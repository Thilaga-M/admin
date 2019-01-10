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
      data: [],
      currentDate: "",
      centerName: "",
      preloader: true
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
  componentWillUpdate() {}
  dateFormat(dateInput) {
    var dateArr = dateInput.split("-");
    return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
  }

  fetchData() {
    http.post("/invoiceageing", param(this.state.params)).then(resp => {
      if (resp.data.status === 200) {
        this.setState({ data: resp.data.result, preloader: false });
      } else {
        alert("Please enter required feilds...");
        this.setState({ preloader: false });
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
    var data = [
      {
        companyName: "Company Name",
        refNo: "Ref_no",
        billDate: "Bill Date",
        retainerAmount: "Retainer Amount",
        amountDue: "Amount Due",
        thirtyDays: "0-30 Days",
        sixtyDays: "30-60 Days",
        ninetyDays: "60-90 Days",
        onetwentyDays: "90-120 Days",
        morethanOnetwentyDays: "More than 120 Days"
      }
    ]; //Title for columns
    let datas = this.state.data;
    let totalAmountRetainer = 0,
      totalAmountDue = 0;
    datas.map((val, i) => {
       totalAmountRetainer += parseInt(val.retainer_amount)
                        ? parseInt(val.retainer_amount)
                        : 0;
                      totalAmountDue += parseInt(val.amount_due)
                        ? parseInt(val.amount_due)
                        : 0;
      data.push({
       companyName: val.company_name,
        refNo: val.ref_no,
        billDate: this.dateFormat(val.bill_date),
        retainerAmount: val.retainer_amount,
        amountDue: val.amount_due,
        thirtyDays: val.outstandingdays <= 30 ? val.outstandingdays : "-",
        sixtyDays: val.outstandingdays > 30 && val.outstandingdays <= 60 ? val.outstandingdays : "-",
        ninetyDays: val.outstandingdays > 60 && val.outstandingdays <= 90 ? val.outstandingdays : "-",
        onetwentyDays: val.outstandingdays > 90 && val.outstandingdays <= 120 ? val.outstandingdays : "-",
        morethanOnetwentyDays: val.outstandingdays > 120 ? val.outstandingdays : "-"
      });
    });
    tabletoExcel(data, "ageing_report.xls", "Excel");
  }

  render() {
    let role = permissionCheck("package");
    if (!role) return <Nopermission />;
    let { preloader, data } = this.state;
    let action = role.permission ? role.permission.split(",") : [];
    let totalAmountRetainer = 0,
      totalAmountDue = 0;
    return (
      <div
        className="portlet_table"
        style={{ width: "100%", fontSize: "13px" }}
      >
        <div className="transition-item list-page">
          <div className="main-content" id="root">
            <ReportFilter
              callPrint={this.callPrint.bind(this)}
              callExcel={this.callExcel.bind(this)}
              filterSearch={this.filterSearch.bind(this)}
            />
            <div id="title_id">
              <div className="col s12 portlet-title">
                <div className="caption">AGEING REPORT</div>
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
                        {this.state.params.billFromDate}&nbsp;&nbsp;To&nbsp;&nbsp;{this.state.params.billToDate}
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
                    <th>Ref_no</th>
                    <th>Bill Date</th>
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
                  {data &&
                    data.map((val, i) => {
                      totalAmountRetainer += parseInt(val.retainer_amount)
                        ? parseInt(val.retainer_amount)
                        : 0;
                      totalAmountDue += parseInt(val.amount_due)
                        ? parseInt(val.amount_due)
                        : 0;

                      return (
                        <tr>
                          <td className="leftAlignText">{val.company_name}</td>
                          <td>{val.ref_no}</td>
                          <td>{this.dateFormat(val.bill_date)}</td>
                          <td>{val.retainer_amount}</td>
                          <td>{val.amount_due}</td>
                          <td>
                            {val.outstandingdays <= 30
                              ? val.outstandingdays
                              : "-"}
                          </td>
                          <td>
                            {val.outstandingdays > 30 &&
                            val.outstandingdays <= 60
                              ? val.outstandingdays
                              : "-"}
                          </td>
                          <td>
                            {val.outstandingdays > 60 &&
                            val.outstandingdays <= 90
                              ? val.outstandingdays
                              : "-"}
                          </td>
                          <td>
                            {val.outstandingdays > 90 &&
                            val.outstandingdays <= 120
                              ? val.outstandingdays
                              : "-"}
                          </td>
                          <td>
                            {val.outstandingdays > 120
                              ? val.outstandingdays
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  {data && data.length > 0 && (
                    <tr>
                      <td colSpan={3} style={{ fontWeight: "bold" }}>
                        Grand Total
                      </td>
                      <td style={{ fontWeight: "bold" }}>
                        {totalAmountRetainer}
                      </td>
                      <td style={{ fontWeight: "bold" }}>{totalAmountDue}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  )}
                  {data && data.length === 0 && (
                    <tr>
                      <td colSpan="12" className="center red-text">
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
