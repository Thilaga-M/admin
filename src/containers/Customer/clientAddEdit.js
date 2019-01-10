import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { addEmployee , update_fetch_status, viewEmployee, officespacelist,getKYC} from '../../actions/customerActions';
import { getCountryList,getStateList,getCityList} from '../../actions/pincodeActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import {validationCheck} from './../../core/validation';
import ManageDocuments from './KYCDocument';
const $=window.$;
var validateCols={
first_name:{
required:true,
value:'',
msg:'',
},
last_name:{
required:true,
value:'',
msg:'',
},
emailid:{
required:true,
email:true,
value:'',
msg:'',
},
address1:{
required:true,
value:'',
msg:'',
},
address2:{
required:true,
value:'',
msg:'',
},
contact_number:{
required:true,
number:true,
value:'',
msg:'',
},
emergency_number:{
required:true,
number:true,
value:'',
msg:'',
},
mac_id:{
required:true,
value:'',
msg:'',
},
blood_group:{
required:true,
value:'',
msg:'',
},
dob:{
required:true,
value:'',
msg:'',
},
kyc_id:{
required:true,
value:'',
msg:'',
},
invoice_cc_status:{
required:true,
value:'',
msg:'',
},
email_cc_status:{
required:true,
value:'',
msg:'',
},
marketing_cc_status:{
required:true,
value:'',
msg:'',
},
country:{
required:true,
value:'',
msg:'',
},
state:{
required:true,
value:'',
msg:'',
},
city:{
required:true,
value:'',
msg:'',
},
pincode:{
required:true,
number:true,
value:'',
msg:'',
},
status:{
required:true,
value:'',
msg:'',
}
};
class AddEdit extends React.Component {
constructor(props) {
super(props);
this.state={
first_name:"",
last_name:"",
emailid:"",
address1:"",
address2:"",
contact_number:"",
emergency_number:"",
mac_id:"",
blood_group:"",
dob:"",
kyc_id:"",
invoice_cc_status:0,
email_cc_status:0,
marketing_cc_status:0,
country:"",
state:"",
city:"",
pincode:"",
status:1,
stateall:[],
cityall:[],
countryall:[], 
kycall:[], 
error_status:false,
preloader:(this.props.params.id)?true:false,
title:(this.props.params.id)?"Edit":"New",
isManageKYCDocs:''
}
this.eventHandle=this.eventHandle.bind(this);
this.onsubmit=this.onsubmit.bind(this);
this.handleChange=this.handleChange.bind(this);
this.showKYCDocs=this.showKYCDocs.bind(this);
this.closeKYCDocs=this.closeKYCDocs.bind(this);
}
componentDidMount(){
if(this.props.params.id){
viewEmployee(this.props.params.id).then((res)=>{
if(res.data.status===200){
let data=res.data.data;
this.getCityLists(data.state);
this.getStateLists(data.country);
this.setState({
first_name:data.first_name,
last_name:data.last_name,
emailid:data.emailid,
address1:data.address1,
address2:data.address2,
contact_number:data.contact_number,
emergency_number:data.emergency_number,
mac_id:data.mac_id,
blood_group:data.blood_group,
dob:moment(data.dob),
kyc_id:data.kyc_id,
invoice_cc_status:data.invoice_cc_status,
email_cc_status:data.email_cc_status,
marketing_cc_status:data.marketing_cc_status,
country:data.country,
state:data.state,
city:data.city,
pincode:data.pincode,
status:data.status,
error_status:true,
preloader:false
})
}
})
}
getCountryList().then((res)=>{
if(res.data.status===200){
let data=res.data.data;
this.setState({countryall:data});
}
}) 
getKYC().then((res)=>{
if(res.data.status===200){
let data=res.data.result.data;
this.setState({kycall:data});
}
})
}
getStateLists(id){
getStateList(id).then((res)=>{
if(res.data.status===200){
let data=res.data.data;
this.setState({stateall:data});
}
})
}
getCityLists(id){
getCityList(id).then((res)=>{
if(res.data.status===200){
let data=res.data.data;
this.setState({cityall:data});
}
})
}  
showKYCDocs()
{
this.setState({isManageKYCDocs:true});
$('#ManageKYCDocs').modal('open');
}
closeKYCDocs()
{
this.setState({isManageKYCDocs:false});
$('#ManageKYCDocs').modal('close');
}
eventHandle(e,key,val){
if(key==="country"){
this.getStateLists(e.target.value);
}else if(key==="state"){
this.getCityLists(e.target.value);
} 
this.setState({[key]:(key==='email_cc_status' || key==='invoice_cc_status' || key==='marketing_cc_status'|| key==='status')?val:e.target.value});
}
handleChange(date,e) {
this.setState({
dob: moment(date) 
});
}
onsubmit(){
let {first_name,last_name,emailid,address1,address2,contact_number,emergency_number,mac_id,blood_group,dob,kyc_id,invoice_cc_status,email_cc_status,marketing_cc_status,country,state,city,pincode,status,error_status,preloader,title} =this.state;
let errors= validationCheck(validateCols);
let isDisabled = Object.keys(errors).some(x =>errors[x].msg);
this.setState({preloader:true});
if(isDisabled===false){ 
let params={
cust_hid:localStorage.getItem("cust_hid"),
first_name:first_name,
last_name:last_name,
emailid:emailid,
address1:address1,
address2:address2,
contact_number:contact_number,
emergency_number:emergency_number,
mac_id:mac_id,
blood_group:blood_group,
dob:moment(new Date(dob)).format("YYYY-MM-DD"),
kyc_id:kyc_id,
invoice_cc_status:invoice_cc_status,
email_cc_status:email_cc_status,
marketing_cc_status:marketing_cc_status,
country:country,
state:state,
city:city,
pincode:pincode,
status:status
}
let para=(this.props.params.id)?'/'+this.props.params.id:'';
addEmployee(params,para).then((res)=>{
if(res.data.status===200){
this.props.update_fetch_status();
browserHistory.push("customers/client-setting/client-setting");
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
console.log(this.state);
let {first_name,last_name,emailid,address1,address2,contact_number,emergency_number,mac_id,blood_group,dob,kyc_id,invoice_cc_status,email_cc_status,marketing_cc_status,country,state,city,pincode,status,stateall,cityall,countryall,error_status,title,preloader,kycall,isManageKYCDocs} = this.state; 
let role=permissionCheck("customer",title);
validateCols.first_name.value=first_name;
validateCols.last_name.value=last_name;
validateCols.emailid.value=emailid;
validateCols.address1.value=address1;
validateCols.address2.value=address2;
validateCols.contact_number.value=contact_number;
validateCols.emergency_number.value=emergency_number;
validateCols.mac_id.value=mac_id;
validateCols.blood_group.value=blood_group;
validateCols.dob.value=dob;
validateCols.kyc_id.value=kyc_id;
validateCols.invoice_cc_status.value=invoice_cc_status;
validateCols.email_cc_status.value=email_cc_status;
validateCols.marketing_cc_status.value=marketing_cc_status;
validateCols.country.value=country;
validateCols.state.value=state;
validateCols.city.value=city;
validateCols.pincode.value=pincode;
validateCols.status.value=status; 
let errors= validationCheck(validateCols);
if(!role)
return 
<Nopermission/>
return (
<div className="portlet" style={{height: '800px'}}>
   <div className="transition-item detail-page">
      <div className="col s12 portlet-title">
         <div className="caption">MANAGE KYC DOCUMENT
         </div>
      </div>
      <div id="ManageKYCDocs" className="modal" style={{width:"85vw",height:"100vh"}}>
         <div className="modal-content">
            {
            isManageKYCDocs &&
            <ManageDocuments closeKYCDocs={this.closeKYCDocs} kyc_id={kyc_id}/>
            }
         </div>
      </div>
      <div className="main-content">
         <div className="talign-demo">
            <h5 className="center-align">{title} Employee</h5>
         </div>
         <form method="post" encType="multipart/form-data">
            <div className="col s12" style={{margin:'2%'}}>
               <h7 className="sub-header">CONTACT DETAILS</h7>
            <div className="row">
               <div className="input-field col s4">
                  <input type="text"  onChange={(e)=>{this.eventHandle(e,"first_name")}} className={(errors.first_name.msg && error_status)?'invalid':''} value={first_name} />
                  <label className={(errors.first_name.msg)?'':'active'}>First Name</label>
                  { 
                  errors.first_name.msg && error_status &&
                  <div className="validation-error">{errors.first_name.msg}</div>
                  }
               </div>
               <div className="input-field col s4">
                  <input type="text"  onChange={(e)=>{this.eventHandle(e,"last_name")}} className={(errors.last_name.msg && error_status)?'invalid':''} value={last_name} />
                  <label className={(errors.last_name.msg)?'':'active'}>Last Name</label>
                  { 
                  errors.last_name.msg && error_status &&
                  <div className="validation-error">{errors.last_name.msg}</div>
                  }
               </div>
               <div className="input-field col s4">
                  <DatePicker showYearDropdown showMonthDropdown scrollableYearDropdown maxDate={moment().add(0, "days")} yearDropdownItemNumber={50} selected={dob} placeholderText="DOB" dateFormat="DD/MM/YYYY"  readOnly={true} className="datepicker form-control" onChange={this.handleChange} />
                  <label className={(errors.dob.msg)?'':'active'}>DOB</label>
                  { 
                  errors.dob.msg && error_status &&
                  <div className="validation-error">{errors.dob.msg}</div>
                  }
               </div>
            </div>
            <div className="row">
               <div className="input-field col s4">
                  <input type="text"  onChange={(e)=>{this.eventHandle(e,"contact_number")}} className={(errors.contact_number.msg && error_status)?'invalid':''} maxLength={10} value={contact_number} />
                  <label className={(errors.contact_number.msg)?'':'active'}>Contact No</label>
                  { 
                  errors.contact_number.msg && error_status &&
                  <div className="validation-error">{errors.contact_number.msg}</div>
                  }
               </div>
               <div className="input-field col s4">
                  <input type="text"  onChange={(e)=>{this.eventHandle(e,"emergency_number")}} className={(errors.emergency_number.msg && error_status)?'invalid':''} maxLength={10} value={emergency_number} />
                  <label className={(errors.emergency_number.msg)?'':'active'}>Emergency No</label>
                  { 
                  errors.emergency_number.msg && error_status &&
                  <div className="validation-error">{errors.emergency_number.msg}</div>
                  }
               </div>
               <div className="input-field col s4">
                  <input type="email"  onChange={(e)=>{this.eventHandle(e,"emailid")}} className={(errors.emailid.msg && error_status)?'invalid':''} value={emailid} />
                  <label className={(errors.emailid.msg)?'':'active'}>Email Id</label>
                  { 
                  errors.emailid.msg && error_status &&
                  <div className="validation-error">{errors.emailid.msg}</div>
                  }
               </div>
            </div>
            <div className="row">
               <div className="input-field col s4">
                  <input type="text"  onChange={(e)=>{this.eventHandle(e,"blood_group")}} className={(errors.blood_group.msg && error_status)?'invalid':''} value={blood_group} />
                  <label className={(errors.blood_group.msg)?'':'active'}>Blood Group</label>
                  { 
                  errors.blood_group.msg && error_status &&
                  <div className="validation-error">{errors.blood_group.msg}</div>
                  }
               </div>
               <div className="input-field col s4">
                  <textarea rows="5" onChange={(e)=>{this.eventHandle(e,"address1")}} className={`materialize-textarea ${(errors.address1.msg && error_status)?'invalid':''} `} value={address1} ></textarea>
                  <label  className={(errors.address1.msg)?'':'active'}>Address Line 1</label>
                  { 
                  errors.address1.msg && error_status &&
                  <div className="validation-error">{errors.address1.msg}</div>
                  }
               </div>
               <div className="input-field col s4">
                  <textarea rows="5" onChange={(e)=>{this.eventHandle(e,"address2")}} className={`materialize-textarea ${(errors.address2.msg && error_status)?'invalid':''} `} value={address2} ></textarea>
                  <label  className={(errors.address2.msg)?'':'active'}>Address Line 2</label>
                  { 
                  errors.address2.msg && error_status &&
                  <div className="validation-error">{errors.address2.msg}</div>
                  }
               </div>
               <div className="input-field col s4">
                  <select className={`browser-default ${(errors.country.msg && error_status)?'invalid':''}`} value={country} onChange={(e)=>{this.eventHandle(e,"country")}} >
                  <option  value=''>Select Country</option>
                  {
                  countryall && countryall.map((val,i)=>{
                  return (
                  <option title={i} key={i} value={val.country_id}>{val.country_name}</option>
                  )
                  })
                  } 
                  </select> 
                  {(errors.country.msg && error_status) ? (
                  <div className="validation-error">{errors.country.msg}</div>
                  ):('')}
               </div>
               <div className="input-field col s4">
                  <select className={`browser-default ${(errors.state.msg && error_status)?'invalid':''}`} value={state} onChange={(e)=>{this.eventHandle(e,"state")}} >
                  <option  value=''>Select State</option>
                  {
                  stateall && stateall.map((val,i)=>{
                  return (
                  <option title={i} key={i} value={val.state_id}>{val.state_name}</option>
                  )
                  })
                  } 
                  </select> 
                  {(errors.state.msg && error_status) ? (
                  <div className="validation-error">{errors.state.msg}</div>
                  ):('')}
                </div>
                <div className="input-field col s4">
                  <select className={`browser-default ${(errors.city.msg && error_status)?'invalid':''}`} value={city} onChange={(e)=>{this.eventHandle(e,"city")}} >
                  <option  value=''>Select City</option>
                  {
                  cityall && cityall.map((val,i)=>{
                  return (
                  <option title={i} key={i} value={val.city_id}>{val.city_name}</option>
                  )
                  })
                  } 
                  </select> 
                  {(errors.city.msg && error_status) ? (
                  <div className="validation-error">{errors.city.msg}</div>
                  ):('')}
               </div>
               <div className="input-field col s4">
                  <input type="text"  onChange={(e)=>{this.eventHandle(e,"pincode")}} className={(errors.pincode.msg && error_status)?'invalid':''} value={pincode} />
                  <label className={(errors.pincode.msg)?'':'active'}>Pincode</label>
                  { 
                  errors.pincode.msg && error_status &&
                  <div className="validation-error">{errors.pincode.msg}</div>
                  }
               </div>

            </div>
          </div>
          <div className="col s12" style={{margin:'2%'}}>
            <h7 className="sub-header">ADDITIONAl InformATIONS</h7>
            <div className="row">
               <div className="input-field col s4">
                  <input type="text"  onChange={(e)=>{this.eventHandle(e,"mac_id")}} className={(errors.mac_id.msg && error_status)?'invalid':''} value={mac_id} />
                  <label className={(errors.mac_id.msg)?'':'active'}>Mac ID</label>
                  { 
                  errors.mac_id.msg && error_status &&
                  <div className="validation-error">{errors.mac_id.msg}</div>
                  }
               </div>
               <div className="input-field col s4">
                  <select className={`browser-default ${(errors.kyc_id.msg && error_status)?'invalid':''}`} value={kyc_id} onChange={(e)=>{this.eventHandle(e,"kyc_id")}} >
                  <option  value=''>Select KYC</option>
                  {
                  kycall && kycall.map((val,i)=>{
                  return (
                  <option title={i} key={i} value={val.kyc_id}>{val.kyc_name}</option>
                  )
                  })
                  } 
                  </select> 
                  {(errors.kyc_id.msg && error_status) ? (
                  <div className="validation-error">{errors.kyc_id.msg}</div>
                  ):('')}
               </div>
               {(kyc_id) && 
               <div className="input-field col s4">
                  <button type="button" onClick={(e)=>{this.showKYCDocs()}} className="btn btn-sm btn-primary">Manage Documents</button>
               </div>
               }
            </div>
            <div className="row">
               <div className="input-field col s4">
                  <div ><label>Email CC Status</label> </div>
                  <div className="right" style={{paddingRight:"15%"}}> 
                     <input type="radio" id="email_cc_status1" name="email_cc_status" checked={(email_cc_status==1)?true:false}/>
                     <label htmlFor="Cold Lead" onClick={(e)=>{this.eventHandle(e,"email_cc_status",1)}}>Yes</label> 
                     <input type="radio" id="email_cc_status2" name="email_cc_status" checked={(email_cc_status==0)?true:false}/>
                     <label htmlFor="Hot Lead" onClick={(e)=>{this.eventHandle(e,"email_cc_status",0)}}>No</label>
                  </div>
               </div>
               <div className="input-field col s4">
                  <div ><label>Invoice CC Status</label> </div>
                  <div className="right" style={{paddingRight:"15%"}}> 
                     <input type="radio" id="invoice_cc_status1" name="invoice_cc_status" checked={(invoice_cc_status==1)?true:false}/>
                     <label htmlFor="Cold Lead" onClick={(e)=>{this.eventHandle(e,"invoice_cc_status",1)}}>Yes</label> 
                     <input type="radio" id="invoice_cc_status2" name="invoice_cc_status" checked={(invoice_cc_status==0)?true:false}/>
                     <label htmlFor="Hot Lead" onClick={(e)=>{this.eventHandle(e,"invoice_cc_status",0)}}>No</label>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="input-field col s4">
                  <div ><label>Marketing CC Status</label> </div>
                  <div className="right" style={{paddingRight:"15%"}}> <input type="radio" id="marketing_cc_status1" name="marketing_cc_status" checked={(marketing_cc_status==1)?true:false}/>
                     <label htmlFor="Cold Lead" onClick={(e)=>{this.eventHandle(e,"marketing_cc_status",1)}}>Yes</label> 
                     <input type="radio" id="marketing_cc_status2" name="marketing_cc_status" checked={(marketing_cc_status==0)?true:false}/>
                     <label htmlFor="Hot Lead" onClick={(e)=>{this.eventHandle(e,"marketing_cc_status",0)}}>No</label>
                  </div>
               </div>
               <div className="input-field col s4">
                  <div ><label>Active/InActive</label> </div>
                  <div className="right" style={{paddingRight:"15%"}}>
                     <input type="radio" id="status1" name="status" checked={(status==1)?true:false}/>
                     <label htmlFor="Cold Lead" onClick={(e)=>{this.eventHandle(e,"status",1)}}>Yes</label> 
                     <input type="radio" id="status2" name="status" checked={(status==0)?true:false}/>
                     <label htmlFor="Hot Lead" onClick={(e)=>{this.eventHandle(e,"status",0)}}>No</label>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="input-field col s12">
                  <div className="card-footer right">
                     <Link to="customers/client-setting/client-setting" className="btn btn-sm btn-danger">
                     Cancel</Link>&nbsp;&nbsp;
                     <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                  </div>
               </div>
            </div>
          </div>
         </form>
      </div>
      { preloader && 
      <Preloader/>
      }
   </div>
</div>
)
}
}
const mapStateToProps = (state) => ({
data: state.customerReducer,
})
const mapDispatchToProps = (dispatch) => {
return bindActionCreators({ update_fetch_status },dispatch);
}
const CustomerAEContainer = connect(mapStateToProps,
mapDispatchToProps, null, { withRef: true }
)(AddEdit)
export default CustomerAEContainer;