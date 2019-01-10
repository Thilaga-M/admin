import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { addServiceallocation , update_fetch_status, viewServiceallocation, servicemasterlist,viewBill,confirmBill} from '../../actions/serviceallocationActions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import browserHistory from '../../core/History';
import { Link } from 'react-router';
import Autocomplete from 'react-autocomplete';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import axiosCancel from 'axios-cancel';
import xhr from '../../core/http-call';

function validate(customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,status) { 
   //let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
   let numbers =  /^\d{10}$/;  
   let regs = /^\d+$/;   
   return {
    customer_name:customer_name.length===0,
    company_name:company_name.length===0,
    address:address.length===0,
    customer_type:customer_type.length===0,
    discount:!regs.test(discount),
    office_space_ids:office_space_ids.length===0,
    allocate_office_price:allocate_office_price.length===0,
    annexure:annexure.length===0,
    agreement_start_date: annexure.length===0,
    agreement_end_date:annexure.length===0,
    status:status.length===0, 
  };
}
var index='',cols='';
class AddEdit extends React.Component {
  constructor(props) {
    super(props);
    let bill_confirm=0;
/*    if(localStorage.getItem("allocate_id")==2){ 
      bill_confirm=1;
    }*/
        this.state={
          servicelist:[{value:'',list:[],selected:[]}],
          loading: false,
          customer_name:'',
          company_name:(localStorage.getItem("company_name")!='')?localStorage.getItem("company_name"):"",
          address:'',
          customer_type:'',
          value:'',
          discount:'',
          agreement_start_date:'',
          agreement_end_date:'',
          office_space_ids:"",
          allocate_office_price:"",
          allocate_discount_price:"",
          annexure:"", 
          area:'',
          areas:[],
          pickDate:moment().subtract(2, "days"),
          //pickDate:moment(),
          status:1,
          error_status:false,
          bill_confirm:0,
          sa_hid:(localStorage.getItem("sa_hid")!='')?localStorage.getItem("sa_hid"):0,
          bill_data:[],
          total_amt:0,
          billingDate:moment(),
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
      this.onsubmitnew=this.onsubmitnew.bind(this);      
      this.onChangetext=this.onChangetext.bind(this);
      this.handleChange=this.handleChange.bind(this);
      this.handleChangeBillDate=this.handleChangeBillDate.bind(this);
      
     // this.onSelectedtext=this.onSelectedtext.bind(this);
     }

    componentWillMount(){
      if(this.props.params.id){
       viewServiceallocation(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              customer_name:data.customer_name,
              company_name:data.company_name,
              address:data.address,
              customer_type:data.customer_type,
              discount:data.discount,
              agreement_start_date:data.agreement_start_date,
              agreement_end_date:data.agreement_end_date,
              allocate_discount_price:data.allocate_discount_price,
              office_space_ids:data.office_space_ids.split(","),
              allocate_office_price:data.allocate_office_price,
              annexure:data.annexure,
              error_status:true,
              status:1,
              preloader:false
            })
         }

       })
      }

     let sa_hid=localStorage.getItem("sa_hid");
     if(sa_hid){
        viewBill(sa_hid).then((res)=>{
            if(res.data.status===200){
                this.setState({bill_data:res.data.data});
            }
        });
      }
 
    }

 
    eventHandle(e,key){
      if(key==='discount'){
        let discount=(e.target.value)?(this.state.allocate_office_price*e.target.value)/100:0;
        let discount_price=(this.state.allocate_office_price-discount);
        this.setState({[key]:e.target.value,allocate_discount_price:discount_price});
      }else{
          this.setState({[key]:e.target.value});
      }
    }

    onsubmit(){
      let errorCount=0;
      let errorMsg="";
    this.state.servicelist.map((val,i) => {

      if(parseInt(this.state.servicelist[i].selected["amount"]) == 0 ) {
        errorMsg +="Amount should not be zero for "+this.state.servicelist[i].selected["servicename"]+"\n";
        errorCount++;
      }
      else if( this.state.servicelist[i].selected.startDate =="" || this.state.servicelist[i].selected.endDate == "")
        {
          errorMsg +="Start Date or End Date is missing for "+this.state.servicelist[i].selected["servicename"]+"\n";
          errorCount++;
        }
      
     });
       

        let {customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,allocate_discount_price,status,servicelist,total_amt,billingDate} =this.state;
        let errors = validate(customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,status);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        isDisabled=false;
         if(errorCount > 0)
        {
          isDisabled=true;
          alert(errorMsg);
        }
        this.setState({preloader:true});
        if(isDisabled===false){ 
             let params={
                cust_id:localStorage.getItem("cust_hid"),
                employee_id:localStorage.getItem("emp_id"),
                office_space_ids:localStorage.getItem("space_id"),             
                billing_type:localStorage.getItem("allocate_id"),
                billtype:localStorage.getItem("billtype"),               
                serviceList:servicelist,
                total_amt :total_amt, 
                billingDate:moment(new Date(billingDate)).format("YYYY-MM-DD"),
                status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addServiceallocation(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                    if(localStorage.getItem("allocate_id")==2){
                        localStorage.setItem("sa_hid",res.data.sa_hid);
                        localStorage.setItem("bill_confirm",this.state.bill_confirm);
                        viewBill(res.data.sa_hid).then((res)=>{

                            if(res.data.status===200){
                                this.setState({bill_confirm:1,bill_data:res.data.data,total_amt:0,preloader:false});
                            }
                        });

                    }else{
                        localStorage.setItem("sa_hid",'');
                        localStorage.setItem("bill_confirm",'');
                        browserHistory.push("customers/");
                    }
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
 
    onsubmitnew(){
          var confirmation=confirm("Do you want to continue post this bill?");
          if(confirmation == true)
          {
            confirmBill(localStorage.getItem("sa_hid")).then((res)=>{

                if( res.data.status===200 ) {
                         alert("Bill posted successfully");
                 }
              });    
          }
  }
   onChangetext( e ,i) {
    this.state.servicelist[i].value=e.target.value;
    this.setState({loading:true,loader:true,servicelist:this.state.servicelist});
      axiosCancel(xhr, { debug: false});
      const requestId = 'areasuggest';
      let allocate_id = localStorage.getItem("allocate_id");
      allocate_id=(allocate_id==2)?'':allocate_id;
      xhr.get('/service',{params:{search_term:e.target.value,limit:10,page:1,allocate_id:allocate_id,availableUnits:1}},{requestId:requestId}).then((res)=>{
        let data=res.data.result.data;
        //console.log(data);
        if(data){
            let options=[];
            data.map((val,i)=>{
               options.push({ value:val.servicename,result:val});
            })
            this.state.servicelist[i].list=options;
            this.state.servicelist[i].selected=[];
            this.setState({loading:false,loader:false,servicelist:this.state.servicelist});
          }
      }); 
   xhr.cancel(requestId);
  }

  onSelectedtext(i,val,list) { 
    let slist=this.state.servicelist;
    let isvalid = Object.keys(slist).some(x => slist[x].value==val);
     if(!isvalid){
          let totalsum=this.state.total_amt>0 ? this.state.total_amt:0;
          let allocate_id=localStorage.getItem("allocate_id")
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
          var today = yyyy+'-'+mm+'-'+dd;
          this.state.servicelist[i].list=[];
          this.state.servicelist[i].value=val;
          this.state.servicelist[i].selected=list["result"];
          this.state.servicelist[i].selected.qty=1;
          this.state.servicelist[i].selected.prorate=0;
          this.state.servicelist[i].selected.amount=this.state.servicelist[i].selected.qty*this.state.servicelist[i].selected.rate;
          this.state.servicelist[i].selected.startDate=(this.state.servicelist[i].selected["servicetype"]==1 || allocate_id==1) ? today :'';
          this.state.servicelist[i].selected.endDate=(this.state.servicelist[i].selected["servicetype"]==1  || allocate_id==1) ? today :'';
          if(this.state.servicelist[i].selected.amount>0)totalsum += this.state.servicelist[i].selected.amount;
          this.setState({loading:false,loader:false,total_amt:Math.round(totalsum),servicelist:[...this.state.servicelist,...[{value:'',list:[],selected:[]}]]});
         // console.log(this.state.total_amt);
        }else{
          alert("Service already exist...!");
        }


  }
  onRowchange(e,val,k) { 
    console.log("on row change");
    let allocate_id=localStorage.getItem("allocate_id")
    this.state.servicelist[k].selected[val]=e.target.value;
    let sum=0
    if(isNaN(this.state.servicelist[k].selected["qty"]))this.state.servicelist[k].selected["qty"]=0;
       let servicelist = this.state.servicelist.map((val,i) => {
        if(parseInt(val.selected["qty"]) > 0 && parseInt(val.selected["rate"]) > 0 && (val.selected["servicetype"]==1 || allocate_id!=2)){
             val.selected["amount"]=Math.round(parseInt(val.selected["qty"])*parseInt(val.selected["rate"]));
              sum=parseFloat(parseFloat(sum)+parseFloat(val.selected["amount"]));           
         }
        else if(val.selected["servicetype"]==0 && allocate_id==2)
        {
        let date1 = new Date(val.selected["startDate"]);
        let date2 = new Date(val.selected["endDate"]);
        let timeDiff = date2.getTime() - date1.getTime();
        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

        if(val.selected["qty"] == "" || val.selected["qty"] == 0 || val.selected["qty"] == undefined)val.selected["qty"]=parseInt(1);
            if(diffDays>0){    
              //console.log("diffDays 290"+diffDays);
              diffDays=Number(diffDays)+1;
              let totalSerivcePro=0;let daysInMonth=0;
			  let temp=0;
              for(let mon=date1.getMonth();mon<=date2.getMonth();mon++)
              {
                daysInMonth=new Date(date1.getYear(), mon+1, 0).getDate();
                if(date1.getMonth() != mon || date2.getMonth() != mon)diffDays=daysInMonth; 
                if(date1.getMonth() == mon && date2.getMonth() != mon)diffDays=daysInMonth-date1.getDate(); 
                if(date2.getMonth() == mon && date1.getMonth() != date2.getMonth())diffDays=date2.getDate();
       //        console.log(daysInMonth);
               /*if(daysInMonth==diffDays)
               {
                diffDays=Number(diffDays);
               }
               else
               {
                 diffDays=Number(diffDays)+1;
               }*/
			   if(temp==0 && date1.getMonth()!=date2.getMonth())diffDays=Number(diffDays)+1;temp=1;
               diffDays=Number(diffDays);
               
                //totalSerivcePro += (parseFloat((val.selected["rate"]/daysInMonth)*diffDays))*val.selected["qty"];
                totalSerivcePro += (parseFloat((val.selected["rate"]/daysInMonth)*diffDays))*1;
                console.log("Month="+mon,"total daysInMonth="+daysInMonth,"diffDays="+diffDays,"totalSerivcePro="+totalSerivcePro);
              }
              val.selected["prorate"]=Math.round(totalSerivcePro);
              val.selected["amount"]=Math.round(val.selected["prorate"])*parseInt(val.selected["qty"]);
              val.selected["amount"]=Math.round(parseInt(val.selected["prorate"])*parseInt(val.selected["qty"]));
              sum=parseFloat(parseFloat(sum)+parseFloat(val.selected["amount"]));
            }    
            else
            {
              alert("End Date should be greater than start date for "+val.selected["servicename"]);
              val.selected["endDate"]="";
            } 
        }  
          return val; 
      });
    this.setState({servicelist:servicelist,total_amt:Math.round(sum)});
  }

   handleChangeBillDate(date,e) {
      this.setState({
        billingDate: moment(date) 
      });
    }    

handleChange (date) {
  this.state.servicelist[index].selected[cols]=moment(new Date(date)).format("YYYY-MM-DD");
  if(this.state.servicelist[index].selected["servicetype"]==0 && this.state.servicelist[index].selected["startDate"] !="" && this.state.servicelist[index].selected["endDate"] !="")
  {
    var date1 = new Date(this.state.servicelist[index].selected["startDate"]);
    var date2 = new Date(this.state.servicelist[index].selected["endDate"]);
    var timeDiff = date2.getTime() - date1.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if(this.state.servicelist[index].selected["qty"] == "" || this.state.servicelist[index].selected["qty"] == 0 || this.state.servicelist[index].selected["qty"] == undefined)this.state.servicelist[index].selected["qty"]=parseInt(1);
    if(diffDays>0){   
      let allocate_id=localStorage.getItem("allocate_id")
      if(allocate_id==2){
      diffDays=Number(diffDays)+1;
      var totalSerivcePro=0;var daysInMonth=0;let temp=0;
      for(var mon=date1.getMonth();mon<=date2.getMonth();mon++)
      {
        
        daysInMonth=new Date(date1.getYear(), mon+1, 0).getDate();
        if(date1.getMonth() != mon || date2.getMonth() != mon)diffDays=daysInMonth; 
        if(date1.getMonth() == mon && date2.getMonth() != mon)diffDays=daysInMonth-date1.getDate(); 
        if(date2.getMonth() == mon && date1.getMonth() != date2.getMonth())diffDays=date2.getDate();
        
		 if(temp==0 && date1.getMonth()!=date2.getMonth())diffDays=Number(diffDays)+1;temp=1;
         diffDays=Number(diffDays);
            /* if()
               {
                diffDays=Number(diffDays);
               }
               else 
               {
                 diffDays=Number(diffDays);
               }*/
         
		
		
        totalSerivcePro += (parseFloat((this.state.servicelist[index].selected["rate"]/daysInMonth)*diffDays))*this.state.servicelist[index].selected["qty"];
        console.log("Month="+mon,"daysInMonth="+daysInMonth,"diffDays="+diffDays,"totalSerivcePro="+totalSerivcePro);
      }
      this.state.servicelist[index].selected["prorate"]=Math.round(totalSerivcePro);
      this.state.servicelist[index].selected["amount"]=Math.round(this.state.servicelist[index].selected["prorate"])*parseInt(this.state.servicelist[index].selected["qty"]);
    }
       
    }    
    else
    {
      alert("End Date should be greater than start date for "+this.state.servicelist[index].selected["servicename"]);
      this.state.servicelist[index].selected["endDate"]="";
    }
  }
  let totalSum=0
  this.state.servicelist.map((val,i) => {
    //console.log("Amount="+this.state.servicelist[i].selected["amount"]);
        if(parseFloat(this.state.servicelist[i].selected["amount"])>0)totalSum=parseFloat(parseFloat(totalSum)+parseFloat(this.state.servicelist[i].selected["amount"]));
  });
  this.setState({servicelist:this.state.servicelist,total_amt:Math.round(totalSum)});
  this.toggleCalendar();
}

toggleCalendar (e,col,i) {
  e && e.preventDefault()
    index=i;
    cols=col;
  let pickdate=(this.state.servicelist[index] && this.state.servicelist[index].selected[cols])?moment(this.state.servicelist[index].selected[cols]):moment();
  this.setState({isOpen: !this.state.isOpen,pickDate:pickdate})
}
 

  render() {
    let {bill_data,bill_confirm,customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,status,servicelist,allocate_discount_price,error_status,title,preloader,value,areas,area,qty,amount,total_amt} = this.state;

    let errors = validate(customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,status);
    let css= {   
          position: 'fixed',
          overflow: 'auto',
          zIndex:1,
          maxHeight: '50%',  
        };

    let role=permissionCheck("customer",title);
    let allocate_id=localStorage.getItem("allocate_id")

    let heading=(allocate_id==2)?'Volume sales':(allocate_id==0)?"Recurring":"One Time";
    let totalcgst_amt=0;
    let totalsgst_amt=0;

      if(!role)
        return <Nopermission/>
          return (
              <div className="portlet">
                  <div className="transition-item detail-page">
                   <div className="main-content">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} Service Alloaction
                      </div>
                    </div>
                        <div className="row">
                         
                            <div className="input-field col s6">
                                Company info : {company_name}
                            </div>
                            
                            <div className="input-field col s6">
                                { heading }

                                 {
                                    this.state.isOpen && (
                                        <DatePicker
                                            selected={this.state.pickDate}
                                            onChange={this.handleChange}
                                            withPortal
                                            showYearDropdown
                                            showMonthDropdown
                                            inline />
                                    )
                                }
                            </div>
                          </div>
                          <div className="row">                         
                          <div className="input-field col s4">Billing Date</div>
                            <div className="input-field col s4">  
                              <DatePicker selected={this.state.billingDate} placeholderText="End date" dateFormat="DD-MM-YYYY"  readOnly={true} className="datepicker form-control" onChange={this.handleChangeBillDate} /> 
                            </div>
                            </div>
                          { bill_confirm==0 &&
                          <div className="row">
                            <div className="input-field col s12">
 
                                  <table className="striped ">
                                    <thead className="fixed-header">
                                      <tr>
                                        <th  width="4%">Sno</th>
                                        <th>Service Name</th>
                                        <th>Category</th> 
                                        <th>From Date</th>
                                        <th>To Date</th>
                                        <th>Rate</th>
                                        <th>Qty</th> 
                                        <th>Total Amount</th> 
                                      </tr>
                                    </thead>
                                    <tbody  className="fixed-div">

                                    {
                                       servicelist.map((val,i)=>{

                                            return(
                                              <tr key={i}>
                                              <td width="4%" className="inputggg-field">
                                                {i+1} 
                                              </td>
                                              <td className="input-field">
                                                      <Autocomplete inputProps={{ className: 'input-box test' }} wrapperStyle={{display:'inline',zIndex:'102'}}
                                                      menuStyle={css}
                                                      getItemValue={(item) => item.value}
                                                      items={val.list}
                                                      renderItem={(item, isHighlighted,i) =>
                                                        <div key={item.result.sm_id} style={{ background: isHighlighted ? 'lightgray' : 'white',zIndex:'102' }}>
                                                          {item.value}
                                                        </div>
                                                      }
                                                      value={val.value}
                                                      onChange={(e) =>this.onChangetext(e,i)} 
                                                      //onSelect={(e) =>this.onSelectedtext.bind(e,val.list,i)} 
                                                       onSelect={this.onSelectedtext.bind( this,i )} 
                                                    />
                                              </td>
                                              <td className="input-field">
                                                <input type="text"  value={val.selected.service_category} placeholder="Category"/>
                                              </td> 
                                              <td className="input-field">
                                                <input type="text" dateFormat="DD/MM/YYYY"  readOnly={true} onClick={(e)=>{this.toggleCalendar(e,"startDate",i)}} value={val.selected.startDate} placeholder="Start Date" />
                                              </td>
                                              <td className="input-field">
                                                <input type="text" dateFormat="DD/MM/YYYY"  readOnly={true} onClick={(e)=>{this.toggleCalendar(e,"endDate",i)}}  value={val.selected.endDate} placeholder="End Date" />
                                              </td>
                                              <td className="input-field">
                                                <input type="text"  onChange={(e)=>{this.onRowchange(e,"rate",i)}} value={val.selected.rate} placeholder="Rate" />
                                              </td>
                                              <td className="input-field">
                                                <input type="text"  onChange={(e)=>{this.onRowchange(e,"qty",i)}} value={val.selected.qty} placeholder="Qty"/>
                                              </td>
                                              <td className="input-field">
                                                <input type="text"  value={val.selected.amount} placeholder="Total Amount"/>
                                              </td>
                        



          
                                            </tr>)
                                    })
                                    }
                                    </tbody>
                                    <thead className="fixed-header">
                                      <tr>
                                        <th   width="4%"></th>
                                        <th></th>
                                        <th></th> 
                                        <th></th>
                                        <th></th>
                                        <th>Total Amount</th> 
                                        <th> {total_amt}</th> 
                                      </tr>
                                    </thead>
                                  </table>
                             </div>
                           </div>
                         }

                         { bill_confirm==1 &&
                          <div className="row">
                            <div className="input-field col s12">
 
                                  <table className="striped ">
                                    <thead>
                                      <tr>
                                        <th  width="4%">Sno</th>
                                        <th>Service Name</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Rate</th>
                                        <th>Qty</th> 
                                        <th>Total Amount</th> 
                                      </tr>
                                    </thead>
                                    <tbody >
                                        {
                                       bill_data.map((val,i)=>{
                                        total_amt=parseInt(total_amt)+parseInt(val.amount);
                                        if(val.gst_applicable)totalcgst_amt=Math.round(parseInt(val.amount)*0.09)+totalcgst_amt;
                                        if(val.gst_applicable)totalsgst_amt=Math.round(parseInt(val.amount)*0.09)+totalsgst_amt;
                                            return(
                                              <tr key={i}>
                                              <td width="4%" className="inputggg-field">
                                                {i+1} 
                                              </td>
                                              
                                              <td className="input-field">{val.servicename}</td> 
                                              <td className="input-field">{val.start_date}</td> 
                                              <td className="input-field">{val.end_date}</td> 
                                              <td className="input-field">{val.over_ride_rate}</td> 
                                              <td className="input-field">{val.quantity}</td> 
                                              <td className="input-field">{val.amount}</td>  
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
                           </div>
                         }

                        { bill_confirm===0 &&
                          <div className="row"> 
                           <div className="card-footer right">
                            <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">{(allocate_id)?"Save & Bill":"Save"}</button>
                            &nbsp;&nbsp;
                            <Link to="customers/serviceallocation" className="btn btn-sm btn-default">Cancel</Link>
                          </div>
                          </div> 
                        }  
                        { bill_confirm===1 &&
                          <div className="row"> 
                           <div className="card-footer right">
                            <Link to="customers/serviceallocation" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
                            <button type="button" onClick={(e)=>{this.onsubmitnew()}} className="btn btn-sm btn-primary">Confirm Bill</button>
                          </div>
                          </div> 
                        }
 
                    </div> 
                     { preloader && <Preloader/> }
                  </div> 
                </div>
              )
  }
}
 
 
const mapStateToProps = (state) => ({
  data: state.customerReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const CustomerAEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default CustomerAEContainer;