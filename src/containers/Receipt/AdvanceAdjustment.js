import React, { Component } from 'react';
import {  Link } from 'react-router';
import browserHistory from './../../core/History';
import { receiptAdvance} from '../../actions/receiptActions';

const $=window.$;


class Header extends Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          preloader:false,
          advanceReceiptData:''
          }
      
      this.submit=this.submit.bind(this);
      this.close=this.close.bind(this);
      this.verifyAdjustment=this.verifyAdjustment.bind(this);
      this.onRowchange=this.onRowchange.bind(this);
      
    }

     componentDidMount(){
       if(this.props.cust_hid){
       receiptAdvance(this.props.cust_hid).then((res)=>{
        console.log(res.data);
         if(res.data.status===200){         
          this.setState({advanceReceiptData:res.data.data});          
         }

       })
      }
     }

  close(){
    this.props.closeAdvanceReceiptList();
  }

  verifyAdjustment(e,key,source){
     this.state.advanceReceiptData[key][source]=!this.state.advanceReceiptData[key][source];
     this.state.advanceReceiptData[key][source]=this.state.advanceReceiptData[key][source]?1:0;
     
      let netBalance=0;
      netBalance=parseInt(this.state.advanceReceiptData[key]["credit_amount"])-parseInt(this.state.advanceReceiptData[key]["debit_amount"]);

      this.state.advanceReceiptData[key]["adjustmentAmt"]=(this.state.advanceReceiptData[key]["adjustmentAmt"])?this.state.advanceReceiptData[key]["adjustmentAmt"]:netBalance;
        if(this.state.advanceReceiptData[key]["verify"]==0)
       {
          this.state.advanceReceiptData[key]["adjustmentAmt"]=0;
       }
      this.setState({advanceReceiptData:this.state.advanceReceiptData});
  }


    onRowchange(e,val,key) { 
    //console.log(e,val,k);
      if(val=="adjustmentAmt")this.state.advanceReceiptData[key][val]=e.target.value;
      
      let netBalance=0;
      netBalance=parseInt(this.state.advanceReceiptData[key]["credit_amount"])-parseInt(this.state.advanceReceiptData[key]["debit_amount"]);

      if(this.state.advanceReceiptData[key]["verify"]==1)
     {        

        if(this.state.advanceReceiptData[key]["adjustmentAmt"] > netBalance)
        {
          alert("Adjustment amount should not be greater than balance amount");
          this.state.advanceReceiptData[key]["adjustmentAmt"]=0;
          this.state.advanceReceiptData[key]["verify"]=0;        
        }        
     }
     else
     {
        this.state.advanceReceiptData[key]["adjustmentAmt"]=0;
     }
     

      this.setState({advanceReceiptData:this.state.advanceReceiptData});
      console.log("advanceReceiptData",this.state.advanceReceiptData);


    }


    submit()
    {
        let isDisabled=true;
        let advanceList=this.state.advanceReceiptData;
        let tempadvanceList=this.state.advanceReceiptData;
        let errorMsg="Please enter amount for below receipt"+"\n";
         let totalAmt=0;
         advanceList.map((val,i)=>{
         
          if(val.adjustmentAmt === 0 && val.verify === 1)
          {
               errorMsg+=" - "+val.receipt_no+"\n";                     
          }
           if(val.adjustmentAmt > 0 && val.verify === 1)
          {
               totalAmt += val.adjustmentAmt;                     
          }

        });

         console.log("validation status=",advanceList);
        advanceList = advanceList.filter((bill) => (bill.verify === 1 && bill.adjustmentAmt === 0) );
        console.log("Final validation status=",advanceList);
        
        if(advanceList.length>0)
          {
            alert(errorMsg);       
            return false;
          }
          else
          {
            advanceList = tempadvanceList.filter((bill) => (bill.verify === 1 && bill.adjustmentAmt > 0));
            isDisabled=false;
          }

          if(isDisabled===false)
          {
            this.props.calculateAdvanceAdjustment(advanceList,parseInt(totalAmt));
          }

    }

   render() {
  
    let {preloader,advanceReceiptData} = this.state;
    console.log(advanceReceiptData);
         return (<div>
        <table style={{width: '80%', margin: '0% 10%', align:'center'}}><tbody><tr id="print"><th>Adjust</th><th>Receipt No</th><th>Advance Amount</th><th>Adjusted Amount</th><th>Current Balance</th><th>Adjustment Amount</th></tr>
             {
                advanceReceiptData && advanceReceiptData.map((val,i)=>{

                      return(
                        <tr key={i}>
                            <td style={{fontWeight:'normal'}}> <input type="checkbox"  className="filled-in" checked={(val.verify)?true:false} value="{val.verify}"/><label  onClick={(e)=>{this.verifyAdjustment(e,i,"verify")}} htmlFor="inline-checkbox1"></label></td>
                            <td style={{fontWeight:'normal'}}>{val.receipt_no}</td>
                            <td style={{fontWeight:'normal'}}>{val.credit_amount}</td>
                            <td style={{fontWeight:'normal'}}>{val.debit_amount}</td>
                            <td style={{fontWeight:'normal'}}>{val.credit_amount-val.debit_amount}</td>
                            <td style={{fontWeight:'normal'}}>
                            
                            {(val.verify == 1) && <input type="text" onChange={(e)=>{this.onRowchange(e,"adjustmentAmt",i)}} value={val.adjustmentAmt} placeholder="Enter Amount"/>
                            }

                            </td>
                       </tr>
                        )
                    })
              }
              
          </tbody>
          </table>
          
           <div className="row">
             <div className="input-field col s12" style={{textAlign:'center'}}>
                <button type="button" onClick={(e)=>{this.submit()}} className="btn btn-sm btn-primary">Submit</button>&nbsp;&nbsp;<button type="button" onClick={(e)=>{this.close()}}  className="btn btn-sm btn-danger">Cancel</button>
                  
              </div>
          </div> 
      </div>
    )
  }



}

export default Header;


