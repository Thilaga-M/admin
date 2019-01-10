import React, { Component } from "react";
import { Link } from "react-router";
import browserHistory from "./../../core/History";
import Autocomplete from "react-autocomplete";
import moment from "moment";
import Preloader from "./../../core/Preloader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { leadSoucre, officeType } from "../../actions/leadsActions";
import {
getWonLead,
addAgreement,
viewAgreement,
sendEmailAgreement,
getCustomerDetails
} from "../../actions/agreementActions";
import {
getCountryList,
getStateList,
getCityList,
getPincodeList
} from "../../actions/pincodeActions";
import { validationCheck } from "./../../core/validation";
import axiosCancel from "axios-cancel";
import xhr from "../../core/http-call";
import AgreementConfirm from "./agreementconfirm";
import RenewalAgreement from "./agreementrenewal";
import PreviewAgreementrenewal from "./previewagreementrenewal";
const $ = window.$;
var validateCols = {
retainer_amount: {
required: true,
msg: "",
value: ""
},
reference_no: {
required: true,
msg: "",
value: ""
},
lead_date: {
required: true,
msg: "",
value: ""
},
firstname_title: {
   required: true,
   msg: "",
   value: ""
   },
first_name: {
required: true,
msg: "",
value: ""
},
last_name: {
required: true,
msg: "",
value: ""
},
company_name: {
required: true,
msg: "",
value: ""
},
emailid: {
required: true,
msg: "",
value: ""
},
contact_number: {
required: true,
msg: "",
value: ""
},
subsequencemonth: {
required: true,
msg: "",
value: ""
},
retainer_months: {
required: true,
msg: "",
value: ""
},
term_in_months: {
required: true,
msg: "",
value: ""
},
lockDate: {
required: true,
msg: "",
value: ""
},
startDate: {
required: true,
msg: "",
value: ""
},
endDate: {
required: true,
msg: "",
value: ""
},
// comments: {
// required: false,
// msg: "",
// value: ""
// },
country_id: {
required: true,
msg: "",
value: ""
},
state_id: {
required: true,
msg: "",
value: ""
},
city_id: {
required: true,
msg: "",
value: ""
},
pincode: {
required: true,
msg: "",
value: ""
},
otm_id: {
required: true,
msg: "",
value: ""
},
/*customer_name:{
required:true,
msg:'',
value:''
} ,*/
address2: {
required: true,
msg: "",
value: ""
},
address1: {
required: true,
msg: "",
value: ""
}
};
class Header extends Component {
constructor(props) {
super(props);
this.state = {
loading: false,
first_name: "",
firstname_title:"",
last_name: "",
company_name: "",
customer_name: "",
endDate: "",
lead_date: "",
lockDate: "",
startDate: "",
office_type: "",
lead_source: "",
country_id: "",
countryall: [],
state_id: "",
stateall: [],
city_id: "",
cityall: [],
pincode: "",
pincodeAll: [],
retainer_amount: "",
emailid: "",
lds_id: "",
otm_id: "",
lds_data: [],
type_data: [],
spaceList: [{ value: "", text: false, list: [], selected: [] }],
contact_number: "",
error_status: false,
preloader: false,
lead_status: 1,
reference_no: localStorage.getItem("lead_id")
? localStorage.getItem("lead_id")
: "",
comments: "",
subsequencemonth: "",
retainer_months: "",
term_in_months:"",
total_amt: "",
address2: "",
address1: "",
title: "Edit",
renewalStatus: localStorage.getItem("renewalStatus")
? localStorage.getItem("renewalStatus")
: false,
renewalAgreementModal: false,
extensionFlag: 0,
extensionCustomerId: 0,
renewal_status: 0
};
this.eventHandle = this.eventHandle.bind(this);
this.close_lead = this.close_lead.bind(this);
this.handleChangeAgreement = this.handleChangeAgreement.bind(this);
this.handleChangeLock = this.handleChangeLock.bind(this);
this.handleChangeStart = this.handleChangeStart.bind(this);
this.handleChangeEnd = this.handleChangeEnd.bind(this);
this.onsubmit = this.onsubmit.bind(this);
this.sendemail = this.sendemail.bind(this);
this.onChangetext = this.onChangetext.bind(this);
this.getLead = this.getLead.bind(this);
this.onRowchange = this.onRowchange.bind(this);
this.showAgreement = this.showAgreement.bind(this);
this.closeAgreement = this.closeAgreement.bind(this);
this.renewalAgreement = this.renewalAgreement.bind(this);
this.closeRenewalAgreement = this.closeRenewalAgreement.bind(this);
this.confirmAgreement = this.confirmAgreement.bind(this);
this.deleteRow = this.deleteRow.bind(this);
// this.totalCalculation=this.totalCalculation.bind(this);
}
componentDidMount() {
if (this.props.params.id) {
this.setState({ preloader: true });
viewAgreement(this.props.params.id).then(res => {
   console.log("data=",res.data);
   debugger;
if (res.data.status === 200) {
  
let data = res.data.data;
let datas = res.data.datas;
this.getStateLists(data.country ? data.country : 0);
this.getCityLists(data.state ? data.state : 0);
let specs = datas.map((val, i) => {
//console.log(val);
return { value: val.cabinname, list: [], selected: val };
});
this.setState({
city_id: data.city,
comments: data.comments ? data.comments : "",
company_name: data.company_name,
contact_number: data.contact_number,
country_id: data.country,
address2: data.address2,
address1: data.address1,
emailid: data.emailid,
endDate: moment(data.end_date),
first_name: data.first_name,
firstname_title:data.firstname_title?data.firstname_title:"Mr",
last_name: data.last_name,
otm_id: data.otm_id,
lds_id: data.lds_id,
lead_date: moment(data.agreement_date),
lead_source: data.lead_source,
lead_status: data.lead_status,
lockDate: moment(data.lock_date),
subsequencemonth: data.subsequencemonth,
office_type: data.office_type,
pincode: data.pincode,
reference_no: data.reference_no,
retainer_months: data.retainer_months,
retainer_amount: data.retainer_amount,
term_in_months:data.term_in_months?data.term_in_months:0,
spaceList: specs,
startDate: moment(data.start_date),
state_id: data.state,
total_amt: data.total_amt,
error_status: true,
preloader: false,
agreementid: this.props.params.id,
agreementID: this.props.params.id,
previewAgreement: false,
renewalAgreement: false,
renewal_status: data.renewal_status ? data.renewal_status : 0
});
}
});
} else {
//For extend new agreement
if (
localStorage.getItem("extensionStatus") == "true" &&
localStorage.getItem("cust_hid")
) {
this.getCustomerInfo(localStorage.getItem("cust_hid"));
} else {
this.getLead();
}
}
getCountryList().then(res => {
if (res.data.status === 200) {
let data = res.data.data;
this.setState({ countryall: data });
}
});
leadSoucre().then(res => {
if (res.data.status === 200) {
let data = res.data.result.data;
this.setState({ lds_data: data });
}
});
officeType().then(res => {
if (res.data.status === 200) {
let data = res.data.result.data;
this.setState({ type_data: data });
}
});
}
getStateLists(id) {
getStateList(id).then(res => {
if (res.data.status === 200) {
let data = res.data.data;
this.setState({ stateall: data });
}
});
}
getCityLists(id) {
getCityList(id).then(res => {
if (res.data.status === 200) {
let data = res.data.data;
this.setState({ cityall: data });
}
});
}
/*  getPincodeLists(id){
getPincodeList(id).then((res)=>{
if(res.data.status===200){
let data=res.data.data;
this.setState({pincodeAll:data});
}
})
}*/
getCustomerInfo(cust_hid) {
this.setState({ preloader: true });
getCustomerDetails(cust_hid).then(res => {
let data = res.data.data;
if (res.data.status === 200 && data) {
   console.log("data=",data);
this.getStateLists(data.country ? data.country : 0);
this.getCityLists(data.state ? data.state : 0);
this.setState({
extensionFlag: 1,
extensionCustomerId: cust_hid,
first_name: data.first_name,
firstname_title:data.firstname_title?data.firstname_title:"Mr",
last_name: data.last_name,
company_name: data.company_name,
emailid: data.emailid,
otm_id: 0,
office_type: 0,
lead_date: "",
reference_no: data.reference_no,
contact_number: data.contact_number,
lead_status: data.lead_status,
preloader: false,
address1: data.address1,
address2: data.address2,
country_id: data.country,
state_id: data.state,
city_id: data.city,
pincode: data.pincode,
lead_status: 1
});
}
});
this.setState({ preloader: false });
}
getLead() {
getWonLead(this.state.reference_no).then(res => {
let data = res.data.data;
if (res.data.status === 200 && data) {
this.setState({
first_name: data.first_name,
firstname_title:data.firstname_title,
last_name: data.last_name,
company_name: data.company_name,
emailid: data.emailid,
lds_id: data.lds_id,
otm_id: data.otm_id,
office_type: data.office_type,
lead_source: data.lead_source,
lead_date: moment(data.lead_date), //data.lead_date,
contact_number: data.contact_number,
lead_status: data.lead_status,
preloader: false
});
}
localStorage.removeItem("lead_id");
});
}
eventHandle(e, key, val) {
if (key === "otm_id") {
let office_type =
e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
this.setState({ otm_id: e.target.value, office_type: office_type });
} else if (key === "subsequencemonth") {
let retainer_amount = this.state.retainer_months
? e.target.value * this.state.retainer_months
: 0;
this.setState({
[key]: key === "status" ? val : e.target.value,
retainer_amount: retainer_amount
});
} else if (key === "retainer_months") {
let retainer_amount = this.state.subsequencemonth
? e.target.value * this.state.subsequencemonth
: 0;
this.setState({
[key]: key === "status" ? val : e.target.value,
retainer_amount: retainer_amount
});
}  else {
this.setState({ [key]: key === "status" ? val : e.target.value });
}
if (key === "country_id") {
this.getStateLists(e.target.value);
}
if (key === "state_id") {
this.getCityLists(e.target.value);
}
/*if(key==="city_id"){
this.getPincodeLists(e.target.value);
}*/
}
handleChangeAgreement(date, e) {
this.setState({
lead_date: moment(date)
});
}
handleChangeLock(date, e) {
this.setState({
lockDate: moment(date)
});
}
handleChangeStart(date, e) {
   this.setState({
      startDate: moment(date),
      term_in_months: 0,
      endDate:''
      });
}
handleChangeEnd(date, e) {


  if(date){ 
   let termInMonths=moment(this.state.startDate).date()===1?(moment(date).diff(moment(this.state.startDate),'month')+1):(moment(date).diff(moment(this.state.startDate),'month'));
     this.setState({
      endDate: moment(date),
      term_in_months: termInMonths
      });
  } 

}
sendemail() {
sendEmailAgreement(this.props.params.id).then(res => {
if (res.data.status === 200) {
alert("Send Successfully");
}
});
}
showRenewal = () => {
this.setState({
renewalAgreementModal: true,
agreementid: this.props.params.id
});
$("#AgreementRenewal").modal("open");
};
closeRenewalModal = v => {
if (v == 1) {
this.setState({ renewalAgreementModal: false, renewalStatus: false });
localStorage.setItem("renewalStatus", false);
}
$("#AgreementRenewal").modal("close");
};
showAgreement() {
this.setState({
previewAgreement: true,
agreementid: this.props.params.id
});
// $("#AgreementConfirm").modal("open");
}
closeAgreement(v) {
if (v == 1) {
this.setState({ previewAgreement: false });
}
$("#AgreementConfirm").modal("close");
}
renewalAgreement() {
this.setState({
renewalAgreement: true,
agreementID: this.props.params.id
});
$("#RenewalAgreement").modal("open");
}
closeRenewalAgreement(v) {
if (v == 1) {
this.setState({ renewalAgreement: false });
}
$("#RenewalAgreement").modal("close");
}
confirmAgreement() {}
onsubmit() {
let {
retainer_amount,
city_id,
comments,
company_name,
contact_number,
country_id,
emailid,
endDate,
firstname_title,
first_name,
last_name,
lds_id,
lead_date,
lead_source,
lead_status,
lockDate,
subsequencemonth,
office_type,
otm_id,
pincode,
reference_no,
retainer_months,
term_in_months,
spaceList,
startDate,
state_id,
total_amt,
address2,
address1,
extensionFlag,
extensionCustomerId
} = this.state;
let errors = validationCheck(validateCols);
let isDisable = Object.keys(errors).some(x => errors[x].msg);
console.log(isDisable, validateCols);
//let errors = validate(first_name,company_name,emailid,lds_id,contact_number,lead_status);
this.setState({ preloader: true });
let isDisabled = false; //Object.keys(errors).some(x => errors[x]);
let slist = this.state.spaceList;
//isDisabled = Object.keys(slist).some(x => slist[x].value);
/*let officeunits=[],dupofficeunits=[];
this.state.spaceList.map((val,i) => {
if(val.selected.cabin_no!="" && val.selected.cabin_no!=undefined)
{
if(officeunits.indexOf(val.selected.cabin_no)==-1)
{
officeunits.push(val.selected.cabin_no);
}
else
{
dupofficeunits.push(val.selected.cabin_no);
}
}
});
if(dupofficeunits.length>0)
{
alert("Duplicate office number exist...");
isDisabled=true;
}
else
{
isDisabled=false;
}*/
if (isDisable === false) {
var ds = "Mon Jul 03 2017 00:00:00 GMT+0530 (India Standard Time)";
var date = moment(new Date(ds.substr(0, 16)));
let params = {
city_id: city_id,
comments: comments,
company_name: company_name,
contact_number: contact_number,
country_id: country_id,
address2: address2,
address1: address1,
emailid: emailid,
endDate: moment(new Date(endDate)).format("YYYY-MM-DD"),
firstname_title:firstname_title,
first_name: first_name,
last_name: last_name,
lds_id: lds_id,
lead_date: moment(new Date(lead_date)).format("YYYY-MM-DD"),
lead_source: lead_source,
lead_status: lead_status,
lockDate: moment(new Date(lockDate)).format("YYYY-MM-DD"),
subsequencemonth: subsequencemonth,
office_type: office_type,
otm_id: otm_id,
pincode: pincode,
reference_no: reference_no,
retainer_months: retainer_months,
term_in_months:term_in_months,
retainer_amount: retainer_amount,
spaceList: spaceList,
startDate: moment(new Date(startDate)).format("YYYY-MM-DD"),
state_id: state_id,
total_amt: total_amt,
extensionFlag: extensionFlag,
extensionCustomerId: extensionCustomerId
};
let para = this.props.params.id ? "/" + this.props.params.id : "";
addAgreement(params, para).then(res => {
if (res.data.status === 200) {
//this.props.update_fetch_status();
localStorage.removeItem("extensionStatus");
localStorage.removeItem("cust_hid");
browserHistory.push("/leads/agreement");
} else {
alert("Please enter required fields...");
this.setState({ error_status: true, preloader: false });
}
});
} else {
this.setState({ error_status: true, preloader: false });
}
}
close_lead() {
this.props.close_lead();
}
onChangetext(e, i) {
//console.log(this.state.startDate);
let date1 = new Date(this.state.startDate);
let date2 = new Date(this.state.endDate);
let currentDate = new Date(this.state.lockDate);
let timeDiff = date2.getTime() - date1.getTime();
let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
if (this.state.startDate == "" || this.state.endDate == "") {
alert("Enter agreement start-date/end-date");
} else {
if (diffDays < 0) {
alert("End Date should be greater than start date");
} else {
if (currentDate >= date1 && currentDate <= date2) {
console.log("Correct Date");
} else {
alert("Lock date should be between start-date & end-date !!");
}
}
this.state.spaceList[i].value = e.target.value;
this.setState({
loading: true,
loader: true,
spaceList: this.state.spaceList
});
axiosCancel(xhr, { debug: false });
const requestId = "areasuggest";
xhr
.get(
"loadAvailableUnits",
{
params: {
search_term: e.target.value,
limit: 10,
page: 1,
availableUnits: 1,
startDate: moment(new Date(this.state.startDate)).format(
"YYYY-MM-DD"
),
endDate: moment(new Date(this.state.endDate)).format("YYYY-MM-DD")
}
},
{ requestId: requestId }
)
.then(res => {
console.log(res.data.data);
let data = res.data.data;
//console.log(data);
if (data) {
let options = [];
data.map((val, i) => {
options.push({ value: val.cabin_no, result: val });
});
this.state.spaceList[i].list = options;
this.state.spaceList[i].selected = [];
this.setState({
loading: false,
loader: false,
spaceList: this.state.spaceList
});
}
});
xhr.cancel(requestId);
}
}
onSelectedtext(i, val, list) {
let slist = this.state.spaceList;
let isvalid = Object.keys(slist).some(
x => slist[x].value == val && slist[x].text === true
);
if (!isvalid) {
this.state.spaceList[i].list = [];
this.state.spaceList[i].value = val;
this.state.spaceList[i].text = true;
this.state.spaceList[i].selected = list["result"];
let sum = 0;
let retainerAmount = 0;
this.state.spaceList.map((val, i) => {
let rate = val.selected.over_ride_rate
? val.selected.over_ride_rate
: val.selected.rate;
if (rate) {
sum = parseFloat(parseFloat(sum) + parseFloat(rate));
}
});
if (parseInt(this.state.retainer_months) > 0)
retainerAmount = parseFloat(this.state.retainer_months * sum);
this.setState({
loading: false,
loader: false,
spaceList: [
...this.state.spaceList,
...[{ value: "", text: false, list: [], selected: [] }]
],
total_amt: sum,
subsequencemonth: sum,
search_term: "",
retainer_amount: retainerAmount
});
} else {
alert("Space already selected!");
}
}
onRowchange(e, val, i) {
this.state.spaceList[i].selected[val] = e.target.value;
let sum = 0;
let retainerAmount = 0;
this.state.spaceList.map((val, i) => {
let rate = val.selected.over_ride_rate
? val.selected.over_ride_rate
: val.selected.rate;
if (rate) {
sum = parseFloat(parseFloat(sum) + parseFloat(rate));
}
});
if (parseInt(this.state.retainer_months) > 0)
retainerAmount = parseFloat(this.state.retainer_months * sum);
this.setState({
spaceList: this.state.spaceList,
total_amt: sum,
subsequencemonth: sum,
retainer_amount: retainerAmount
});
}
deleteRow(i) {
if (this.state.spaceList[i].text === true) {
let spacelist = this.state.spaceList;
spacelist.splice(i, 1);
this.setState({ spaceList: spacelist });
}
}
render() {
let {
retainer_amount,
total_amt,
reference_no,
lead_date,
firstname_title,
first_name,
last_name,
company_name,
emailid,
contact_number,
subsequencemonth,
retainer_months,
term_in_months,
lockDate,
startDate,
endDate,
comments,
country_id,
state_id,
city_id,
pincode,
otm_id,
pincodeAll,
stateall,
cityall,
countryall,
title,
error_status,
preloader,
lds_data,
type_data,
spaceList,
customer_name,
address2,
address1,
agreementid,
previewAgreement,
renewalAgreement,
lead_status,
renewalStatus,
renewalAgreementModal,
renewal_status
} = this.state;
/* let {pincodeAll,reference_no,customer_name,state_id,stateall,city_id,cityall,pincode,spaceList,countryall,country_id,first_name,last_name,company_name,emailid,lds_id,contact_number,title,error_status,preloader,lds_data,otm_id,type_data,office_type,lead_source,requirement,comments,lead_status,lead_date,retainer_months,lockDate,startDate,endDate,subsequencemonth} = this.state;
*/
let css = {
position: "fixed",
overflow: "auto",
zIndex: 1,
maxHeight: "10%"
};
validateCols.retainer_amount.value = retainer_amount;
validateCols.reference_no.value = reference_no;
validateCols.lead_date.value = lead_date;
validateCols.firstname_title.value=firstname_title;
validateCols.first_name.value = first_name;
validateCols.last_name.value = last_name;
validateCols.company_name.value = company_name;
validateCols.emailid.value = emailid;
validateCols.contact_number.value = contact_number;
validateCols.subsequencemonth.value = subsequencemonth;
validateCols.retainer_months.value = retainer_months;
validateCols.term_in_months.value=term_in_months;
validateCols.lockDate.value = lockDate;
validateCols.startDate.value = startDate;
validateCols.endDate.value = endDate;
//validateCols.comments.value = comments;
validateCols.country_id.value = country_id;
validateCols.state_id.value = state_id;
validateCols.city_id.value = city_id;
validateCols.pincode.value = pincode;
validateCols.otm_id.value = otm_id;
//validateCols.customer_name.value=customer_name;
validateCols.address2.value = address2;
validateCols.address1.value = address1;
console.log(validateCols);
let errors = validationCheck(validateCols);
return (
<div className="portlet">
   <div className="transition-item detail-page">
      <div className="main-content">
         <div
         id="AgreementConfirm"
         className="modal"
         style={{ width: "85vw", height: "100vh" }}
         >
         <div className="modal-content">
            <h6>Preview Agreement</h6>
            {previewAgreement && (
            <AgreementConfirm
               closeAgreement={this.closeAgreement}
               confirmAgreement={this.confirmAgreement}
               agreementid={agreementid}
               />
            )}
         </div>
      </div>
      <div
      id="RenewalAgreement"
      className="modal"
      style={{ width: "85vw", height: "100vh" }}
      >
      <div className="modal-content">
         <h6>Renewal Agreement</h6>
         {renewalAgreement && (
         <PreviewAgreementrenewal
            closeRenewalAgreement={this.closeRenewalAgreement}
            renewalAgreement={this.renewalAgreement}
            agreementid={agreementid}
            />
         )}
      </div>
   </div>
   <div
   id="AgreementRenewal"
   className="modal"
   style={{ width: "85vw", height: "100vh" }}
   >
   <div className="modal-content">
      <h6>Renewal Agreement</h6>
      {renewalAgreementModal && (
      <RenewalAgreement
         closeRenewalModal={this.closeRenewalModal}
         renewalAgreement={this.renewalAgreement}
         agreementid={agreementid}
         />
      )}
   </div>
</div>
<div className="col s12 portlet-title">
   <div className="caption">AGREEMENT</div>
</div>
<form method="post" encType="multipart/form-data">
   <div className="col s12" style={{margin:'2%'}}>
       <h7 className="sub-header">ADDRESS</h7>
   <div className="row">
      <div className="input-field col s4">
         <input
            type="text"
            onBlur={() => {
         this.getLead();
         }}
         onChange={e => {
         this.eventHandle(e, "reference_no");
         }}
         className={
         errors.reference_no.msg && error_status ? "invalid" : ""
         }
         value={reference_no}
         />
         <label className={errors.reference_no.msg ? "" : "active"}>
         Reference No
         </label>
         {errors.reference_no.msg && error_status ? (
         <div className="validation-error">
            {errors.reference_no.msg}
         </div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <DatePicker
            selected={lead_date}
            dateFormat="DD/MM/YYYY"
            readOnly={true}
            className="datepicker form-control"
            onChange={this.handleChangeAgreement}
            />
         <label className={errors.lead_date.msg ? "" : "active"}>
         Agreement Date
         </label>
         {errors.lead_date.msg && error_status ? (
         <div className="validation-error">
            {errors.lead_date.msg}
         </div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s1">
         <select
         className={`browser-default ${
         errors.firstname_title.msg && error_status ? "invalid" : ""
         }`}
         value={firstname_title}
         onChange={e => {
         this.eventHandle(e, "firstname_title");
         }}
         >
         <option value="">Title</option>
         <option value="Mr">Mr</option>
         <option value="Mrs">Mrs</option>
        
         </select>
         {errors.firstname_title.msg && error_status ? (
         <div className="validation-error">
            {errors.firstname_title.msg}
         </div>
         ) : (
         ""
         )}
      </div>

      <div className="input-field col s3">
         <input
            type="text"
            onChange={e => {
         this.eventHandle(e, "first_name");
         }}
         className={
         errors.first_name.msg && error_status ? "invalid" : ""
         }
         value={first_name}
         />
         <label className={errors.first_name.msg ? "" : "active"}>
         First Name
         </label>
         {errors.first_name.msg && error_status ? (
         <div className="validation-error">
            {errors.first_name.msg}
         </div>
         ) : (
         ""
         )}
      </div>
    </div>
    <div className="row">
      <div className="input-field col s4">
         <input
            type="text"
            onChange={e => {
         this.eventHandle(e, "last_name");
         }}
         className={
         errors.last_name.msg && error_status ? "invalid" : ""
         }
         value={last_name}
         />
         <label className={errors.last_name.msg ? "" : "active"}>
         Last Name
         </label>
         {errors.last_name.msg && error_status ? (
         <div className="validation-error">
            {errors.last_name.msg}
         </div>
         ) : (
         ""
         )}
      </div>
       <div className="input-field col s4">
         <input
            type="text"
            onChange={e => {
         this.eventHandle(e, "emailid");
         }}
         className={
         errors.emailid.msg && error_status ? "invalid" : ""
         }
         value={emailid}
         />
         <label className={errors.emailid.msg ? "" : "active"}>
         Email ID
         </label>
         {errors.emailid.msg && error_status ? (
         <div className="validation-error">{errors.emailid.msg}</div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <input
            type="text"
            onChange={e => {
         this.eventHandle(e, "contact_number");
         }}
         className={
         errors.contact_number.msg && error_status ? "invalid" : ""
         }
         maxLength={10}
         value={contact_number}
         />
         <label className={errors.contact_number.msg ? "" : "active"}>
         Contact No
         </label>
         {errors.contact_number.msg && error_status ? (
         <div className="validation-error">
            {errors.contact_number.msg}
         </div>
         ) : (
         ""
         )}
      </div>
    </div>
    <div className="row">
      <div className="input-field col s4">
         <textarea
            onChange={e =>
         {
         this.eventHandle(e, "address1");
         }}
         className={
         errors.address1.msg && error_status
         ? "materialize-textarea invalid"
         : "materialize-textarea"
         }
         value={address1}
         />
         <label className={errors.address1.msg ? "" : "active"}>
         Address Line 1
         </label>
         {errors.address1.msg && error_status ? (
         <div className="validation-error">
            {errors.address1.msg}
         </div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <textarea
            onChange={e =>
         {
         this.eventHandle(e, "address2");
         }}
         className={
         errors.address2.msg && error_status
         ? "materialize-textarea invalid"
         : "materialize-textarea"
         }
         value={address2}
         />
         <label className={errors.address2.msg ? "" : "active"}>
         Address Line 2
         </label>
         {errors.address2.msg && error_status ? (
         <div className="validation-error">
            {errors.address2.msg}
         </div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <select
         className={`browser-default ${
         errors.country_id.msg && error_status ? "invalid" : ""
         }`}
         value={country_id}
         onChange={e => {
         this.eventHandle(e, "country_id");
         }}
         >
         <option value="">Select Country</option>
         {countryall &&
         countryall.map((val, i) => {
         return (
         <option title={i} key={i} value={val.country_id}>
            {val.country_name}
         </option>
         );
         })}
         </select>
         {errors.country_id.msg && error_status ? (
         <div className="validation-error">
            {errors.country_id.msg}
         </div>
         ) : (
         ""
         )}
      </div>
    </div>
    <div className="row">
      <div className="input-field col s4">
         <select
         className={`browser-default ${
         errors.state_id.msg && error_status ? "invalid" : ""
         }`}
         value={state_id}
         onChange={e => {
         this.eventHandle(e, "state_id");
         }}
         >
         <option value="">Select State</option>
         {stateall &&
         stateall.map((val, i) => {
         return (
         <option title={i} key={i} value={val.state_id}>
            {val.state_name}
         </option>
         );
         })}
         </select>
         {errors.state_id.msg && error_status ? (
         <div className="validation-error">
            {errors.state_id.msg}
         </div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <select
         className={`browser-default ${
         errors.city_id.msg && error_status ? "invalid" : ""
         }`}
         value={city_id}
         onChange={e => {
         this.eventHandle(e, "city_id");
         }}
         >
         <option value="">Select City</option>
         {cityall &&
         cityall.map((val, i) => {
         return (
         <option title={i} key={i} value={val.city_id}>
            {val.city_name}
         </option>
         );
         })}
         </select>
         {errors.city_id.msg && error_status ? (
         <div className="validation-error">{errors.city_id.msg}</div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <input
            type="text"
            onChange={e => {
         this.eventHandle(e, "pincode");
         }}
         className={
         errors.pincode.msg && error_status ? "invalid" : ""
         }
         maxLength={15}
         value={pincode}
         />
         <label className={errors.pincode.msg ? "" : "active"}>
         Pincode
         </label>
         {errors.pincode.msg && error_status ? (
         <div className="validation-error">{errors.pincode.msg}</div>
         ) : (
         ""
         )}
      </div>
    </div>
</div>



<div className="col s12" style={{margin:'2%'}}>
    <h7 className="sub-header">Additional Informations</h7>
   <div className="row">
      <div className="input-field col s4">
         <input
            type="text"
            onChange={e => {
         this.eventHandle(e, "company_name");
         }}
         className={
         errors.company_name.msg && error_status ? "invalid" : ""
         }
         value={company_name}
         />
         <label className={errors.company_name.msg ? "" : "active"}>
         Comapny Name
         </label>
         {errors.company_name.msg && error_status ? (
         <div className="validation-error">
            {errors.company_name.msg}
         </div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <DatePicker
         showYearDropdown
         showMonthDropdown
         scrollableYearDropdown
         minDate={moment().add(-150, "days")}
         yearDropdownItemNumber={20}
         selected={startDate}
         dateFormat="DD/MM/YYYY"
         readOnly={true}
         className="datepicker form-control"
         onChange={this.handleChangeStart}
         />
         <label className={errors.startDate.msg ? "" : "active"}>
         Start date
         </label>
         {errors.startDate.msg && error_status ? (
         <div className="validation-error">
            {errors.startDate.msg}
         </div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <DatePicker
         showYearDropdown
         showMonthDropdown
         scrollableYearDropdown
         minDate={moment().add(-150, "days")}
         yearDropdownItemNumber={20}
         selected={endDate}
         dateFormat="DD/MM/YYYY"
         readOnly={true}
         className="datepicker form-control"
         onChange={this.handleChangeEnd}
         />
         <label className={errors.endDate.msg ? "" : "active"}>
         End date
         </label>
         {errors.endDate.msg && error_status ? (
         <div className="validation-error">{errors.endDate.msg}</div>
         ) : (
         ""
         )}
      </div>
    </div>
    <div className="row">
      <div className="input-field col s4">
         <DatePicker
         showYearDropdown
         showMonthDropdown
         scrollableYearDropdown
         minDate={moment().add(-150, "days")}
         yearDropdownItemNumber={20}
         selected={lockDate}
         dateFormat="DD/MM/YYYY"
         readOnly={true}
         className="datepicker form-control"
         onChange={this.handleChangeLock}
         />
         <label className={errors.lockDate.msg ? "" : "active"}>
         Lock in Date
         </label>
         {errors.lockDate.msg && error_status ? (
         <div className="validation-error">
            {errors.lockDate.msg}
         </div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <input
            type="text"
            onChange={e => {
         this.eventHandle(e, "subsequencemonth");
         }}
         className={
         errors.subsequencemonth.msg && error_status
         ? "invalid"
         : ""
         }
         maxLength={10}
         value={subsequencemonth}
         />
         <label
         className={errors.subsequencemonth.msg ? "" : "active"}
         >
         Subsequent Monthly Billing
         </label>
         {errors.subsequencemonth.msg && error_status ? (
         <div className="validation-error">
            {errors.subsequencemonth.msg}
         </div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <input
            type="text"
            onChange={e => {
         this.eventHandle(e, "retainer_months");
         }}
         className={
         errors.retainer_months.msg && error_status
         ? "invalid"
         : ""
         }
         maxLength={10}
         value={retainer_months}
         />
         <label className={errors.retainer_months.msg ? "" : "active"}>
         Retainer in Month
         </label>
         {errors.retainer_months.msg && error_status ? (
         <div className="validation-error">
            {errors.retainer_months.msg}
         </div>
         ) : (
         ""
         )}
      </div>
	  
	  <div className="input-field col s4">
         <input
            type="text"            
         className={
         errors.term_in_months.msg && error_status
         ? "invalid"
         : ""
         }
         maxLength={10}
         value={term_in_months}
         />
         <label className={errors.term_in_months.msg ? "" : "active"}>
         Term in Month
         </label>
         {errors.term_in_months.msg && error_status ? (
         <div className="validation-error">
            {errors.term_in_months.msg}
         </div>
         ) : (
         ""
         )}
      </div>
   </div>
   <div className="row">    
      <div className="input-field col s4">
         <input
            type="text"
            onChange={e => {
         this.eventHandle(e, "retainer_amount");
         }}
         className={
         errors.retainer_amount.msg && error_status
         ? "invalid"
         : ""
         }
         maxLength={15}
         value={retainer_amount}
         />
         <label className={errors.retainer_amount.msg ? "" : "active"}>
         Retainer Amount
         </label>
         {errors.retainer_amount.msg && error_status ? (
         <div className="validation-error">
            {errors.retainer_amount.msg}
         </div>
         ) : (
         ""
         )}
      </div>     
      <div className="input-field col s4">
         <select
         className={`browser-default ${
         errors.otm_id.msg && error_status ? "invalid" : ""
         }`}
         value={otm_id}
         onChange={e => {
         this.eventHandle(e, "otm_id");
         }}
         >
         <option value="">Select Office Type</option>
         {type_data &&
         type_data.map((val, i) => {
         return (
         <option title={i} key={i} value={val.otm_id}>
            {val.officetype}
         </option>
         );
         })}
         </select>
         {errors.otm_id.msg && error_status ? (
         <div className="validation-error">{errors.otm_id.msg}</div>
         ) : (
         ""
         )}
      </div>
      <div className="input-field col s4">
         <textarea
            onChange={e =>
         {
         this.eventHandle(e, "comments");
         }}
         className={"materialize-textarea"}
         value={comments}
         />
         <label className={"active"}>
         Comments
         </label>    
      </div>
   </div>
  </div>
   <div className="row">
      <div className="input-field col s12">
         <table className="striped ">
            <thead className="fixed-header">
               <tr>
                  <th width="4%">Sno</th>
                  <th>Office No</th>
                  <th>No of work station</th>
                  <th>
                     Area (m
                     <sup>2</sup>)
                  </th>
                  <th>Rate</th>
                  <th>Over ride rate</th>
               </tr>
            </thead>
            <tbody className="fixed-div">
               {spaceList.map((val, i) => {
               return (
               <tr key={i}>
                  <td width="4%" className="input-field">
                     <span
                     style={{ color: "red" }}
                     onClick={e => this.deleteRow(i)}
                     >
                     X
                     </span>{" "}
                     {i + 1}
                  </td>
                  <td className="input-field">
                     <Autocomplete
                     inputProps={{ className: "input-box test" }}
                     wrapperStyle={{
                     display: "inline",
                     zIndex: "102"
                     }}
                     menuStyle={css}
                     getItemValue={item => item.value}
                     items={val.list}
                     renderItem={(item, isHighlighted, i) => (
                     <div
                     key={item.result.sm_id}
                     style={{
                     background: isHighlighted
                     ? "lightgray"
                     : "white",
                     zIndex: "102"
                     }}
                     >
                     {item.value}
      </div>
      )}
      value={val.value}
      onChange={e => this.onChangetext(e, i)}
      //onSelect={(e) =>this.onSelectedtext.bind(e,val.list,i)}
      onSelect={this.onSelectedtext.bind(this, i)}
      />
      </td>
      <td className="input-field">
      <input
         type="text"
         value={val.selected.no_of_work_station}
         placeholder="Category"
         />
      </td>
      <td className="input-field">
      <input
         type="text"
         value={val.selected.area}
         placeholder="Type"
         />
      </td>
      <td className="input-field">
      <input
         type="text"
         value={val.selected.rate}
         placeholder="Rate"
         />
      </td>
      <td className="input-field">
      <input
         type="text"
         onChange={e => {
      this.onRowchange(e, "over_ride_rate", i);
      }}
      className={
      errors.over_ride_rate && error_status
      ? "invalid"
      : ""
      }
      value={val.selected.over_ride_rate}
      placeholder="Over ride rate"
      />
      </td>
      </tr>
      );
      })}
      </tbody>
      <thead className="fixed-header">
      <tr>
      <th width="4%" />
      <th />
      <th />
      <th />
      <th> Total Amount</th>
      <th>{total_amt}</th>
      </tr>
      </thead>
      </table>
   </div>
   </div>
   <div className="row">
      <div className="input-field col s12 right">

         &nbsp;&nbsp;
         {lead_status != 4 &&
         !this.props.params.id && (
         <button
            type="button"
            onClick={e => {
         this.onsubmit();
         }}
         className="btn btn-sm btn-primary"
         >
         Save
         </button>
         )}
         &nbsp;&nbsp;
         {this.props.params.id &&
         lead_status != 4 && (
         <button
            type="button"
            onClick={e => {
         this.sendemail();
         }}
         className="btn btn-sm btn-primary"
         >
         Send Email
         </button>
         )}
         &nbsp;
         {this.props.params.id && (
          <a href={'http://localhost/rest-api/previewagreement/'+agreementid} target="_blank"> 
          <button
            type="button"
            onClick={e => {
         this.showAgreement();
         }}
         className="btn btn-sm btn-primary"
         >
           Preview
         </button>
         </a>
        
         )}
         &nbsp;
         {this.props.params.id &&
         renewal_status == 1 && (
         <button
            type="button"
            onClick={e => {
         this.renewalAgreement();
         }}
         className="btn btn-sm btn-primary"
         >
         Preview Agreement Renewal
         </button>
         )}
         &nbsp;
         {this.props.params.id &&
         renewalStatus == "true" && (
         <button
            type="button"
            onClick={e => {
         this.showRenewal();
         }}
         className="btn btn-sm btn-primary"
         >
         Renewal
         </button>
         )}
         &nbsp;&nbsp;
         <Link to="leads/agreement" className="btn-sm btn-default">
         Cancel
         </Link>
      </div>
   </div>
</form>
</div>
{preloader && 
<Preloader />
}
</div>
</div>
);
}
}
export default Header;

