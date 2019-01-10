import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addBusiness , update_fetch_status, viewBusiness } from '../../actions/businessActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
  
function validate(business_name,business_address,description,business_mobile,business_email,business_phone,status,user_name,pass_word,centername,rolename) {
   let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
   let numbers =  /^\d{10}$/;  
   let regs = /^\d+$/;   
   return { 
    business_name:business_name.length===0,
    business_address:business_address.length===0,
    description:description.length===0,
    user_name:user_name.length===0,
    pass_word:pass_word.length===0,
    centername:centername.length===0,
    rolename:rolename.length===0,
    business_mobile:!numbers.test(business_mobile),
    business_email: !reg.test(business_email), 
    business_phone:!regs.test(business_phone), 
    status:status.length===0, 
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          business_name:'',
          business_address:'',
          description:'',
          business_mobile:'',
          business_email:'',
          user_name:'',
          pass_word:'',
          centername:'',
          rolename:'',
          business_phone:'',
          error_status:false,
          preloader:false,
          status:1,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewBusiness(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              business_name:data.business_name,
              business_address:data.business_address,
              description:data.description,
              business_mobile:data.business_mobile,
              business_email:data.business_email,
              business_phone:data.business_phone,
              user_name:'000',
              pass_word:'000',
              centername:'000',
              rolename:'000',
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
        let {business_name,business_address,description,business_mobile,business_email,business_phone,status,user_name,pass_word,centername,rolename} =this.state;
        let errors = validate(business_name,business_address,description,business_mobile,business_email,business_phone,status,user_name,pass_word,centername,rolename);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({preloader:true}); 
        if(isDisabled===false){
             let params={
              business_name:business_name,
              business_address:business_address,
              description:description,
              business_mobile:business_mobile,
              business_email:business_email,
              business_phone:business_phone,
              user_name:user_name,
              pass_word:pass_word,
              centername:centername,
              rolename:rolename,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addBusiness(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/business");
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
    let {business_name,business_address,description,business_mobile,business_email,business_phone,status,error_status,user_name,pass_word,centername,rolename,title,preloader} = this.state;
    let errors = validate(business_name,business_address,description,business_mobile,business_email,business_phone,status,user_name,pass_word,centername,rolename);

    let role=permissionCheck("business",title);
      if(!role)
        return <Nopermission/>
  
          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">

                    <div className="talign-demo">
                      <h5 className="center-align">Business Group</h5> 
                    </div> 

                          <form method="post" encType="multipart/form-data">
                            <div className="row"> 
                              <div className="input-field col s12">
                                <input type="text" onChange={(e)=>{this.eventHandle(e,"business_name")}} className={(errors.business_name && error_status)?'invalid':''} value={business_name}/>
                                <label className={(errors.business_name)?'':'active'}>Business Name</label>
                              </div>
                              
                              <div className="input-field col s12">
                                <input type="text" onChange={(e)=>{this.eventHandle(e,"business_mobile")}} className={(errors.business_mobile && error_status)?'invalid':''} value={business_mobile} maxLength={10} />
                                <label className={(errors.business_mobile)?'':'active'}>Mobile Number</label>
                              </div>

                              <div className="input-field col s12">
                                <input type="text" onChange={(e)=>{this.eventHandle(e,"business_email")}} className={(errors.business_email && error_status)?'invalid':''} value={business_email} />
                                <label className={(errors.business_email)?'':'active'}>Business Email</label>
                              </div>

                              <div className="input-field col s12">
                                <input type="text" maxLength={10} onChange={(e)=>{this.eventHandle(e,"business_phone")}} className={(errors.business_phone && error_status)?'invalid':''} value={business_phone} />
                                <label className={(errors.business_phone)?'':'active'}>Phone Number</label>
                              </div> 

                              { !this.props.params.id &&  
                              <span >
                              <div className="input-field col s12">
                                <input type="text"  onChange={(e)=>{this.eventHandle(e,"user_name")}} className={(errors.user_name && error_status)?'invalid':''} value={user_name} />
                                <label className={(errors.user_name)?'':'active'}>Username</label>
                              </div>  

                              <div className="input-field col s12">
                                <input type="password"  onChange={(e)=>{this.eventHandle(e,"pass_word")}} className={(errors.pass_word && error_status)?'invalid':''} value={pass_word} />
                                <label className={(errors.pass_word)?'':'active'}>Password</label>
                              </div>  

                              <div className="input-field col s12">
                                <input type="text" onChange={(e)=>{this.eventHandle(e,"centername")}} className={(errors.centername && error_status)?'invalid':''} value={centername} />
                                <label className={(errors.centername)?'':'active'}>Center Name</label>
                              </div>  

                              <div className="input-field col s12">
                                <input type="text" onChange={(e)=>{this.eventHandle(e,"rolename")}} className={(errors.rolename && error_status)?'invalid':''} value={rolename} />
                                <label className={(errors.rolename)?'':'active'}>Role Name</label>
                              </div>
                              </span>  
                            }

                              <div className="input-field col s12">
                                <textarea rows="5" onChange={(e)=>{this.eventHandle(e,"business_address")}} className={`materialize-textarea ${(errors.business_address && error_status)?'invalid':''} `} value={business_address} ></textarea>
                                <label className={(errors.business_address)?'':'active'} >Address</label>
                              </div>

                              <div className="input-field col s12">
                                <textarea rows="5" onChange={(e)=>{this.eventHandle(e,"description")}} className={`materialize-textarea ${(errors.description && error_status)?'invalid':''}`} value={description} ></textarea>
                                <label className={(errors.description)?'':'active'}>Description</label>
                              </div>
                            </div>
                          </form>
                     
                          <div className="card-footer">
                            <Link to="settings/business" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
                            <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
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
  data: state.businessReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const BusinessAEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default BusinessAEContainer;