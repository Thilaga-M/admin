import React from "react";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
import ReportFilter from "./../../core/ageingReportFilter";
import http from "./../../core/http-call";
import moment from "moment";
import { printer, tabletoExcel } from "../../core/reportActions";

var param = require("jquery-param");
let username = localStorage.getItem("username");
let cresult = localStorage.getItem("Cresult");
class CustomerAgeingReport extends React.Component {
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
    http.post("/customerinvoiceageing", param(this.state.params)).then(resp => {
      this.setState({ data: resp.data.result, preloader: false });
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
        ref_no: "Ref_no",
        billDate: "Bill Date",
        amountDue: "Amount Due",
        outstandingDays: "Outstanding Days",
        intervalDate: "Interval Date"
      }
    ]; //Title for columns
    let datas = this.state.data;
    datas.map((val, i) => {
      data.push({
        companyName: val.company_name,
        ref_no: val.ref_no,
        billDate: val.bill_date,
        amountDue: val.amount_due,
        outstandingDays: val.outstandingdays,
        intervalDate: val.intervaldate
      });
    });
    tabletoExcel(data, "ageing_report.xls", "Excel");
  }

  render() {
    let role = permissionCheck("package");
    if (!role) return <Nopermission />;
    let { preloader, data } = this.state;
    let action = role.permission ? role.permission.split(",") : [];

    return (
      <div className="portlet" style={{ width: "100%", fontSize: "13px" }}>
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
                <div className="col s6 rpt-label">
                  <div>
                    <p className="col s3 Label">Center Name:</p>
                    <p className="col s3 Label-helper">
                      {this.state.centerName}
                    </p>
                  </div>
                </div>
                <div className="col s6 rpt-label">
                  <div>
                    <p className="col s2 Label">Period:</p>
                    <p className="col s2 Label-helper">
                      {this.state.params.billFromDate}
                    </p>
                    <p className="col s2 Label-helper">
                      {this.state.params.billToDate}
                    </p>
                  </div>
                </div>
                <div className="col s6 rpt-label">
                  <div>
                    <p className="col s3 Label">Generated On:</p>
                    <p className="col s3 Label-helper">
                      {this.state.currentDate}
                    </p>
                  </div>
                </div>
                <div className="col s6 rpt-label">
                  <div>
                    <p className="col s3 Label">Generated By:</p>
                    <p className="col s3 Label-helper">{username}</p>
                  </div>
                </div>
              </div>
            </div>
            {action.indexOf("View") !== -1 && (
              <table id="ageingReportDetails" className="striped">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Ref_no</th>
                    <th>Bill Date</th>
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
                      return (
                        <tr>
                          <td>{val.company_name}</td>
                          <td>{val.ref_no}</td>
                          <td>{this.dateFormat(val.bill_date)}</td>
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
                  {data &&
                    data.length === 0 && (
                      <tr>
                        <td colSpan="9" className="center red-text">
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
export default CustomerAgeingReport;
