import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
update_fetch_status,
viewLeads,
enquiry,
leadSoucre,
officeType,
getCenter,
getSalesPerson
} from "../../actions/leadsActions";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import browserHistory from "../../core/History";
import { Link } from "react-router";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
function validate(
first_name,
company_name,
emailid,
lds_id,
phone,
status,
enquiry_date
) {
let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let regs = /^\d+$/;
let numbers = /^\d{10}$/;
return {
first_name: first_name.length === 0,
company_name: company_name.length === 0,
emailid: reg.test(emailid) === false,
lds_id: lds_id.length === 0,
phone: !numbers.test(phone),
status: status.length === 0,
enquiry_date: enquiry_date.length === 0
};
}
class AddEdit extends React.Component {
constructor(props) {
super(props);
this.state = {
loading: false,
first_name: "",
last_name: "",
company_name: "",
office_type: "",
lead_source: "",
emailid: "",
lds_id: "",
otm_id: "",
sales_id: "",
cent_id: "",
lds_data: [],
centerData: [],
salesData: [],
type_data: [],
phone: "",
requirement: "",
no_of_seats: "",
proposal_value: "",
exp_start_date: "", //moment(),
error_status: false,
preloader: this.props.params.id ? true : false,
status: 1,
title: this.props.params.id ? "Edit" : "New",
enquiry_date: moment()
};
this.eventHandle = this.eventHandle.bind(this);
this.onsubmit = this.onsubmit.bind(this);
this.loadSalesPerson = this.loadSalesPerson.bind(this);
this.handleChangeAgreement = this.handleChangeAgreement.bind(this);
this.handleChangeEnquiry = this.handleChangeEnquiry.bind(this);
// this.totalCalculation=this.totalCalculation.bind(this);
}
componentDidMount() {
if (this.props.params.id) {
viewLeads(this.props.params.id).then(res => {
if (res.data.status === 200) {
let data = res.data.data;
this.setState({
first_name: data.first_name,
last_name: data.last_name,
company_name: data.company_name,
emailid: data.emailid,
lds_id: data.lds_id,
otm_id: data.otm_id,
office_type: data.office_type,
lead_source: data.lead_source,
phone: data.phone,
error_status: true,
exp_start_date: moment(new Date(data.exp_start_date)).format(
"YYYY-MM-DD"
),
enquiry_date: moment(new Date(data.enquiry_date)),
no_of_seats: data.no_of_seats,
proposal_value: data.proposal_value,
cent_id: data.cent_id,
sales_id: data.sales_id,
status: data.status,
requirement: data.requirement,
preloader: false
});
}
});
}
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
getCenter().then(res => {
if (res.data.status === 200) {
let data = res.data.data;
this.setState({ centerData: data });
}
});


}

loadSalesPerson=($centerid)=>{
   getSalesPerson($centerid).then(res => {
      if (res.data.status === 200) {
      let data = res.data.data;
      this.setState({ salesData: data });
      }
      });
}

handleChangeAgreement(date, e) {
this.setState({
exp_start_date: moment(date)
});
}
eventHandle(e, key, val) {
if (key === "lds_id") {
let lead_source =
e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
this.setState({ lds_id: e.target.value, lead_source: lead_source });
} else if (key === "otm_id") {
let office_type =
e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
this.setState({ otm_id: e.target.value, office_type: office_type });
} else if (key === "cent_id") {
this.loadSalesPerson(e.target.value);
this.setState({ [key]: key === "status" ? val : e.target.value });
} else {
this.setState({ [key]: key === "status" ? val : e.target.value });
}
}
onsubmit() {
let {
exp_start_date,
no_of_seats,
proposal_value,
cent_id,
sales_id,
first_name,
office_type,
lead_source,
last_name,
company_name,
emailid,
lds_id,
otm_id,
phone,
status,
requirement,
enquiry_date
} = this.state;
let errors = validate(
first_name,
company_name,
emailid,
lds_id,
phone,
status,
enquiry_date
);
this.setState({ preloader: true });
let isDisabled = Object.keys(errors).some(x => errors[x]);
if (isDisabled === false) {
let params = {
first_name: first_name,
last_name: last_name,
company_name: company_name,
office_type: office_type,
lead_source: lead_source,
emailid: emailid,
otm_id: otm_id,
lds_id: lds_id,
phone: phone,
exp_start_date: moment(new Date(exp_start_date)).format("YYYY-MM-DD"),
enquiry_date: moment(new Date(enquiry_date)).format("YYYY-MM-DD"),
no_of_seats: no_of_seats,
proposal_value: proposal_value,
requirement: requirement,
cent_id: cent_id,
sales_id: sales_id,
status: status
};
let para = this.props.params.id ? "/" + this.props.params.id : "";
enquiry(params, para).then(res => {
if (res.data.status === 200) {
this.props.update_fetch_status();
browserHistory.push("/leads/leads");
} else {
let phoneduplicate = res.data.error.phone[0];
if (phoneduplicate.includes("already")) {
alert("Phone number already exist...");
this.setState({ error_status: true, preloader: false });
return false;
}
alert("Please enter required feilds...");
this.setState({ error_status: true, preloader: false });
}
});
} else {
this.setState({ error_status: true, preloader: false });
}
}
handleChangeEnquiry(date, e) {
this.setState({
enquiry_date: moment(date)
});
}
render() {
let {
first_name,
last_name,
company_name,
emailid,
lds_id,
phone,
status,
title,
error_status,
preloader,
lds_data,
otm_id,
type_data,
ffice_type,
lead_source,
sales_id,
cent_id,
centerData,
salesData,
exp_start_date,
no_of_seats,
proposal_value,
requirement,
enquiry_date
} = this.state;
console.log(this.state);
let role = permissionCheck("leads", title);
if (!role) return 
<Nopermission />
;
let errors = validate(
first_name,
company_name,
emailid,
lds_id,
phone,
status,
enquiry_date
);
return (
<div className="portlet" style={{height: '600px'}}>
   <div className="transition-item detail-page">
      <div className="main-content">
         <div className="col s12 portlet-title">
            <div className="caption">ENQUIRY</div>
         </div>
         <form  method="post" encType="multipart/form-data">
          <div className="col s12" style={{margin:'2%'}}>
                <h7 className="sub-header">CONTACT DETAILS</h7>
               <div className="row">
                  <div className="input-field col s4">
                     <input
                        type="text"
                        onChange={e => {
                     this.eventHandle(e, "first_name");
                     }}
                     className={
                     errors.first_name && error_status ? "invalid" : ""
                     }
                     value={first_name}
                     />
                     <label
                     htmlFor="text-input"
                     className={errors.first_name ? "" : "active"}
                     >
                     First Name
                     </label>
                  </div>
                  <div className="input-field col s4">
                     <input
                        type="text"
                        onChange={e => {
                     this.eventHandle(e, "last_name");
                     }}
                     className={
                     errors.last_name && error_status ? "invalid" : ""
                     }
                     value={last_name}
                     />
                     <label
                     htmlFor="text-input"
                     className={errors.last_name ? "" : "active"}
                     >
                     Last Name
                     </label>
                  </div>
                  <div className="input-field col s4">
                     <input
                        type="text"
                        onChange={e => {
                     this.eventHandle(e, "company_name");
                     }}
                     className={
                     errors.company_name && error_status ? "invalid" : ""
                     }
                     value={company_name}
                     />
                     <label
                     htmlFor="textarea-input"
                     className={errors.company_name ? "" : "active"}
                     >
                     Comapny Name
                     </label>
                  </div>
               </div>
               <div className="row">
                  <div className="input-field col s4">
                     <input
                        type="text"
                        onChange={e => {
                     this.eventHandle(e, "emailid");
                     }}
                     className={errors.emailid && error_status ? "invalid" : ""}
                     value={emailid}
                     />
                     <label
                     htmlFor="text-input"
                     className={errors.emailid ? "" : "active"}
                     >
                     Email ID
                     </label>
                  </div>
                  <div className="input-field col s4">
                     <input
                        type="text"
                        onChange={e => {
                     this.eventHandle(e, "phone");
                     }}
                     className={errors.phone && error_status ? "invalid" : ""}
                     maxLength={10}
                     value={phone}
                     />
                     <label
                     htmlFor="text-input"
                     className={errors.phone ? "" : "active"}
                     >
                     Phone Number
                     </label>
                  </div>
               </div>
            </div>
            <div className="col s12" style={{margin:'2%'}}>
              <div className="col s12 row" >
                <h7 className="sub-header">ADDITIONAL  INFORMATIONS</h7>
              </div>
              <div className="col s12 row">
                  <div className="input-field col s4">
                     <DatePicker
                        selected={exp_start_date}
                        placeholderText="Expected Start date"
                        dateFormat="DD/MM/YYYY"
                        readOnly={true}
                        className="datepicker form-control"
                        onChange={this.handleChangeAgreement}
                        />
                  </div>


                  <div className="input-field col s4">
                     <input
                        type="text"
                        onChange={e => {
                     this.eventHandle(e, "no_of_seats");
                     }}
                     className={
                     errors.no_of_seats && error_status ? "invalid" : ""
                     }
                     value={no_of_seats}
                     />
                     <label
                     htmlFor="text-input"
                     className={errors.no_of_seats ? "" : "active"}
                     >
                     No Of Seats
                     </label>
                  </div>
                  <div className="input-field col s4">
                     <input
                        type="text"
                        onChange={e => {
                     this.eventHandle(e, "proposal_value");
                     }}
                     className={
                     errors.proposal_value && error_status ? "invalid" : ""
                     }
                     maxLength={10}
                     value={proposal_value}
                     />
                     <label
                     htmlFor="text-input"
                     className={errors.proposal_value ? "" : "active"}
                     >
                     proposal Value
                     </label>
                  </div>
                </div>
                <div className="col s12 row">
                  <div className="input-field col s4">
                     <DatePicker
                     showYearDropdown
                     showMonthDropdown
                     scrollableYearDropdown
                     minDate={moment().add(-150, "days")}
                     yearDropdownItemNumber={20}
                     selected={enquiry_date}
                     dateFormat="DD/MM/YYYY"
                     readOnly={true}
                     className="datepicker form-control"
                     onChange={this.handleChangeEnquiry}
                     />
                     <label
                     htmlFor="text-input"
                     className={errors.enquiry_date ? "" : "active"}
                     >
                     Enquiry Date
                     </label>
                  </div>
                  <div className="input-field col s4">
                     <select
                     className={`${
                     errors.otm_id && error_status ? "invalid" : ""
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
                  </div>
                  <div className="input-field col s4">
                     <select
                     className={`browser-default ${
                     errors.lds_id && error_status ? "invalid" : ""
                     }`}
                     value={lds_id}
                     onChange={e => {
                     this.eventHandle(e, "lds_id");
                     }}
                     >
                     <option value="">Select Source</option>
                     {lds_data &&
                     lds_data.map((val, i) => {
                     return (
                     <option title={i} key={i} value={val.lds_id}>
                        {val.lead_source_name}
                     </option>
                     );
                     })}
                     </select>
                  </div>
                </div>
                <div className="col s12 row">
                  <div className="input-field col s4">
                     <select
                     className={`browser-default ${
                     errors.cent_id && error_status ? "invalid" : ""
                     }`}
                     value={cent_id}
                     onChange={e => {
                     this.eventHandle(e, "cent_id");
                     }}
                     >
                     <option value="">Select Center</option>
                     {centerData &&
                     centerData.map((val, i) => {
                     return (
                     <option title={i} key={i} value={val.c_id}>
                        {val.centername}
                     </option>
                     );
                     })}
                     </select>
                  </div>
                  <div className="input-field col s4">
                     <select
                     className={`browser-default ${
                     errors.sales_id && error_status ? "invalid" : ""
                     }`}
                     value={sales_id}
                     onChange={e => {
                     this.eventHandle(e, "sales_id");
                     }}
                     >
                     <option value="">Select Sales Person</option>
                     {salesData &&
                     salesData.map((val, i) => {
                     return (
                     <option title={i} key={i} value={val.user_id}>
                        {val.name}
                     </option>
                     );
                     })}
                     </select>
                  </div>
                  <div className="input-field col s4">
                     <textarea
                        onChange={e => {
                     this.eventHandle(e, "requirement");
                     }}
                     className={
                     errors.requirement && error_status
                     ? "materialize-textarea invalid"
                     : "materialize-textarea"
                     }
                     value={requirement}
                     />
                     <label
                     htmlFor="text-input"
                     className={errors.requirement ? "" : "active"}
                     >
                     Requirements
                     </label>
                  </div>
                  </div>
                  <div className="col s12 row">
                  <div className="input-field col s4 right">
                     <button
                        type="button"
                        onClick={e => {
                     this.onsubmit();
                     }}
                     className="btn btn-sm btn-primary"
                     >
                     Save
                     </button>
                     &nbsp;&nbsp;
                     
                     <Link to="/leads/" className="btn-sm btn-default">
                     Cancel
                     </Link>
                  </div>
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
const mapStateToProps = state => ({
data: state.leadsReducer
});
const mapDispatchToProps = dispatch => {
return bindActionCreators({ update_fetch_status }, dispatch);
};
const LeadsAEContainer = connect(
mapStateToProps,
mapDispatchToProps,
null,
{ withRef: true }
)(AddEdit);
export default LeadsAEContainer;