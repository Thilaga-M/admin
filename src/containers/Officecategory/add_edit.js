import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addCategory , update_fetch_status, viewCategory } from '../../actions/officecategoryActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
  
function validate(officecategory,status) {
   return {
    officecategory:officecategory.length===0, 
    status:status.length===0, 
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          officecategory:'',
           error_status:false,
          status:1,
          title:(this.props.params.id)?"Edit":"New",
          preloader:(this.props.params.id)?true:false,
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewCategory(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              officecategory:data.officecategory,
               error_status:true,
               preloader:false,
              status:1
            })
         }

       })
      }
    }

 
    eventHandle(e,key){
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {officecategory,status} =this.state;
        let errors = validate(officecategory,status);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              officecategory:officecategory,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addCategory(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/general/officecategory");
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
    let {officecategory,status,error_status,title,preloader} = this.state;

    let role=permissionCheck("officecategory",title);
      if(!role)
        return <Nopermission/>
    let errors = validate(officecategory,status);
  
          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">

                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} OFFICE CATEGORY 
                      </div>
                    </div>
                            
                        
                            <form method="post" encType="multipart/form-data">

                            <div className="row">
                              <div className="input-field col s12">
                                    <input type="text"  onChange={(e)=>{this.eventHandle(e,"officecategory")}} className={(errors.officecategory && error_status)?'invalid':''} value={officecategory} />
                                    <label className={(errors.officecategory)?'':'active'}>Office Category</label>
                              </div>
                            </div> 
                            </form>
                          <br/>
                          <div className="card-footer right">
                            
                            <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                            &nbsp;&nbsp;
                            <Link to="settings/general/officecategory" className="btn btn-sm btn-default">Cancel</Link>
                          </div>
                          <br/>
                    </div> 
                     { preloader && <Preloader/> }
                  </div> 
              </div>
              )
  }
}
 
 
const mapStateToProps = (state) => ({
  data: state.officecategoryReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;