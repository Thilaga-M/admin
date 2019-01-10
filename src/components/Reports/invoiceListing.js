import React from 'react'; 
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import ReportFilter from './../../core/invoiceListFilter';
import {printer,tabletoExcel} from '../../core/reportActions';  
import http from './../../core/http-call';
import moment from 'moment';
import { Link } from 'react-router';

var param= require('jquery-param');
let total_invoice_amount = 0;
let total_gst_not_apply_amt =0;
let username=localStorage.getItem("username");
let cresult=localStorage.getItem("Cresult");
class InvoiceListing extends React.Component {
  constructor(props) {
    super(props);
  this.state={
        params:{
            bill_status:1,
            client_id:'',
            service_id:'',
            bill_start_date:'',
            bill_end_date:'',
            company_name:'',
            service_name:'',
            billing_period_from:'',
            billing_period_to:''
        }, 
      data:[],
      currentDate:'',
      centerName:'',
      preloader:true,
    }
    this.fetchData = this.fetchData.bind(this); 
    this.filterSearch = this.filterSearch.bind(this);  
   }
  componentDidMount(){ 
    this.fetchData(); 
    let newString = cresult.substr(0, cresult.length-12);
    let newString1 = newString.substr(16);
    this.setState({centerName:newString1});
  }
componentWillUpdate (){

}
 
  fetchData(){
    http.post('/invoicelisting',param(this.state.params))
    .then((resp)=>{
       this.setState({data:resp.data.result,preloader:false});
      })
    var tempDate = new Date();
    var date = tempDate.getDate() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getFullYear() +' '+ tempDate.getHours()+':'+ tempDate.getMinutes()+':'+ tempDate.getSeconds();
    const currDate = date;
    this.setState({currentDate:currDate});
  }
 
   filterSearch(data){ 
    
    this.setState({preloader:true});
    let self = this;
    let client_id=data.company_name;
    let startDate=data.startDate;
    let endDate=data.endDate;
    let service_name=data.service_name;
 
    //Added for date filter
    if(startDate)this.state.params.bill_start_date=moment(new Date(startDate)).format("YYYY-MM-DD");
    if(endDate)this.state.params.bill_end_date=moment(new Date(endDate)).format("YYYY-MM-DD");    
    self.setState({params:{...self.state.params,client_id,service_name,startDate,endDate}},()=>{
      self.fetchData();
    });
  }

    callPrint(){
    var oTable = document.getElementById('invoiceListing').outerHTML;
    var title = document.getElementById('title_id').innerHTML;
    printer(oTable,title);

  }
  callExcel(){ 
    var data=[
          {
            "companyName":"Company Name",
            "invoiceNo":"Invoice No",
            "billDate":"Bill Date", 
            "customerAccountNo":"Customer Account No",
            "invoiceAmount":"Invoice Amount",
            "gstNotApplyAmt":"GST Not Apply Amt"
          } 
      ]; //Title for columns
      let datas = this.state.data;
      datas.map((val,i)=>{
        total_invoice_amount=total_invoice_amount+val.invoice_amount;
        total_gst_not_apply_amt=total_gst_not_apply_amt+val.gst_not_apply_amt;
        data.push( {
            "companyName":val.company_name,
            "invoiceNo":val.invoiceno,
            "billDate":val.bill_date=moment(new Date(val.bill_date)).format("DD-MM-YYYY"), 
            "customerAccountNo":val.customer_account_no,
            "invoiceAmount":val.invoice_amount,
            "gstNotApplyAmt":val.gst_not_apply_amt
        }); 
       });
  tabletoExcel(data, "invoice_listing.xls","Excel"); 
  }

 
   render() {

    let role=permissionCheck("package");
      if(!role)
        return <Nopermission/>
    
    let {preloader,data}=this.state;
 
    let action=(role.permission)?role.permission.split(","):[];
    let total_invoice_amount = 0,total_gst_not_apply_amt =0;
       return (
          <div className="portlet_table">
            <div className="transition-item list-page">
                <div className="main-content">
                  <ReportFilter
                  callPrint={this.callPrint.bind(this)}  
                  callExcel={this.callExcel.bind(this)} 
                  filterSearch={this.filterSearch.bind(this)} 
                  />  
                  <div id="title_id" > 
                    <div className="col s12 portlet-title">
                      <div className="caption">INVOICE LISTING1</div>
                    </div>
                    <div className="col s12">
                      <table className="striped report-table-header">
                        <thead>
                        </thead>
                        <tbody>
                          <tr className="report-header" style={{borderBottom: ' !important'}}>
                            <th className="report-header-data">Center Name:</th>
                            <td className="report-header-data leftAlignText header-value" >{this.state.centerName}</td>
                            <th className="report-header-data"></th>
                            <td className="report-header-data leftAlignText header-value">
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
                { action.indexOf("View")!==-1 &&
                <table  id="invoiceListing"  className="striped print-friendly">
                    <thead>
                        <tr>  
                          <th style={{textAlign:'left',paddingLeft:'20px'}}>Company Name</th>
                          <th>Invoice No</th>
                          <th>Bill Date</th> 
                          <th>Customer Account No</th> 
                          <th>Invoice Amount</th>
                          <th>GST Not Apply Amt</th> 
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        data && data.map((val,i)=>{
                         total_invoice_amount=total_invoice_amount+val.invoice_amount;
                         total_gst_not_apply_amt=total_gst_not_apply_amt+val.gst_not_apply_amt;
                         return(
                            <tr key={i}>
                              <td style={{textAlign:'left',paddingLeft:'20px'}}>{val.company_name}</td>
                              <td>
                              <Link to={`billing/edit-invoice/${val.bill_hid}`} target="_blank">{val.invoiceno}</Link></td>
                              <td>{val.bill_date=moment(new Date(val.bill_date)).format("DD-MM-YYYY")}</td>
                              <td>{val.customer_account_no}</td>
                              <td style={{textAlign:"right"}}>{val.invoice_amount}</td>
                              <td style={{textAlign:"right",padding: '10px 10px'}}>{val.gst_not_apply_amt}</td>  
                            </tr>
                            )
                        })
                    }
                    <tr className="total_cal">
                      <td>TOTAL</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td style={{textAlign:"right"}}>{total_invoice_amount}</td>
                      <td style={{textAlign:"right",padding: '10px 10px'}}>{total_gst_not_apply_amt}</td>
                    </tr>
                    {
                    (data && data.length===0 )&&
                        <tr>  
                            <td colSpan="5" className="center red-text">No Record Found...!</td> 
                        </tr> 
                    }
                            
                    </tbody>
                </table> 
                }
           </div>
               { preloader && <Preloader/> }
            </div> 
          </div>
    )
  }
}
export default InvoiceListing;
