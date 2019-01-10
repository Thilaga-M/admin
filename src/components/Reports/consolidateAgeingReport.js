import React from 'react'; 
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import ReportFilter from "./../../core/ageingReportFilter";
import http from './../../core/http-call';
import moment from 'moment';
import {printer,tabletoExcel} from '../../core/reportActions'; 
import Condition,{If, Else, ElseIf} from 'react-else-if';

var param= require('jquery-param');

class ConsolidateAgeingReport extends React.Component {
  constructor(props) {
    super(props);
  this.state={
        params:{
            billFromDate: '',
            billToDate: '',
            client_id: '',
            company_name:'',
            ref_no:'',
            bill_date:'',
            amount_due:'',
            outstandingdays:''
        }, 
        data:[],
      preloader:true
    }
    this.fetchData = this.fetchData.bind(this); 
    this.filterSearch = this.filterSearch.bind(this);  
   }
  componentDidMount(){ 
    this.fetchData(); 
  }

  fetchData(){
    debugger
    http.post('/consolidatedinvoiceageing',param(this.state.params))
    .then((resp)=>{
      debugger
       this.setState({data:resp.data.result,preloader:false});
      })
  }

   filterSearch(data){
   debugger 
    this.setState({preloader:true});
    let self = this;
    let company_name=data.company_name;
    let startDate=data.startDate;
    let endDate=data.endDate;
    let service_name=data.service_name;
 
    //Added for date filter
    if(startDate)this.state.params.billFromDate=moment(new Date(startDate)).format("DD-MM-YYYY");
    if(endDate)this.state.params.billToDate=moment(new Date(endDate)).format("DD-MM-YYYY");    
    self.setState({params:{...self.state.params,company_name,service_name,startDate,endDate}},()=>{
      debugger
      self.fetchData();
    });
  }

  callPrint(){

    var oTable = document.getElementById('ConsolidateAgeingReportDetails').outerHTML;
    var title = document.getElementById('title_id').innerHTML;
    printer(oTable,title);
  }
    callExcel(){ 
    var data=[
          {
            "companyName":"Company Name",
            "ref_no":"Ref_no",
            "billDate":"Bill Date",
            "amountDue":"Amount Due", 
            "outstandingDays":"Outstanding Days"
            // "0-30Days":"0-30 Days",
            // "30-60Days":"30-60 Days",
            // "60-90Days":"60-90 Days",
            // "90-120Days":"90-120 Days",
            // "Morethan120Days":"More than 120 Days",
          } 
      ]; //Title for columns
      let datas = this.state.data;
      datas.map((val,i)=>{
        data.push( {
            "sNo":val.s_no,
            "companyName":val.company_name,
            "ref_no":val.ref_no,
            "billDate":val.bill_date,
            "amountDue":val.amount_due, 
            "outstandingDays":val.outstandingdays
            // "0-30Days":,
            // "30-60Days":,
            // "60-90Days":,
            // "90-120Days":,
            // "Morethan120Days":
        }); 
       });
  tabletoExcel(data, "consolidate_ageing_report.xls","Excel"); 
  }

   render() {
     
    let role=permissionCheck("package");
      if(!role)
        return <Nopermission/>
        let {preloader,data}=this.state;
        let action=(role.permission)?role.permission.split(","):[];  
       return (
          <div  className="portlet" style={{width: '100%',fontSize: '13px'}}>
            <div className="transition-item list-page">
              <div className="main-content" id="root">
                <div id="title_id" className="col s12 portlet-title"> 
                  <div className="caption">CONSOLIDATE AGEING REPORT</div>
                </div>
                  <ReportFilter 
                  callPrint={this.callPrint.bind(this)}  
                  callExcel={this.callExcel.bind(this)}  
                  filterSearch={this.filterSearch.bind(this)} 
                  />
                { action.indexOf("View")!==-1 &&
                <table id="ConsolidateAgeingReportDetails" className="striped">
                    <thead>
                      <tr>  
                        <th>Company Name</th>
                        <th>Ref_no</th>
                        <th>Bill Date</th>
                        <th>Amount Due</th>
                        <th>Outstanding Days</th>
                        <th>0-30 Days</th>
                        <th>30-60 Days</th>
                        <th>60-90 Days</th>
                        <th>90-120 Days</th>
                        <th>More than 120 Days</th>
                      </tr>
                    </thead>
                    <tbody>
                    { 
                      data && data.map((val,i)=>{
                       return(
                          <tr>     
                            <td>{val.company_name}</td>
                            <td>{val.ref_no}</td>
                            <td>{val.bill_date}</td>
                            <td>{val.amount_due}</td>
                            <td>{val.outstandingdays}</td>
                            <td>
                              <Condition>
                                <If is={val.s_no < 31}>
                                    {val.s_no}                      
                                </If>
                                <Else>-</Else>
                              </Condition>
                            </td>
                            <td>
                              <Condition>
                                <If is={val.s_no < 61}>
                                   {val.s_no}                      
                                </If>
                                <Else>-</Else>
                              </Condition>                         
                            </td>
                            <td>
                             <Condition>
                                <If is={val.s_no < 91}>
                                   {val.s_no}                      
                                </If>
                                <Else>-</Else>
                              </Condition>
                            </td>
                            <td>
                             <Condition>
                                <If is={val.s_no < 121}>
                                   {val.s_no}              
                                </If>
                                <Else>-</Else>
                              </Condition>
                            </td>
                             <td>
                             <Condition>
                                <If is={val.s_no > 121}>
                                  {val.s_no}                      
                                </If>
                                <Else>-</Else>
                              </Condition>
                            </td>
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
export default ConsolidateAgeingReport;
