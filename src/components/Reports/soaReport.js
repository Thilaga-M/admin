import React from "react";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
import ReportFilter from "./../../core/invoiceListFilter";
import { printer, tabletoExcel } from "../../core/reportActions";
import http from "./../../core/http-call";
import moment from "moment";
import { Link } from 'react-router';
import PreviewReceiptModule from './../../containers/Receipt/PreviewReceiptModule';
const $=window.$;

var param = require("jquery-param");
let total_credit_amount = 0;
let total_debit_amount = 0;
let username = localStorage.getItem("username");
let cresult = localStorage.getItem("Cresult");
class InvoiceListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        client_id: ""
      },
      data: [],
      currentDate: "",
      centerName: "",
      preloader: true,
      previewReceipt:false,
      receiptID:''
    };
    this.fetchData = this.fetchData.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
    this.receiptPreview=this.receiptPreview.bind(this);
    this.closePreview=this.closePreview.bind(this);
  }
  componentDidMount() {
    this.fetchData();
    let newString = cresult.substr(0, cresult.length - 12);
    let newString1 = newString.substr(16);
    this.setState({ centerName: newString1 });
  }
  componentWillUpdate() {}

  fetchData() {
    http.post("/statementofaccounts", param(this.state.params)).then(resp => {
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

    let startDate = data.startDate;
    let endDate = data.endDate;

    //Added for date filter
    if (startDate)
      this.state.params.billFromDate = moment(new Date(startDate)).format(
        "YYYY-MM-DD"
      );
    if (endDate)
      this.state.params.billToDate = moment(new Date(endDate)).format(
        "YYYY-MM-DD"
      );
    if (data.company_name) this.state.params.client_id = data.company_name;

    self.setState(
      {
        params: {
          ...self.state.params,
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
    var oTable = document.getElementById("invoiceListing").outerHTML;
    var title = document.getElementById("title_id").innerHTML;
    printer(oTable, title);
  }
  callExcel() {
    var data = [
      {
        "invoiceNo": "Invoice / Receipt No",
        "billDate": "Bill / Receipt Date",
        "charges": "Charges",
        "credits": "Credits",
        "accountBalance": "Account Balance"
        
      }
    ]; //Title for columns
    let datas = this.state.data;
    datas.map((val, i) => {
    let total_credit_amount = 0,
    total_debit_amount = 0;
      if (val.bill_hid <= 0) {
                        total_credit_amount =
                          total_credit_amount + val.credit_amount;
                      } else {
                        total_debit_amount =
                          total_debit_amount + val.debit_amount;
                      }
      data.push({
        "invoiceNo": val.bill_hid <= 0 ? val.receipt_no : val.ref_no,
        "billDate": (val.bill_date =
                                val.bill_hid > 0
                                  ? moment(new Date(val.bill_date)).format(
                                      "DD-MM-YYYY"
                                    )
                                  : moment(new Date(val.bill_date)).format(
                                      "DD-MM-YYYY"
                                    )),
        "charges": val.bill_hid > 0 ? val.debit_amount : 0,
        "credits": val.bill_hid <= 0 ? val.credit_amount : 0,
        "accountBalance": total_debit_amount - total_credit_amount 
      });
    });
    tabletoExcel(data, "invoice_listing.xls", "Excel");
  }

  receiptPreview(receiptId)
    {
       this.setState({previewReceipt:true,receiptID:receiptId});
       $('#previewreceiptmodule').modal('open');
    }

   closePreview(){     
      this.setState({previewReceipt:false,receiptID:''});      
      $('#previewreceiptmodule').modal('close');
    }

  render() {
    let role = permissionCheck("package");
    if (!role) return <Nopermission />;

    let { preloader, data,previewReceipt,receiptID } = this.state;

    let action = role.permission ? role.permission.split(",") : [];
    let total_credit_amount = 0,
      total_debit_amount = 0;
    return (
      <div className="portlet_table">
        <div className="transition-item list-page">
          
		      <div id="previewreceiptmodule" className="modal" style={{width:"85vw",height:"100vh"}}>
                          <div className="modal-content">                                
                               {
                                 previewReceipt &&
                                <PreviewReceiptModule closePreview={this.closePreview} receiptID={receiptID}/>
                              }

                          </div>
          </div>
          <div className="main-content">
            <ReportFilter
              isSOAReport={true}
              callPrint={this.callPrint.bind(this)}
              callExcel={this.callExcel.bind(this)}
              filterSearch={this.filterSearch.bind(this)}
            />
            <div id="title_id">
              <div className="col s12 portlet-title">
                <div className="caption">SOA Report</div>
              </div>
              <div className="col s12">
                <table className="striped report-table-header">
                  <thead />
                  <tbody>
                    <tr
                      className="report-header"
                      style={{ borderBottom: " !important" }}
                    >
                      <th className="report-header-data">Center Name:</th>
                      <td className="report-header-data leftAlignText header-value">
                        {this.state.centerName}
                      </td>
                      <th className="report-header-data" />
                      <td className="report-header-data leftAlignText header-value" />
                    </tr>
                    <tr
                      className="report-header"
                      style={{ borderBottom: "none !important" }}
                    >
                      <th className="report-header-data">Generated On:</th>
                      <td className="report-header-data leftAlignText header-value">
                        {this.state.currentDate}
                      </td>
                      <th className="report-header-data header-value">
                        Generated By:
                      </th>
                      <td className="report-header-data leftAlignText header-value">
                        {username}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {action.indexOf("View") !== -1 && (
              <table id="invoiceListing" className="striped">
                <thead>
                  <tr>
                    <th>Invoice / Receipt No</th>

                    <th>Bill / Receipt Date</th>
                    <th>Payment Reference</th>
                    <th>Charges</th>
                    <th>Credits</th>
                    <th>Account Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((val, i) => {
                      if (val.bill_hid <= 0) {
                        total_credit_amount =
                          total_credit_amount + val.credit_amount;
                      } else {
                        total_debit_amount =
                          total_debit_amount + val.debit_amount;
                      }
                      return (
                        <tr key={i}>
                            <td>
                            {val.bill_hid > 0 && <Link to={`billing/edit-invoice/${val.bill_hid}`} target="_blank">{val.ref_no}</Link>}
                           {val.bill_hid <= 0 && <Link onClick={(e)=>{this.receiptPreview(val.receipt_hid)}} >{val.receipt_no}</Link>}
                                       </td>

                          <td>
                            {
                              (val.bill_date =
                                val.bill_hid > 0
                                  ? moment(new Date(val.bill_date)).format(
                                      "DD-MM-YYYY"
                                    )
                                  : moment(new Date(val.bill_date)).format(
                                      "DD-MM-YYYY"
                                    ))
                            }
                          </td>
                          <td>{val.payment_reference}</td>
                          <td
                            style={{
                              textAlign: "right",
                              padding: "10px 10px"
                            }}
                          >
                            {val.bill_hid > 0 ? val.debit_amount : 0}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              padding: "10px 10px"
                            }}
                          >
                            {val.bill_hid <= 0 ? val.credit_amount : 0}
                          </td>
                          <td>{total_debit_amount - total_credit_amount}</td>
                        </tr>
                      );
                    })}
                  <tr className="total_cal">
                    <td colSpan={5}>Ending Balance</td>

                    <td colSpan={1} style={{ padding: "10px" }}>
                      {total_debit_amount - total_credit_amount}
                    </td>
                  </tr>
                  {data && data.length === 0 && (
                    <tr>
                      <td colSpan="6" className="center red-text">
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
export default InvoiceListing;
