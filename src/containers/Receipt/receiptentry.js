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
      
    }

  
  close(){
    this.props.closeReceiptEntry();
  }


  render() {

    return (  <div>                         
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
                                                                    
                                  </table>

                             </div>
                              
                           </div>
                            <div className="row">
                             	<div className="input-field col s12" style={{textAlign:'center'}}>
                                <button type="button" onClick={(e)=>{this.close()}}  className="btn btn-sm btn-danger">Close</button>&nbsp;&nbsp;                               
                              </div>
                            </div> 
                        </div>
    )
  }



}

export default Header;


