import React from 'react'; 
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import ReportFilter from './../../core/receiptFilter';
import {printer,tabletoExcel} from '../../core/reportActions';  
import http from './../../core/http-call';
import moment from 'moment';

var param= require('jquery-param');
let total_received_amount = 0;
let total_tds_amount =0;
let username=localStorage.getItem("username");
let cresult=localStorage.getItem("Cresult");
class ReceiptListing extends React.Component {
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
            billing_period_to:'',
            start_date:'',
            end_date: '',

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
    let newString = cresult.substr(0, cresult.length-12);
    let newString1 = newString.substr(16);
    this.setState({centerName:newString1});
    this.fetchData();
  }
  componentWillUpdate (){
   
    }
 
  
 
   filterSearch(data){ 
    this.setState({preloader:true});
    let self = this;
    let company_name=data.company_name;
    let startDate=data.startDate;
    let endDate=data.endDate;
    let service_name=data.service_name;
 
    //Added for date filter
    if(startDate)this.state.params.bill_start_date=moment(new Date(startDate)).format("DD-MM-YYYY");
    if(endDate)this.state.params.bill_end_date=moment(new Date(endDate)).format("DD-MM-YYYY");    
    self.setState({params:{...self.state.params,company_name,service_name,startDate,endDate}},()=>{
      self.fetchData();
    });
  }
  fetchData(){
    http.post('/receiptlisting',param(this.state.params))
    .then((resp)=>{
       this.setState({data:resp.data.result,preloader:false});
      })
    var tempDate = new Date();
    var date = tempDate.getDate() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getFullYear() +' '+ tempDate.getHours()+':'+ tempDate.getMinutes()+':'+ tempDate.getSeconds();
    const currDate = date;
    this.setState({currentDate:currDate});
  }

    callPrint(){
    var oTable = document.getElementById('receiptListing').outerHTML;
    var title = document.getElementById('title_id').innerHTML;
    printer(oTable,title);

  }
  callExcel(){ 
    var data=[
          {
            "companyName":"Company Name",
            "receiptDate":"Receipt Date", 
            "receiptNo":"Receipt No",
            "referenceNo":"Reference No",
            "receivedAmount":"Received Amount",
            "tdsAmount":"TDS Amount"
          } 
      ]; //Title for columns
      let datas = this.state.data;

      datas.map((val,i)=>{
        total_received_amount=total_received_amount+val.received_amount;
        total_tds_amount=total_tds_amount+val.tds_amount;
        data.push( {
            "companyName":val.company_name,
            "receiptDate":val.receipt_date=moment(new Date(val.receipt_date)).format("DD-MM-YYYY"),
            "receiptNo":val.receipt_no, 
            "referenceNo":val.reference_no,
            "receivedAmount":val.received_amount,
            "tdsAmount":val.tds_amount
        }); 
       });
  tabletoExcel(data, "receipt_listing.xls","Excel"); 
  }
 
  render() {

    let role=permissionCheck("package");
      if(!role)
        return <Nopermission/>
    
    let {preloader,data}=this.state;
 
    let action=(role.permission)?role.permission.split(","):[];
    let total_received_amount = 0,total_tds_amount =0;
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
                      <div className="caption">RECEIPT LISTING</div>
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
                              {this.state.params.bill_start_date}&nbsp;&nbsp;To&nbsp;&nbsp;{this.state.params.bill_end_date}
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
                <table id="receiptListing" className="striped print-friendly">
                    <thead>
                        <tr>  
                          <th className="leftAlignText">Company Name</th>
                          <th>Receipt Date</th>
                          <th>Receipt No</th> 
                          <th>Reference No</th> 
                          <th>Received Amount</th>
                          <th>TDS Amount</th> 
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        data && data.map((val,i)=>{
                         total_received_amount=total_received_amount+val.received_amount;
                         total_tds_amount=total_tds_amount+val.tds_amount;
                         return(
                            <tr key={i}>
                              <td className="leftAlignText">{val.company_name}</td>
                              <td>{val.receipt_date=moment(new Date(val.receipt_date)).format("DD-MM-YYYY")}</td>
                              <td>{val.receipt_no}</td>
                              <td>{val.reference_no}</td>
                              <td style={{textAlign:"right"}}>{val.received_amount}</td>
                              <td style={{textAlign:"right",padding: '10px'}}>{val.tds_amount}</td>  
                            </tr>
                            )
                        })
                    }
                    <tr className="total_cal">
                      <td>TOTAL</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td style={{textAlign:"right"}}>{total_received_amount}</td>
                      <td style={{textAlign:"right",padding: '10px'}}>{total_tds_amount}</td>
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
export default ReceiptListing;