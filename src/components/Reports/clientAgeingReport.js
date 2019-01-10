import React from "react";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
import ReportFilter from "./../../core/ageingReportFilter";
import http from "./../../core/http-call";
import moment from "moment";
import { printer, tabletoExcel } from "../../core/reportActions";
import Condition, { If, Else, ElseIf } from "react-else-if";

var param = require("jquery-param");
let username = localStorage.getItem("username");
let cresult = localStorage.getItem("Cresult");
class AgeingReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        billFromDate: "",
        billToDate: "",
        client_id: "",
        company_name: "",
        ref_no: "",
        bill_date: "",
        amount_due: "",
        outstandingdays: ""
      },
      customerAgeingData: [],
      currentDate: "",
      centerName: "",
      preloader: false
    };
    this.fetchData = this.fetchData.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
    this.dateFormat = this.dateFormat.bind(this);
  }
  componentDidMount() {
    this.fetchData();
    let newString = cresult.substr(0, cresult.length - 12);
    let newString1 = newString.substr(16);
    this.setState({ centerName: newString1 });
  }

  dateFormat(dateInput) {
    var dateArr = dateInput.split("-");
    return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
  }

  fetchData() {
    let consolidatedData = [];
    http.post("/customerinvoiceageing", param(this.state.params)).then(resp => {
      if (resp.data.status === 200) {
        resp.data.result.map((val, i) => {
          //if (val.customer_id == 13) {

          if (consolidatedData[val.customer_id] === undefined) {
            consolidatedData[val.customer_id] = {
              customer_id: val.customer_id,
              outstandingdays: val.outstandingdays,
              company_name: val.company_name,
              total_amount: 0,
              days_30: 0,
              days_60: 0,
              days_90: 0,
              days_120: 0,
              days_120_greater: 0,
              retainer_amount :parseInt(val.retainer_amount ? val.retainer_amount : 0)
            };
          }

          consolidatedData[val.customer_id].total_amount =
            parseInt(val.amount_due) +
            parseInt(consolidatedData[val.customer_id].total_amount);

          //consolidatedData[val.customer_id].retainer_amount = parseInt(val.retainer_amount ? val.retainer_amount : 0) + parseInt(consolidatedData[val.customer_id].retainer_amount);

          if (val.outstandingdays <= 30) {
            consolidatedData[val.customer_id].days_30 =
              parseInt(val.amount_due) +
              parseInt(
                consolidatedData[val.customer_id]["days_30"]
                  ? consolidatedData[val.customer_id]["days_30"]
                  : 0
              );
          }
          if (val.outstandingdays > 30 && val.outstandingdays <= 60) {
            consolidatedData[val.customer_id].days_60 =
              parseInt(val.amount_due) +
              parseInt(
                consolidatedData[val.customer_id]["days_60"]
                  ? consolidatedData[val.customer_id]["days_60"]
                  : 0
              );
          }
          if (val.outstandingdays > 60 && val.outstandingdays <= 90) {
            consolidatedData[val.customer_id].days_90 =
              parseInt(val.amount_due) +
              parseInt(
                consolidatedData[val.customer_id]["days_90"]
                  ? consolidatedData[val.customer_id]["days_90"]
                  : 0
              );
          }
          if (val.outstandingdays > 90 && val.outstandingdays <= 120) {
            consolidatedData[val.customer_id].days_120 =
              parseInt(val.amount_due) +
              parseInt(
                consolidatedData[val.customer_id]["days_120"]
                  ? consolidatedData[val.customer_id]["days_120"]
                  : 0
              );
          }
          if (val.outstandingdays > 120) {
            consolidatedData[val.customer_id].days_120_greater =
              parseInt(val.amount_due) +
              parseInt(
                consolidatedData[val.customer_id]["days_120_greater"]
                  ? consolidatedData[val.customer_id]["days_120_greater"]
                  : 0
              );
          }

          console.log("consolidatedData=", consolidatedData);
          //}
        });

        this.setState({
          preloader: false,
          customerAgeingData: consolidatedData
        });
      }
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
    this.setState({ preloader: true });
    let self = this;
    let company_name = data.company_name;
    let startDate = data.startDate;
    let endDate = data.endDate;
    let service_name = data.service_name;

    //Added for date filter
    if (startDate)
      this.state.params.billFromDate = moment(new Date(startDate)).format(
        "YYYY-MM-DD"
      );
    if (endDate)
      this.state.params.billToDate = moment(new Date(endDate)).format(
        "YYYY-MM-DD"
      );
    self.setState(
      {
        params: {
          ...self.state.params,
          company_name,
          service_name,
          startDate,
          endDate
        }
      },
      () => {
        self.fetchData();
      }
    );
  }
  callPrint() {
    var oTable = document.getElementById("ageingReportDetails").outerHTML;
    var title = document.getElementById("title_id").innerHTML;
    printer(oTable, title);
  }
  callExcel() {
    debugger
    var data = [
      {
        "companyName": "Company Name",
        "retainer_amount": "Retainer Amount",
        "amount_due": "Amount Due",
        "till_thirty_days": "0-30 Days",
        "till_sixty_days": "30-60 Days",
        "till_ninety_days": "60-90 Days",
        "till_onetwenty_days": "90-120 Days",
        "more_than_120_days": "More than 120 Days"

      }
    ]; //Title for columns
    let datas = this.state.customerAgeingData;
    debugger
    datas.map((val, i) => {
       let totalAgeing30 = 0,
      totalAgeing60 = 0,
      totalAgeing90 = 0,
      totalAgeing120 = 0,
      totalAgeing120Greater = 0,
      totalAmountDue = 0,
      totalRetainerAmount = 0;
      totalAgeing30 += val.days_30 ? val.days_30 : 0;
      totalAgeing60 += val.days_60 ? val.days_60 : 0;
      totalAgeing90 += val.days_90 ? val.days_90 : 0;
      totalAgeing120 += val.days_120 ? val.days_120 : 0;
      totalAgeing120Greater += val.days_120_greater
        ? val.days_120_greater
        : 0;
      totalAmountDue += val.total_amount ? val.total_amount : 0;
      totalRetainerAmount += val.retainer_amount
        ? val.retainer_amount
        : 0;
      data.push({
        "companyName": val.company_name,
        "retainer_amount": val.retainer_amount,
        "amount_due": val.total_amount,
        "till_thirty_days": val.days_30 ? val.days_30 : "-",
        "till_sixty_days":val.days_60 ? val.days_60 : "-",
        "till_ninety_days": val.days_90 ? val.days_90 : "-",
        "till_onetwenty_days": val.days_120 ? val.days_120 : "-",
        "more_than_120_days": val.days_120_greater ? val.days_120_greater : "-"
      });
    });
    tabletoExcel(data, "customer_ageing_report.xls", "Excel");
  }

  render() {
    let role = permissionCheck("package");
    if (!role) return <Nopermission />;
    let { preloader, customerAgeingData } = this.state;
    let action = role.permission ? role.permission.split(",") : [];
    let totalAgeing30 = 0,
      totalAgeing60 = 0,
      totalAgeing90 = 0,
      totalAgeing120 = 0,
      totalAgeing120Greater = 0,
      totalAmountDue = 0,
      totalRetainerAmount = 0;
    return (
      <div className="portlet_table" style={{ width: "100%", fontSize: "13px" }}>
        <div className="transition-item list-page">
          <div className="main-content" id="root">
           <ReportFilter
              callPrint={this.callPrint.bind(this)}
              callExcel={this.callExcel.bind(this)}
              filterSearch={this.filterSearch.bind(this)}
            /> 
            <div id="title_id">
              <div className="col s12 portlet-title">
                <div className="caption">CUSTOMER AGEING REPORT</div>
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
                          {this.state.params.billFromDate} &nbsp;&nbsp;&nbsp;To &nbsp;&nbsp;&nbsp;{this.state.params.billToDate}
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
            {action.indexOf("View") !== -1 && (
              <table id="ageingReportDetails" className="striped">
                <thead>
                  <tr>
                    <th className="leftAlignText">Company Name</th>
                    <th>Retainer Amount</th>
                    <th>Amount Due</th>
                    <th>0-30 Days</th>
                    <th>30-60 Days</th>
                    <th>60-90 Days</th>
                    <th>90-120 Days</th>
                    <th>More than 120 Days</th>
                  </tr>
                </thead>
                <tbody>
                  {customerAgeingData &&
                    customerAgeingData.map((val, i) => {
                      totalAgeing30 += val.days_30 ? val.days_30 : 0;
                      totalAgeing60 += val.days_60 ? val.days_60 : 0;
                      totalAgeing90 += val.days_90 ? val.days_90 : 0;
                      totalAgeing120 += val.days_120 ? val.days_120 : 0;
                      totalAgeing120Greater += val.days_120_greater
                        ? val.days_120_greater
                        : 0;
                      totalAmountDue += val.total_amount ? val.total_amount : 0;
                      totalRetainerAmount += val.retainer_amount
                        ? val.retainer_amount
                        : 0;
                      return (
                        <tr>
                          <td className="leftAlignText">{val.company_name}</td>
                          <td>{val.retainer_amount}</td>
                          <td>{val.total_amount}</td>
                          <td>{val.days_30 ? val.days_30 : "-"}</td>
                          <td>{val.days_60 ? val.days_60 : "-"}</td>
                          <td>{val.days_90 ? val.days_90 : "-"}</td>
                          <td>{val.days_120 ? val.days_120 : "-"}</td>
                          <td>
                            {val.days_120_greater ? val.days_120_greater : "-"}
                          </td>
                        </tr>
                      );
                    })}

                  {customerAgeingData && customerAgeingData.length > 0 && (
                    <tr>
                      <td style={{ fontWeight: "bold" }}>Grand Total</td>
                      <td style={{ fontWeight: "bold" }}>
                        {totalRetainerAmount}
                      </td>
                      <td style={{ fontWeight: "bold" }}>{totalAmountDue}</td>
                      <td style={{ fontWeight: "bold" }}>{totalAgeing30}</td>
                      <td style={{ fontWeight: "bold" }}>{totalAgeing60}</td>
                      <td style={{ fontWeight: "bold" }}>{totalAgeing90}</td>
                      <td style={{ fontWeight: "bold" }}>{totalAgeing120}</td>
                      <td style={{ fontWeight: "bold" }}>
                        {totalAgeing120Greater}
                      </td>
                    </tr>
                  )}
                  {customerAgeingData && customerAgeingData.length === 0 && (
                    <tr>
                      <td colSpan="7" className="center red-text">
                        No Record Found...!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          {preloader && <Preloader />}
        </div>
      </div>
    );
  }
}
export default AgeingReport;
