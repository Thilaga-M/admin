import React from "react";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
import http from "./../../core/http-call";
import moment from "moment";
import { printer, tabletoExcel } from "../../core/reportActions";
import ReportFilter from "./../../core/officeOccupancyReportFilter";
import MonthPickerInput from "react-month-picker-input";
import "react-month-picker-input/dist/react-month-picker-input.css";

var param = require("jquery-param");
let username = localStorage.getItem("username");
let cresult = localStorage.getItem("Cresult");

class OfficeOccupancy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      params: {
        startmonth: "",
        startyear: "",
        endmonth: "",
        endyear: ""
      },
      data: [],
      currentDate: "",
      centerName: "",
      preloader: true
    };
    this.fetchData = this.fetchData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeStart = this.onChangeStart.bind(this);
    this.onChangeEnd = this.onChangeEnd.bind(this);
  }
  componentDidMount() {
    this.fetchData();
    let newString = cresult.substr(0, cresult.length - 12);
    let newString1 = newString.substr(16);
    this.setState({ centerName: newString1 });
  }
  componentWillUpdate() {}
  handleChange(date) {
    console.log(date);
  }
  onChangeStart = function(selectedYear, selectedMonth) {
    selectedYear = selectedYear.slice(0, -3);
    this.setState(
      { startmonth: selectedYear, startyear: selectedMonth },
      () => {
        console.log(this.state.startmonth, this.state.startyear);
      }
    );
  };
  onChangeEnd = function(selectedYear, selectedMonth) {
    selectedYear = selectedYear.slice(0, -3);
    this.setState({ endmonth: selectedYear, endyear: selectedMonth }, () => {
      console.log(this.state.endmonth, this.state.endyear);
    });
  };

  fetchData() {
    debugger;
    let params = {
      startMonth: this.state.startmonth,
      startYear: this.state.startyear,
      endMonth: this.state.endmonth,
      endYear: this.state.endyear
    };
    http.post("/officeoccupancyreport", param(params)).then(resp => {
      debugger;
      this.setState({
        data2: resp.data.data2,
        periodArr: resp.data.period,
        preloader: false
      });
      this.setState({ data1: resp.data.data1, preloader: false });
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
    debugger;
    this.setState({ preloader: true });
    let self = this;
    let company_name = data.company_name;
    let startDate = data.startDate;
    let endDate = data.endDate;
    let service_name = data.service_name;

    //Added for date filter
    if (startDate)
      this.state.params.billFromDate = moment(new Date(startDate)).format(
        "DD-MM-YYYY"
      );
    if (endDate)
      this.state.params.billToDate = moment(new Date(endDate)).format(
        "DD-MM-YYYY"
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
        debugger;
        self.fetchData();
      }
    );
  }
  callPrint() {
    var oTable = document.getElementById("officeOccupancy", "officeOccupancy1")
      .outerHTML;
    var title = document.getElementById("title_id", "title_id1").innerHTML;
    printer(oTable, title);
  }
  callExcel() {
    var data = [
      {
        totalRevenue: "Total Revenue",
        totalOfficeInventory: "Total Office Inventory",
        totalSeatsInventory: "Total Seats Inventory",
        totalSQMInventory: "Total SQM Inventory",
        totalOccupiedOffices: "Total Occupied Offices",
        totalOccupiedSeats: "Total Occupied Seats",
        totalOccupiedSQM: "Total Occupied SQM",
        avgPricePerOffice: "Avg Price Per Office",
        avgPricePerSQM: "Avg Price Per SQM",
        officeOccupancy: "Office Occupancy",
        seatOccupancy: "Seat Occupancy",
        SQMOccupancy: "SQM Occupancy",
        month: "Month",
        /////////////////////////////////

        companyName: "Company Name",
        AGHid: "AG Hid",
        OSMId: "OSM id",
        cabinName: "Cabin Name",
        officeType: "Office Type",
        noOfWorkStation: "No Of Work Station",
        rate: "Rate",
        custHid: "Cust Hid",
        overRideRate: "Over Ride Rate",
        startDate: "Start Date",
        endDate: "End Date"
      }
    ]; //Title for columns
    let datas = this.state.data;
    datas.map((val, i) => {
      data.push({
        totalRevenue: val.total_revenue,
        totalOfficeInventory: val.total_office_inventory,
        totalSeatsInventory: val.total_seats_inventory,
        totalSQMInventory: val.total_sqm_inventory,
        totalOccupiedOffices: val.total_occupied_offices,
        totalOccupiedSeats: val.total_occupied_seats,
        totalOccupiedSQM: val.total_occupied_sqm,
        avgPricePerOffice: val.avg_price_per_office,
        avgPricePerSQM: val.avg_price_per_sqm,
        officeOccupancy: val.office_occupancy,
        seatOccupancy: val.seat_occupancy,
        SQMOccupancy: val.sqm_occupancy,
        month: val.month,

        // /////////////////////////////////////
        companyName: val.company_name,
        AGHid: val.ag_hid,
        OSMId: val.osm_id,
        cabinName: val.cabinname,
        officeType: val.officetype,
        noOfWorkStation: val.no_of_work_station,
        rate: val.rate,
        custHid: val.cust_hid,
        overRideRate: val.over_ride_rate,
        startDate: val.startDate,
        endDate: val.endDate
      });
    });
    tabletoExcel(data, "office_occupancy_list.xls", "Excel");
  }

  render() {
    let role = permissionCheck("package");
    if (!role) return <Nopermission />;
    let { preloader, data1, data2, periodArr } = this.state;

    let action = role.permission ? role.permission.split(",") : [];
    let total_amount = 0;
    return (
      <div className="portlet" style={{ width: "100%", fontSize: "13px" }}>
        <div className="transition-item list-page">
          <div className="main-content" id="root">
            <div className="rows col s6" style={{ padding: "10px 0" }}>
              <div className="rows col s5">
                <MonthPickerInput
                  value={new Date()}
                  onChange={this.onChangeStart}
                />
              </div>
              <div className="rows col s5">
                <MonthPickerInput
                  value={new Date()}
                  onChange={this.onChangeEnd}
                />
              </div>
              <button
                className="rows col s2"
                style={{ float: "left" }}
                type="button"
                className="btn filterBtn"
                onClick={this.fetchData}
              >
                Submit
              </button>
            </div>
            <ReportFilter
              callPrint={this.callPrint.bind(this)}
              callExcel={this.callExcel.bind(this)}
              filterSearch={this.filterSearch.bind(this)}
            />
            <div id="title_id">
              <div className="col s12 portlet-title">
                <div className="caption">OFFICE OCCUPANCY REPORT</div>
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
                      {this.state.startmonth}/{this.state.startyear}
                    </p>
                    <p className="col s2 Label-helper">
                      {this.state.endmonth}/{this.state.endyear}
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
              <table id="officeOccupancy1" className="striped">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total Revenue</th>
                    <th>Total Office Inventory</th>
                    <th>Total Seats Inventory</th>
                    <th>Total SQM Inventory</th>
                    <th>Total Occupied Offices</th>
                    <th>Total Occupied Seats</th>
                    <th>Total Occupied SQM</th>
                    <th>Avg Price Per Office</th>
                    <th>Avg Price Per SQM</th>
                    <th>Office Occupancy</th>
                    <th>Seat Occupancy</th>
                    <th>SQM Occupancy</th>
                  </tr>
                </thead>

                {data1 &&
                  Object.keys(data1).map(propKey => {
                    {
                      return (
                        <tbody>
                          {propKey &&
                            data1[propKey].map((val, i) => {
                              return (
                                <tr key={i}>
                                  <td>{val.month}</td>
                                  <td>{val.total_revenue}</td>
                                  <td>{val.total_office_inventory}</td>
                                  <td>{val.total_seats_inventory}</td>
                                  <td>{val.total_sqm_inventory}</td>
                                  <td>{val.total_occupied_offices}</td>
                                  <td>{val.total_occupied_seats}</td>
                                  <td>{val.total_occupied_sqm}</td>
                                  <td>{val.avg_price_per_office}</td>
                                  <td>{val.avg_price_per_sqm}</td>
                                  <td>{val.office_occupancy}</td>
                                  <td>{val.seat_occupancy}</td>
                                  <td>{val.sqm_occupancy}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      );
                    }
                  })}

                {data1 &&
                  data1.length === 0 && (
                    <tbody>
                      <tr>
                        <td colSpan="5" className="center red-text">
                          No Record Found...!
                        </td>
                      </tr>
                    </tbody>
                  )}
              </table>
            )}
            <div id="title_id1" className="col s12 portlet-title">
              <div className="caption">ADDITIONAL INFORMATIONS</div>
            </div>
            {action.indexOf("View") !== -1 && (
              <table id="officeOccupancy" className="striped">
                <thead>
                  {data1 &&
                    Object.keys(data1).map(propKey => {
                      {
                        return (
                          <tr>
                            <th>Cabin Name</th>
                            <th>Office Type</th>
                            <th>Company Name</th>
                            <th>No Of Work Station</th>
                            <th>Rate</th>
                            <th>Cust Hid</th>
                            <th>Over Ride Rate</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            {propKey &&
                              data1[propKey].map((val, i) => {
                                return (
                                  <th key={i}>
                                    {val.revenueDetails &&
                                      val.revenueDetails.map((val1, key1) => {
                                        debugger;
                                        let amount =
                                          val.revenueDetails[key1][
                                            Object.keys(
                                              val.revenueDetails[key1]
                                            )[0]
                                          ];
                                        total_amount = total_amount + amount;
                                        console.log(total_amount);
                                        return (
                                          <td key={key1}>
                                            {
                                              Object.keys(
                                                val.revenueDetails[key1]
                                              )[0]
                                            }
                                          </td>
                                        );
                                      })}
                                    {val.month}
                                  </th>
                                );
                              })}
                            <th>Total</th>
                          </tr>
                        );
                      }
                    })}
                </thead>
                <tbody>
                  {data2 &&
                    data2.map((val, i) => {
                      return (
                        <tr key={i}>
                          <td>{val.cabinname}</td>
                          <td>{val.officetype}</td>
                          <td>{val.company_name}</td>
                          <td>{val.no_of_work_station}</td>
                          <td>{val.rate}</td>
                          <td>{val.cust_hid}</td>
                          <td>{val.over_ride_rate}</td>
                          <td>{val.startDate}</td>
                          <td>{val.endDate}</td>
                          {val.revenueDetails &&
                            val.revenueDetails.map((val1, key1) => {
                              let amount =
                                val.revenueDetails[key1][
                                  Object.keys(val.revenueDetails[key1])[0]
                                ];
                              total_amount = total_amount + amount;
                              console.log(total_amount);
                              return (
                                <td key={key1}>
                                  {
                                    val.revenueDetails[key1][
                                      Object.keys(val.revenueDetails[key1])[0]
                                    ]
                                  }
                                </td>
                              );
                            })}
                          <td>{total_amount}</td>
                        </tr>
                      );
                    })}

                  {data2 &&
                    data2.length === 0 && (
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
export default OfficeOccupancy;
