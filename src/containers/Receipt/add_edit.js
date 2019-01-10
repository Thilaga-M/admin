import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addReceipt,viewReceipt,getCustomerList,getPaymentList,getInvoiceList,update_fetch_status,addAdvance,getLedgerBankList} from '../../actions/receiptActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import {validationCheck} from './../../core/validation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import AdvanceAdjustmentModule from './AdvanceAdjustment';

const $=window.$;
var validateCols={
      cust_hid:{
          required:true,
          value:'',
          msg:'',
      },
      payment_id:{
          required:true,
          value:'',
          msg:'',
      },       
        amount_paid:{
          required:true,
          number:true,
          value:'',
          msg:'',
      },
         receipt_date:{
          required:true,
          value:'',
          msg:'',
      }, 
      comments:{
          required:false,
          value:'',
          msg:'',
      },
      deposit_to:{
        required:false,
        value:'',
        msg:''
      },
      transactionreferenceno:{
        required:false,
        value:'',
        msg:''
      }
    };

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          receiptData:'',
          cust_hid:'',
          payment_id:'',
          amount_paid:'',
          advance_amount:0,
          receipt_date:'',
          payment_date:'',
          receipt_no:'',
          companyList:[],
          paymentList:[],
          invoiceList:[],
          invoiceData:[],
          isEnabled:false,
          preloader:(this.props.params.id)?true:false,
          title:"Receipt",
          comments:'',
          deposit_to:'',
          cheque_no:'',
          cheque_date:'',
          transactionreferenceno:'',
          carryforwardbalance:'',
          receivedAdvance:'',
          ledgerList:[],
          isadvanceReceiptList:false,
          adjustmentData:''
        }
      this.eventHandle=this.eventHandle.bind(this);    
      this.handleChangeReceiptDate=this.handleChangeReceiptDate.bind(this);     
      this.handleChangePaymentDate=this.handleChangePaymentDate.bind(this);
      this.handleChangecheque_date=this.handleChangecheque_date.bind(this);
      this.approveReceipt=this.approveReceipt.bind(this);
      this.receiveAdvance=this.receiveAdvance.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
      this.onReceiveAdvance=this.onReceiveAdvance.bind(this);
      this.onRowchange=this.onRowchange.bind(this);
      this.advanceReceiptList=this.advanceReceiptList.bind(this);
      this.closeAdvanceReceiptList=this.closeAdvanceReceiptList.bind(this);
      this.calculateAdvanceAdjustment=this.calculateAdvanceAdjustment.bind(this);
    }

    receiveAdvance(e,source){
      if(source=="receivedAdvance")
      {
        
        this.state.receivedAdvance=!this.state.receivedAdvance;
        this.state.receivedAdvance=this.state.receivedAdvance?1:0;
        console.log(this.state.receivedAdvance,this.state.invoiceList);
        if(this.state.receivedAdvance == 1)
        {
          this.setState({receivedAdvance:this.state.receivedAdvance,isEnabled:false,invoiceList:[],advance_amount:0,adjustmentData:''});
        }
        else
        {
          
        this.setState({receivedAdvance:this.state.receivedAdvance,isEnabled:false,invoiceList:this.state.invoiceData});
        }
        
       }
       
    }
     approveReceipt(e,key,source){
     //console.log(e,key,source,this.state.invoiceList);
     let amount_paid=0;
     let advance_amount=0;


        if(isNaN(this.state.amount_paid))
     {
          alert("Amount received should be numeric value");
          return false; 
     }

     amount_paid=this.state.amount_paid?this.state.amount_paid:0;
     advance_amount=this.state.advance_amount?this.state.advance_amount:0;
      
      if(amount_paid <= 0 && advance_amount<=0)
      {
        alert("Enter amount received");
        return false;
      }
    
      let tempAmountReceived=parseInt(amount_paid)+parseInt(advance_amount);

      this.state.invoiceList[key][source]=!this.state.invoiceList[key][source];
      this.state.invoiceList[key][source]=this.state.invoiceList[key][source]?1:0;


       this.state.invoiceList.map((val,i)=>{
      
          if(val.verify==1)
          {

            if(tempAmountReceived>0 && val.remainingBalance<0)
          {

            if(tempAmountReceived > val.invoice_amount)
            {
              val.received_amount=val.invoice_amount
              tempAmountReceived=tempAmountReceived-val.invoice_amount;
            }
            else
            {
              val.received_amount=tempAmountReceived;
              tempAmountReceived=0;
            }
          }
          else
          {
            if(tempAmountReceived > val.remainingBalance)
            {
              val.received_amount=val.remainingBalance
              tempAmountReceived=tempAmountReceived-val.remainingBalance;
            }
            else
            {
              val.received_amount=tempAmountReceived;
              tempAmountReceived=0;  
       
            }
            if(val.received_amount==0)val.verify=0;

          }
          
        }
        else
        {
          val.received_amount=0;
        }
       // console.log(val.received_amount,val.verify);    
       });

      this.setState({"invoiceList":this.state.invoiceList});
 
      this.state.isEnabled=this.state.invoiceList.some((bill) => bill.verify);
      //this.setState({invoiceList: this.state.invoiceList,isEnabled:this.state.isEnabled});
     // console.log(this.state.invoiceList);
      if(this.state.isEnabled==true && this.state.invoiceList[key]["verify"] == 1)
      {
        if(this.state.invoiceList[key]["remainingBalance"]>0)
        {
          this.state.invoiceList[key]["received_amount"]=this.state.invoiceList[key]["received_amount"]?this.state.invoiceList[key]["received_amount"]:this.state.invoiceList[key]["remainingBalance"];
          this.state.invoiceList[key]["tds_amount"]=this.state.invoiceList[key]["tds_amount"]?this.state.invoiceList[key]["tds_amount"]:0;
        }
        else
        {
          this.state.invoiceList[key]["received_amount"]=this.state.invoiceList[key]["received_amount"]?this.state.invoiceList[key]["received_amount"]:this.state.invoiceList[key]["invoice_amount"];
        this.state.invoiceList[key]["tds_amount"]=this.state.invoiceList[key]["tds_amount"]?this.state.invoiceList[key]["tds_amount"]:0;  
        }
        this.state.invoiceList[key]["invoiceTotalReceivedAmt"]=this.state.invoiceList[key]["received_amount"]+this.state.invoiceList[key]["tds_amount"];
        
      }
      else
      {
         this.state.invoiceList[key]["received_amount"]=0;
        this.state.invoiceList[key]["tds_amount"]=0;
      }
      this.setState({"isEnabled":this.state.isEnabled,"invoiceList":this.state.invoiceList});
    }

    eventHandle(e,key){      

      if(key==="amount_paid")
      {
          this.state.invoiceList.map((val,i)=>{
              this.state.invoiceList[i]["verify"]=0;
              this.state.invoiceList[i]["received_amount"]=0;
              this.state.invoiceList[i]["tds_amount"]=0;
          });
          this.setState({invoiceList:this.state.invoiceList});
      }
      
      this.setState({[key]:e.target.value});

      if(key==="cust_hid" && this.state.receivedAdvance == 0){
          this.getInvoiceList(e.target.value);
      }

    }

    handleChangeReceiptDate(date,e) {
      this.setState({
        receipt_date: moment(date) 
      });
    }

    handleChangePaymentDate(date,e) {
      this.setState({
        payment_date: moment(date) 
      });
    }

    handleChangecheque_date(date,e) {
      this.setState({
        cheque_date: moment(date) 
      });
    }  
    
    advanceReceiptList(cust_hid)
    {      
      if(cust_hid == undefined || cust_hid == "" || cust_hid == null || cust_hid == 0)
      {
        alert("Select company name");
        return false;
      }
      this.setState({isadvanceReceiptList:true});
       $('#advanceReceiptListModule').modal('open');
    }

    closeAdvanceReceiptList(){     
      this.setState({isadvanceReceiptList:false});      
      $('#advanceReceiptListModule').modal('close');
    }

    calculateAdvanceAdjustment(data,totalAmt)
    {
      $('#advanceReceiptListModule').modal('close');
      this.setState({isadvanceReceiptList:false,adjustmentData:data,advance_amount:totalAmt});      

    }

    componentDidMount(){

     this.setState({preloader:true});

     getCustomerList().then((res)=>{
           if(res.data.status===200){
            let data=res.data.data;
              this.setState({companyList:data});
            }
    
      }) 
     getPaymentList().then((res)=>{

           if(res.data.status===200){
            let data=res.data.result.data;
              this.setState({paymentList:data});
            }
    
      }) 

     
     
     getLedgerBankList().then((res)=>{
      console.log(res);
           if(res.data.status===200){
            let data=res.data.data;
              this.setState({ledgerList:data});
            }
    
      }) 
     this.setState({preloader:false});
    }

    getInvoiceList(id){
      getInvoiceList(id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({invoiceList:data,invoiceData:data});
          }

      })
    }
    onRowchange(e,val,k) { 
    //console.log(e,val,k);
    if(val=="received_amount")this.state.invoiceList[k]["received_amount"]=e.target.value;
    if(val=="tds_amount")this.state.invoiceList[k]["tds_amount"]=e.target.value;  


    let totalreceivedamtagainstbill=0;
    totalreceivedamtagainstbill=parseInt(this.state.invoiceList[k]["received_amount"])+parseInt(this.state.invoiceList[k]["tds_amount"]);
      this.state.invoiceList[k]["invoiceTotalReceivedAmt"]=totalreceivedamtagainstbill;
    if(this.state.invoiceList[k]["remainingBalance"]>0)
    {
        if(totalreceivedamtagainstbill > this.state.invoiceList[k]["remainingBalance"])
      {
        alert("Amount paid & TDS should not be more than remaining balance amt");
        this.state.invoiceList[k]["received_amount"]=0;
        this.state.invoiceList[k]["tds_amount"]=0;      
        this.state.invoiceList[k]["invoiceTotalReceivedAmt"]=0;
      }
    } 
    else
    {
        if(totalreceivedamtagainstbill > this.state.invoiceList[k]["invoice_amount"])
      {
        alert("Amount paid & TDS should not be more than invoice amt");
        this.state.invoiceList[k]["received_amount"]=0;
        this.state.invoiceList[k]["tds_amount"]=0;      
        this.state.invoiceList[k]["invoiceTotalReceivedAmt"]=0;
      }  
    } 
    

    

    
    this.setState({invoiceList:this.state.invoiceList});
    //console.log("invoice",this.state.invoiceList);
  }
    onReceiveAdvance()
    {
      let isSubmit=false;
       if(this.state.cust_hid == 0)
       {
        alert("Select the customer");        
        return false;
       }


       if(this.state.amount_paid<=0 || this.state.amount_paid=="")
       {
        alert("Enter amount received");
        return false;
       }

       if(this.state.receipt_date.length==0)
       {
        alert("Enter receipt date");
        return false;
       }


       if(this.state.payment_id == 0)
       {
        alert("Select the payment method");
        return false;
       }
       
        if(this.state.payment_id == 2)
       {
        if(this.state.transactionreferenceno.length==0)
        {            
          alert("Enter the transaction reference no");
          return false;
        }
       }
       
        if(this.state.payment_id == 3)
       {
        if(this.state.cheque_no.length==0 || this.state.cheque_no=="")
        {            
          alert("Enter the cheque no");
          return false;
        }
        if(this.state.cheque_date.length==0 || this.state.cheque_date=="")
        {            
          alert("Enter the cheque date");
          return false;
        }
       }

       if(this.state.comments.length==0)
       {
        alert("Enter your comment");
        return false;
       }
      
       isSubmit=true;
       if(isSubmit === true)
       {
          this.setState({preloader:true});
          let {cust_hid,payment_id,amount_paid,receipt_date,payment_date,comments,receivedAdvance,deposit_to,cheque_no,cheque_date,transactionreferenceno} =this.state;

             let params={
              cust_hid:cust_hid,
              payment_id:payment_id,              
              amount_paid:amount_paid,
              receipt_date:moment(new Date(receipt_date)).format("YYYY-MM-DD"),              
              comments:comments,
              
              deposit_to:deposit_to,
              cheque_no:cheque_no,
              cheque_date:moment(new Date(cheque_date)).format("YYYY-MM-DD"),
              transactionreferenceno:transactionreferenceno
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addAdvance(params,para).then((res)=>{
              
              console.log("response",res);
                if(res.data.status===200){
                   this.setState({preloader:false});
                   this.props.update_fetch_status();                   
                   browserHistory.push("/billing/receipt");
                }
                else{
                  alert("Please enter required feilds...");
                   this.setState({error_status:true,preloader:false});
                }
            });
          }

    }

    onsubmit(){
        let {cust_hid,payment_id,amount_paid,receipt_date,payment_date,comments,receivedAdvance,deposit_to,cheque_no,cheque_date,transactionreferenceno,advance_amount,adjustmentData} =this.state;

           let isDisabled=true;
       if(this.state.cust_hid == 0)
       {
        alert("Select the customer");
        return false;
       }


       if(this.state.amount_paid<=0 || this.state.amount_paid=="")
       {
        if(this.state.advance_amount <= 0 || this.state.advance_amount == "")
        {
          alert("Enter amount received");
          return false;
        } 

       }

       if(this.state.receipt_date.length==0)
       {
        alert("Enter receipt date");
        return false;
       }


       if(this.state.payment_id == 0)
       {
        alert("Select the payment method");
        return false;
       }
       
        if(this.state.payment_id == 2)
       {
        if(this.state.transactionreferenceno.length==0)
        {            
          alert("Enter the transaction reference no");
          return false;
        }
       }

       if(this.state.payment_id == 3)
       {
        if(this.state.cheque_no.length==0 || this.state.cheque_no=="")
        {            
          alert("Enter the cheque no");
          return false;
        }
        if(this.state.cheque_date.length==0 || this.state.cheque_date=="")
        {            
          alert("Enter the cheque date");
          return false;
        }
       }
       
       if(this.state.comments.length==0)
       {
        alert("Enter your comment");
        return false;
       }

        let invoiceList=this.state.invoiceList;
        let tempinvoiceList=this.state.invoiceList;
         let errorMsg="Please enter amount for below invoice"+"\n";
         invoiceList.map((val,i)=>{
         
          if(val.invoiceTotalReceivedAmt === 0 && val.verify === 1)
          {
               errorMsg+=" - "+val.ref_no+"\n";      
               
          }
        });

         console.log("validation status=",invoiceList);
        invoiceList = invoiceList.filter((bill) => (bill.verify === 1 && bill.invoiceTotalReceivedAmt === 0) );
        console.log("Final validation status=",invoiceList);
        if(invoiceList.length>0)
          {
            alert(errorMsg);       
            return false;
          }
          else
          {
            invoiceList = tempinvoiceList.filter((bill) => (bill.verify === 1 && bill.invoiceTotalReceivedAmt > 0));
            isDisabled=false;
          }
        console.log("Filter",invoiceList);
         let tempReceivedAmt=0;  
         invoiceList.map((val,i)=>{
          tempReceivedAmt += parseInt(val.received_amount) + parseInt(val.tds_amount);
        });

         let totalpaid=parseInt(amount_paid)+parseInt(advance_amount);

        if(totalpaid > tempReceivedAmt)
        {
          let receiptConfirm=confirm("Click OK to receive the excess amount (INR "+(parseInt(totalpaid)-parseInt(tempReceivedAmt))+") as advance or click cancel to adjust against bill?");
          
          if(receiptConfirm==false)
            {
              isDisabled=true;
              return false;
            }
        }
       //let errors= validationCheck(validateCols);
       
        //isDisabled = Object.keys(errors).some(x =>errors[x].msg);
        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              cust_hid:cust_hid,
              payment_id:payment_id,              
              amount_paid:amount_paid,
              receipt_date:moment(new Date(receipt_date)).format("YYYY-MM-DD"),
              payment_date:moment(new Date(payment_date)).format("YYYY-MM-DD"),
              receiptlist:invoiceList,
              comments:comments,
              deposit_to:deposit_to,
              cheque_no:cheque_no,
              cheque_date:cheque_date,
              transactionreferenceno:transactionreferenceno,
              advance_amount:advance_amount,
              adjustmentData:adjustmentData

            }
            console.log("params",params);
           
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addReceipt(params,para).then((res)=>{
                if(res.data.status===200){
                   this.setState({preloader:false});
                   this.props.update_fetch_status();                   
                   browserHistory.push("/billing/receipt");
                }
                else{
                  alert("Please enter required feilds...");
                   this.setState({error_status:true,preloader:false});
                }
            });
        }else{
           this.setState({error_status:true,preloader:false});
        }
    }
  

  render() {
   
         let {cust_hid,payment_id,error_status,title,preloader,receiptData,receipt_date,payment_date,receipt_no,amount_paid,companyList,paymentList,invoiceList,isEnabled,comments,deposit_to,cheque_date,cheque_no,transactionreferenceno,carryforwardbalance,receivedAdvance,ledgerList,advance_amount,isadvanceReceiptList,adjustmentData} = this.state;
    
   let role=permissionCheck("customer");

      if(!role)
        return <Nopermission/>
        validateCols.cust_hid.value=cust_hid;
        validateCols.payment_id.value=payment_id;
        
        validateCols.amount_paid.value=amount_paid;
        validateCols.receipt_date.value=receipt_date;
        validateCols.comments.value=comments;
        validateCols.deposit_to.value=deposit_to;
        validateCols.transactionreferenceno.value=transactionreferenceno;

        let errors= validationCheck(validateCols);
  
          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div id="advanceReceiptListModule" className="modal" style={{width:"85vw",height:"100vh"}}>
                          <div className="modal-content">
                                
                               {
                                 isadvanceReceiptList &&
                                <AdvanceAdjustmentModule closeAdvanceReceiptList={this.closeAdvanceReceiptList} calculateAdvanceAdjustment={this.calculateAdvanceAdjustment} cust_hid={cust_hid}/>
                              }

                          </div>
                    </div>

                   <div className="main-content">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">RECEIPT
                      </div>
                    </div>
                     <form method="post" encType="multipart/form-data">
                            <div className="row">
                                <div className="input-field col s3">
                                  <select className={`browser-default ${(errors.cust_hid.msg && error_status)?'invalid':''}`} value={cust_hid}  onChange={(e)=>{this.eventHandle(e,"cust_hid")}}>
                                      <option  value=''>Select Company Name</option>
                                        {
                                          companyList && companyList.map((val,i)=>{
                                              return (<option title={i} key={i} value={val.cust_hid}>{val.company_name}</option>)
                                          })
                                        } 
                                      </select> 
                                      {(errors.cust_hid.msg && error_status) ? (<div className="validation-error">{errors.cust_hid.msg}</div>):('')}  
                                </div>

                                <div className="input-field col s3">
                                  <DatePicker selected={receipt_date} dateFormat="DD/MM/YYYY"  readOnly={true} className="datepicker form-control" onChange={this.handleChangeReceiptDate} /> 
                                    <label  className={(errors.receipt_date.msg)?'':'active'}>Receipt Date</label> 
                                  {(errors.receipt_date.msg && error_status) ? (<div className="validation-error">{errors.receipt_date.msg}</div>):('')}
                                </div>
                                <div className="input-field col s3">
                                  <DatePicker selected={payment_date} dateFormat="DD/MM/YYYY"  readOnly={true} className="datepicker form-control" onChange={this.handleChangePaymentDate} /> 
                                    <label className={''}>Payment Date</label>                                   
                                </div>
                            </div>

                            <div className="row">
                                <div className="input-field col s3">
                                     <select className={`browser-default ${(errors.payment_id.msg && error_status)?'invalid':''}`} value={payment_id}  onChange={(e)=>{this.eventHandle(e,"payment_id")}}>
                                      <option  value=''>Select Payment Method</option>
                                        {
                                          paymentList && paymentList.map((val,i)=>{
                                              return (<option title={i} key={i} value={val.payment_id}>{val.payment_mode}</option>)
                                          })
                                        } 
                                      </select> 
                                      {(errors.payment_id.msg && error_status) ? (<div className="validation-error">{errors.payment_id.msg}</div>):('')}  
                                </div>
                              <div className="input-field col s3">        
                                 <input type="text" value={amount_paid} onChange={(e)=>{this.eventHandle(e,"amount_paid")}}/>
                                   <label>Amount Received</label> 
                              </div>  
                              <div className="input-field col s3">        
                                 <input type="checkbox"  className="filled-in" checked={(receivedAdvance)?true:false} value="{receivedAdvance}"/><label  onClick={(e)=>{this.receiveAdvance(e,"receivedAdvance")}} htmlFor="inline-checkbox1">Advance Received</label>
                              </div>                              
                            </div>

                            { (payment_id==3) &&
                              <div className="row">
                                  <div className="input-field col s3">
                                    <input type="text" value={cheque_no} onChange={(e)=>{this.eventHandle(e,"cheque_no")}}/>
                                   <label>Cheque No</label>   
                                  </div>

                                  <div className="input-field col s6">                                      
                                  <DatePicker selected={cheque_date} dateFormat="DD/MM/YYYY"  readOnly={true} className="datepicker form-control" onChange={this.handleChangecheque_date} /> 
                                    <label>Cheque Date</label> 
                                  </div>                                 
                                  
                              </div>
                            }


                            <div className="row">                             
                                                           

                             
                                  <div className="input-field col s3">
                                     <select className={`browser-default ${(errors.deposit_to.msg && error_status)?'invalid':''}`} value={deposit_to}  onChange={(e)=>{this.eventHandle(e,"deposit_to")}}>
                                      <option  value=''>Deposit To</option>
                                        {
                                         ledgerList && ledgerList.map((val,i)=>{
                                              return (<option title={i} key={i} value={val.ledgerid}>{val.ledgername}</option>)
                                          })
                                        } 
                                      </select> 
                                      {(errors.deposit_to.msg && error_status) ? (<div className="validation-error">{errors.deposit_to.msg}</div>):('')}  
                                </div>
                           

                                { (payment_id==2) && <div className="input-field col s6">
                                    <input type="text" value={transactionreferenceno} onChange={(e)=>{this.eventHandle(e,"transactionreferenceno")}}/>
                                   <label>Transaction Refernce No</label>   
                                  </div>
                                }

                            </div>


                            

                             <div className="row">
                                
                                <div className="input-field col s3">
                                  <textarea onChange={(e)=>{this.eventHandle(e,"comments")}} className={(errors.comments.msg && error_status)?'materialize-textarea invalid':'materialize-textarea'} value={comments}/>
                                  <label  className={(errors.comments.msg)?'':'active'}>Comment</label>
                                  {(errors.comments.msg && error_status) ? (<div className="validation-error">{errors.comments.msg}</div>):('')}  
                                  
                                </div>
                               { (!receivedAdvance) && <div>
                                <div className="input-field col s3">   
                                  Advance Amount : {advance_amount}

                                   <input type="hidden" value={carryforwardbalance} onChange={(e)=>{this.eventHandle(e,"carryforwardbalance")}} readOnly={true}/>
                                     <label></label> 
                                  </div>   
                                  <div className="input-field col s3">
                                  
                                  <span onClick={(e)=>{this.advanceReceiptList(cust_hid)}} ><i className="material-icons dp48 invalid" >find_in_page</i></span>
                                  </div>
                                  </div>
                                }

                            </div>

                    

                    <div className="row">

                                <div className="input-field col s12">
 
                                  <table className="striped ">
                                    <thead className="fixed-header">
                                      <tr>
                                        <th>Verify</th>
                                        <th>Invoice No</th>
                                        <th>Received Paid Amount</th>
                                        <th>Received TDS Amount</th>
                                        <th>Balance Amount</th>
                                        <th>Invoice Date</th>
                                        <th>Due Date</th>
                                        <th>Total Exc Tax</th>                                      
                                        <th>Tax</th> 
                                        <th>Total Inc Tax</th> 
                                        <th>Amount Paid</th>
                                        <th>TDS if any</th>
                                        
                                      </tr>
                                    </thead>
                                    <tbody  className="fixed-div">

                                    {
                                       invoiceList.map((val,i)=>{

                                            return(
                                              <tr key={i}>
                                               <td>
                                                 <input type="checkbox"  className="filled-in" checked={(val.verify)?true:false} value="{val.verify}"/><label  onClick={(e)=>{this.approveReceipt(e,i,"verify")}} htmlFor="inline-checkbox1"></label>
                                                </td>
                                                <td>
                                                 {val.ref_no}
                                                </td>
                                                <td>
                                                 {val.receiptReceivedPaidAmt}
                                                </td>
                                                 <td>
                                                 {val.receiptReceivedTDSAmt}
                                                </td>
                                                 <td>
                                                 {val.remainingBalance}
                                                </td>
                                              <td>
                                                 {val.bill_date}
                                              </td>
                                              <td>
                                                 {val.due_date}
                                              </td> 
                                              <td>
                                                 {val.invoice_amount-val.tax_amount}
                                              </td>
                                              <td>
                                                 {val.tax_amount}
                                              </td> 
                                               <td>
                                                 {val.invoice_amount}
                                              </td> 
                                              <td>
                                                <input type="text" onChange={(e)=>{this.onRowchange(e,"received_amount",i)}} value={val.received_amount} placeholder="Amount Paid"/>
                                              </td>
                                              <td>
                                                <input type="text" onChange={(e)=>{this.onRowchange(e,"tds_amount",i)}} value={val.tds_amount} placeholder="TDS Paid"/>
                                              </td> 
                                            </tr>)
                                    })
                                    }
                                    </tbody>
                                   
                                  </table>
                             </div> 
                             </div>
                              {isEnabled && <div className="row">
                             <div className="input-field col s12" style={{textAlign:'center'}}>
                                <button type="button" onClick={(e)=>{this.onsubmit()}}  className="btn btn-sm btn-danger">Save</button>&nbsp;&nbsp;                               
                              </div>
                        </div>
                        } 

                        {receivedAdvance && <div className="row">
                             <div className="input-field col s12" style={{textAlign:'center'}}>
                                <button type="button" onClick={(e)=>{this.onReceiveAdvance()}}  className="btn btn-sm btn-danger">Receive Advance</button>
                              </div>
                        </div>
                        }
                             </form>
                    <br/>
                     { preloader && <Preloader/> }
                  </div> 
                  </div>
              </div>
                )      
  
  }
}
 
 
const mapStateToProps = (state) => ({
  data: state.creditreceiptReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;