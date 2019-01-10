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
    this.props.closeRenewalAgreement(v);
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
                              <table id="agreement" style={{width: 900, margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'arial'}} border={1} cellSpacing={0} cellPadding={0}>
                                <tbody>
                                  <tr>
                                    <td id="title_id"  style={{borderRight: 'none', borderLeft: 'none'}} colSpan={3}>
                                      <img src="../../../images/hq10logo.png" alt="Logo"/>
                                    </td>
                                    <td  style={{fontSize: 24, fontWeight: 600, padding: '30px 5px', borderLeft: 'none', borderRight: 'none'}} colSpan={4}>
                                      Online Office Service Renewal Agreement
                                    </td>
                                  </tr> 
                                  <tr>
                                    <td colSpan={1} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left'}}>Date of Agreement:</td>
                                    <td colSpan={2}>24.09.2018</td>
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
                                    <td colSpan={7} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Client Details:</td>
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
                                  <tr>
                                    <td colSpan={1} style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Registered Office Address:</td>
                                    <td colSpan={6}> &nbsp;{agreement_h_data.address1},{agreement_h_data.address2},{agreement_h_data.city}-{agreement_h_data.pincode},{agreement_h_data.state},{agreement_h_data.country}</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={7} style={{width: '100%', padding: 12, backgroundColor: '#fff',border: 'none'}}> </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={4} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Office Payment Details(Excluding tax and services)
                                    </td>
                                     <td colSpan={3} style={{backgroundColor: '#fff',border: 'none'}}></td>
                                  </tr>
                                  <tr>
                                    <td colSpan={1} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'Center', padding: 5}}>Office Number</td>
                                    <td colSpan={1} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5}}>No. of work station</td>
                                    <td colSpan={1} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5}}>Monthly office fee</td>
                                    <td colSpan={1} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5}}>Currency</td>
                                    <td colSpan={3} style={{backgroundColor: '#fff',border: 'none'}}></td>
                                  </tr>
                                  
                                  {
                                        
                                        agreement_d_data && agreement_d_data.map((val,i)=>{
                                        
                                        total_no_of_work_station += parseInt(val.no_of_work_station);
                                        total_over_ride_rate += parseInt(val.over_ride_rate);
                                            return(
                                              <tr key={i}>
                                                                                          
                                              <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{val.cabin_no}</td> 
                                              <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{val.no_of_work_station}</td> 
                                              <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5}}>{val.over_ride_rate}</td> 
                                              <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5}}>INR</td> 
                                              <td colSpan={3} style={{backgroundColor: '#fff',border: 'none'}}></td>
                                             </tr>)
                                    })                                    
                                      
                                    }
                                    

                                     
                                     
                                      
                                 

                                  <tr>
                                    <td colSpan={1} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Total Per Month</td>
                                    <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5,fontWeight: 'bold'}}>{total_no_of_work_station}</td>
                                    <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5,fontWeight: 'bold'}}>{total_over_ride_rate}</td>
                                    <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5}}>INR</td>
                                    <td colSpan={3} style={{backgroundColor: '#fff',border: 'none'}}></td>
                                  </tr>
                                  <tr>
                                   <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',
                                   border: '1px solid #fff'}}> </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={4} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5}}>Down Payment</td>
                                    <td colSpan={3} style={{backgroundColor: '#fff',border: 'none'}}></td>

                                  </tr>
                                  <tr>
                                    <td colSpan={1} style={{fontSize: 14, textAlign: 'left', padding: 5}}>First Month Service Fees</td>
                                    <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5}}>01.10.2018</td>
                                    <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5}}>31.10.2018</td>
                                    <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5}}>13250</td>
                                   <td colSpan={3} style={{backgroundColor: '#fff',border: 'none'}}></td>
                                  </tr>
                                  <tr>
                                    <td colSpan={1} style={{fontSize: 14, textAlign: 'left', padding: 5}}>Service Retainer</td>
                                    <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5}}>-</td>
                                    <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5}}>-</td>
                                    <td colSpan={3} style={{backgroundColor: '#fff',border: 'none'}}></td>
                                  </tr>
                                  <tr>
                                    <td colSpan={3} style={{backgroundColor: '#bfbfbf', fontSize: 14, textAlign: 'left', padding: 5}}>Total Down Payment</td>
                                    <td colSpan={1} style={{fontSize: 14, textAlign: 'center', padding: 5,fontWeight: 'bold'}}>13250</td>
                                    <td colSpan={3} style={{backgroundColor: '#fff',border: '1px solid #fff'}}></td>
                                  </tr>
                                  <tr>
                                    <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',borderRight: 'none',borderLeft: 'none', borderBottom: 'none'}}> </td>
                                  </tr>

                                  <tr>

                                    <td colSpan={3} style={{backgroundColor: '#bfbfbf', fontSize: 14, textAlign: 'left', padding: 5,fontWeight: 'bold'}}>Subsequent Monthly Payment</td>
                                    <td colSpan={2} style={{fontSize: 14, textAlign: 'center', padding: 5,fontWeight: 'bold',borderTop: '1px solid #ccc'}}>{agreement_h_data.subsequencemonth}</td>
                                    <td colSpan={2} style={{backgroundColor: '#fff',border: '1px solid #fff'}}></td>
                                    
                                  </tr>
                                  <tr>
                                    <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',borderRight: 'none',borderLeft: 'none'}}> </td>
                                  </tr>
                                  <tr>
                                    <td style={{width: '40%', backgroundColor: '#bfbfbf', fontSize: 14, textAlign: 'left', padding: 5}}>Service provision</td>
                                    <td style={{width: '10%', fontSize: 14, textAlign: 'center', padding: 5}}>Start Date</td>
                                    <td style={{width: '10%', fontSize: 14, textAlign: 'left', padding: 5}} >01.10.2018</td>
                                    <td style={{width: '10%', fontSize: 14, textAlign: 'center', padding: 5}}>End Date</td>
                                    <td style={{width: '10%', fontSize: 14, textAlign: 'left', padding: 5}}>31.03.2019</td>
                                    <td style={{width: '10%', fontSize: 14, textAlign: 'center', padding: 5}}>Locked in till</td>
                                    <td style={{width: '10%', fontSize: 14, textAlign: 'left', padding: 5}}>31.03.2019</td>
                                  </tr>
                                  <tr>
                                    <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',
                                   border: '1px solid #fff'}}> </td>
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
                                   borderRight: 'none',borderLeft: 'none'}}></td>
                                    </tr>
                                    
                                    <tr>
                                    <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',
                                      border: '1px solid #ccc'}}>
                                         <p className="termscond">Terms and conditions</p>
                                         <p className="termspara"> We are HQ10 and this Agreement incorporates our Terms and Conditions attached overleaf which you (“Client”) confirm that you have read and understood and the same shall form part of this Agreement for initial and renewal periods. We both agree to comply with those terms and our obligations as set out herein. This Agreement is binding from the Agreement Date (not from the Commencement Date) and shall be terminated only in accordance to the terms and provisions contained in Clause 4 under “Termination”.
                                         The retainer can be refunded within 15 days after the contract end date.
                                          </p>
                                          <table style={{width: 900, margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'arial'}} cellSpacing={0} cellPadding={0}>
                                          <tbody>

                                        <tr>  
                                             <td style={{Width:'50%',fontSize: 12, textAlign: 'left', padding: 5,fontWeight: 'bold',border: '1px solid #fff',fontFamily:'arial'}}>I accept the terms and conditions</td>
                                          </tr>

                                          <tr>  
                                             <td style={{Width:'50%',fontSize: 12, textAlign: 'left', padding: 5,fontWeight: 'bold',border: '1px solid #fff',fontFamily:'arial'}}></td>
                                          </tr>
                                        </tbody></table>
                                          <p className="termslast"> We and our preferred partners would like to keep you informed of the latest product News , Special offers and Others  market   
                                          information. If you would like to receive this
                                          information then select this box 
                                          </p>    
                                    </td>
                                  </tr>

                                  <tr>
                                      <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',
                                      borderRight: 'none',borderLeft: 'none'}}></td>
                                    </tr>
                                    
                                  <tr>
                                  <td colSpan={7} style={{width: '100%', padding: 10, backgroundColor: '#fff',
                                   border: '1px solid #ccc'}}>
                              
                                  <p className="termspara" style={{fontWeight: 'bold'}}>Confirm by typing your name in the box below</p>
                                        <table style={{width: 900, margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'arial'}} cellSpacing={0} cellPadding={0}>
                                        <tbody>

                                           <tr>  
                                             <td style={{Width:'35%',fontSize: 12, textAlign: 'left', padding: 5,fontWeight: 'bold',border: '1px solid #fff',fontFamily:'arial'}}>Name:</td>
                                             <td style={{Width:'65%',fontSize: 12, textAlign: 'right', padding: 5,border: '1px solid #fff',fontFamily:'arial'}}>on behalf of Karbon Consulting</td>
                                             </tr>
                                             <tr>  
                                             <td style={{Width:'35%',fontSize: 12, textAlign: 'left', padding: 5,fontWeight: 'bold',border: '1px solid #fff',fontFamily:'arial'}}>Date:</td>
                                             </tr>
                        <tr>  
                          <td style={{Width:'80%',fontSize: 12, textAlign: 'left', padding: 5,fontWeight: 'bold',border: '2px solid #fff',fontFamily:'arial'}}> I confirm these details are correct to the best of my knowledge</td>

                         <td style={{Width:'20%',fontSize: 12, textAlign: 'right', Valign: 'Top',fontWeight: 'bold',border: '1px solid #fff',fontFamily:'arial'}}>Signed</td>
                         </tr>

                          <tr>  
                          <td style={{Width:'80%',fontSize: 12, textAlign: 'left', padding: 5,fontWeight: 'bold',border: '2px solid #fff',fontFamily:'arial'}}> This website is secure. Your personal details are protected at all times.</td>
                         </tr>
                         <tr>
      
                         </tr>
                                        </tbody>
                                        </table>

                                          <p className="termslast"> We and our preferred partners would like to keep you informed of the latest product News , Special offers and Others market information. If you would like to receive this
                                          information then select this box 
                                          </p>    
                                    </td>
                                  </tr>
                                </tbody></table>
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


