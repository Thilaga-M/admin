import React from "react";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
import ReportFilter from "./../../core/reportFilter";
import { printer, tabletoExcel } from "../../core/reportActions";
import http from "./../../core/http-call";
import moment from "moment";
var param = require("jquery-param");
let total_amount = 0;
let total_tax = 0;
let total_total = 0;
let username = localStorage.getItem("username");
let cresult = localStorage.getItem("Cresult");
class TotalServiceInvoiced extends React.Component {
constructor(props) {
super(props);
this.state = {
params: {
bill_status: 1,
client_id: "",
service_id: "",
bill_start_date: "",
bill_end_date: "",
company_name: "",
service_name: "",
billing_period_from: "",
billing_period_to: "",
displayFilter: ""
},
data: [],
currentDate: "",
centerName: "",
preloader: false
};
this.fetchData = this.fetchData.bind(this);
this.filterSearch = this.filterSearch.bind(this);
}
componentDidMount() {

let newString = cresult.substr(0, cresult.length - 12);
let newString1 = newString.substr(16);
this.setState({ centerName: newString1 });
}

fetchData() {
http
.post("/totalserviceallocationitems", param(this.state.params))
.then(resp => {
let processedResponse = [];
if (this.state.displayFilter != "Split") {
resp.data.result.map((val, key) => {
if (val.sc_id in processedResponse) {
processedResponse[val.sc_id]["items"].push(val);
} else {
processedResponse[val.sc_id] = {
service_category: val.service_category,
sc_id: val.sc_id,
items: [val]
};
}
});
}
if (this.state.displayFilter == "Split") {
resp.data.result.map((val, key) => {
if (val.customer_id in processedResponse) {
processedResponse[val.customer_id]["items"].push(val);
} else {
processedResponse[val.customer_id] = {
company_name: val.company_name,
customer_id: val.customer_id,
items: [val]
};
}
});
}
console.log("processedResponse=", processedResponse);
this.setState({
data: processedResponse,
preloader: false,
displayFilter: this.state.params.displayFilter
});
});
var tempDate = new Date();
var date =
tempDate.getDate() +
"-" +
(tempDate.getMonth() + 1) +
"-" +
tempDate.getFullYear() +
" " +
tempDate.getHours() +
":" +
tempDate.getMinutes() +
":" +
tempDate.getSeconds();
const currDate = date;
this.setState({ currentDate: currDate });
}
filterSearch(data) {
if (data.startDate == "" || data.startDate == null) {
alert("Choose start date");
return false;
}
if (data.endDate == "" || data.endDate == null) {
alert("Choose end date");
return false;
}
if (data.periodFilter == "" || data.periodFilter == null) {
alert("Select period type");
return false;
}
if (data.displayFilter == "" || data.displayFilter == null) {
alert("Select display type");
return false;
}
if (data.incomeType == "R") {
if (data.refundableDeposit == "" || data.refundableDeposit == null) {
alert("Include refundable deposit?");
return false;
}
}
this.setState({ preloader: true });
let self = this;
let company_name = data.company_name;
let startDate = data.startDate;
let endDate = data.endDate;
let service_name = data.service_name;
let displayFilter = data.displayFilter;
let incomeType = data.incomeType;
let refundableDeposit = data.refundableDeposit;
//Added for date filter
if (startDate) {
if (data.periodFilter == "1")
this.state.params.bill_start_date = moment(new Date(startDate)).format(
"YYYY-MM-DD"
);
if (data.periodFilter == "2")
this.state.params.billing_period_from = moment(
new Date(startDate)
).format("YYYY-MM-DD");
}
if (endDate) {
if (data.periodFilter == "1")
this.state.params.bill_end_date = moment(new Date(endDate)).format(
"YYYY-MM-DD"
);
if (data.periodFilter == "2")
this.state.params.billing_period_to = moment(new Date(endDate)).format(
"YYYY-MM-DD"
);
}
self.setState(
{
params: {
...self.state.params,
company_name,
service_name,
startDate,
endDate,
displayFilter,
incomeType,
refundableDeposit
}
},
() => {
self.fetchData();
}
);
}
callPrint() {
var oTable = document.getElementById("serviceInvoiced").outerHTML;
var title = document.getElementById("title_id").innerHTML;
printer(oTable, title);
}
callExcel() {
var data = [
{
"serviceCategory": "Service Category",
"serviceType": "Service Type",
"amount": "Amount",
"tax": "Tax",
"total": "Total"
}
]; //Title for columns
let datas = this.state.data;
datas.map((val, i) => {
let tax = val.igst ? val.igst : val.cgst + val.sgst;
let total = tax + val.amount;
total_amount = total_amount + val.amount;
total_tax = total_tax + tax;
total_total = total_total + total;
data.push({
"serviceCategory": val.service_category,
"serviceType": val.service_category,
"amount": val.service_category,
"tax": val.service_category,
"total":val.service_category 
});
});
tabletoExcel(data, "total_service_invoiced.xls", "Excel");
}
render() {
let role = permissionCheck("package");
if (!role) return 
<Nopermission />
;
let { preloader, data } = this.state;
let action = role.permission ? role.permission.split(",") : [];
let tax = 0,
total = 0,
total_amount = 0,
total_tax = 0,
total_total = 0,
sno = 0,
grand_total_amount = 0,
grand_total_tax = 0,
grand_total = 0;
return (
<div className="portlet_table">
   <div className="transition-item list-page">
      <div className="main-content">
         <ReportFilter
            isRefundableFilter={true}
            isIncomeTypeFilter={true}
            callPrint={this.callPrint.bind(this)}
            callExcel={this.callExcel.bind(this)}
            filterSearch={this.filterSearch.bind(this)}
            />
         <div id="title_id">
            <div className="col s12 portlet-title">
               <div className="caption">TOTAL SERVICE (Invoiced)</div>
            </div>
            <div className="col s12">
               <table className="striped report-table-header">
                  <thead>
                  </thead>
                  <tbody>
                     <tr className="report-header" style={{borderBottom: ' !important'}}>
                     <th className="report-header-data">Center Name:</th>
                     <td className="report-header-data leftAlignText header-value" >{this.state.centerName}</td>
                     <th className="report-header-data">Period:</th>
                     <td className="report-header-data leftAlignText header-value">
                        {this.state.params.bill_start_date}&nbsp;&nbsp;To&nbsp;&nbsp;{this.state.params.bill_end_date}
                     </td>
                     </tr> 
                     <tr className="report-header" style={{borderBottom: 'none !important'}}>
                     <th className="report-header-data">Generated On:</th>
                     <td className="report-header-data leftAlignText header-value">{this.state.currentDate}</td>
                     <th className="report-header-data header-value">Generated By:</th>
                     <td className="report-header-data leftAlignText header-value">{username}</td>
                     </tr>                         
                  </tbody>
               </table>
            </div>
         </div>
         
         {action.indexOf("View") !== -1 &&
         this.state.displayFilter == "Split" && (
         <table id="serviceInvoiced" className="striped bordered print-friendly">
            <thead>
              <tr style={{ borderTop: "1px solid #ccc", borderRight: "1px solid #ccc" }} >
                <th style={{ borderTop: "1px solid #ccc", borderRight: "1px solid #ccc" }} >
                  #
                </th>
                <th style={{ borderTop: "1px solid #ccc", borderRight: "1px solid #ccc" }} >
                  Company Name
                </th>
                <th style={{ borderTop: "1px solid #ccc", borderRight: "1px solid #ccc" }} >
                  Service Details
                </th>
                <th style={{ borderTop: "1px solid #ccc", borderRight: "1px solid #ccc" }} >
                  Total
                </th>
               </tr>
            </thead>
            <tbody>
               {data && data.map((val, i) => {
               sno++;
               total = 0;
               total_amount = 0;
               total_tax = 0;
        return (
               <tr key={i}>
                <td style={{ borderRight: "1px solid #ccc" }}>
                  {sno}
                </td>
                <td style={{ borderRight: "1px solid #ccc", fontWeight: "bold", textAlign: "left" }}  >
                  {val.company_name}
                </td>
                <td style={{ borderRight: "1px solid #ccc" }}>
                    <table>
                      <thead>
                        <th className="leftAlignText">Service Type</th>
                        <th className="rightAlignText">Amount</th>
                        <th className="rightAlignText">Tax</th>
                        <th className="rightAlignText">Total</th>
                      </thead>
                      <tbody>
                        {data && val.items.map((val, i) => {
                        tax =  Math.round(parseInt(val.igst?val.igst:0)) + Math.round(parseInt(val.cgst?val.cgst:0)) +
                              Math.round(parseInt(val.sgst?val.sgst:0));
                        if (!isNaN(val.amount) && !isNaN(tax)) {
                            total = tax + val.amount;
                            total_amount += val.amount;
                            total_tax += tax;
                            grand_total += total;
                            }
                         if (!isNaN(val.amount) && !isNaN(tax)) {
                            grand_total_amount +=  val.amount;
                            grand_total_tax += tax;
                          }
                        return (
                        <tr>
                          <td style={{ textAlign: "left", padding: "8px", width: "40%" }} > {val.servicename} </td>
                          <td style={{ textAlign: "right", padding: "8px", width: "20%" }} > {val.amount} </td>
                          <td style={{ textAlign: "right", padding: "8px", width: "20%" }} > {tax.toFixed(2)} </td>
                          <td style={{ textAlign: "right", padding: "8px", width: "20%" }} > {val.amount + tax} </td>
                        </tr>
                        );
                        })}
                        <tr>
                          <td style={{ textAlign: "left", padding: "8px", width: "40%", fontWeight: "bold" }} > Total </td>
                          <td style={{ textAlign: "right", padding: "8px", width: "20%", fontWeight: "bold" }} > 
                            {total_amount.toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right", padding: "8px", width: "20%", fontWeight: "bold" }} > 
                            {total_tax.toFixed(2)} 
                          </td>
                          <td style={{ textAlign: "right", padding: "8px", width: "20%", fontWeight: "bold" }} >
                           {(total_amount + total_tax).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                </td>
                <td style={{fontWeight: '600', verticalAlign: 'bottom',textAlign: 'center'}}>{(total_amount + total_tax).toFixed(2)}</td>
              </tr>
               );
               })}
               {data && data.length > 0 && (
               <tr>
                  <td style={{ textAlign: "center", padding: "8px", fontWeight: "bold" }} > 
                  </td>
                  <td  style={{ textAlign: "center", padding: "8px",   fontWeight: "bold" }}>
                    Grand Total
                  </td>
                  <td style={{padding: "8px", fontWeight: "bold"}}>
                    <table className="striped report-table-header">
                      <thead>
                      </thead>
                      <tbody>
                        <tr  style={{border: ' none'}}>
                          <th style={{border: ' none',textAlign: 'right'}}>{grand_total_amount}</th>
                          <th style={{border: ' none'}}>{grand_total_tax}</th>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td style={{ textAlign: "center", padding: "8px", fontWeight: "bold" }}  >
                    {grand_total.toFixed(2)}
                  </td>
               </tr>
               )}
               {data && data.length === 0 && (
               <tr>
                  <td colSpan="4" className="center red-text">
                     No Record Found...!
                  </td>
               </tr>
               )}
            </tbody>
         </table>
         )}
         { /* ////////////////////////////service category wise table//////////////////*/}
        


         {this.state.displayFilter}
         {action.indexOf("View") !== -1 &&
         this.state.displayFilter != "Split" && (
         <table id="serviceInvoiced" className="striped bordered">
            <thead>
              <tr style={{ borderTop: "1px solid #ccc", borderRight: "1px solid #ccc" }} >
                <th style={{ borderTop: "1px solid #ccc", borderRight: "1px solid #ccc" }} > # </th>
                  <th style={{ borderTop: "1px solid #ccc", borderRight: "1px solid #ccc" }} > Service Category </th>
                  <th style={{ borderTop: "1px solid #ccc", borderRight: "1px solid #ccc" }} > Service Details </th>
                  <th style={{ borderTop: "1px solid #ccc", borderRight: "1px solid #ccc" }} > Total </th>
                <th />
              </tr>
            </thead>
            <tbody>
               {data && data.map((val, i) => {
               sno++;
               total = 0;
               total_amount = 0;
               total_tax = 0;
               return (
               <tr key={i}>
                  <td style={{ borderRight: "1px solid #ccc" }}>
                    {sno}
                  </td>
                  <td style={{ borderRight: "1px solid #ccc", textAlign: "left" }} >
                    {val.service_category}
                  </td>
                  <td style={{ borderRight: "1px solid #ccc" }}>
                    <table>
                       <thead>
                          <th className="leftAlignText">Service Type</th>
                          <th className="rightAlignText">Amount</th>
                          <th className="rightAlignText">Tax</th>
                          <th className="rightAlignText">Total</th>
                       </thead>
                       <tbody>
                          {data &&
                          val.items.map((val, i) => {
                            tax =  Math.round(parseInt(val.igst?val.igst:0)) + Math.round(parseInt(val.cgst?val.cgst:0)) +
                            Math.round(parseInt(val.sgst?val.sgst:0));
                          if (!isNaN(val.amount) && !isNaN(tax)) {
                          total = tax + val.amount;
                          total_amount += val.amount;
                          total_tax += tax;
                          grand_total += total;
                          }
                          if (!isNaN(val.amount) && !isNaN(tax)) {
                            grand_total_amount +=  val.amount;
                            grand_total_tax += tax;
                          }
                          return (
                          <tr>
                             <td style={{ textAlign: "left", padding: "8px", width: "40%" }}> {val.servicename} </td>
                             <td style={{  textAlign: "right", padding: "8px", width: "20%" }} > {val.amount} </td>
                             <td style={{ textAlign: "right", padding: "8px", width: "20%" }} > {tax} </td>
                             <td style={{ padding: "8px", width: "20%",fontWeight: '600', verticalAlign: 'bottom',textAlign: 'right' }} > 
                               {val.amount + tax} 
                            </td> 
                          </tr> 
                          ); 
                        })} 
                             <tr> 
                               <td style={{ textAlign: "left", padding: "8px", width: "40%", fontWeight: "bold"}}> Total </td>
                               <td style={{ textAlign: "right", padding: "8px", width: "20%", fontWeight: "bold" }} > {total_amount.toFixed(2)} </td>
                               <td style={{ textAlign: "right", padding: "8px", width: "20%", fontWeight: "bold" }} > {total_tax.toFixed(2)} </td>
                               <td style={{ padding: "8px", width: "20%", fontWeight: "bold",fontWeight: '600', verticalAlign: 'bottom',textAlign: 'right'}} > {(total_amount + total_tax).toFixed(2)} </td>
                             </tr>
                       </tbody>
                    </table>
                  </td>
                  <td>{(total_amount + total_tax).toFixed(2)}</td>
                </tr>
                 );
                 })}
                 {data && data.length > 0 && (
                 <tr>
                    <td style={{ textAlign: "center", padding: "8px", fontWeight: "bold" }} > 
                    </td>
                    <td style={{ textAlign: "center", padding: "8px", fontWeight: "bold" }} > 
                      Grand Total
                    </td>
                    <td style={{textAlign: "center",padding: "8px",fontWeight: "bold"}}>
                      <table className="striped report-table-header">
                        <thead>
                        </thead>
                        <tbody>
                          <tr  style={{border: ' none'}}>
                            <th style={{border: ' none',textAlign: 'right'}}>{grand_total_amount}</th>
                            <th style={{border: ' none'}}>{grand_total_tax}</th>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td style={{ textAlign: "center", padding: "8px",fontWeight: "bold" }} >
                      {grand_total.toFixed(2)}
                    </td>
                 </tr>
                 )}
                 {data && data.length === 0 && (
                 <tr>
                    <td colSpan="4" className="center red-text">
                       No Record Found...!
                    </td>
                 </tr>
                 )}
            </tbody>
         </table>
         )}

      </div>
      {preloader && 
      <Preloader />
      }
   </div>
</div>
);
}
}
export default TotalServiceInvoiced; 