import React, { Component } from 'react';
import {  Link } from 'react-router';
import browserHistory from './../../core/History';
import moment from 'moment';
import Preloader from './../../core/Preloader';
const $=window.$;


class Header extends Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          preloader:false
          }
      this.close_preview=this.close_preview.bind(this);
      
    }

  
  close_preview(){
    this.props.closeBillPreview();
  }

  dateFormat(dateString)
  {
    var splitArr = dateString.split(" ");
    var dateObj=splitArr[0].split("-");
    return dateObj[2]+"-"+dateObj[1]+"-"+dateObj[0];
    
  }
  render() {
    let total_amt=0;
    let totalcgst_amt=0;
    let totalsgst_amt=0;
    console.log(this.props.invoiceData);
              return (
                         <div>
                           <div className="row">
                         
                              <div className="input-field col s6">
                                  Company Name : {this.props.previewCompanyName}
                              </div>
                          </div>
                          <div className="row">
                            <div className="input-field col s12">
 
                                  <table className="striped ">
                                    <thead>
                                      <tr>
                                        <th className="center-align" width="4%">Sno</th>
                                        <th className="center-align">Service Name</th>  
                                        <th className="center-align">Qty</th>                                      
                                        <th className="center-align">Amount</th>                                        
                                         
                                      </tr>
                                    </thead>
                                    <tbody >
                                        {

                                       this.props.invoiceData.map((val,i)=>{
                                        total_amt=parseInt(total_amt)+parseInt(val.total_amount);
                                        totalcgst_amt=Math.round(parseInt(val.total_amount)*0.09)+totalcgst_amt;
                                        totalsgst_amt=Math.round(parseInt(val.total_amount)*0.09)+totalsgst_amt;
                                            return(
                                              <tr key={i}>
                                              <td width="4%" className="center-align">
                                                {i+1} 
                                              </td>
                                              
                                              <td className="center-align">{val.servicename}</td>                                            
                                              <td className="center-align">{val.quantity}</td> 
                                              <td className="center-align">{val.total_amount}</td>  
                                             </tr>)
                                    })
                                    }
                                     
                                    </tbody>                                  
                                  </table>

                                  <table style={{margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'arial', fontSize: 14, marginTop: 20}} border={1} cellSpacing={0} cellPadding={0}>
                                <tbody>
                                <tr>
                                  <td colSpan={2} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>Total Charges
                                </td>
                                </tr>
                                <tr width="100%">
                                    <td width="50%" style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>Total (Excluding GST)</td>
                                    <td width="50%" style={{textAlign: 'right', padding: 5}}>{total_amt}</td>
                                  </tr>
                                  <tr width="100%">
                                    <td width="50%" style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>CGST 9%</td>
                                    <td width="50%" style={{textAlign: 'right', padding: 5}}>{Math.round(totalcgst_amt)}</td>
                                  </tr>
                                  <tr width="100%">
                                    <td width="50%" style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>SGST 9%</td>
                                    <td width="50%" style={{textAlign: 'right', padding: 5}}>{Math.round(totalsgst_amt)}</td>
                                  </tr>
                                  <tr width="100%">
                                    <td width="50%" style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>Total (inc. CGST, IGST, SGST as applicable)</td>
                                    <td width="50%" style={{textAlign: 'right', padding: 5}}>{Math.round(total_amt)+Math.round(totalcgst_amt)+Math.round(totalsgst_amt)}</td>
                                  </tr>
                                </tbody></table>
                             </div>
                               <div className="row">
                             <div className="input-field col s12" style={{textAlign:'center'}}>
                                <button type="button" onClick={(e)=>{this.close_preview()}}  className="btn btn-sm btn-danger">Close</button>&nbsp;&nbsp;                               
                              </div>
                            </div> 
                           </div>
                        </div>
                         )
  }



}

export default Header;


