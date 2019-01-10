import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { viewcompany,updatePayment,update_fetch_status,getKYC,getPayment} from '../../actions/customerActions';   
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
function validate(monthly_payment_type1,monthly_payment_type2,invoice_type,gst_no) { 
let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
let numbers =  /^\d{10}$/;  
let regs = /^\d+$/;   
return {
monthly_payment_type1:monthly_payment_type1.length===0,
monthly_payment_type2:monthly_payment_type2.length===0,
invoice_type:invoice_type.length===0,
gst_no: gst_no.length===0 
};
}
class AddEdit extends React.Component {
constructor(props) {
super(props);
this.state={
monthly_payment_type1:"",
monthly_payment_type2:"",
invoice_type:'', 
gst_no:'',
pan_no:'',
company_kyc:'',
employees:[],
kycall:[],
paymentAll:[],
error_status:false,
preloader:(this.props.params.id)?true:false,
title:(this.props.params.id)?"Edit":"New"
}
this.eventHandle=this.eventHandle.bind(this);
this.onsubmit=this.onsubmit.bind(this);
}
componentDidMount(){
let cust_hid=localStorage.getItem("cust_hid");
if(cust_hid){
viewcompany(cust_hid).then((res)=>{
if(res.data.status===200){
let data=res.data.data; 
this.setState({
monthly_payment_type1:data.monthly_payment_type1,
monthly_payment_type2:data.monthly_payment_type2,
invoice_type:data.invoice_type, 
gst_no:data.gst_no,
pan_no:data.pan_no,
company_kyc:data.company_kyc,
error_status:true,
preloader:false
})
}
})
}
getKYC().then((res)=>{
if(res.data.status===200){
let data=res.data.result.data;
this.setState({kycall:data});
}
})
getPayment().then((res)=>{
if(res.data.status===200){
let data=res.data.result.data;
this.setState({paymentAll:data});
}
})
}
eventHandle(e,key){ 
this.setState({[key]:e.target.value});
}
onsubmit(){
let {monthly_payment_type1,monthly_payment_type2,invoice_type,gst_no,pan_no,company_kyc} =this.state;
let errors = validate(monthly_payment_type1,monthly_payment_type2,invoice_type,gst_no);
let isDisabled = Object.keys(errors).some(x => errors[x]);
this.setState({preloader:true});
isDisabled=true;
if(isDisabled){ 
let params={
monthly_payment_type1:monthly_payment_type1,
monthly_payment_type2:monthly_payment_type2,
invoice_type:invoice_type, 
gst_no:gst_no,
pan_no:pan_no,
company_kyc:company_kyc,
}
let cust_hid=localStorage.getItem("cust_hid");
updatePayment(params,cust_hid).then((res)=>{
if(res.data.status===200){ 
browserHistory.push("customers/client-setting/customer-setting");
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
let {monthly_payment_type1,monthly_payment_type2,invoice_type,gst_no,title,preloader,error_status,pan_no,company_kyc,kycall,paymentAll} =this.state;
let errors = validate(monthly_payment_type1,monthly_payment_type2,invoice_type,gst_no,pan_no,company_kyc);
let role=permissionCheck("customer",title);
if(!role)
return 
<Nopermission/>
return (
<div className="portlet">
   <div className="transition-item detail-page">
      <div className="main-content">
         <div className="col s12 portlet-title">
            <div className="caption">PAYMENT SETTING
            </div>
         </div>
         <form method="post" encType="multipart/form-data">
            <div className="row">
               <div className="input-field col s4">
                  <select className={`browser-default ${(errors.monthly_payment_type1 && error_status)?'invalid':''}`} value={monthly_payment_type1} onChange={(e)=>{this.eventHandle(e,"monthly_payment_type1")}} >
                  <option  value=''>Select Monthly Payment Type1</option>
                  {
                  paymentAll && paymentAll.map((val,i)=>{
                  return (
                  <option title={i} key={i} value={val.payment_id}>{val.payment_mode}</option>
                  )
                  })
                  } 
                  </select>  
               </div>
               <div className="input-field col s4">
                  <select className={`browser-default ${(errors.monthly_payment_type2 && error_status)?'invalid':''}`} value={monthly_payment_type2} onChange={(e)=>{this.eventHandle(e,"monthly_payment_type2")}} >
                  <option  value=''>Select Monthly Payment Type2</option>
                  {
                  paymentAll && paymentAll.map((val,i)=>{
                  return (
                  <option title={i} key={i} value={val.payment_id}>{val.payment_mode}</option>
                  )
                  })
                  } 
                  </select>  
               </div>
               <div className="input-field col s4">
                  <select className={`browser-default ${(errors.company_kyc && error_status)?'invalid':''}`} value={company_kyc} onChange={(e)=>{this.eventHandle(e,"kyc_id")}} >
                  <option  value=''>Select KYC</option>
                  {
                  kycall && kycall.map((val,i)=>{
                  return (
                  <option title={i} key={i} value={val.kyc_id}>{val.kyc_name}</option>
                  )
                  })
                  } 
                  </select> 
                  {(errors.company_kyc && error_status) ? (
                  <div className="validation-error">{errors.company_kyc}</div>
                  ):('')}
               </div>
               <div className="input-field col s4">
                  <select className={`browser-default ${(errors.invoice_type && error_status)?'invalid':''}`} value={invoice_type} onChange={(e)=>{this.eventHandle(e,"invoice_type")}} >
                  <option  value=''>Select Invoice Type</option>
                  <option  value='Split Invoice'>Split Invoice</option>
                  <option  value='Regular Invoice'>Regular Invoice</option>
                  </select>  
               </div>
               <div className="input-field col s4">
                  <input type="text"  onChange={(e)=>{this.eventHandle(e,"gst_no")}} className={(errors.gst_no && error_status)?'invalid':''} value={gst_no} />
                  <label className={(errors.gst_no)?'':'active'}>GST No</label>
               </div>
               <div className="input-field col s4">
                  <input type="text"  onChange={(e)=>{this.eventHandle(e,"pan_no")}} className={(errors.pan_no && error_status)?'invalid':''} value={pan_no} />
                  <label className={(errors.pan_no)?'':'active'}>PAN No</label>
               </div>
            </div>
            <div className="row">
               <div className="input-field col s12">
                  <div className="card-footer center">
                     &nbsp;&nbsp;
                     <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                     <Link to="customers/client-setting/customer-setting" className="btn-sm btn-default">
                     Cancel</Link>
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