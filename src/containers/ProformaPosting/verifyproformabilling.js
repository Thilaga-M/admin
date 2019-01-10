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
      this.close=this.close.bind(this);
      this.confirm=this.confirm.bind(this);
    }

  confirm()
  {
    this.props.postBill();
  }
  close(){
    this.props.closeVerifyBillDetails();
  }
  
  render() {   
    let verifiedBillData=this.props.verifiedBillData;
    //console.log("verifiedBillData"+JSON.stringify(verifiedBillData));
              return (
                         <div>
                          
                          <div className="row">
                            <div className="input-field col s12">
                               {
                                  (verifiedBillData) &&
                                  <div><br/>
                                  <table className="striped">
                                  <thead>
                                    <tr>
                                      <th>#</th>                        
                                      <th className="center-align">Company Name</th>                                     
                                      <th className="center-align">Total Amount</th>                                    
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {

                                    verifiedBillData && verifiedBillData.map((val,i)=>{
                                        return (<tr key={i}><td>{i+1}</td><td className="center-align">{val.company_name}</td><td className="center-align">{val.total_amt}</td></tr>)
                                    })
                                  } 

                      
                                   </tbody>
                                  </table> 
                             
                                </div>
                              }
                                  
                             </div>                             
                           </div>

                             <div className="row">
                             <div className="input-field col s12" style={{textAlign:'center'}}>
                                <button type="button" onClick={(e)=>{this.confirm()}}  className="btn btn-sm btn-danger">Confirm</button>&nbsp;&nbsp;                               
                                <button type="button" onClick={(e)=>{this.close()}}  className="btn btn-sm btn-danger">Close</button>&nbsp;&nbsp;                               
                              </div>
                            </div> 
                        </div>
                         )
  }



}

export default Header;


