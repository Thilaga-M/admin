import React from "react";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
import ReportFilter from "./../../core/reportFilter";
import { printer, tabletoExcel } from "../../core/reportActions";
import http from "./../../core/http-call";
import moment from "moment";
var param = require("jquery-param");
let total_rate = 0;
let total_over_ride_rate = 0;
let total_amount = 0;
class DailyActivityUninvoiced extends React.Component {
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
      preloader: true
    };
    this.fetchData = this.fetchData.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    http
      .post("/serviceallocationitems", param(this.state.params))
      .then(resp => {
        this.setState({ data: resp.data.result, preloader: false });
      });
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
      this.state.params.bill_start_date = moment(new Date(startDate)).format(
        "YYYY-MM-DD"
      );
    if (endDate)
      this.state.params.bill_end_date = moment(new Date(endDate)).format(
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
    var oTable = document.getElementById("dailyActivityUninvoiced").outerHTML;
    var title = document.getElementById("title_id").innerHTML;
    printer(oTable, title);
  }
  callExcel() {
    var data = [
      {
        companyName: "Company Name",
        serviceName: "Service Name",
        username: "Username",
        fromDate: "From Date",
        toDate: "To Date",
        quantity: "Quantity",
        rate: "Rate",
        "override Rate": "Override Rate",
        amount: "Amount"
      }
    ]; //Title for columns
    let datas = this.state.data;
    datas.map((val, i) => {
      total_rate = total_rate + val.rate;
      total_over_ride_rate = total_over_ride_rate + val.over_ride_rate;
      total_amount = total_amount + val.amount;
      data.push({
        companyName: val.company_name,
        serviceName: val.servicename,
        username: val.username,
        fromDate: (val.start_date = moment(new Date(val.start_date)).format(
          "DD-MM-YYYY"
        )),
        toDate: (val.end_date = moment(new Date(val.end_date)).format(
          "DD-MM-YYYY"
        )),
        quantity: val.quantity,
        rate: val.rate,
        overrideRate: val.over_ride_rate,
        amount: val.amount
      });
    });
    tabletoExcel(data, "daily_activity_uninvoiced.xls", "Excel");
  }

  render() {
    let role = permissionCheck("package");
    if (!role) return <Nopermission />;

    let { preloader, data } = this.state;

    let action = role.permission ? role.permission.split(",") : [];
    let total_rate = 0,
      total_over_ride_rate = 0,
      total_amount = 0;
    return (
      <div className="portlet">
        <div className="transition-item list-page">
          <div className="main-content">
            <div id="title_id" className="col s12 portlet-title">
              <div className="caption">DAILY ACTIVITY REPORT (Uninvoiced)</div>
            </div>
            <ReportFilter
              callPrint={this.callPrint.bind(this)}
              callExcel={this.callExcel.bind(this)}
              filterSearch={this.filterSearch.bind(this)}
              addbtn={
                action.indexOf("New") !== -1
                  ? "settings/accounts/add-accounthead"
                  : ""
              }
              displayType="false"
            />
            {action.indexOf("View") !== -1 && (
              <table id="dailyActivityUninvoiced" className="striped">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Service Name</th>
                    <th>Username</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Override Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((val, i) => {
                      total_rate = total_rate + val.rate;
                      total_over_ride_rate =
                        total_over_ride_rate + val.over_ride_rate;
                      total_amount = total_amount + val.amount;
                      return (
                        <tr key={i}>
                          <td>{val.company_name}</td>
                          <td>{val.servicename}</td>
                          <td>{val.username}</td>
                          <td>
                            {
                              (val.start_date = moment(
                                new Date(val.start_date)
                              ).format("DD-MM-YYYY"))
                            }
                          </td>
                          <td>
                            {
                              (val.end_date = moment(
                                new Date(val.end_date)
                              ).format("DD-MM-YYYY"))
                            }
                          </td>
                          <td>{val.quantity}</td>
                          <td>{val.rate}</td>
                          <td>{val.over_ride_rate}</td>
                          <td>{val.amount}</td>
                        </tr>
                      );
                    })}
                  <tr className="total_cal">
                    <td>TOTAL</td>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td>{total_rate}</td>
                    <td>{total_over_ride_rate}</td>
                    <td>{total_amount}</td>
                  </tr>
                  {data &&
                    data.length === 0 && (
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
export default DailyActivityUninvoiced;
