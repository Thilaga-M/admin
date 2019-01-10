import React, { Component } from 'react';
import {  Link } from 'react-router';
import browserHistory from './../../core/History';
import { previewReceipt} from '../../actions/receiptActions';

const $=window.$;


class Header extends Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          preloader:false,
          receipt_h_data:'',
          receipt_d_data:'',
          customer_data:'',
          customer_address_data:''          
          }
      
      this.showprintout=this.showprintout.bind(this);
      this.close=this.close.bind(this);
      
    }

     componentDidMount(){
       if(this.props.receiptID){
       previewReceipt(this.props.receiptID).then((res)=>{
        
         if(res.data.status===200){         
          res.data.receipth_data.receipt_date=this.dateFormat(res.data.receipth_data.receipt_date);
          res.data.receipth_data.payment_date=this.dateFormat(res.data.receipth_data.payment_date);
          this.setState({receipt_h_data:res.data.receipth_data,receipt_d_data:res.data.receiptd_data,customer_data:res.data.customer_data,customer_address_data:res.data.customer_address_data[0],amountInWords:this.inWords(res.data.receipth_data["amount_paid"])});
          
         }

       })
      }
     }

  close(){
    this.props.closePreview();
  }

 
inWords (num) {
  
     let a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen'];
     let b = ['', '', 'Twenty','Thirty','Fourty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}



  dateFormat(dateString)
  {    
    console.log("dateString",dateString);
    var dateObj=dateString.split("-");
    return dateObj[2]+"-"+dateObj[1]+"-"+dateObj[0];
    
  }
  showprintout()
  {
                let printableContent=document.getElementById("printableContent").outerHTML;
                let mywindow = window.open('', 'RECEIPT', 'height=400,width=600');
                mywindow.document.write('<html><head><title>' + document.title  + '</title>');
                mywindow.document.write('</head><body >');
                mywindow.document.write(printableContent);
                mywindow.document.write('</body></html>');
                mywindow.document.close(); // necessary for IE >= 10
                mywindow.focus(); // necessary for IE >= 10*/
                mywindow.print();
                mywindow.close();
                return true;

  }
  render() {
  
    let {preloader,receipt_h_data,receipt_d_data,customer_data,customer_address_data,amountInWords} = this.state;
    

   let paymentType={1:"Cash",2:"Bank",3:"Cheque"}
         return (
      <div>
        <div id="printableContent">
        <style dangerouslySetInnerHTML={{__html: "\ntable, th, td {\n  width: 20%;\n  padding: 2px;    \n}\n#bg\n{\n border-radius: 0px;\n -webkit-print-color-adjust: exact;background-color:#bfbfbf; \n}\n     #test\n{\n  border: 1px solid #ccc;\n font-family: arial;\n  font-size: 13px;\n  text-align: left;\n  padding-top: 5px;\n}\n #print\n{\n border:1px solid #ccc;\n width:14%;\n padding: 4px 4px !important;\n}\n #test1 th,td\n{\n padding: 2px 2px !important;\n}\n #test1\n{\n  font-family: arial;\n  font-weight: normal;\n  font-size: 13px;\n  text-align: left;\n  padding-top: 5px;\n  \n}\n" }} />

        <table style={{width: '80%', margin: '0% 10%'}} align="center">
          <tbody><tr>
              <th style={{border:'None',borderBottom:'1px Solid Black', verticalAlign: 'middle'}}><img src="../../../images/coaider_logo.png" align="left" /></th>
              <th style={{fontSize: 25, fontWeight: 'bold', fontFamily: 'arial', textAlign: 'center',
              border:'None',borderBottom:'1px Solid Black'}}>Payment Receipt</th>
            </tr>
            <tr>
            <th colSpan='2' style={{border:'None'}}>&nbsp;</th>
            </tr>
          </tbody></table>
        <table style={{width: '80%', margin: '0% 10%'}} border={0} align="center" id="test1">
          <tbody><tr>
              <th style={{border:'None'}} colSpan={2} id='bg'>Client Address Details </th>
              <th style={{border:'None'}} id='bg'>&nbsp;</th>
              <th style={{border:'None'}}>Payment Date</th>
              <th style={{border:'None',fontWeight:'normal'}}>{receipt_h_data.payment_date}</th>
            </tr>
            <tr>
              <th style={{border:'None',fontWeight:'normal'}}>Company Name </th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>{customer_data.company_name}</th>
              <th style={{border:'None',fontWeight:'bold'}}>Receipt Date</th>
              <th style={{border:'None',fontWeight:'normal'}}>{receipt_h_data.receipt_date}</th>
            </tr>
            <tr>
              <th style={{border:'None',fontWeight:'normal'}}>Attention Of: </th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>{customer_data.company_name}</th>
              <th style={{border:'None',fontWeight:'bold'}}>Receipt Number</th>
              <th style={{border:'None',fontWeight:'normal'}}>{receipt_h_data.receipt_no}</th>
            </tr>
            <tr>
              <th style={{border:'None',fontWeight:'normal'}}>Address 1</th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>{customer_data.address1}</th>
              <th style={{border:'None',fontWeight:'normal'}}>&nbsp;</th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={1}>&nbsp;</th>
            </tr>
            <tr>
              <th style={{border:'None',fontWeight:'normal'}}>Address 2 
              </th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>{customer_data.address2}</th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>&nbsp;</th>
            </tr>
            <tr>
              <th style={{border:'None',fontWeight:'normal'}}>City</th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>{customer_address_data.city_name} </th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>&nbsp;</th>
            </tr>
            <tr>
              <th style={{border:'None',fontWeight:'normal'}}>State</th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>{customer_address_data.state_name}</th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>&nbsp;</th>
            </tr>
            <tr>
              <th style={{border:'None',fontWeight:'normal'}}>PIN</th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>{customer_address_data.pincode} </th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>&nbsp;</th>
            </tr>
            <tr>
              <th style={{border:'None',fontWeight:'normal'}}>Country</th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>{customer_address_data.country_name}</th>
              <th style={{border:'None',fontWeight:'normal'}} colSpan={2}>&nbsp;</th>
            </tr>
            <tr>
              <th style={{border:'None'}} colSpan={5}>&nbsp;</th>
            </tr><tr>
            </tr></tbody></table>
        <table style={{width: '80%', margin: '0% 10%'}} align="center" id="test" >
          <tbody><tr id="print"><th>Payment made Against Invoice No </th>
              <th>Invoice Amounts</th>
              <th>Payment Made</th>
              <th>TDS Amount If any</th>
              <th>Short payment If Any</th>
              <th>Payment Type</th>
              <th>Transaction Referance No</th>
            </tr>
             {
                    receipt_d_data && receipt_d_data.map((val,i)=>{

                      return(
                        <tr key={i}>
                            <td style={{fontWeight:'normal'}}>{val.ref_no}</td>
                            <td style={{fontWeight:'normal'}}>{val.invoice_amount}</td>
                            <td style={{fontWeight:'normal'}}>{val.received_amount}</td>
                            <td style={{fontWeight:'normal'}}>{val.tds_amount}</td>
                            <td>&nbsp;</td>
                            <td style={{fontWeight:'normal'}}>{paymentType[receipt_h_data.payment_id]}</td>
                            <td style={{fontWeight:'normal'}}>{receipt_h_data.transactionreferenceno}</td>
                        </tr>
                        )
                    })
              }
              
              {
                  (receipt_d_data && receipt_d_data.length===0 ) &&
                            <tr key={receipt_d_data.length}>  
                            <td style={{fontWeight:'normal'}}>&nbsp;</td>
                            <td style={{fontWeight:'normal'}}>&nbsp;</td>
                            <td style={{fontWeight:'normal'}}>&nbsp;</td>
                            <td style={{fontWeight:'normal'}}>&nbsp;</td>
                            <td tyle={{fontWeight:'normal'}}>&nbsp;</td>
                            <td style={{fontWeight:'normal'}}>{paymentType[receipt_h_data.payment_id]}</td>
                            <td style={{fontWeight:'normal'}}>{receipt_h_data.transactionreferenceno}</td>
                            </tr> 
              }
              
            <tr>
              <th style={{fontWeight:'normal'}}>Amount in words </th>
              <th colSpan={6}>{amountInWords}</th>
            </tr>
            <tr>
              <th style={{fontWeight:'normal'}}>Comments</th>
              <th colSpan={6} style={{fontWeight:'normal'}}y>{receipt_h_data.comments}</th>
            </tr>
            <tr>
              <th colSpan={7} style={{fontWeight:'normal'}}>Note:Payment received is subject to realization of funds</th>
            </tr>
          </tbody></table>
          </div>
           <div className="row">
             <div className="input-field col s12 right">
                <button type="button" onClick={(e)=>{this.showprintout()}} className="btn btn-sm btn-primary">Print</button>
                &nbsp;&nbsp;
                <button type="button" onClick={(e)=>{this.close()}}  className="btn btn-sm btn-default">Cancel</button>
                  
              </div>
          </div> 
      </div>
    )
  }



}

export default Header;


