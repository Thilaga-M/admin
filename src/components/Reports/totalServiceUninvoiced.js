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
let username = localStorage.getItem("username");
let cresult = localStorage.getItem("Cresult");
class TotalServiceUninvoiced extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        bill_status: 0,
        client_id: "",
        service_id: "",
        bill_start_date: "",
        bill_end_date: "",
        company_name: "",
        service_name: "",
        billing_period_from: "",
        billing_period_to: ""
      },
      data: [],
      currentDate: "",
      centerName: "",
      preloader: true
    };
    this.fetchData = this.fetchData.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
  }
  componentDidMount() {
    this.fetchData();
    let newString = cresult.substr(0, cresult.length - 12);
    let newString1 = newString.substr(16);
    this.setState({ centerName: newString1 });
  }
  componentWillUpdate() {}

  fetchData() {
    http
      .post("/totalserviceallocationitems", param(this.state.params))
      .then(resp => {
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
    let search_term = data.search_term;
    let startDate = data.startDate;
    let endDate = data.endDate;
    //Added for date filter
    if (startDate)
      this.state.params.bill_start_date = moment(new Date(startDate)).format(
        "DD-MM-YYYY"
      );
    if (endDate)
      this.state.params.bill_end_date = moment(new Date(endDate)).format(
        "DD-MM-YYYY"
      );

    self.setState({
      params: { ...self.state.params, search_term, startDate, endDate }
    });
    this.fetchData();
  }

  callPrint() {
    var oTable = document.getElementById("serviceUninvoiced").outerHTML;
    var title = document.getElementById("title_id").innerHTML;
    printer(oTable, title);
  }
  callExcel() {
    var data = [
      {
        serviceName: "Service Name",
        amount: "Amount"
      }
    ]; //Title for columns
    let datas = this.state.data;
    datas.map((val, i) => {
      total_amount = total_amount + val.amount;
      data.push({
        serviceName: val.servicename,
        amount: val.amount
      });
    });
    tabletoExcel(data, "service_uninvoiced.xls", "Excel");
  }
  render() {
    let role = permissionCheck("package");
    if (!role) return <Nopermission />;

    let { preloader, data } = this.state;

    let action = role.permission ? role.permission.split(",") : [];
    let total_amount = 0;
    return (
      <div className="portlet_table" style={{ fontSize: "13px" }}>
        <div className="transition-item list-page">
          <div className="main-content">
            <ReportFilter
              callPrint={this.callPrint.bind(this)}
              callExcel={this.callExcel.bind(this)}
              filterSearch={this.filterSearch.bind(this)}
              addbtn={
                action.indexOf("New") !== -1
                  ? "settings/accounts/add-accounthead"
                  : ""
              }
            />
            <div id="title_id">
              <div className="col s12 portlet-title">
                <div className="caption">TOTAL SERVICE (Uninvoiced) ORC</div>
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
                    <p className="col s3 Label">Period:</p>
                    <p className="col s2 Label-helper">
                      {this.state.params.bill_start_date}
                    </p>
                    <p className="col s1 Label-helper">To</p>
                    <p className="col s2 Label-helper">
                      {this.state.params.bill_end_date}
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
              <table id="serviceUninvoiced" className="striped">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((val, i) => {
                      total_amount = total_amount + val.amount;
                      return (
                        <tr key={i}>
                          <td>{val.servicename}</td>
                          <td style={{ textAlign: "right" }}>{val.amount}</td>
                        </tr>
                      );
                    })}
                  <tr className="total_cal">
                    <td>TOTAL</td>
                    <td style={{ textAlign: "right", padding: "10px" }}>
                      {total_amount}
                    </td>
                  </tr>
                  {data && data.length === 0 && (
                    <tr>
                      <td colSpan="5" className="center red-text">
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
export default TotalServiceUninvoiced;
