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
let total_cgst = 0;
let total_sgst = 0;
let total_igst = 0;
class DailyActivityInvoiced extends React.Component {
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
    var oTable = document.getElementById("dailyActivityInvoiced").outerHTML;
    var title = document.getElementById("title_id").innerHTML;
    printer(oTable, title);
  }
  callExcel() {
    var data = [
      {
        companyName: "Company Name",
        refNo: "Ref No",
        username: "Username",
        billDate: "Bill Date",
        "service Name": "Service Name",
        fromDate: "From Date",
        toDate: "To Date",
        quantity: "Quantity",
        rate: "Rate",
        "override Rate": "Override Rate",
        amount: "Amount",
        cgst: "CGST",
        sgst: "SGST",
        igst: "IGST"
      }
    ]; //Title for columns
    let datas = this.state.data;
    datas.map((val, i) => {
      total_rate = total_rate + val.rate;
      total_over_ride_rate = total_over_ride_rate + val.over_ride_rate;
      total_amount = total_amount + val.amount;
      total_cgst = total_cgst + val.cgst;
      total_sgst = total_sgst + val.sgst;
      total_igst = total_igst + val.igst;
      data.push({
        companyName: val.company_name,
        refNo: val.ref_no,
        username: val.username,
        billDate: (val.bill_date = moment(new Date(val.bill_date)).format(
          "DD-MM-YYYY"
        )),
        "service Name": val.servicename,
        fromDate: (val.start_date = moment(new Date(val.start_date)).format(
          "DD-MM-YYYY"
        )),
        toDate: (val.end_date = moment(new Date(val.end_date)).format(
          "DD-MM-YYYY"
        )),
        quantity: val.quantity,
        rate: val.rate,
        "override Rate": val.over_ride_rate,
        amount: val.amount,
        cgst: val.cgst,
        sgst: val.sgst,
        igst: val.igst
      });
    });
    tabletoExcel(data, "daily_activity_invoiced.xls", "Excel");
  }

  render() {
    let role = permissionCheck("package");
    if (!role) return <Nopermission />;
    let { preloader, data } = this.state;
    let action = role.permission ? role.permission.split(",") : [];
    let total_rate = 0,
      total_over_ride_rate = 0,
      total_amount = 0,
      total_cgst = 0,
      total_sgst = 0,
      total_igst = 0;
    return (
      <div className="portlet">
        <div className="transition-item list-page">
          <div className="main-content">
            <div id="title_id" className="col s12 portlet-title">
              <div className="caption">DAILY ACTIVITY REPORT (Invoiced)</div>
            </div>
            <ReportFilter
              callPrint={this.callPrint.bind(this)}
              callExcel={this.callExcel.bind(this)}
              filterSearch={this.filterSearch.bind(this)}
              displayType="false"
            />
            {action.indexOf("View") !== -1 && (
              <table id="dailyActivityInvoiced" className="striped">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Ref No</th>
                    <th>Username</th>
                    <th>Bill Date</th>
                    <th>Service Name</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Override Rate</th>
                    <th>Amount</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>IGST</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((val, i) => {
                      total_rate = total_rate + val.rate;
                      total_over_ride_rate =
                        total_over_ride_rate + val.over_ride_rate;
                      total_amount = total_amount + val.amount;
                      total_cgst = total_cgst + val.cgst;
                      total_sgst = total_sgst + val.sgst;
                      total_igst = total_igst + val.igst;
                      return (
                        <tr key={i}>
                          <td>{val.company_name}</td>
                          <td>{val.ref_no}</td>
                          <td>{val.username}</td>
                          <td>
                            {
                              (val.bill_date = moment(
                                new Date(val.bill_date)
                              ).format("DD-MM-YYYY"))
                            }
                          </td>
                          <td>{val.servicename}</td>
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
                          <td>{val.cgst}</td>
                          <td>{val.sgst}</td>
                          <td>{val.igst}</td>
                        </tr>
                      );
                    })}

                  <tr className="total_cal">
                    <td>TOTAL</td>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    <td>{total_rate}</td>
                    <td>{total_over_ride_rate}</td>
                    <td>{total_amount}</td>
                    <td>{total_cgst.toFixed(2)}</td>
                    <td>{total_sgst.toFixed(2)}</td>
                    <td>{total_igst.toFixed(2)}</td>
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
export default DailyActivityInvoiced;
