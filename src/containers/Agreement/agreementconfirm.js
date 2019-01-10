import React, { Component } from 'react';
import {  Link } from 'react-router';
import browserHistory from './../../core/History';
import moment from 'moment';
import {confirmAgreement,previewEmailAgreement} from '../../actions/agreementActions';
import {printer,tabletoExcel} from '../../core/reportActions'; 
const $=window.$;
class Header extends Component {
constructor(props) {
super(props);
this.state={
loading: false,
preloader:false,
agreementID:0,
agreement_h_data:'',
agreement_d_data:''
}
this.onsubmit=this.onsubmit.bind(this);
this.close_agreement=this.close_agreement.bind(this);
}
componentDidMount(){
if(this.props.agreementid){
previewEmailAgreement(this.props.agreementid).then((res)=>{
if(res.data.status===200){
let data=res.data;
let over_ride_rate=0;
for(let x=0;x<data.agreement_d_data.length;x++)
{
over_ride_rate += data.agreement_d_data[x].over_ride_rate;
}
if(data.agreement_h_data.start_date)
{
let firstMonthServiceFees=0;
let agreementStartDate = new Date(data.agreement_h_data.start_date);
var dd = agreementStartDate.getDate();
var mm = agreementStartDate.getMonth()+1; //January is 0!
var yyyy = agreementStartDate.getFullYear();
if(dd<10){
dd='0'+dd;
} 
if(mm<10){
mm='0'+mm;
} 
let numberOfDaysInMonth=new Date(agreementStartDate.getFullYear(),agreementStartDate.getMonth()+1, 0).getDate();
let firstMonthEndDate = numberOfDaysInMonth+'-'+mm+'-'+yyyy;
let endDate=new Date(agreementStartDate.getFullYear()+"-"+parseInt(agreementStartDate.getMonth()+1)+"-"+numberOfDaysInMonth);
let timeDiff = Math.abs(new Date(agreementStartDate.getFullYear()+"-"+parseInt(agreementStartDate.getMonth()+1)+"-"+numberOfDaysInMonth).getTime() - agreementStartDate.getTime());
let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
if(diffDays==31)
{
diffDays=31;
}
else
{
diffDays=diffDays+1;
}
firstMonthServiceFees= (over_ride_rate/numberOfDaysInMonth)*diffDays;
data.agreement_h_data.first_month_end_date=firstMonthEndDate;
data.agreement_h_data.first_month_billing_days =diffDays;
data.agreement_h_data.firstMonthServiceFees=firstMonthServiceFees;
}
data.agreement_h_data.agreement_date=this.dateFormat(data.agreement_h_data.agreement_date);
data.agreement_h_data.start_date=this.dateFormat(data.agreement_h_data.start_date);
data.agreement_h_data.end_date=this.dateFormat(data.agreement_h_data.end_date);
data.agreement_h_data.lock_date=this.dateFormat(data.agreement_h_data.lock_date);
console.log(data.agreement_h_data);
this.setState({ 
agreementID:this.props.agreementid,
preloader:false,
agreement_h_data:data.agreement_h_data,
agreement_d_data:data.agreement_d_data
})
}
})
}
}
onsubmit(){
let {agreementID,error_status,preloader} =this.state;        
this.setState({preloader:true});
let isDisabled = false;
if(isDisabled===false){
let params={serviceid:agreementID}
confirmAgreement(params).then((res)=>{
if(res.data.status===200){
alert("Agreement accepted!");
this.close_agreement(1); 
browserHistory.push("/leads/agreement");
}
}); 
}else{
this.setState({error_status:true,preloader:false}); 
}
}
close_agreement(v){
this.props.closeAgreement(v);
}
dateFormat(dateString)
{
var splitArr = dateString.split(" ");
var dateObj=splitArr[0].split("-");
return dateObj[2]+"-"+dateObj[1]+"-"+dateObj[0];
}
callPrint(){
var oTable = document.getElementById('agreement').outerHTML;
var title = document.getElementById('title_id').innerHTML;
printer(oTable, title);
}
render() {
let {preloader,serviceid,agreement_h_data,agreement_d_data} = this.state;
let total_no_of_work_station = 0;
let total_over_ride_rate=0;
return(
<div >
   <form method="post">
      <div className="row">
         <div className="input-field col s12 right">
            <div>
               <table id="agreement" style={{width: 800, margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'arial', lineHeight: 1.3}} border={1} cellSpacing={0} cellPadding={0}>
               <tbody>
                  <tr>
                     <td id="title_id"  style={{borderRight: 'none', borderLeft: 'none',verticalAlign: 'middle'}} colSpan={3}>
                     <img src="../../../images/hq10logo_old.png" alt="Logo"/>
                     </td>
                     <td  style={{fontSize: 24, fontWeight: 600, padding: '30px 5px', borderLeft: 'none', borderRight: 'none'}} colSpan={4}>
                     Online Office Service Agreement
                     </td>
                  </tr>
                  <tr style={{border:'1px solid #ccc'}}>
                  <td colSpan={1} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Date of Agreement:</td>
                  <td colSpan={2}>{agreement_h_data.agreement_date}</td>
                  <td colSpan={2} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5}}>Reference No:</td>
                  <td colSpan={2}>{agreement_h_data.reference_no}</td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{width: '100%', padding: 12, backgroundColor: '#fff',border: 'none'}}> </td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Business Center Address:</td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Bristol IT park, Plot no 10, 4th Floor, South Phase, Tiru Industrial Estate, Guindy, Chennai - 600032.</td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{width: '100%', padding: 12, backgroundColor: '#fff',border: 'none'}}> </td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5,fontWeight: 'bold'}}>Client Details:</td>
                  </tr>
                  <tr>
                     <td colSpan={1} style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Company Name:</td>
                     <td colSpan={3}>{agreement_h_data.company_name} </td>
                     <td colSpan={1} style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Phone:</td>
                     <td colSpan={2}>{agreement_h_data.contact_number} </td>
                  </tr>
                  <tr>
                     <td colSpan={1} style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Contact Name:</td>
                     <td colSpan={3}>{agreement_h_data.first_name} {agreement_h_data.last_name} </td>
                     <td colSpan={1} style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Email:</td>
                     <td colSpan={2}>{agreement_h_data.emailid} </td>
                  </tr>
                  <tr >
                     <td colSpan={1} style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Registered Office Address:</td>
                     <td colSpan={6}> &nbsp;{agreement_h_data.address1},{agreement_h_data.address2},{agreement_h_data.city}-{agreement_h_data.pincode},{agreement_h_data.state},{agreement_h_data.country}</td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',borderRight: 'none',borderLeft: 'none', borderBottom: 'none'}}> </td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5,fontWeight: 'bold'}}>Office Payment Details(Excluding tax and services)
                     </td>
                  </tr>
                  <tr>
                     <td colSpan={1} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'Center', padding: 5}}>Office Number</td>
                     <td colSpan={2} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5}}>No. of work station</td>
                     <td colSpan={2} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5}}>Monthly office fee</td>
                     <td colSpan={2} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5}}>Currency</td>
                  </tr>
                  {
                  agreement_d_data && agreement_d_data.map((val,i)=>{
                  total_no_of_work_station += parseInt(val.no_of_work_station);
                  total_over_ride_rate += parseInt(val.over_ride_rate);
                  return(
                  <tr key={i}>
                     <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{val.cabin_no}</td> 
                     <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{val.no_of_work_station}</td> 
                     <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{val.over_ride_rate}</td> 
                     <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5}}>INR</td> 
                  </tr>
                  )
                  })                                    
                  }                                                                   
                  <tr style={{borderBottom:'1px solid #ccc'}}>
                  <td colSpan={1} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5,borderBottom:'1px solid #ccc'}}>Total Per Month</td>
                  <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5,fontWeight: 'bold',borderBottom:'1px solid #ccc'}}>{total_no_of_work_station}</td>
                  <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5,fontWeight: 'bold',borderBottom:'1px solid #ccc'}}>{total_over_ride_rate}</td>
                  <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5,borderBottom:'1px solid #ccc'}}>INR</td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',borderRight: 'none',borderLeft: 'none', borderBottom: 'none'}}> </td>
                  </tr>
                  <tr style={{border:'1px solid #ccc'}}>
                  <td colSpan={7} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5,fontWeight: 'bold'}}>Down Payment</td>
                  </tr>
                  <tr>
                     <td colSpan={1} style={{fontSize: 14, textAlign: 'left', padding: 5}}>First Month Service Fees</td>
                     <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{agreement_h_data.start_date}</td>
                     <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{agreement_h_data.first_month_end_date}</td>
                     <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{Math.round(agreement_h_data.firstMonthServiceFees)}</td>
                  </tr>
                  <tr>
                     <td colSpan={1} style={{fontSize: 14, textAlign: 'left', padding: 5}}>Service Retainer</td>
                     <td colSpan={4} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{agreement_h_data.retainer_months} Months</td>
                     <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{Math.round(agreement_h_data.retainer_amount)}</td>
                  </tr>
                  <tr>
                     <td colSpan={5} style={{backgroundColor: '#bfbfbf', fontSize: 14, textAlign: 'left', padding: 5}}>Total Down Payment</td>
                     <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5,fontWeight: 'bold'}}>{Math.round(agreement_h_data.retainer_amount+agreement_h_data.firstMonthServiceFees)}</td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',borderRight: 'none',borderLeft: 'none', borderBottom: 'none'}}> </td>
                  </tr>
                  <tr>
                     <td colSpan={5} style={{backgroundColor: '#bfbfbf', fontSize: 14, textAlign: 'left', padding: 5}}>Subsequent Monthly Payment</td>
                     <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5,fontWeight: 'bold',borderTop: '1px solid #ccc'}}>{agreement_h_data.subsequencemonth}</td>                     
                  </tr>
                  <tr>
                     <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',borderRight: 'none',borderLeft: 'none'}}> </td>
                  </tr>
                  <tr style={{border:'1px solid #ccc',borderBottom:'1px solid #ccc !important'}}>
                  <td style={{width: '40%', backgroundColor: '#bfbfbf', fontSize: 14, textAlign: 'left', padding: 5,borderBottom:'1px solid #ccc !important'}}>Service provision</td>
                  <td style={{width: '10%', fontSize: 14, textAlign: 'center', padding: 5,borderBottom:'1px solid #ccc !important'}}>Start Date</td>
                  <td style={{width: '10%', fontSize: 14, textAlign: 'left', padding: 5,borderBottom:'1px solid #ccc !important'}} >{agreement_h_data.start_date}</td>
                  <td style={{width: '10%', fontSize: 14, textAlign: 'center', padding: 5,borderBottom:'1px solid #ccc !important'}}>End Date</td>
                  <td style={{width: '10%', fontSize: 14, textAlign: 'left', padding: 5,borderBottom:'1px solid #ccc !important'}}>{agreement_h_data.end_date}</td>
                  <td style={{width: '10%', fontSize: 14, textAlign: 'center', padding: 5,borderBottom:'1px solid #ccc !important'}}>Locked in till</td>
                  <td style={{width: '10%', fontSize: 14, textAlign: 'left', padding: 5,borderBottom:'1px solid #ccc !important'}}>{agreement_h_data.lock_date}</td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{width: '100%', padding: 5, fontSize: 11, textAlign: 'left',border: '1px solid #fff'}}>*All monthly payments are excluding taxes and excluding chargable services and all agreements shall end only on last calendar day of the month.</td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{width: '100%', backgroundColor: '#fff',borderLeft: 'none',borderRight: 'none', fontSize: 11, textAlign: 'left'}}>
                     <p className="comments"> Comments</p>
                     </td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{height: 50, backgroundColor: '#fff', fontSize: 11, textAlign: 'left', padding: 5}}>{agreement_h_data.comments}</td>
                  </tr>
                  <tr>
                     <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',
                     border: 'none', borderTop:'none'}}>
                     <p className="termspara">We are HQ10 and this Agreement incorporates our Terms and Conditions attached overleaf which you (“Client”) confirm that you have read and understood and the same shall form part of this Agreement for initial and renewal periods. We both agree to comply with those terms and our obligations as set out herein. This Agreement is binding from the Agreement Date (not from the Commencement Date) and shall be terminated only in accordance to the terms and provisions contained in Clause 4 under “Termination”.
                        The retainer can be refunded within 15 days after the contract end date.
                     </p>
                     </td>
                  </tr>
                  <tr>
                     <td colSpan={2} style={{width: '100%', padding: 10, backgroundColor: '#fff',
                     border: 'none'}}>
                     <table style={{width: '100%',pageBreakBefore: 'always !important', pageBreakInside: 'avoid'}}>
                  <tr>
                     <td  style={{backgroundColor: '#fff',
                     border: 'none'}}>
                     <label style={{color: '#333',position: 'inherit'}}>Name :</label>
                     </td>
                     <td  style={{backgroundColor: '#fff',
                     border: 'none'}}>
                     <p></p>
                     </td>
                  </tr>
                  <tr>
                     <td  style={{ backgroundColor: '#fff',
                     border: 'none'}}>
                     <label style={{color: '#333',position: 'inherit'}}>Title :</label>
                     </td>
                     <td  style={{ backgroundColor: '#fff',
                     border: 'none'}}>
                     <p></p>
                     </td>
                  </tr>
                  <tr>
                     <td  style={{ backgroundColor: '#fff',
                     border: 'none'}}>
                     <label style={{color: '#333',position: 'inherit'}}>Date :</label>
                     </td>
                     <td  style={{ backgroundColor: '#fff',
                     border: 'none'}}>
                     <p></p>
                     </td>
                  </tr>
                  <tr> 
                     <td  style={{ backgroundColor: '#fff',
                     border: 'none'}}>
                     <label style={{color: '#333',position: 'inherit'}}>Signed on your behalf (Client)</label>
                     </td>
                  </tr>
                  <tr> 
                     <td  style={{backgroundColor: '#fff',
                     border: 'none'}}>
                     <label style={{color: '#333',position: 'inherit'}}></label>
                     </td>
                  </tr>
               </table>
               </td>
               <td colSpan={5} style={{width: '100%', padding: 10, backgroundColor: '#fff',
               border: 'none'}}>
               <table style={{width: '100%'}}>
               <tr>
                  <td  style={{ backgroundColor: '#fff',
                  border: 'none'}}>
                  <label style={{color: '#333',position: 'inherit'}}>Name :</label>
                  </td>
                  <td  style={{ backgroundColor: '#fff',
                  border: 'none'}}>
                  <p></p>
                  </td>
               </tr>
               <tr>
                  <td  style={{ backgroundColor: '#fff',
                  border: 'none'}}>
                  <label style={{color: '#333',position: 'inherit'}}>Title :</label>
                  </td>
                  <td  style={{ backgroundColor: '#fff',
                  border: 'none'}}>
                  <p></p>
                  </td>
               </tr>
               <tr>
                  <td  style={{ backgroundColor: '#fff',
                  border: 'none'}}>
                  <label style={{color: '#333',position: 'inherit'}}>Date :</label>
                  </td>
                  <td  style={{ backgroundColor: '#fff',
                  border: 'none'}}>
                  <p></p>
                  </td>
               </tr>
               <tr> 
                  <td  style={{ backgroundColor: '#fff',
                  border: 'none'}}>
                  <label style={{color: '#333',position: 'inherit'}}>Signed on your behalf (Client)</label>
                  </td>
               </tr>
               <tr> 
                  <td  style={{ backgroundColor: '#fff',
                  border: 'none'}}>
                  <label style={{color: '#333',position: 'inherit',fontWeight: 600}}>I accept the terms and conditions</label>
                  </td>
               </tr>
               </table>
               </td>
               </tr>
               <tr>
                  <td colSpan={7} style={{fontSize: '20px', fontWeight: 600, padding: '15px 5px', border: 'none', textAlign: 'center'}}>
                  TERMS AND CONDITIONS
                  </td>
               </tr>
               <tr colSpan={7} style={{width: '100%'}}>
               <td colSpan={2} style={{width: '100%', padding: 10, backgroundColor: '#fff',
               border: 'none'}}>
               <table style={{width: '100%',pageBreakBefore: 'always !important', pageBreakInside: 'avoid'}}>
               <tr> 
                  <td  style={{padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  1. TERM OF THE AGREEMENT AND RENEWAL:
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  a) The minimum term of this agreement is as mentioned above subject to the
                  contingencies mentioned in the Termination Clause hereinafter. This
                  Agreement shall be in effect for the term stated above and then the same shall
                  be extended in writing before expiry of notice period on mutually agreed terms
                  for successive minimum period of 3 months until terminated by the Client or by
                  the Service Provider as per Termination Clause. The fees on any renewal will
                  be subject to the market price as determined by the Service Provider
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  b) The term in this Agreement shall come to an end only on the last day of the month.
                  </td>
               </tr>
               <tr> 
                  <td  style={{padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  2. FEES:
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  a) The Client agrees to pay the Service Fee promptly before the due date mentioned in the invoice
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  b) If the Client fails to pay fees within the time, a late fee of INR 1000/- will be
                  charged on the Client and the Client must pay the said amount by the due
                  date or will be subject to further late fees. The Service Provider also reserves
                  the right to withhold services (including for the avoidance of doubt, denying
                  the Client access to its accommodation(s)) till the outstanding dues are paid.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  c) The Client will be required to pay an Interest Free Refundable Service
                  Retainer Deposit equivalent to three months service fee, upon entering into
                  this agreement as security for performance of all the Client’s obligations under
                  this agreement. The service retainer deposit or any balance will be returned to
                  the Client only on termination of the Service Agreement and after the Client
                  has settled its account which includes deducting outstanding fees and other
                  costs due to the Service Provider. Service provider reserves the right to adjust
                  any outstanding fees against retainer including any damages caused to the
                  Centre by the Client, in the event of non-payment of outstanding fees.
                  Necessary proof on TDS deductions to be provided by the client to the service
                  provider to avoid any adjustments. 
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  d) The Client agrees to pay promptly (i) all sales, use, excise, consumption
                  and any other taxes and license fees which it is required to pay to any
                  governmental authority (and, at the Service Provider’s request, will provide to
                  the Service Provider evidence of such payment) and (ii) any taxes paid by the
                  Service Provider to any governmental authority that are attributable to the
                  accommodation(s), including, without limitation, any gross receipts, rent and
                  occupancy taxes, tangible personal property taxes, stamp duty and
                  registration charges orother documentary fees.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  e) Fees for pay-as-you-use services, plus applicable taxes, in accordance
                  with the Service Provider’s published rates which may change from time to
                  time, are invoiced in arrears and payable at the end of the calendar month in
                  which the additional services were provided.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  f) If the Client benefited from a special discount, promotion or offer, the
                  Provider may discontinue that discount, promotion or offer without notice if the
                  Client breaches these terms and conditions.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  g) The Client will pay a penalty fee for any returned cheque or any other
                  payments declined due to insufficient funds.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  h) The Service Provider is eco-friendly and therefore the Service Provider will
                  send all invoices electronically and the Client will make payments via an
                  automated method such as 
                  </td>
               </tr>
               </table>
               </td>
               <td colSpan={5} style={{width: '100%', padding: 10, backgroundColor: '#fff',
               border: 'none'}}>
               <table style={{width: '100%',pageBreakBefore: 'always !important', pageBreakInside: 'avoid'}}>
               <tr>
                  <td style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  Direct Debit or Credit Card, wherever local
                  banking systems permit unless another form of payment is offered to the
                  Client. All amounts payable by the Client under this agreement may be
                  assigned to other members of the Service Provider’s group.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  i) In case if for any reason the Service Provider cannot provide the
                  accommodation(s) stated in this agreement by the date when this agreement
                  is due to start it has no liability to the Client for any loss or damages but the
                  Client may cancel this Agreement without penalty. The Service Provider will
                  not charge the Client the monthly office fees for accommodation(s) the Client
                  cannot use until it becomes available. The Service Provider may delay the
                  start date of this agreement provided it provides to the Client alternative
                  accommodation(s) that shall be at least of equivalent size to the
                  accommodation(s) stated in this agreement.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  j) The client will be asked to pay an exit Fee of INR 850/- per Sq meterduring
                  the exit of their contract term anything greater than 6 months period
                  </td>
               </tr>
               <tr> 
                  <td  style={{padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  3. USE OFFICE SPACE:
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  a) The Client must only use the allotted place only for office purposes and use
                  of any other nature involving illegal acts or frequent visits by members of the
                  public, are prohibited.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  b) The Client must not carry on a business that competes with the service
                  Provider’s business of providing serviced office spaces or its ancillary
                  services.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  c) The Client may carry on its business either in its name or in its group
                  company’s name with prior permission from Service Provider.
                  </td>
               </tr>
               <tr> 
                  <td  style={{padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  4. SERVICE PROVIDER CODES:
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  The standard operating procedures of Service Provider are listed named as
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  “Service Provider Codes”. The client must comply with this Codes which the
                  Service Provider imposes on the Clients for using their Centre and the said
                  Codes varies from Centre to Centre and the same shall be provided to the
                  Client on his request made to the Service Provider.
                  </td>
               </tr>
               <tr>
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  5. AGREEMENT:
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  a) This Agreement is a commercial agreement for accommodation. In this
                  Agreement the possession and control of the entire Business Centre remains
                  in the hands of the Service Provider with a right given to the Client to share the
                  use of the Centre on the terms and conditions, as supplemented by the Service
                  Provider codes, so that the Service Provider can provide the services to the
                  Client. Further the Client agrees and accepts that this agreement does not
                  create any tenancy rights, leasehold rights or any other rights or interest with
                  respect to the accommodation in the Business Centre in favour of the Client.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  b) This Agreement is personal and the Client cannot transfer the same to any
                  third party.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  6. OBLIGATIONS OF THE SERVICES PROVIDER:
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  a) The Service Provider is to provide the number of serviced office
                  accommodation(s) for which the Client has agreed to pay in this Agreement.
                  This Agreement lists the accommodation(s) the Service Provider has initially
                  allocated for the Client’s use and the Client will have a non-exclusive right to
                  the rooms allocated to it.
                  </td>
               </tr>
               </table>
               </td>
               </tr>
               <tr colSpan={7} style={{width: '100%'}}>
               <td colSpan={2} style={{width: '100%', padding: 10, backgroundColor: '#fff',
               border: 'none'}}>
               <table style={{width: '100%',pageBreakBefore: 'always !important', pageBreakInside: 'avoid'}}>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  b) The additional Services that are provided to Clients are detailed in the
                  Service Provider codes.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  The Service Provider is to provide during normal opening hours the services,
                  requested, described in the relevant service description (which is available on
                  request). If the Service Provider decides that a request for any particular
                  service is excessive, it shall reserve its right to charge an additional fee.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  c) The Service Provider has internet security protocols, and does not make
                  any representations as to the data security of the Service Provider’s network
                  (or the internet) or of any information that the client places on it. The client
                  should adopt whatever security measures (such as encryption) it believes are
                  appropriate to its business circumstances. The Service Provider cannot
                  guarantee that a particular degree of availability will be attained in connection
                  with the Client’s use of the Service Provider’s network (or the internet). The
                  Client’s sole and exclusive remedy shall be the remedy of such failure in
                  providing the network by the Service Provider within a reasonable time after
                  written notice.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  7. NO ALTERATION OF ACCOMMODATION:
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  a) The Client must not alter any part of its accommodation and must take good
                  care of all parts of the Centre, its equipment, fixtures, fittings and furnishings
                  which the Client uses. The Client is liable for any damage caused by it or
                  those in the Centre with the Client’s permission or at the Client’s invitation
                  whether express or implied, including but not limited to all employees,
                  contractors, agents or other persons present on the Centre.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  b) The Client must not install any cabling, IT or telecom connections without
                  the Service Provider’s consent, which the Service Provider may refuse at its
                  absolute discretion. As a condition to the Service Provider’s consent, the
                  Client must permit the Service Provider to oversee any installations, either IT
                  or electrical systems and to verify that such installations do not interfere with
                  the use of the accommodation(s) by other Clients or the Service Provider or
                  any landlord of the building.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  8. COMPLIANCE:
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  a) The Client and the Service Provider must comply with all relevant laws and
                  regulations in the conduct of its business in relation to this agreement. The
                  Client must do nothing illegal in connection with its use of the Business
                  Centre. The Client must not do anything that may interfere with the use of the
                  Centre by the Service Provider or by others, (including but not limited to
                  political campaigning or immoral activity), cause any nuisance or annoyance,
                  increase the insurance premiums the Service Provider has to pay, or cause
                  loss or damage to the Service Provider (including damage to reputation) or to
                  the owner of any interest in the building which contains the Centre the Client
                  is using. Both the Client and the Service Provider shall comply at all times with
                  all relevant laws.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  b) If the Service Provider has been advised by any government authority or
                  other legislative body that it has reasonable suspicion that the Client is
                  conducting criminal activities from the Centre then the Service Provider shall
                  be entitled to terminate this agreement with immediate effect.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  c) The Client acknowledges that (i) the terms of this clause are a material
                  inducement in the Service Provider’s execution of this agreement and (ii) any
                  violation by the Client of these clauses shall constitute a material default by
                  the Client hereunder, entitling the Service Provider to terminate this
                  agreement, without further notice or procedure.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  d) The Client acknowledges and accepts that its personal data may be
                  transferred or made accessible to all entities of the Service Provider, wherever
                  located, for the purposes of providing the services herein.e) It is the 
                  client’s responsibility to meet all its statutory obligations and to
                  comply with all local regulations/compliance of the country 
                  </td>
               </tr>
               </table>
               </td>
               <td colSpan={5} style={{width: '100%', padding: 10, backgroundColor: '#fff',
               border: 'none'}}>
               <table style={{width: '100%',pageBreakBefore: 'always !important', pageBreakInside: 'avoid'}}>
               <tr>
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',border: 'none'}}>
                  and the service
                  provider might provide necessary support by referring it to the local consultant
                  for such matters.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',border: 'none'}}>
                  f) The client should deduct TDS at the applicable rate of the country from all
                  payments towards fees and deposit the same with the government in a timely
                  manner. Necessary proof of the same needs to be submitted to the Service
                  Provider. Further the Service provider reserves its right to adjust this in the
                  retainer amount, in the absence of adequate proofs.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',border: 'none'}}>
                  g) The Client may use the Centre address as its business address. Any other
                  uses are prohibited without the Service Provider’s prior written consent.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  9. SERVICE PROVIDER’S LIABILITY:
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  a) To the maximum extent permitted by applicable law, the Service Provider is
                  not liable to the Client in respect of any loss or damage the Client suffers in
                  connection with this agreement, with the services or with the Client’s
                  accommodation(s) unless the Provider has acted deliberately or negligently in
                  causing that loss or damage. the Service Provider is not liable for any loss as a
                  result of the Service Provider’s failure to provide the required services as a result
                  of mechanical breakdown, strike, termination of the Service Provider’s interest in
                  the building containing the Centre or otherwise unless the Provider does so
                  deliberately or is negligent. In no event shall the Service Provider be liable for
                  any loss or damage until the Client provides the Service Provider written notice
                  and give the Service Provider a reasonable period to correct the same.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  b) The Service Provider will not in any circumstances have any liability for loss
                  of business, loss of profits, loss of anticipated savings, loss of or damage to
                  data, third party claims or any consequential loss unless the Service Provider
                  otherwise agrees in writing. The Service Provider strongly advises the client to
                  insure against all such potential loss, damage, expense or liability.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  c) It is clearly agreed between the Service Provider and the Client that the
                  Complimentary Services are provided to the Client without charging to the
                  Client. In this regard the Service Provider shall take all necessary steps to
                  ensure that the said complimentary services are provided to the client.
                  However due to certain unavoidable circumstances, if the Service Provider is
                  unable to provide the said Complimentary Services to the client then the
                  Client shall not hold the Service Provider liable for such interruption in
                  services which are not attributable to the Service Provider. The Service
                  Provider is no way liable to indemnify the client in such case of interruption or
                  non-availability of complimentary services to the Client and the Client cannot
                  demand the said complimentary services as a matter of right for the reason
                  that the said is offered as compliment to the Client.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  10. EMPLOYEES:
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  As long as this agreement is in force and for a period of six months after it
                  ends, neither the Service Provider nor the Client may knowingly solicit or offer
                  employment to any of the other’s staff employed in the Centre. This obligation
                  applies to any employee employed at the Centre up to that employee’s
                  termination of employment, and for six months thereafter. It is stipulated that
                  the breaching party shall pay the non-breaching party the equivalent of six
                  months’ salary for any employee concerned. Nothing in this clause shall
                  prevent either party from employing an individual who responds in good faith
                  and independently to an advertisement which is made to the public at large.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  11. INSURANCE:
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  It is the Client’s responsibility to keep its own property, its own liability to its
                  employees and to third parties in the Centre properly insured. The Service Provider strongly 
                  recommends that the Client has to keep such insurance in
                  place to cover its risks and the Service Provider shall not be made liable for
                  the same.
                  </td>
               </tr>
               </table>
               </td>
               </tr>
               <tr colSpan={7} style={{width: '100%'}}>
               <td colSpan={2} style={{width: '100%', padding: 10, backgroundColor: '#fff',
               border: 'none'}}>
               <table style={{width: '100%',pageBreakBefore: 'always !important', pageBreakInside: 'avoid'}}>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  12. TERMINATION:
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  Subject to the Lock-in period and Renewal clause mentioned above, either
                  the Service Provider or the Client can terminate this agreement at the end
                  date stated in it or at the end of any extension or renewal period or by
                  providing a notice period detailed below:
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  a) Three months or more, then either party shall provide a notice period of
                  three months, or
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  b) If less than three months, then either party shall provide a notice period of
                  one month.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  All the above notices issued shall be effective from the start of the subsequent
                  calendar month.
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  Subject to the following contingencies:
                  </td>
               </tr>
               <tr> 
                  <td  style={{width: '100%', padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  a)Service Provider termination by Notice: To the maximum extent permitted by
                  applicable law, the Service Provider may put an end to this agreement
                  immediately by providing notice to the Client and without need to follow any
                  additional procedure if (i) the Client becomes insolvent, bankrupt, goes into
                  liquidation or becomes unable to pay its debts as they fall due, or (ii) the Client
                  is in breach of one of its obligations which cannot be corrected or which the
                  Service Provider have given the Client notice correct the same but the Client
                  has failed to correct it within ten (10) days of that notice, or (iii) its conduct, or
                  that of someone at the Centre without its permission or invitation, is
                  incompatible with ordinary office use or such conduct is repeated despite the
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  Client having been given a warning or such conduct is material enough (in the
                  Service Provider’s opinion) to warrant immediate termination. If the Service
                  provider puts an end to this Agreement for any of these reasons it does not put
                  an end to any outstanding obligations, including additional services used,
                  requested or required under the Agreement and the monthly office fees for the
                  notice period as per this agreement. The client shall have to pay as per notice
                  period clause.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  b) Non availability of Centre: In the event that the Service Provider is
                  permanently unable to provide the services and accommodation(s) at the
                  Centre stated in this agreement or the Centre is no longer available, then this
                  agreement will end and the Client will only have to pay only the monthly office
                  fees up to the date it ends and for the additional services the Client has used.
                  The Service Provider will try to find suitable alternative accommodation(s) for
                  the Client at another Centre that is under the Service Provider.
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  c) Force Majeure: An event of Force Majeure means an act of god, fire,
                  drought, flood, earthquake, landslide, storm or other natural disaster, war,
                  invasion, armed conflict, hostilities of foreign enemy, revolution, riot,
                  insurrection, civil commotion or act of terrorism or any explosion, fire,
                  blockade, breakdown or other accident not caused due to negligence or
                  failure to take due care or to comply with the terms of this Agreement (“Force
                  Majeure”) and in such case, neither Party obligations/ performance in this
                  Agreement shall be suspended during the Force Majeure event and till
                  reinstatement of the centre. Client shall be billed only to the extent 
                  services are utilised during such period.Consequences of termination: As and when this
                  agreement ends, the Client has to vacate the accommodation(s) immediately, leaving 
                  the accommodation(s) in the same condition as it was when the Client took it and
                  upon the Client’s exit or if the Client,  at its option, chooses to relocate to
                  different rooms within 
                  </td>
               </tr>
               </table>
               </td>
               <td colSpan={5} style={{width: '100%', padding: 10, backgroundColor: '#fff',
               border: 'none'}}>
               <table style={{width: '100%',pageBreakBefore: 'always !important', pageBreakInside: 'avoid'}}>
               <tr>
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>  
                  the Centre, the Service Provider will charge an Office
                  Restoration Service fee to cover normal cleaning and testing and to return the
                  accommodation(s) to its original state. This Restoration fee will differ and is
                  listed in the Service Provider codes. The Service Provider reserves the right
                  to charge additional reasonable fees for any repairs needed above and
                  beyond normal wear and tear. If the Client leaves any property in the Centre,
                  the Service Provider may dispose of it at the Client’s cost in any way the
                  Service Provider chooses without owing the Client any responsibility for it or
                  any proceeds of sale. If the Client continues to use the accommodation(s)
                  after when this agreement has ended, then the Client is responsible for any
                  loss, claim or liability the Service Provider incurs as a result of the Client’s
                  failure to vacate on time. The Service Provider may, at its discretion, permit
                  the Client an extension subject to a surcharge on the monthly office fees.
                  </td>
               </tr>
               <tr> 
                  <td  style={{padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  13. NOTICES:
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  All formal notices must be in writing, which may include by email to the
                  address first written above. 
                  </td>
               </tr>
               <tr> 
                  <td  style={{padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  14. CONFIDENTIALITY:
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  The terms and conditions of this Agreement are confidential and neither the
                  Service Provider nor the Client must disclose them without the other’s consent
                  unless required to do so by law or an official authority. This obligation
                  continues for a period of 2 years after this agreement ends.
                  </td>
               </tr>
               <tr> 
                  <td  style={{padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  15. DISPUTE RESOLUTION:
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  Any dispute arising out this or in relation to this agreed shall resolved by
                  referring to a Sole Arbitrator appointed by both the parties on mutual consent
                  and place of Arbitration shall be in Chennai.
                  </td>
               </tr>
               <tr> 
                  <td  style={{padding: 10, backgroundColor: '#fff',
                  border: 'none',fontWeight:'600'}}>
                  16. APPLICABLE LAWS:
                  </td>
               </tr>
               <tr> 
                  <td  style={{ padding: 10, backgroundColor: '#fff',
                  border: 'none'}}>
                  This Agreement is interpreted and enforced in accordance with the laws of the
                  land where the relevant Centre is situated. All dispute resolution proceedings
                  will be conducted as per the law of the land where the Centre is situated. If any
                  provision of these terms and conditions is held void or unenforceable under
                  the applicable law, the other provisions shall remain in force.
                  </td>
               </tr>
               <tr><td style={{ border: 'none'}}>
                  <table style={{borderTop:'2px solid #333',borderBottom:'2px solid #333',borderLeft:'none',
                  borderRight:'none'}}>
               <tr>
                  <td  style={{padding :'10px',backgroundColor: '#fff',
                  border: 'none'}}>Name :
                  </td>
                  <td  style={{padding :'10px',backgroundColor: '#fff',
                  border: 'none'}}>
                  </td>
               </tr>
               <tr>
                  <td  style={{padding :'10px',backgroundColor: '#fff',
                  border: 'none'}}>Title :
                  </td>
                  <td  style={{padding :'10px',backgroundColor: '#fff',
                  border: 'none'}}>
                  </td>
               </tr>
               <tr>
                  <td  style={{padding :'10px',backgroundColor: '#fff',
                  border: 'none'}}>Date :
                  </td>
                  <td  style={{padding :'10px',backgroundColor: '#fff',
                  border: 'none'}}>
                  </td>
               </tr>
               <tr>
                  <td  style={{padding :'10px', backgroundColor: '#fff',
                  border: 'none'}}><label style={{color: '#333',position: 'inherit'}}>Signed on your behalf (Client)</label>
                  </td>
                  <td  style={{padding :'10px', backgroundColor: '#fff',
                  border: 'none'}}>
                  </td>
               </tr>
               </table>
               </td>
               </tr>
               <tr><td style={{ border: 'none'}}>
                  <table style={{borderBottom:'2px solid #333',borderTop:'none',borderLeft:'none',
                  borderRight:'none'}}>
               <tr>
                  <td  style={{padding :'10px', backgroundColor: '#fff',
                  border: 'none'}}>Name :
                  </td>
                  <td  style={{padding :'10px', backgroundColor: '#fff',
                  border: 'none'}}>
                  </td>
               </tr>
               <tr>
                  <td  style={{padding :'10px', backgroundColor: '#fff',
                  border: 'none'}}>Title :
                  </td>
                  <td  style={{padding :'10px', backgroundColor: '#fff',
                  border: 'none'}}>
                  </td>
               </tr>
               <tr >
                  <td  style={{padding :'10px', backgroundColor: '#fff',
                  border: 'none'}}>Date :
                  </td>
                  <td  style={{padding :'10px', backgroundColor: '#fff',
                  border: 'none'}}>
                  </td>
               </tr>
               <tr>
                  <td  style={{padding :'10px', backgroundColor: '#fff',
                  border: 'none'}}><label style={{color: '#333',position: 'inherit'}}>Signed on your behalf (Client)</label>
                  </td>
                  <td  style={{padding :'10px', backgroundColor: '#fff',
                  border: 'none'}}>
                  </td>
               </tr>
               </table></td>
               </tr>
               </table>
               </td>
               </tr>
               </tbody>
               </table>
            </div>
         </div>
      </div>
      <div className="row">
         <div className="input-field col s12 right">
            <button type="button" onClick={(e)=>{this.close_agreement(0)}}  className="btn btn-sm btn-danger">Cancel</button>&nbsp;&nbsp;
            {agreement_h_data.lead_status != 4 && <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Confirm</button>}
            <button type="button" onClick={this.callPrint.bind(this)}
               className="btn filterBtn">Print</button>
         </div>
      </div>
   </form>
</div>
)
}
}
export default Header;