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
let username=localStorage.getItem("username");
let cresult=localStorage.getItem("Cresult");
class OfficeOccupancy extends React.Component {
  constructor(props) {
    super(props);
    let  dateObj = new Date();
    this.state = {     
      currentDate:'',
      centerName:'',
      startmonth: dateObj.getMonth()+1,
      startyear: dateObj.getFullYear(),
      endmonth: dateObj.getMonth()+1,
      endyear: dateObj.getFullYear()+1,
      officefilter:0,
      params: {
        startmonth: "",
        startyear: "",
        endmonth: "",
        endyear: ""
      },
      data: [],
      preloader: false
      
    };
    this.fetchData = this.fetchData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeStart = this.onChangeStart.bind(this);
    this.onChangeEnd = this.onChangeEnd.bind(this);
    this.dateFormat = this.dateFormat.bind(this);
  }
   componentDidMount(){ 
    let newString = cresult.substr(0, cresult.length-12);
    let newString1 = newString.substr(16);
    
    
    this.setState({centerName:newString1});
    console.log("state=",this.state);
    this.fetchData();
     
  }
  dateFormat(dateInput) {
    var dateArr = dateInput.split("-");
    return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
  }

  dateFormat = dateInput => {
    var dateArr = dateInput.split("-");
    return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
  };

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
    this.setState({ preloader: true });
    let params = {
      startMonth: this.state.startmonth,
      startYear: this.state.startyear,
      endMonth: this.state.endmonth,
      endYear: this.state.endyear,
      officefilter: this.state.officefilter
    };
    http.post("/officeoccupancyreport", param(params)).then(resp => {
      this.setState({
        data2: resp.data.data2,
        periodArr: resp.data.period,
        data1: resp.data.data1,
        preloader: false
      });
    });
    var tempDate = new Date();
    var date = tempDate.getDate() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getFullYear() +' '+ tempDate.getHours()+':'+ tempDate.getMinutes()+':'+ tempDate.getSeconds();
    const currDate = date;
    this.setState({currentDate:currDate});
  }
  filterSearch(data) {
    debugger
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
        debugger;
        self.fetchData();
      }
    );
  }
  callPrint() {
    var oTable = document.getElementById("officeOccupancy")
      .outerHTML;
    var title = document.getElementById("title_id").innerHTML;
    printer(oTable, title);
  }
  callExcel() {
    var data = [
      {
        "totalRevenue": "Total Revenue",
        "totalOfficeInventory": "Total Office Inventory",
        "totalSQMInventory": "Total SQM Inventory",
        "totalOccupiedOffices": "Total Occupied Offices",
        "totalOccupiedSeats": "Total Office Seats",
        "totalOccupiedSQM": "Total Occupied Seats",
        "avgPricePerOffice": "Total Occupied SQM",
        "avgPricePerSQM": "Avg Price Per Office",
        "officeOccupancy": "Avg Price Per Seat",
        "seatOccupancy": "Office Occupancy (%)",
        "SQMOccupancy": "Seat Occupancy (%)",
        /////////////////////////////////

        "companyName": "Company Name",
        "CabinName": "Cabin Name",
        "officeType": "Office Type",
        "noOfWorkStation": "No Of Work Station",
        "officeRevenue": "Office Revenue",
        "quotePricePerWorkstation": "Quote Price / Workstation",
        "soldPricePerWorkstation": "Sold Price / Workstation",
        "startDate": "Start Date",
        "endDate": "End Date",
        "total":"Total"

      }
    ]; //Title for columns
    let datas = this.state.data;
    let tempTotal = 0;
    let tempNetAmount = 0;
    datas.map((val, i) => {
      tempTotal = 0;
      tempNetAmount = 0;
      data.push({
        "totalRevenue": val.total_revenue,
        "totalOfficeInventory": val.total_office_inventory,
        "totalSQMInventory": val.total_sqm_inventory,
        "totalOccupiedOffices": val.total_occupied_offices,
        "totalOccupiedSeats": val.total_seats_inventory,
        "totalOccupiedSQM": val.total_occupied_seats,
        "avgPricePerOffice": val.total_occupied_sqm,
        "avgPricePerSQM": val.avg_price_per_office,
        "officeOccupancy": Math.round(val.total_revenue /val.total_occupied_seats),
        "seatOccupancy": val.office_occupancy,
        "SQMOccupancy": val.seat_occupancy,


        /////////////////////////////////
        "companyName": val.company_name,
        "CabinName": val.cabinname,
        "officeType": val.officetype,
        "noOfWorkStation": val.no_of_work_station,
        "officeRevenue": val.over_ride_rate,
        "quotePricePerWorkstation": Math.round(val.rate / val.no_of_work_station),
        "soldPricePerWorkstation": Math.round(val.over_ride_rate / val.no_of_work_station),
        "startDate":this.dateFormat(val.startDate),
        "endDate": this.dateFormat(val.endDate),
        "total": tempTotal
      });
    });
    tabletoExcel(data, "office_occupancy_list.xls", "Excel");
  }

  render() {
    let role = permissionCheck("package");
    if (!role) return <Nopermission />;
    let { preloader, data1, data2, periodArr, officefilter } = this.state;
    let tempTotal = 0;
    let tempNetAmount = 0;
    let action = role.permission ? role.permission.split(",") : [];
    return (
      <div
        className="portlet_table"
        style={{ width: "100%", fontSize: "13px", overflowX: "scroll" }}
      >
        <div className="transition-item list-page">
          <div className="main-content" id="root">
             <ReportFilter
              callPrint={this.callPrint.bind(this)}
              callExcel={this.callExcel.bind(this)}
              filterSearch={this.filterSearch.bind(this)}
            />
            <div
              className="rows col s12"
              style={{ padding: "10px 0" }}
            >
              <div className="rows col s4">
                <MonthPickerInput
                  value={new Date()}
                  onChange={this.onChangeStart}
                />
              </div>
              <div className="rows col s4">
                <MonthPickerInput
                  value={new Date()}
                  onChange={this.onChangeEnd}
                />
              </div>
              <div className="rows col s2">
                <select
                  value={officefilter}
                  onChange={e => {
                    this.setState({ officefilter: e.target.value });
                  }}
                >
                  <option value="">Select officefilter</option>
                  <option value="0">Office</option>
                  <option value="1">Virtual</option>
                </select>
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

           
            <div id="title_id" > 
              <div className="col s12 portlet-title">
                <div className="caption">OFFICE OCCUPANCY REPORT</div>
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
                        {this.state.startmonth} {this.state.startyear}&nbsp;&nbsp;&nbsp; To &nbsp;&nbsp;&nbsp;{this.state.endmonth} {this.state.endyear}
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
        <table id="officeOccupancy" className="striped report-table-header">
          <thead>
          </thead>
          <tbody>
            <table  className="striped report-table-header">
              <thead>
              </thead>
              <tbody>
                <tr className="report-header">
                    {action.indexOf("View") !== -1 && (
              <table className="striped">
                <thead>
                  <tr>
                    <th style={{ borderRight: "1px solid #ccc" }}>
                      Month - Year
                    </th>
                    <th style={{ borderRight: "1px solid #ccc" }}>
                      Total Revenue
                    </th>
                    <th style={{ borderRight: "1px solid #ccc" }}>
                      Total Office Inventory
                    </th>
                    <th style={{ borderRight: "1px solid #ccc" }}>
                      Total SQM Inventory
                    </th>
                    <th style={{ borderRight: "1px solid #ccc" }}>
                      Total Occupied Offices
                    </th>
                    <th style={{ borderRight: "1px solid #ccc" }}>
                      Total Office Seats
                    </th>
                    <th style={{ borderRight: "1px solid #ccc" }}>
                      Total Occupied Seats
                    </th>
                    <th style={{ borderRight: "1px solid #ccc" }}>
                      Total Occupied SQM
                    </th>
                    {/* <th style={{ borderRight: "1px solid #ccc" }}>
                      Avg Price Per Office
                    </th> */}
                    {/* <th style={{ borderRight: "1px solid #ccc" }}>
                      Avg Price Per SQM
                    </th> */}
                    {
                      <th style={{ borderRight: "1px solid #ccc" }}>
                        Avg Price Per Seat
                      </th>
                    }
                    <th style={{ borderRight: "1px solid #ccc" }}>
                      Office Occupancy (%)
                    </th>
                    <th style={{ borderRight: "1px solid #ccc" }}>
                      Seat Occupancy (%)
                    </th>
                    {/* <th style={{ borderRight: "1px solid #ccc" }}>
                      SQM Occupancy (%)
                    </th> */}
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
                                  <th
                                    style={{
                                      borderRight: "1px solid #ccc",
                                      minWidth: "80px"
                                    }}>
                                    {val.month} - {propKey}
                                  </th>
                                  <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.total_revenue}
                                  </td>
                                  <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.total_office_inventory}
                                  </td>
                                  <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.total_sqm_inventory}
                                  </td>
                                  <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.total_occupied_offices}
                                  </td>
                                  <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.total_seats_inventory}
                                  </td>
                                  <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.total_occupied_seats}
                                  </td>
                                  <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.total_occupied_sqm}
                                  </td>
                                  {/* <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.avg_price_per_office}
                                  </td> */}
                                  <td style={{ borderRight: "1px solid #ccc" }}>
                                    {Math.round(val.total_revenue /val.total_occupied_seats)}
                                  </td>
                                  {/* <td style={{ borderRight: "1px solid #ccc" }}>
                                    {Math.round(
                                      val.total_revenue / val.total_occupied_sqm
                                    )}
                                  </td> */}
                                  <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.office_occupancy}
                                  </td>
                                  <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.seat_occupancy}
                                  </td>
                                  {/* <td style={{ borderRight: "1px solid #ccc" }}>
                                    {val.sqm_occupancy}
                                  </td> */}
                                </tr>
                              );
                            })}
                        </tbody>
                      );
                    }
                  })}

                {data1 && data1.length === 0 && (
                  <tbody>
                    <tr>
                      <td colSpan="10" className="center red-text">
                        No Record Found...!
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            )}
            <table className="striped report-table-header">
              <thead>
              <th> ADDITIONAL INFORMATIONS</th>
              </thead>
              <tbody>                       
              </tbody>
            </table>
            {action.indexOf("View") !== -1 && (
              <table className="striped">
                <thead>
                  <tr>
                    <th className="ofc-rpt-tData leftAlignText">Company Name</th>
                    <th className="ofc-rpt-tData">Cabin Name</th>
                    <th className="ofc-rpt-tData">Office Type</th>
                    <th className="ofc-rpt-tData">No Of Work Station</th>
                    {/* <th className="ofc-rpt-tData">Rate</th> */}
                    <th className="ofc-rpt-tData">Office Revenue</th>                    
                    <th className="ofc-rpt-tData">Quote Price / Workstation</th>
                    <th className="ofc-rpt-tData">Sold Price / Workstation</th>
                    <th className="ofc-rpt-tData">Retainer Deposit</th>
                    <th className="ofc-rpt-tData th-date">Start Date</th>
                    <th className="ofc-rpt-tData th-date">End Date</th>
                    {periodArr &&
                      periodArr.map((val1, key1) => {
                        return (
                          <th key={key1} className="ofc-rpt-tData th-date">
                            {Object.keys(periodArr[key1])[0].replace("_", "-")}
                          </th>
                        );
                      })}
                    <th style={{ borderRight: "1px solid #ccc" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data2 &&
                    data2.map((val, i) => {
                      tempTotal = 0;
                      tempNetAmount = 0;
                      {
                        val.revenueDetails &&
                          val.revenueDetails.map((val1, key1) => {
                            tempNetAmount +=
                              val.revenueDetails[key1][
                                Object.keys(val.revenueDetails[key1])[0]
                              ];
                          });
                      }
                      if (tempNetAmount > 0) {
                        return (
                          <tr key={i}>
                            <td className="ofc-rpt-tData leftAlignText">
                              {val.company_name}
                            </td>
                            <td className="ofc-rpt-tData">{val.cabinname}</td>
                            <td className="ofc-rpt-tData">{val.officetype}</td>
                            <td className="ofc-rpt-tData">
                              {val.no_of_work_station}
                            </td>
                            {/* <td className="ofc-rpt-tData">{val.rate}</td> */}
                            <td className="ofc-rpt-tData">
                              {val.over_ride_rate}
                            </td>
                            <td className="ofc-rpt-tData">
                              {Math.round(val.rate / val.no_of_work_station)}
                            </td>
                            <td className="ofc-rpt-tData">
                              {Math.round(
                                val.over_ride_rate / val.no_of_work_station
                              )}
                            </td>
                            <td className="ofc-rpt-tData">
                            {Math.round(
                                (val.over_ride_rate / val.no_of_work_station)*val.retainer_months
                              )}
                            </td>      
                            <td
                              className="ofc-rpt-tData td-date"
                              style={{ minWidth: "75px !important" }}
                            >
                              {this.dateFormat(val.startDate)}
                            </td>
                            <td
                              className="ofc-rpt-tData td-date"
                              style={{ minWidth: "75px !important" }}
                            >
                              {this.dateFormat(val.endDate)}
                            </td>
                            {val.revenueDetails &&
                              val.revenueDetails.map((val1, key1) => {
                                tempTotal +=
                                  val.revenueDetails[key1][
                                    Object.keys(val.revenueDetails[key1])[0]
                                  ];
                                return (
                                  <td key={key1} className="ofc-rpt-tData">
                                    {val.revenueDetails[key1][
                                      Object.keys(val.revenueDetails[key1])[0]
                                    ]
                                      ? val.revenueDetails[key1][
                                          Object.keys(
                                            val.revenueDetails[key1]
                                          )[0]
                                        ]
                                      : 0}
                                  </td>
                                );
                              })}
                            <td
                              className="ofc-rpt-tData"
                              style={{ fontWeight: "bold" }}
                            >
                              {tempTotal}
                            </td>
                          </tr>
                        );
                      }
                    })}

                  {data2 && data2.length === 0 && (
                    <tr>
                      <td colSpan="12" className="center red-text">
                        No Record Found...!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
                </tr>                        
              </tbody>
            </table>
          </tbody>
        </table>

           
          </div>
          {preloader && <Preloader />}
        </div>
      </div>
    );
  }
}
export default OfficeOccupancy;
