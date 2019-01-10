import React from "react";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";

import { printer, tabletoExcel } from "../../core/reportActions";
import http from "./../../core/http-call";

var param = require("jquery-param");
let total_amount = 0;
let username = localStorage.getItem("username");
let cresult = localStorage.getItem("Cresult");
class ProformaReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billtype: null,
      billingMonth: null,
      billingYear: null,
      data: [],
      currentDate: "",
      centerName: "",
      preloader: false,
      billingMonthData: [
        { month: "01", monthName: "January" },
        { month: "02", monthName: "February" },
        { month: "03", monthName: "March" },
        { month: "04", monthName: "April" },
        { month: "05", monthName: "May" },
        { month: "06", monthName: "June" },
        { month: "07", monthName: "July" },
        { month: "08", monthName: "August" },
        { month: "09", monthName: "September" },
        { month: "10", monthName: "October" },
        { month: "11", monthName: "November" },
        { month: "12", monthName: "December" }
      ],
      billingYearData: [{ year: "2017" }, { year: "2018" }, { year: "2019" }]
    };
    this.eventHandle = this.eventHandle.bind(this);
  }

  eventHandle(e, key) {
    this.setState({ [key]: e.target.value });
  }

  componentDidMount() {
    let newString = cresult.substr(0, cresult.length - 12);
    let newString1 = newString.substr(16);
    this.setState({ centerName: newString1 });
  }
  fetchData = () => {
    if (this.state.billingMonth == "" || this.state.billingMonth == null) {
      alert("Select Billing Month");
      return false;
    }

    if (this.state.billingYear == null || this.state.billingYear == "") {
      alert("Select Billing Year");
      return false;
    }

    if (this.state.billtype == null || this.state.billtype == "") {
      alert("Select Billing Type");
      return false;
    }
    let url = "";
    if (this.state.billtype == 0) {
      url = "/profamabilling";
    }
    if (this.state.billtype == 1) {
      url = "/loadProformaBills";
    }
    let params = {
      billingYear: this.state.billingYear,
      billingMonth: this.state.billingMonth
    };
    http.post(url, param(params)).then(resp => {
      if (resp.data.status === 200) {
        this.setState({ data: resp.data.data, preloader: false });
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
  };

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
    tabletoExcel(data, "total_service_uninvoiced.xls", "Excel");
  }
  handleclick(e){
    this.setState({selected:e.target.value,center:e.target.options[e.target.selectedIndex].text});
  }
  changeCenter(){
  localStorage.setItem("c_id",this.state.selected);
  localStorage.setItem("centerName",this.state.center);
  this.setState({selected:'',center:''});
  location.reload();
  }
  render() {
    let clength = localStorage.getItem("clength");
    let username = localStorage.getItem("username");
    let c_id = localStorage.getItem("c_id");
    let business_name = localStorage.getItem("business_name");
    let Cresult =JSON.parse(localStorage.getItem("Cresult"));
    let centerName=localStorage.getItem("centerName");
    if(clength>1 && !c_id){
      setTimeout(()=>{
        this.popup();
      },5);
      }else{
        centerName=(centerName)?centerName:(Cresult)?Cresult[0].centername:'';
      }

    let role = permissionCheck("package");
    if (!role) return <Nopermission />;

    let {
      preloader,
      data,
      billingMonthData,
      billingYearData,
      billingMonth,
      billingYear,
      billtype
    } = this.state;

    let action = role.permission ? role.permission.split(",") : [];
    let total_amount = 0;
    return (
      <div className="portlet_table" style={{ fontSize: "13px" }}>
        <div className="transition-item list-page">
          <div className="main-content">
            <div id="title_id">
              <div className="col s12 portlet-title">
                <div className="caption">TOTAL SERVICE (Uninvoiced)</div>
              </div>

              <div className="row">
                <div className="col s2" style={{margin:'10px'}}>
                  <select value={this.state.selected}  onChange={(e)=>{this.handleclick(e)}} >
                        <option>Select Center</option>
                        {
                          Cresult && Cresult.map((val,i)=>{
                              return (<option title={i} key={i} value={val.c_id}>{val.centername}</option>)
                          })
                        } 
                  </select> 
                </div>
                <div className="input-field col s2 filter-margin">
                  <select
                    value={billingMonth}
                    onChange={e => {
                      this.eventHandle(e, "billingMonth");
                    }}
                  >
                    <option value="">Select Billing Month</option>
                    {billingMonthData &&
                      billingMonthData.map((val, i) => {
                        return (
                          <option title={i} key={i} value={val.month}>
                            {val.monthName}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="input-field col s2 filter-margin">
                  <select
                    value={billingYear}
                    onChange={e => {
                      this.eventHandle(e, "billingYear");
                    }}
                  >
                    <option value="">Select Billing Year</option>
                    {billingYearData &&
                      billingYearData.map((val, i) => {
                        return (
                          <option title={i} key={i} value={val.year}>
                            {val.year}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="input-field col s2 filter-margin">
                  <select
                    value={billtype}
                    onChange={e => {
                      this.eventHandle(e, "billtype");
                    }}
                  >
                    <option value="">Select Invoice Type</option>
                    <option value="0">Before Proforma</option>
                    <option value="1">After Proforma</option>
                  </select>
                </div>
                 <div className="input-field col s2 center" style={{width: '14%'}}>
                  <button
                    type="button"
                    onClick={this.fetchData}
                    className="btn btn-sm btn-primary"
                  >
                    Submit
                  </button>

                </div>
                &nbsp;&nbsp;
                 <div className="input-field col s2 center" style={{width: '14%'}}>
                  <button
                    type="button"
                    onClick={this.callPrint.bind(this)}
                    className="btn filterBtn" style={{float:'right'}}
                  >
                    Print
                  </button>
                  &nbsp;&nbsp;
                  <button
                    type="button"
                    onClick={this.callExcel.bind(this)}
                    className="btn filterBtn" style={{float:'right'}}
                  >
                    Excel
                  </button>
                  &nbsp;&nbsp;
                </div>
              </div>
               
              

              <div className="col s12">
                <table className="striped report-table-header">
                  <thead>
                  </thead>
                  <tbody>
                    <tr className="report-header" style={{borderBottom: ' !important'}}>
                      <th className="report-header-data">Center Name:</th>
                      <td className="report-header-data leftAlignText header-value" >{this.state.centerName}</td>
                      <th className="report-header-data">Month:</th>
                      <td className="report-header-data leftAlignText header-value">
                       {this.state.billingMonth}
                      </td>
                      <th className="report-header-data">Year:</th>
                      <td className="report-header-data leftAlignText header-value">
                       {this.state.billingYear}
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
              <table id="serviceUninvoiced" className="striped bordered print-friendly">
                <thead >
                  <tr  style={{borderTop: '1px solid #ccc',borderRight: '1px solid #ccc'}}>
                    <th style={{borderTop: '1px solid #ccc',borderRight: '1px solid #ccc'}}>#</th>
                    <th  style={{borderTop: '1px solid #ccc',borderRight: '1px solid #ccc'}}>Customer Name</th>
                    <th  style={{borderTop: '1px solid #ccc',borderRight: '1px solid #ccc'}}>Service Details</th>
                    <th  style={{borderTop: '1px solid #ccc',borderRight: '1px solid #ccc'}}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((val, i) => {
                      total_amount =
                        total_amount +
                        (val.amount ? val.amount : val.total_amt);
                      return (
                        <tr key={i} >
                          <td style={{borderRight: '1px solid #ccc'}}>{i + 1}</td>
                          <th style={{borderRight: '1px solid #ccc'}}>{val.company_name}</th>
                          <td  style={{borderRight: '1px solid #ccc'}}>
                            <table >
                              <thead>
                                <tr>
                                  
                                  <th style={{textAlign: 'left', padding: '8px'}}>Service Name</th>
                                  <th style={{textAlign: 'right' , padding: '8px'}}>Amount</th>
                                </tr>
                              </thead>
                              {val.serviceList &&
                                val.serviceList.map((val1, i) => {
                                  return (
                                    <tr>
                                      <td style={{textAlign: 'left', padding: '8px'}}>
                                        {val1.servicename}
                                      </td>
                                      <td style={{textAlign: 'right', padding: '8px'}}>
                                        {val1.proData
                                          ? val1.proData
                                          : val1.total_amount}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </table>
                          </td>
                          <td className="align-text-bottom"  style={{borderRight: '1px solid #ccc',
                          fontWeight: '600',verticalAlign:"bottom",textAlign:"center"}}>
                            {val.amount ? val.amount : val.total_amt}
                          </td>
                        </tr>
                      );
                    })}
                  <tr className="total_cal">
                    <td colSpan="2" >TOTAL</td>
                    <td></td>
                    <td className="center-align" >{total_amount}</td>
                  </tr>
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
          {preloader && <Preloader />}
        </div>
      </div>
    );
  }
}
export default ProformaReport;
