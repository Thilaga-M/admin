import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addLabel , update_fetch_status, viewLabel,fetchLanguages } from '../../actions/labelActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
  
function validate(label_name,label_value,languageid,status) {
   let regs = /^\d+$/;   
   return {
    label_name:label_name.length===0,
    label_value:label_value.length===0,
    languageid:languageid.length===0,
     status:status.length===0, 
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          label_name:'',
          label_value:'',
          languages:'',
          languageid:'',
          status:1,
          preloader:true,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
        fetchLanguages().then((result)=>{
          
         if(result.data.status===200){
                    let data=result.data.result.data;
                      this.setState({
                        languages:data, 
                        status:1,preloader:false
                      })
                   }
          if(this.props.params.id){

                 viewLabel(this.props.params.id).then((res)=>{
                   if(res.data.status===200){
                    let data=res.data.data;
                      this.setState({
                        label_name:data.label_name,
                        label_value:data.label_value,
                        languageid:data.language_id,
                        status:1,preloader:false
                      })
                   }

                 })
           }

        });
    }

 
    eventHandle(e,key){
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {label_name,label_value,languageid,status} =this.state;
        let errors = validate(label_name,label_value,languageid,status);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        if(isDisabled===false){
             let params={
              label_name:label_name,
              label_value:label_value,
              languageid:languageid,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            this.setState({preloader:true}); 
            addLabel(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/general/label");
                }
                else{
                  alert("Please enter required feilds...");
                   this.setState({preloader:false});
                }
            });
        }else{
          this.setState({error_status:true});
        }
    }
  
  render() {
    let {label_name,label_value,languageid,status,error_status,languages,title,preloader} = this.state;

    let role=permissionCheck("label",title);
      if(!role)
        return <Nopermission/>
    let errors = validate(label_name,label_value,languageid,status);
  
          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">LABELS
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s4">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"label_name")}} className={(errors.label_name && error_status)?'invalid':''} value={label_name} />
                              <label className={(errors.label_name)?'':'active'}>Label Name</label>
                          </div>

                          <div className="input-field col s4">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"label_value")}} className={(errors.label_value && error_status)?'invalid':''} value={label_value} />
                              <label className={(errors.label_value)?'':'active'}>Label Value</label>
                          </div> 

                          <div className="input-field col s4">
                             <select className={`browser-default ${(errors.languageid && error_status)?'invalid':''}`} value={languageid}  onChange={(e)=>{this.eventHandle(e,"languageid")}}>
                                <option  value=''>Select Language</option>
                                  {
                                    languages && languages.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.language_id}>{val.language_name}</option>)
                                    })
                                  } 
                                </select>   
                          </div>

                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                        &nbsp;&nbsp;
                        <Link to="settings/general/label" className="btn btn-sm btn-default">Cancel</Link>
                      </div>
                      <br/><br/>
                    </div> 
                    <br/>
                     { preloader && <Preloader/> }
                  </div>
                </div> 
              )
  }
}
 
 
const mapStateToProps = (state) => ({
  data: state.labelReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const LabelAEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default LabelAEContainer;