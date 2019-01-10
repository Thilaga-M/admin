import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addServicecategory , update_fetch_status, viewServicecategory } from '../../actions/servicecategoryActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
function validate(service_category,status) {
   let regs = /^\d+$/;   
   return {
    service_category:service_category.length===0,
    status:status.length===0, 
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          service_category:'',
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
       viewServicecategory(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              service_category:data.service_category,
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
        let {service_category,status} =this.state;
        let errors = validate(service_category,status);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              service_category:service_category,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addServicecategory(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/servicecategory");
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
    let {service_category,status,error_status,title,preloader} = this.state;

    let role=permissionCheck("servicecategory",title);
      if(!role)
        return <Nopermission/>
    let errors = validate(service_category,status);
  
          return (
               <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="talign-demo">
                      <h5 className="center-align">{title} Service Category</h5> 
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"service_category")}} className={(errors.service_category && error_status)?'invalid':''} value={service_category} />
                              <label className={(errors.service_category)?'':'active'}>Service Category</label>
                          </div>                              
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        <Link to="settings/servicecategory" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
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
  data: state.servicecategoryReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;