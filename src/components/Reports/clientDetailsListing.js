import React from 'react'; 
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import ReportFilter from './../../core/clientDetailsFilter'; 
import http from './../../core/http-call';
import moment from 'moment';
import {printer,tabletoExcel} from '../../core/reportActions'; 

var param= require('jquery-param');
let username=localStorage.getItem("username");
let cresult=localStorage.getItem("Cresult");
class ClientDetailsListing extends React.Component {
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
    componentDidMount() {
    this.fetchData();
      let newString = cresult.substr(0, cresult.length-12);
  let newString1 = newString.substr(16);
  this.setState({centerName:newString1});
  }

  fetchData(){
    debugger
    http.post('/clientdetaillisting',param(this.state.params))
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
    var oTable = document.getElementById('clientDetails').outerHTML;
    var title = document.getElementById('title_id').innerHTML;
    printer(oTable,title);

  }
    callExcel(){ 
    var data=[
          {
            "companyName":"Company Name",
            "leadCode":"Lead Code",
            "aGMRefCode":"AGM Ref Code",
            "referenceNo":"Reference No", 
            "industryType":"Industry Type",
            "emailId":"Email Id",
            "contactNumber":"Contact Number",
            "address1":"Address 1",
            "address2":"Address 2",
            "city":"City",
            "state":"State",
            "pincode":"Pincode",
            "country":"Country"
          } 
      ]; //Title for columns
      
      let datas = this.state.data;
      datas.map((val,i)=>{
        data.push( {
            "companyName":val.company_name,
            "leadCode":val.lead_code,
            "aGMRefCode":val.agmref_code,
            "referenceNo":val.reference_no, 
            "industryType":val.industry_type,
            "emailId":val.emailid,
            "contactNumber":val.contact_number,
            "address1":val.address1,
            "address2":val.address2,
            "city":val.city_name,
            "state":val.state_name,
            "pincode":val.pincode,
            "country":val.country_name
        }); 
       });
  tabletoExcel(data, "client_details_listing.xls","Excel"); 
  }

   render() {

    let role=permissionCheck("package");
      if(!role)
        return <Nopermission/>
    
    let {preloader,data}=this.state;
 
    let action=(role.permission)?role.permission.split(","):[];  
  
       return (
          <div  className="portlet_table" style={{width: '100%',fontSize: '13px',overflowX: 'scroll'}}>
            <div className="transition-item list-page">
                <div className="main-content" id="root">
                <ReportFilter
                  callPrint={this.callPrint.bind(this)}  
                  callExcel={this.callExcel.bind(this)}  
                  filterSearch={this.filterSearch.bind(this)}/>
                <div id="title_id"> 
                  <div className="col s12 portlet-title">
                    <div className="caption">CLIENT DETAILS LISTING</div>
                  </div>
                  <div className="col s12">
                    <table className="striped report-table-header">
                      <thead>
                      </thead>
                      <tbody>
                        <tr className="report-header" style={{borderBottom: ' !important'}}>
                          <th className="report-header-data">Center Name:</th>
                          <td className="report-header-data leftAlignText header-value" >{this.state.centerName}</td>
                          <th className="report-header-data header-value"></th>
                          <td className="report-header-data leftAlignText header-value"></td>
                        </tr> 
                        <tr className="report-header" style={{borderBottom: 'none !important'}}>
                          <th className="report-header-data"> Generated On:</th>
                          <td className="report-header-data leftAlignText header-value">{this.state.currentDate}</td>
                          <th className="report-header-data">Generated By:</th>
                          <td className="report-header-data leftAlignText header-value">{username}</td>
                          
                        </tr>                         
                      </tbody>
                    </table>
                  </div>
                </div>
                { action.indexOf("View")!==-1 &&
                <table id="clientDetails" className="striped print-friendly">
                    <thead>
                      <tr>  
                        <th className="client-rpt leftAlignText">Company Name</th>
                        <th className="client-rpt">Lead Code</th> 
                        <th className="client-rpt">AGM Ref Code</th> 
                        <th className="client-rpt">Reference No</th>
                        <th className="client-rpt">Industry Type</th> 
                        <th className="client-rpt leftAlignText">Email Id</th>
                        <th className="client-rpt">Contact Number</th> 
                        <th className="client-rpt leftAlignText">Address 1</th> 
                        <th className="client-rpt leftAlignText">Address 2</th>
                        <th className="client-rpt leftAlignText">City</th> 
                        <th className="client-rpt leftAlignText">State</th>
                        <th className="client-rpt">Pincode</th> 
                        <th className="client-rpt leftAlignText">Country</th>   
                      </tr>
                    </thead>
                    <tbody>
                    { 
                        data && data.map((val,i)=>{
                         return(
                            <tr key={i}>
                              <td className="client-rpt leftAlignText">{val.company_name}</td>
                              <td className="client-rpt">{val.lead_code}</td>
                              <td className="client-rpt">{val.agmref_code}</td>
                              <td className="client-rpt">{val.reference_no}</td>
                              <td className="client-rpt">{val.industry_type}</td>
                              <td className="client-rpt leftAlignText">{val.emailid}</td>
                              <td className="client-rpt">{val.contact_number}</td>
                              <td className="client-rpt leftAlignText">{val.address1}</td>
                              <td className="client-rpt leftAlignText">{val.address2}</td>
                              <td className="client-rpt leftAlignText">{val.city_name}</td>
                              <td className="client-rpt leftAlignText">{val.state_name}</td>
                              <td className="client-rpt">{val.pincode}</td>
                              <td className="client-rpt leftAlignText">{val.country_name}</td>  
                            </tr>
                            )
                        })
                    }
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
export default ClientDetailsListing;
