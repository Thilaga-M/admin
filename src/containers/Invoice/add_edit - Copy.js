import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { update_fetch_status, viewInvoice } from '../../actions/invoiceActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';


class AddEdit extends React.Component {
  constructor(props) {
    super(props);
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!

      var yyyy = today.getFullYear();
      if(dd<10){
          dd='0'+dd;
      } 
      if(mm<10){
          mm='0'+mm;
      } 
      
      
        this.state={
          loading: false,
          invoiceData:'',
          serviceData:'',
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New",
          total_amt:0,
          cgst_amt:0,
          sgst_amt:0,
          igst_amt:0,
          gst_status:0,
          todayDate:dd+'-'+mm+'-'+yyyy
        }
      this.eventHandle=this.eventHandle.bind(this);
       this.onprintnow=this.onprintnow.bind(this);

       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    dateFormat(dateInput)
    {
      var dateArr=dateInput.split("-");
      return dateArr[2]+"-"+dateArr[1]+"-"+dateArr[0];

    }

    componentWillMount(){
      if(this.props.params.id){
       viewInvoice(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
          
            this.setState({
              invoiceData:data,
              serviceData:res.data.serviceList,          
              gst_status:res.data.gst_status,
              attention_off:res.data.attention_off,          
               preloader:false,
               total_amt:0,
               cgst_amt:0,
               sgst_amt:0,
               igst_amt:0
            })
         }

       })
      }
    }

 
    eventHandle(e,key){
      this.setState({[key]:e.target.value});
    }

    onprintnow(){
                let {invoiceData,serviceData,total_amt,cgst_amt,sgst_amt,igst_amt,todayDate,attention_off} = this.state;
                let nettotal_one_amt=0;
                let nettotal_rec_amt=0;
                //var printableContent=document.getElementById("printableContent").outerHTML;
                var mywindow = window.open('', 'INVOICE', 'height=400,width=600');
                let printableContent1 = `<html><body><table style='width: 800px; margin: 0 auto; border-collapse: collapse; font-family: arial;' cellspacing='0' cellpadding='0'><tr><td style='border-right: none;' width='60%'><img src='../../../images/hq10logo.png' alt='Logo' /></td><td style='font-size:28px; font-weight: 600; padding:30px 5px; border-left: none;' width='40%' >Tax Invoice</td></tr><tr><td width='60%'><table width='100%' style='font-size: 14px;'><tr style='-webkit-print-color-adjust: exact;background-color:#bfbfbf;'><td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold;' colspan='2'>Client address details</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>Company Name :</td><td width='50%'>&nbsp;${invoiceData.company_name}</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>Attention Of :</td><td width='50%'>&nbsp;${attention_off}</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>Address 1</td><td width='50%'>&nbsp;${invoiceData.address1 ? invoiceData.address1 : "-"}</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>Address 2</td><td width='50%'>&nbsp;${invoiceData.address2 ?invoiceData.address2 : "-" }</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>City</td><td width='50%'>&nbsp;${invoiceData.city ? invoiceData.city : "-"}</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>State</td><td width='50%'>&nbsp;${invoiceData.state ? invoiceData.state : "-"}</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>Pin</td><td width='50%'>&nbsp;${invoiceData.pincode ? invoiceData.pincode : "-"}</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>Country</td><td width='50%'>&nbsp;${invoiceData.country ? invoiceData.country : "-"}</td></tr></table></td><td width='40%' style='vertical-align: top;'><table width='100%' style='font-size: 14px;'><tr style='-webkit-print-color-adjust: exact;background-color:#bfbfbf;'><td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold;'>Invoice Number</td><td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold;'>Date</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>&nbsp;${invoiceData.ref_no ? invoiceData.ref_no : "-"}</td><td width='50%'>${this.dateFormat(invoiceData.bill_date)}</td></tr><tr style='-webkit-print-color-adjust: exact;background-color:#bfbfbf;'><td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold;'>Invoice Details</td><td style='background-color: #bfbfbf; color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;'></td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>Client Account No.</td><td width='50%'>${invoiceData.customer_account_no ? invoiceData.customer_account_no : "-"}</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>Payment Due Date</td><td width='50%'>${invoiceData.due_date ? invoiceData.due_date : "-"}</td></tr><tr><td style='color: #000; font-size: 14px;text-align: left; padding: 5px;' width='50%'>Client GST Details</td><td width='50%'>${invoiceData.customer_gst ? invoiceData.customer_gst : "-"}</td></tr></table></td></tr></table><table style='width: 800px; margin: 0 auto; border-collapse: collapse; font-family: arial;' cellspacing='0' cellpadding='0' border='1px solid #ccc'><tr style='-webkit-print-color-adjust: exact;background-color:#bfbfbf;'><td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold;'>Description of Charges</td><td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold; text-align: center;'>From Date</td><td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold; text-align: center;'>To Date</td><td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold; text-align: center;'>Qty</td><td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold; text-align: center;'>Rate</td><td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold; text-align: center;'>Total</td></tr>`;

                

                let printableContent2=``;

                if(serviceData.hasOwnProperty("recurring") && serviceData["recurring"])
                  {
                    printableContent2 +=`<tr><td colspan="7" style='color: #000;font-weight: bold;font-size: 14px;border:0px'>One Off Charges Incurred:-</td></tr>`;
                  }

                serviceData.hasOwnProperty("recurring") && serviceData["recurring"].map((val,i)=>{
                  total_amt=parseInt(total_amt)+parseInt(val.total_amount);
                  nettotal_rec_amt=parseInt(nettotal_rec_amt)+parseInt(val.total_amount);
                  
                  if(val.gst_applicable>0)cgst_amt=cgst_amt+val.cgst;
                  if(val.gst_applicable>0)sgst_amt=sgst_amt+val.sgst; 

                 printableContent2 +=`<tr style='font-size: 14px;'><td style='color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;'>&nbsp;&nbsp;${val.servicename}</td><td style='text-align: center;border:0px;padding:5px;'>&nbsp;${this.dateFormat(val.start_date)}</td><td style='text-align: center;border:0px;padding:5px;'>&nbsp;${this.dateFormat(val.end_date)}</td><td style='text-align: center;border:0px;padding:5px;'>&nbsp;${val.quantity}</td><td style='text-align: center;border:0px;padding:5px;'>&nbsp;${val.rate}</td><td style='text-align: right;border:0px;padding:5px;border-right:1px solid black;'>&nbsp;${val.total_amount}</td></tr>`; 

                                            
                })

           if(serviceData.hasOwnProperty("recurring") && serviceData["recurring"])
              {
                 printableContent2 +=`<tr style='font-size: 14px;font-weight: bold;border:0px'>
                <td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'>Total Recurring Charges</td>
                <td style='color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'></td>
                <td style='color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'></td>
                <td style='color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'></td>
                <td style='color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'></td>                
                <td style='color: #000; font-size: 14px;text-align: right; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black;border-right:1px solid black;'>${nettotal_rec_amt}</td>
                </tr>
                `;
              }
                 if(serviceData.hasOwnProperty("onetime") && serviceData["onetime"])
                  {
                    printableContent2 +=`<tr><td colspan="7" style='color: #000; font-size: 14px;border:0px;font-weight:bold;'>One Off Charges Incurred:-</td></tr>`;
                  }
                  
                 
                 serviceData.hasOwnProperty("onetime") && serviceData["onetime"].map((val,i)=>{
                  total_amt=parseInt(total_amt)+parseInt(val.total_amount);
                  nettotal_one_amt=parseInt(nettotal_one_amt)+parseInt(val.total_amount);
                  
                  if(val.gst_applicable>0)cgst_amt=cgst_amt+val.cgst;
                  if(val.gst_applicable>0)sgst_amt=sgst_amt+val.sgst;  

                    printableContent2 +=`<tr style='font-size: 14px;'><td style='color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;'>&nbsp;&nbsp;${val.servicename}</td><td style='text-align: center;border:0px;padding:5px;'>&nbsp;${this.dateFormat(val.start_date)}</td><td style='text-align: center;border:0px;padding:5px;'>&nbsp;${this.dateFormat(val.end_date)}</td><td style='text-align: center;border:0px;padding:5px;'>&nbsp;${val.quantity}</td><td style='text-align: center;border:0px;padding:5px;'>&nbsp;${val.rate}</td><td style='text-align: right;border:0px;border-right:1px solid black;padding:5px;'>&nbsp;${val.total_amount}</td></tr>`; 
                })
              
           
            printableContent2 +=`<tr style='font-size: 14px;font-weight: bold;border:0px'>
                <td style='font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'>Total One Off Charges</td>
                <td style='color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'></td>
                <td style='color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'></td>
                <td style='color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'></td>
                <td style='color: #000; font-size: 14px;text-align: left; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'></td>
                <td style='color: #000; font-size: 14px;text-align: right; padding: 5px; font-weight: bold;border:0px;border-right:1px solid black;border-bottom:1px solid black'>${nettotal_one_amt}</td>
                </tr>
               `;



             printableContent2 +=`<tr>
              <td colspan="7" style=width:100%; padding: 12; background-color:#fff'> </td></tr>
            <tr>
              <td colspan="5" style='color: #000; font-size: 14px;border:0px'>Total Charges
              </td>
              <td style='color: #000; font-size: 14px;text-align: right; padding: 5px; font-weight: bold;border:0px;border-bottom:1px solid black'>${total_amt}</td>
                </tr></tbody></table>`;


                let printableContent3=`<table cellspacing='0' cellpadding='0' style='width: 800px; margin: 20px auto 0px; border-collapse: collapse; font-family: arial; font-size: 14px;'><tr><td width='40%' style='border: 1px;'>&nbsp;</td><td width='60%' style='border: 1px'><table cellspacing='0' cellpadding='0'><tr width='100%''><td width='50%'' style='border: 1px solid black; color: rgb(0, 0, 0); font-size: 14px; text-align: left; padding: 5px; font-weight: bold;'>Total (Excluding GST)</td><td width='50%' style='border: 1px solid black; text-align: right; padding: 5px;font-weight: bold;'>${total_amt}</td></tr><tr width="100%"><td width="50%" style="border: 1px solid black; color: rgb(0, 0, 0); font-size: 14px; text-align: left; padding: 5px; font-weight: bold;">CGST 9%</td><td width="50%" style="border: 1px solid black; text-align: right; padding: 5px;font-weight: bold;">${Math.round(cgst_amt)}</td></tr><tr width="100%"><td width="50%" style="border: 1px solid black; color: rgb(0, 0, 0); font-size: 14px; text-align: left; padding: 5px; font-weight: bold;">SGST 9%</td><td width="50%" style="border: 1px solid black; text-align: right; padding: 5px;font-weight: bold;">${Math.round(sgst_amt)}</td></tr><tr><td width="50%" style="-webkit-print-color-adjust: exact;background-color:#bfbfbf;border: 1px solid black; color: rgb(0, 0, 0); font-size: 14px; text-align: left; padding: 5px; font-weight: bold;">Total (inc. CGST, IGST, SGST as applicable)</td><td width="50%" style="border: 1px solid black; text-align: right; padding: 5px;font-weight: bold;">${Math.round(total_amt+(cgst_amt*2))}</td></tr></table></td></tr></table><br><br><table style='width:800,margin:0 auto,borderCollapse:collapse,font-family:arial,marginTop:200;'><tr><td style='font-size: 9px; position: fixed;left: 0;bottom: 0;width: 100%;color: #000;text-align: center;'>This is a computer generated invoice<br/>PAN No: AACCN5152H; GST No: 33AACCN5152H1ZP; Accounting code of Services: 997212, <br>CIN No: U45201TN2007PLC062662, <br>Place of rendering services: 4th Floor, Bristol IT Park, Plot No.10, Thiruvika Industrial Estate, Guindy, Chennai - 600 032. Ph.No: 044-4004 0600, State Code: 33, Maximum TDS to be with - held is 10% for Rent (exclusive of GST) and 2% for services, Radiance Realty Developers India Limited, No.480. Anna Salai, Khivraj Complex-II, 6th Floor, Nandanam, Chennai – 600 035. <br>Fax #:+91 44 4004 0666</td></tr></table>`;  

                var footerContent="<div style='page-break-before:always;'><center><h3>WAYS TO PAY YOUR INVOICE</h3></center></div><table style='width:100%,margin:0 auto,border-collapse:collapse,font-family:arial,margin-top:200;border:1px solid black;'><tbody><tr><td width='40%' style='font-weight:bold;'>Cheque in favour of</td><td width='60%'>Radiance Realty Developers India Ltd</td></tr><tr><td width='40%' style='font-weight:bold;'>Demand draft in favour of</td><td width='60%'>Radiance Realty Developers India Ltd</td></tr><tr><td width='40%' style='font-weight:bold;'>By Bank Transfer:</td><td width='60%'></td></tr><tr><td width='40%' style='font-weight:bold;'>Account Name:</td><td width='60%'>Radiance Realty Developers India Ltd</td></tr><tr><td width='40%' style='font-weight:bold;'>Account No.</td><td width='60%'>916020060866431</td></tr><tr><td width='40%' style='font-weight:bold;'>IFSC Code</td><td width='60%'>UTIB0000006</td></tr><tr><td width='40%' style='font-weight:bold;'>Account Type</td><td width='60%'>Current Account</td></tr><tr><td width='40%' style='font-weight:bold;'>Name of the Bank</td><td width='60%'>Axis Bank Ltd</td></tr><tr><td width='40%' style='font-weight:bold;'>Address & Branch Details</td><td width='60%'>No.82.Dr.Radhakrishnan Salai, Mylapore Chennai - 600 004</td></tr><tr><td width='100%' colspan='2' ><b>IMPORTANT INFORMATION:</b> Please provide your Invoice Number as a payee reference on all payments made.</td></tr></tbody></table><div><center><h3>Understanding your invoice</h3></center></div><table style='width:100%,margin:0 auto,borderCollapse:collapse,fontFamily:arial,marginTop:200;border:1px solid black;'><tbody><tr><td width='40%' style='font-weight:bold;'>Invoice Terms</td><td width='60%'>&nbsp;</td></tr><tr><td width='40%' style='font-weight:bold;'>Credits:</td><td width='60%'>Credits that were issued against a particular charge for which you have been invoiced for in a previous period.</td></tr><tr><td width='40%' style='font-weight:bold;'>Invoice:</td><td width='60%'>The invoice shows a summary of all charges (recurring and one-off) related to the invoice period.</td></tr><tr><td width='40%' style='font-weight:bold;'>Late payment fees:</td><td width='60%'>Fees levied against your account because payment was not received by the expected payment due date. Please speak with your center team or refer to the service provider code for the date by which your account becomes overdue. </td></tr><tr><td width='40%' style='font-weight:bold;'>One-Off Charges Incurred:</td><td width='60%'>Variable and/or one-off charges related to a specific invoicing period.</td></tr><tr><td width='40%' style='font-weight:bold;'>Payment Due:</td><td width='60%'>The latest date on which the invoice needs to be paid. Please note that any outstanding balances shown in the account summary will be due for immediate payment.</td></tr><tr><td width='40%' style='font-weight:bold;'>Recurring Charges:</td><td width='60%'>These are fixed monthly charges, invoiced in advance.</td></tr></tbody></table><br/><table style='width:100%,margin:0,border-collapse:collapse,font-family:arial,margin-top:200;border:1px solid black;'><tbody><tr><td colspan='2' style='font-weight:bold;'>You have any questions, contact your Center directly. We are here to help.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr><tr><td width='40%' style='font-weight:bold;'>Your Center Team Email Address: </td><td width='60%' style='font-weight:bold;'>chennai.bristol@hq10.in</td></tr><tr><td width='40%' style='font-weight:bold;'>Your Center Team Telephone:</td><td width='60%' style='font-weight:bold;'>91 44 4004 0600&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr></table>";
                mywindow.document.write('<html><head><title>' + document.title  + '</title>');
                mywindow.document.write('</head><body >');
                mywindow.document.write(printableContent1+printableContent2+printableContent3+footerContent);
                mywindow.document.write('</body></html>');
                mywindow.document.close(); // necessary for IE >= 10
                mywindow.focus(); // necessary for IE >= 10*/
                mywindow.print();
                mywindow.close();
                return true;
        }

  render() {
    let {invoiceData,serviceData,error_status,title,preloader,total_amt,cgst_amt,sgst_amt,igst_amt,todayDate,gst_status,attention_off} = this.state;

    let total_rec_amt=0; 
    let total_one_amt=0; 

    let role=permissionCheck("gst",title);
      if(!role)
        return <Nopermission/>
      let errors="";
    //let errors = validate(tax_name,rate,status);
  
          return (
            <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content">
                     
                   

                      <div id="printableContent">
        <table style={{width: 800, margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'arial'}} cellSpacing={0} cellPadding={0}>
          <tbody><tr>
              <td style={{border: 'none'}} width="60%">
                <img src="../../../images/hq10logo.png" alt="Logo" />
              </td>
              <td style={{fontSize: 28, fontWeight: 600, padding: '30px 5px', border: 'none'}} width="40%">
                Tax Invoice
              </td>
            </tr>
            <tr>
              <td width="60%" style={{border: 'none'}}>
             
                <table width="100%" style={{fontSize: 14}}>
                  <tbody><tr>
                      <td style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}} colSpan={2}>Client address details
                      </td>
                    </tr>
                    <tr>
                      <td style={{border:'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">Company Name :</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.company_name}</td>
                    </tr>
                    <tr>
                      <td style={{border:'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">Attention Of :</td>
                      <td width="50%" style={{border: 'none'}}>{attention_off ? attention_off : "-"}</td>
                    </tr>
                    <tr>
                      <td style={{border:'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">Address 1</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.address1 ? invoiceData.address1 : "-" }</td>
                    </tr>
                    <tr>
                      <td style={{border:'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">Address 2</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.address2 ? invoiceData.address2 : "-"}</td>
                    </tr>
                    <tr>
                      <td style={{border:'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">City</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.city ? invoiceData.city : "-"}</td>
                    </tr>
                    <tr>
                      <td style={{border:'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">State</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.state ? invoiceData.state : "-"}</td>
                    </tr>
                    <tr>
                      <td style={{border:'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">Pin</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.pincode ? invoiceData.pincode : "-"}</td>
                    </tr>
                    <tr>
                      <td style={{border:'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">Country</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.country ? invoiceData.country : "-"}</td>
                    </tr>
                  </tbody></table>  
              </td>
              <td width="40%" style={{verticalAlign: 'top',border:'none'}}>
                <table width="100%" style={{fontSize: 14}}>
                  <tbody><tr>
                      <td style={{border: 'none',backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>Invoice Number</td>
                      <td style={{border: 'none',backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>Date</td>
                    </tr>
                    <tr>
                      <td style={{border: 'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">{invoiceData.ref_no}</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.bill_date}</td>
                    </tr>
                    <tr>
                      <td style={{border: 'none',backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>Invoice Details</td>
                      <td style={{border: 'none',backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}></td>
                    </tr>
                    <tr>
                      <td style={{border: 'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">Client Account No.</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.customer_account_no ? invoiceData.customer_account_no : "-"}</td>
                    </tr>
                    <tr>
                      <td style={{border: 'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">Payment Due Date</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.due_date ? invoiceData.due_date : "-"}</td>
                    </tr>
                    <tr>
                      <td style={{border: 'none',color: '#000', fontSize: 14, textAlign: 'left', padding: 5}} width="50%">Client GST Details</td>
                      <td width="50%" style={{border: 'none'}}>{invoiceData.customer_gst ? invoiceData.customer_gst : "-"}</td>
                    </tr>
                  </tbody></table>
              </td>
            </tr>
          </tbody></table>
        <table style={{width: 800, margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'arial',border:'1px solid #ccc'}} cellSpacing={0} cellPadding={0}>
          <tbody>

          <tr>
              <td style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>Description of Charges</td>
              <td style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5, fontWeight: 'bold'}}>From Date</td>
              <td style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5, fontWeight: 'bold'}}>To Date</td>
              <td style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5, fontWeight: 'bold'}}>Qty</td>
              <td colSpan="2" style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5, fontWeight: 'bold'}}>Rate</td>
              <td style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'center', padding: 5, fontWeight: 'bold'}}>Total</td>
            </tr>
            <tr>
                <td style={{fontSize: 14,fontWeight: 'bold',border:'0px'}} >Standing Charges:-</td>
             </tr>

              {

                serviceData.hasOwnProperty("recurring") && serviceData["recurring"].map((val,i)=>{
                  total_amt=parseInt(total_amt)+parseInt(val.total_amount);
                  total_rec_amt=parseInt(total_rec_amt)+parseInt(val.total_amount);
                
                  if(val.gst_applicable>0)cgst_amt=cgst_amt+val.cgst;
                  if(val.gst_applicable>0)sgst_amt=sgst_amt+val.sgst; 
                  
                  return(
                         <tr key={i} style={{fontSize: 14}}>
                          <td style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5,border:'0px'}}>&nbsp;&nbsp; {val.servicename}</td>
                          <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}>{this.dateFormat(val.start_date)}</td>
                          <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}>{this.dateFormat(val.end_date)}</td>
                          <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}>{val.quantity}</td>
                           <td colSpan="2" style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}>{val.rate}</td>
                          
                          <td style={{color: '#000', fontSize: 14, textAlign: 'right',border:'0px'}}>{val.total_amount}</td>
                        </tr>
                      )
                })

              }
            <tr style={{fontSize: 14,fontWeight: 'bold',border:'0px',borderBottom:"1px solid #CCC"}} >
                <td style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5,border:'0px'}}>Total Recurring Charges</td>
                <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}></td>
                <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}></td>
                <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}></td>
                <td cellSpacing="0" colSpan="2" style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}></td>
                
                <td style={{color: '#000', fontSize: 14, textAlign: 'right',border:'0px'}}>{total_rec_amt}</td>
            </tr>

            <tr>
                <td style={{fontSize: 14,fontWeight: 'bold',border:'0px'}} >One Off Charges Incurred:-</td>
            </tr>

            {
                 serviceData.hasOwnProperty("onetime") && serviceData["onetime"].map((val,i)=>{
                  total_amt=parseInt(total_amt)+parseInt(val.total_amount);
                  total_one_amt=parseInt(total_one_amt)+parseInt(val.total_amount);
                  if(val.gst_applicable>0)cgst_amt=cgst_amt+val.cgst;
                  if(val.gst_applicable>0)sgst_amt=sgst_amt+val.sgst;
                  if(val.gst_applicable>0)igst_amt=igst_amt+val.igst; 
                  return(
                         <tr key={i} style={{fontSize: 14}}>
                          <td style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5,border:'0px'}}>&nbsp;&nbsp;{val.servicename}</td>
                          <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}>{this.dateFormat(val.start_date)}</td>
                          <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}>{this.dateFormat(val.end_date)}</td>
                          <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}>{val.quantity}</td>
                          <td colSpan="2" style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}>{val.rate}</td>
                          
                          <td style={{color: '#000', fontSize: 14, textAlign: 'right',border:'0px'}}>{val.total_amount}</td>
                        </tr>
                      )
                })
              }
             <tr style={{fontSize: 14,fontWeight: 'bold'}} >
                <td style={{color: '#000', fontSize: 14, textAlign: 'left', padding: 5,border:'0px'}}>Total One Off Charges</td>
                <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}></td>
                <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}></td>
                <td style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}></td>
                <td colSpan="2" style={{color: '#000', fontSize: 14, textAlign: 'center',border:'0px'}}></td>
                
                <td style={{color: '#000', fontSize: 14, textAlign: 'right',border:'0px'}}>{total_one_amt}</td>
            </tr>

            <tr>
              <td colSpan={7} style={{width: '100%', padding: 12, backgroundColor: '#fff'}}> </td>
            </tr>
            <tr>
              <td colSpan={6} style={{backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>Total Charges
              </td>
              <td style={{borderBottom:'1px solid #red', backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'right', padding: 5, fontWeight: 'bold'}}>{total_amt}
              </td>
            </tr>
          </tbody></table>
        <table style={{width: '800', margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'arial', fontSize: 14, marginTop: 20}} cellSpacing={0} cellPadding={0}>
          <tbody><tr>
          <td width="40%" style={{border: 'none'}}></td>
          <td width="60%" style={{border: 'none'}}>
          <tr width="100%">
              <td width="50%" style={{ border:'1px solid black',color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>Total (Excluding GST)</td>
              <td width="50%" style={{ border:'1px solid black',textAlign: 'right', padding: 5,fontWeight: 'bold'}}>{Math.round(total_amt)}</td>
            </tr>
            {
                gst_status==1 &&
                 <tr width="100%">
                    <td width="50%" style={{ border:'1px solid black',color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>IGST 18%</td>
                    <td width="50%" style={{ border:'1px solid black',textAlign: 'right', padding: 5,fontWeight: 'bold'}}>{Math.round(cgst_amt+sgst_amt)}</td>
                </tr>

            }
            {
                gst_status==0 &&
                 <tr width="100%">
                    <td width="50%" style={{ border:'1px solid black',color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>CGST 9%</td>
                    <td width="50%" style={{ border:'1px solid black',textAlign: 'right', padding: 5,fontWeight: 'bold'}}>{Math.round(cgst_amt)}</td>
                </tr>
            }
            {
                gst_status==0 &&
                 <tr width="100%">
                    <td width="50%" style={{ border:'1px solid black',color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>SGST 9%</td>
                    <td width="50%" style={{ border:'1px solid black',textAlign: 'right', padding: 5,fontWeight: 'bold'}}>{Math.round(sgst_amt)}</td>
                </tr>
            }
            <tr width="100%">
              <td width="50%" style={{ border:'1px solid black',backgroundColor: '#bfbfbf', color: '#000', fontSize: 14, textAlign: 'left', padding: 5, fontWeight: 'bold'}}>Total (inc. CGST, IGST, SGST as applicable)</td>
              <td width="50%" style={{ border:'1px solid black',textAlign: 'right', padding: 5,fontWeight: 'bold'}}>{Math.round(total_amt+(cgst_amt*2))}</td>
            </tr>
            </td>
            </tr>
          </tbody></table>
        <table style={{width: 800, margin: '0 auto', borderCollapse: 'collapse', fontFamily: 'arial', marginTop: 100}}  border={0}>
          <tbody><tr><td style={{fontSize: 8, textAlign: 'center', color: '#000',border:'0px'}}>This is a computer generated invoice<br/>PAN No: AACCN5152H; GST No: 33AACCN5152H1ZP; Accounting code of Services: 997212, CIN No: U45201TN2007PLC062662, Place of rendering services: 4th Floor, Bristol IT Park, Plot No.10, Thiruvika Industrial Estate, Guindy, Chennai - 600 032. Ph.No: 044-4004 0600, State Code: 33, Maximum TDS to be with - held is 10% for Rent (exclusive of GST) and 2% for services, Radiance Realty Developers India Limited, No.480. Anna Salai, Khivraj Complex-II, 6th Floor, Nandanam, Chennai – 600 035. Fax #:+91 44 4004 0666</td></tr></tbody></table>
      </div>
 
                    </div> 
                     {  
                         <div className="row"> 
                           <div className="card-footer center">
                            <Link to="customers/serviceallocation" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
                            <button type="button" onClick={(e)=>{this.onprintnow()}} className="btn btn-sm btn-primary">Print Bill</button>
                            </div>
                         </div> 
                        }
                    <br/>
                     { preloader && <Preloader/> }
                  </div> 
                </div>
              )
  }
}
 
 
const mapStateToProps = (state) => ({
  data: state.invoiceReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;