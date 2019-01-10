import React from 'react'; 
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import ReportFilter from './../../core/officeExpriationFilter'; 
import {printer,tabletoExcel} from '../../core/reportActions'; 
import http from './../../core/http-call';
import moment from 'moment';
var param= require('jquery-param');
let total_monthly_rental_amount = 0;
let username=localStorage.getItem("username");
let cresult=localStorage.getItem("Cresult");
class OfficeExpriationReports extends React.Component {
  constructor(props) {
    super(props);
  this.state={
         params:{
            company_name:'',
            service_name:'',
            bill_status:'',
            client_id:'',
            service_id:'',
            bill_start_date:'',
            bill_end_date:'',
            billing_period_from:'',
            billing_period_to:''
        },  
        data:[],
        currentDate:'',
        centerName:'',
      preloader:true
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
    http.post('/customeragreementdetails',param(this.state.params))
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

    callPrint(){
    var oTable = document.getElementById('officeExpriation').outerHTML;
    var title = document.getElementById('title_id').innerHTML;
    printer(oTable,title);

  }
  callExcel(){ 
    var data=[
          {
            // "customerHid":"Customer Hid",
            "companyName":"Company Name",
            // "aGhid":"AG hid", 
            "agmRefCode":"AGM Ref Code",
            "referenceNo":"Reference No",
            "monthlyRentalAmount":"Monthly Rental Amount",
            "startDate":"Start Date", 
            "endDate":"End Date",
            "unitDetails":"Unit Details"

          } 
      ]; //Title for columns
      let datas = this.state.data;
      datas.map((val,i)=>{
        total_monthly_rental_amount=total_monthly_rental_amount+val.monthly_rental_amount;
        data.push( {
            // "customerHid":val.cust_hid,
            "companyName":val.company_name,
            // "aGhid":val.ag_hid, 
            "agmRefCode":val.agmref_code,
            "referenceNo":val.reference_no,
            "monthlyRentalAmount":val.monthly_rental_amount,
            "startDate":val.start_date=moment(new Date(val.start_date)).format("DD-MM-YYYY"), 
            "endDate":val.end_date=moment(new Date(val.end_date)).format("DD-MM-YYYY")
        }); 
       });
  tabletoExcel(data, "office_expriation.xls","Excel"); 
  }
 
   render() {
    let role=permissionCheck("package");
      if(!role)
        return <Nopermission/> 
    let {preloader,data}=this.state;
    let action=(role.permission)?role.permission.split(","):[];
    let total_monthly_rental_amount = 0;
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
                      <div className="caption">OFFICE EXPRIATION REPORT</div>
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
                              {this.state.params.bill_start_date}&nbsp;&nbsp;&nbsp; To &nbsp;&nbsp;&nbsp;{this.state.params.bill_end_date}
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
                <table id="officeExpriation" className="striped  print-friendly">
                    <thead>
                        <tr>  
                          {/*<th>Customer Hid</th>*/}    
                          <th>Company Name</th> 
                          {/*<th>AG hid</th>*/}
                          <th>AGM Ref Code</th> 
                          <th>Reference No</th> 
                          <th>Monthly Rental Amount</th>
                          <th>Start Date</th> 
                          <th>End Date</th>
                          <th>Unit Details
                            <tr>
                              <th style={{width: '49%'}}>Cabin Number</th>
                              <th>Number Of Workstations</th>
                            </tr>
                          </th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        data && data.map((val,i)=>{
                          total_monthly_rental_amount=total_monthly_rental_amount+val.monthly_rental_amount;
                         return(
                            <tr key={i}>
                              {/*<td>{val.cust_hid}</td>*/}                             
                              <td>{val.company_name}</td>
                              {/*<td>{val.ag_hid}</td>*/}
                              <td>{val.agmref_code}</td>
                              <td>{val.reference_no}</td>
                              <td style={{textAlign:"right"}}>{val.monthly_rental_amount}</td>
                              <td>{val.start_date=moment(new Date(val.start_date)).format("DD-MM-YYYY")}</td>
                              <td>{val.end_date=moment(new Date(val.end_date)).format("DD-MM-YYYY")}</td>
                               <td>  
                                  <table className="striped">
                                   <thead style={{borderBottom: '1px solid #d0d0d0', borderLeft: '1px solid #ccc', borderTop: '1px solid #ccc'}}>
                                   </thead>
                                   <tbody>
                                   {
                                  val.unit_details && val.unit_details.map((values,j)=>{                                   
                                   return( 
                                    <tr key={j}>
                                     <td style={{width: '38%', borderBottom: 'none'}}>{values.cabin_no}</td>
                                     <td style={{borderBottom: 'none'}}>{values.no_of_work_station}</td>
                                    </tr>)
                                    })
                                }
                                    </tbody>
                                    </table>
                                </td>                                                          
                            </tr>
                            )
                        })
                    }
                    <tr className="total_cal">
                      <td colSpan="2">TOTAL</td>
                      <td style={{textAlign:"right"}}>{total_monthly_rental_amount}</td>
                      <td  colSpan="5"></td>
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

export default OfficeExpriationReports;
