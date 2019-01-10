import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addLanguage , update_fetch_status, viewLanguage } from '../../actions/languageActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
  
function validate(language_name,status) {
   let regs = /^\d+$/;   
   return {
    language_name:language_name.length===0,
    status:status.length===0, 
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          language_name:'',
          status:1,
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewLanguage(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              language_name:data.language_name,
              status:1,
              preloader:false
            })
         }

       })
      }
    }

 
    eventHandle(e,key){
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {language_name,status} =this.state;
        let errors = validate(language_name,status);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
         this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              language_name:language_name,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addLanguage(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/general/language");
                }
                else{
                  alert("Please enter required feilds...");
                  this.setState({error_status:true,preloader:false});
                }
            });
        }else{
          this.setState({error_status:true,preloader:false});
        }
    }
  
  render() {
    let {language_name,status,error_status,title,preloader} = this.state;

    let role=permissionCheck("language",title);
      if(!role)
        return <Nopermission/>
    let errors = validate(language_name,status);
  
          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                     <div className="col s12 portlet-title"> 
                        <div className="caption">{title} LANGUAGES
                        </div>
                      </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"language_name")}} className={(errors.language_name && error_status)?'invalid':''} value={language_name} />
                              <label className={(errors.language_name)?'':'active'}>Language Name</label>
                          </div>                                
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                        &nbsp;&nbsp;
                        <Link to="settings/general/language" className="btn btn-sm btn-default">Cancel</Link>
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
  data: state.languageReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const LanguageAEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default LanguageAEContainer;