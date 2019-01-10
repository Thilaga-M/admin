import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addUsers , update_fetch_status, viewUsers,rolesall,fetchCenter } from '../../actions/usersActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

function validate(password,email,name,address,designation,mobile,role_id,username,status,c_id) {
   let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
   let numbers =  /^\d{10}$/;
   let regs = /^\d+$/;
   return {
    email: reg.test(email) === false,
    password: password.length <=4,
    name:name.length===0,
    address:address.length===0,
    designation:designation.length===0,
    mobile:!numbers.test(mobile),
    role_id: role_id.length===0,
    username:password.length <=4,
    //status:status.length===0,
    c_id:c_id.length===0,
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          password:'',
          email:'',
          name:'',
          address:'',
          sales_status:0,
          designation:'',
          mobile:'',
          role_id:'',
          username:'',
          allbusiness:[],
          c_id:'',
          allroles:[],
          status:1,
          approval_status:0,
          approval_email:'',
          error_status:false,
          preloader:true,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentDidMount(){
      if(this.props.params.id){
       viewUsers(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              password:data.password,
              email:data.email,
              name:data.name,
              address:data.address,
              designation:data.designation,
              c_id:data.centerid.split(","),
              mobile:data.mobile,
              role_id:data.role_id,
              sales_status:data.sales_status,
              username:data.username,
              status:data.status,
              error_status:true,
              approval_status:data.approval_status,
              approval_email:data.approval_email
            })
         }

       })
      }
      rolesall().then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({allroles:data});
          }

       })
      fetchCenter({limit:100,offset:0}).then((res)=>{
          if(res.data.status===200){
          let data=res.data.result.data;
            this.setState({allbusiness:data,preloader:false});
          }
       })
    }


    eventHandle(e,key){
      if(key=="sales_status" || key=="approval_status")
      {
        e.target.value=(e.target.value)?0:1;
      }
      if(key=="approval_status")
      {
        if(e.target.value==0)this.setState({"approval_email":""});
      }
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {password,email,name,address,designation,mobile,role_id,username,status,c_id,sales_status,approval_status,approval_email} =this.state;
        let errors = validate(password,email,name,address,designation,mobile,role_id,username,status,c_id);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              password:password,
              emails:email,
              name:name,
              address:address,
              designation:designation,
              mobiles:mobile,
              role_ids:role_id,
              c_ids:c_id.join(","),
              usernames:username,
              status:status,
              sales_status:sales_status,
              approval_status:approval_status,
              approval_email:approval_email
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addUsers(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/general/users");
                }
                else{
                  alert("Please enter required feilds...");
                }
            });
        }else{
          this.setState({error_status:true,preloader:false});
        }
    }

  multiselect(e){
  var options = e.target.selectedOptions;
  var value = [];
  for (var i = 0, l = options.length; i < l; i++) {
      value.push(options[i].value);
  }
   this.setState({c_id:value});
  }

  render() {
    let {preloader,password,email,name,address,designation,mobile,role_id,username,status,title,allroles,allbusiness,c_id,error_status,sales_status,approval_status,approval_email} = this.state;
    let errors = validate(password,email,name,address,designation,mobile,role_id,username,status,c_id);
 let m_status = localStorage.getItem("m_status");
          return (
                <div className="portlet">
                  <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} USERS
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">

                          <div className="input-field col s4">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"name")}} className={(errors.name && error_status)?'invalid':''} value={name} />
                              <label className={(errors.name)?'':'active'}>Name</label>
                          </div>

                          <div className="input-field col s4">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"username")}} className={(errors.username && error_status)?'invalid':''} value={username} />
                              <label className={(errors.username)?'':'active'}>Username</label>
                          </div>

                          <div className="input-field col s4">
                              <input type="password"  onChange={(e)=>{this.eventHandle(e,"password")}} className={(errors.password && error_status)?'invalid':''} value={password} />
                              <label className={(errors.password)?'':'active'}>Password</label>
                          </div>

                          <div className="input-field col s4">
                              <input type="email"  onChange={(e)=>{this.eventHandle(e,"email")}} className={(errors.email && error_status)?'invalid':''} value={email} />
                              <label className={(errors.email)?'':'active'}>Email Id</label>
                          </div>

                          <div className="input-field col s4">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"mobile")}} className={(errors.mobile && error_status)?'invalid':''} maxLength={10} value={mobile} />
                              <label className={(errors.mobile)?'':'active'}>Mobile No</label>
                          </div>

                          <div className="input-field col s4">
                             <select className={`browser-default ${(errors.role_id && error_status)?'invalid':''}`} value={role_id}  onChange={(e)=>{this.eventHandle(e,"role_id")}}>
                                <option  value=''>Select Role</option>
                                  {
                                    allroles && allroles.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.role_id}>{val.rolename}</option>)
                                    })
                                  }
                              </select>
                          </div>

                          
                          <div className="input-field col s6">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"designation")}} className={(errors.designation && error_status)?'invalid':''}  value={designation} />
                              <label className={(errors.designation)?'':'active'}>Designation</label>
                          </div>
                          


                          <div className="input-field col s6" style={{marginLeft: '28px',width: '40%'}}>
                            <textarea rows="5" onChange={(e)=>{this.eventHandle(e,"address")}} className={`materialize-textarea ${(errors.address && error_status)?'invalid':''} `} value={address} ></textarea>
                            <label  className={(errors.address)?'':'active'}>Address</label>
                          </div>
                          <div className="input-field col s6">
                            <select className={`browser-default ${(errors.c_id && error_status)?'invalid':''}`} 
                            value={c_id}  onChange={(e)=>{this.multiselect(e)}} multiple={(m_status==='S')?true:false} style={{height: 'auto !important'}}>
                                  {
                                    allbusiness && allbusiness.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.c_id}>{val.centername}</option>)
                                    })
                                  }
                                </select>
                         </div>
                          <div className="input-field col s3">
                                <input type="checkbox"  className="filled-in" checked={(sales_status)?true:false} value={sales_status}/>
                                <label onClick={(e)=>{this.eventHandle(e,"sales_status")}} htmlFor="Sales Person">Sales Person</label>
                          </div>

                          <div className="input-field col s3">
                                <input type="checkbox"  className="filled-in" checked={(approval_status)?true:false} value={approval_status}/>
                                <label onClick={(e)=>{this.eventHandle(e,"approval_status")}} htmlFor="Approval Email">Approval Email</label>
                          </div>
                          { approval_status==1 && <div className="input-field col s4">
                            <input type="text"  onChange={(e)=>{this.eventHandle(e,"approval_email")}} value={approval_email} />
                            <label className='active'>Approver Email</label>
                            </div>
                          }

                        { title==='Edit' &&
                         <div className="input-field col s4">
                              <input type="radio" id="inline-radio1" name="inline-radios" checked={(status==0)?true:false}/>
                              <label htmlFor="Hot Lead" onClick={(e)=>{this.eventHandle(e,"status",0)}}>InActive</label>

                              <input type="radio" id="inline-radio2" name="inline-radios" checked={(status==1)?true:false}/>
                              <label htmlFor="Cold Lead" onClick={(e)=>{this.eventHandle(e,"status",1)}}>Active</label>
                          </div>
                        }

                          </div>
                          <br/><br/>
                        </form>
                          <div className="card-footer">
                            <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                            &nbsp;&nbsp;
                            <Link to="settings/general/users" className="btn btn-sm btn-default">Cancel</Link>
                          </div>
                          <br/>
                    </div>
                    {
                      preloader &&
                       <Preloader/>
                    }
                  </div>
                </div>
              )
  }
}


const mapStateToProps = (state) => ({
  data: state.usersReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const UsersAEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default UsersAEContainer;
