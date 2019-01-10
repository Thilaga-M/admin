import React, { Component } from 'react';
import {  Link } from 'react-router';
import browserHistory from './../../core/History';
import Autocomplete from 'react-autocomplete';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { leadSoucre ,officeType,viewLeads } from '../../actions/leadsActions';


const $=window.$;
function validate(first_name,company_name,emailid,lds_id,contact_number,lead_status) { 
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    let regs = /^\d+$/;
    let numbers =  /^\d{10}$/;    
   return { 
    first_name:first_name.length===0, 
    company_name:company_name.length===0,
    emailid:reg.test(emailid) === false,
    lds_id:lds_id.length===0,
    contact_number: !numbers.test(contact_number),  
    lead_status:lead_status.length===0, 
  };
}


class Header extends Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          first_name:'',
          last_name:'',
          company_name:'',
          office_type:'',
          lead_source:'',
          emailid:'',
          lds_id:'',
          otm_id:'',
          lds_data:[],
          type_data:[],
          contact_number:'', 
          error_status:false,
          preloader:false,
          lead_status:1,
          title:"Edit"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
      this.close_lead=this.close_lead.bind(this);
      this.handleChange=this.handleChange.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

     componentWillMount(){
      if(this.props.leadid){
       viewLeads(this.props.leadid).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              first_name:data.first_name,
              last_name:data.last_name,
              company_name:data.company_name,
              emailid:data.emailid,
              lds_id:data.lds_id,
              otm_id:data.otm_id,
              office_type:data.office_type,
              lead_source:data.lead_source,
              picker_date:'',//data.lead_date,
              contact_number:data.contact_number, 
              error_status:true, 
              lead_status:data.lead_status,
              preloader:false
            })
         }

       })
      }
       leadSoucre().then((res)=>{
         if(res.data.status===200){
          let data=res.data.result.data;
            this.setState({lds_data:data});
          }
  
       }) 

       officeType().then((res)=>{
         if(res.data.status===200){
          let data=res.data.result.data;
            this.setState({type_data:data});
          }
  
       })

     }
   eventHandle(e,key,val){
    if(key==="otm_id"){
            let office_type=e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
            this.setState({otm_id:e.target.value,office_type:office_type});
      }else{
          this.setState({[key]:(key==='status')?val:e.target.value});
      } 
    }

  handleChange(date) {
     this.setState({
      picker_date: date,
      lead_date:Date.parse(date)  / 1000 
    });
  }

    onsubmit(){
        let {first_name,office_type,last_name,company_name,emailid,lds_id,otm_id,contact_number,lead_source,requirement,lead_date,comments,lead_status} =this.state;
        let errors = validate(first_name,company_name,emailid,lds_id,contact_number,lead_status);
        this.setState({preloader:true});
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        if(isDisabled===false){
             let params={
              first_name:first_name,
              last_name:last_name,
              company_name:company_name,
              office_type:office_type,
              lead_source:lead_source,
              requirement:requirement,
              lead_date:lead_date,
              comments:comments,
              lead_status:lead_status,
              emailid:emailid,
              otm_id:otm_id,
              lds_id:lds_id,
              contact_number:contact_number, 
              lead_status:lead_status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            /*enquiry(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/leads/leads");
                }
                else{
                  alert("Please enter required feilds...");
                   this.setState({error_status:true,preloader:false});
                }
            });*/
        }else{
          this.setState({error_status:true,preloader:false}); 
        }
    }
  close_lead(){
    this.props.close_lead();
  }
  render() {

    console.log(this.state);
 

 let leadstatus=["New","Hot","Cold","Won","Lost"];
    let {customer_name,state_id,stateall,city_id,cityall,pincode,servicelist,countryall,country_id,first_name,last_name,company_name,emailid,lds_id,contact_number,title,error_status,preloader,lds_data,otm_id,type_data,office_type,lead_source,requirement,lead_date,comments,lead_status,picker_date} = this.state;
 
 
    let errors = validate(first_name,company_name,emailid,lds_id,contact_number,lead_status);
 let css= {   
          position: 'fixed',
          overflow: 'auto',
          zIndex:1,
          maxHeight: '50%',  
        };
      return(

        <div className="transition-item detail-page">
               <div className="main-content div-center ">

                      <div className="talign-demo">
                        <h5 className="center-align">Agreement</h5> 
                      </div> 
                            <form method="post" encType="multipart/form-data">
                              <div className="row">


                                <div className="input-field col s4">
                                  <input type="text" onChange={(e)=>{this.eventHandle(e,"first_name")}} className={(errors.first_name && error_status)?'invalid':''} value={first_name} />
                                  <label htmlFor="text-input" className={(errors.first_name)?'':'active'}>Reference No</label>
                                </div>

                                <div className="input-field col s4">
                                  <DatePicker selected={picker_date} placeholderText="From Date" dateFormat="DD/MM/YYYY"  readOnly={true} className="datepicker form-control" onChange={this.handleChange} />
                                  <label htmlFor="text-input" className={(errors.lead_date)?'':'active'}>Agreement Date</label>
                                </div>

                                <div className="input-field col s4">
                                  <input type="text" onChange={(e)=>{this.eventHandle(e,"first_name")}} className={(errors.first_name && error_status)?'invalid':''} value={first_name} />
                                  <label htmlFor="text-input" className={(errors.first_name)?'':'active'}>First Name</label>
                                </div>

                                <div className="input-field col s4">
                                  <input type="text" onChange={(e)=>{this.eventHandle(e,"last_name")}} className={(errors.last_name && error_status)?'invalid':''} value={last_name} />
                                  <label htmlFor="text-input" className={(errors.last_name)?'':'active'}>Last Name</label>
                                </div>

                                <div className="input-field col s4">
                                  <input type="text"  onChange={(e)=>{this.eventHandle(e,"company_name")}} className={(errors.company_name && error_status)?'invalid':''} value={company_name} />
                                  <label htmlFor="textarea-input" className={(errors.company_name)?'':'active'}>Comapny Name</label>
                                </div> 

                                <div className="input-field col s4">
                                  <input type="text" onChange={(e)=>{this.eventHandle(e,"emailid")}} className={(errors.emailid && error_status)?'invalid':''} value={emailid}/>
                                  <label htmlFor="text-input" className={(errors.emailid)?'':'active'}>Email ID</label>
                                </div> 

                                <div className="input-field col s4">
                                  <input type="text" onChange={(e)=>{this.eventHandle(e,"contact_number")}} className={(errors.contact_number && error_status)?'invalid':''} maxLength={10} value={contact_number}/>
                                  <label htmlFor="text-input" className={(errors.contact_number)?'':'active'}>contact_number Number</label>
                                </div> 

                                <div className="input-field col s4">
                                  <select className={`browser-default ${(errors.country_id.msg && error_status)?'invalid':''}`} value={country_id} onChange={(e)=>{this.eventHandle(e,"country_id")}} >
                                          <option  value=''>Select Country</option>
                                            {
                                              countryall && countryall.map((val,i)=>{
                                                  return (<option title={i} key={i} value={val.country_id}>{val.country_name}</option>)
                                              })
                                            } 
                                    </select> 
                                    {(errors.country_id.msg && error_status) ? (<div className="validation-error">{errors.country_id.msg}</div>):('')}
                                 </div>

                                <div className="input-field col s4">
                                    <select className={`browser-default ${(errors.state_id.msg && error_status)?'invalid':''}`} value={state_id} onChange={(e)=>{this.eventHandle(e,"state_id")}} >
                                          <option  value=''>Select State</option>
                                            {
                                              stateall && stateall.map((val,i)=>{
                                                  return (<option title={i} key={i} value={val.state_id}>{val.state_name}</option>)
                                              })
                                            } 
                                    </select> 
                                    {(errors.state_id.msg && error_status) ? (<div className="validation-error">{errors.state_id.msg}</div>):('')}
                                </div> 

                                <div className="input-field col s4">
                                    <select className={`browser-default ${(errors.city_id.msg && error_status)?'invalid':''}`} value={city_id} onChange={(e)=>{this.eventHandle(e,"city_id")}} >
                                          <option  value=''>Select City</option>
                                            {
                                              cityall && cityall.map((val,i)=>{
                                                  return (<option title={i} key={i} value={val.city_id}>{val.city_name}</option>)
                                              })
                                            } 
                                    </select> 
                                    {(errors.city_id.msg && error_status) ? (<div className="validation-error">{errors.city_id.msg}</div>):('')}
                                </div> 

                                <div className="input-field col s4">
                                    <select className={`browser-default ${(errors.pincode.msg && error_status)?'invalid':''}`} value={pincode} onChange={(e)=>{this.eventHandle(e,"pincode")}} >
                                          <option  value=''>Select City</option>
                                            {
                                              cityall && cityall.map((val,i)=>{
                                                  return (<option title={i} key={i} value={val.pincode}>{val.city_name}</option>)
                                              })
                                            } 
                                    </select> 
                                    {(errors.pincode.msg && error_status) ? (<div className="validation-error">{errors.pincode.msg}</div>):('')}
                                </div> 


                                <div className="input-field col s6">
                                   <select className={`browser-default ${(errors.otm_id && error_status)?'invalid':''}`} value={otm_id}  onChange={(e)=>{this.eventHandle(e,"otm_id")}}>
                                      <option  value=''>Select Office Type</option>
                                        {
                                          type_data && type_data.map((val,i)=>{
                                              return (<option title={i} key={i} value={val.otm_id}>{val.officetype}</option>)
                                          })
                                        } 
                                      </select>   
                                </div>  

                                <div className="input-field col s12">
 
                                  <table className="striped ">
                                    <thead className="fixed-header">
                                      <tr>
                                        <th  width="4%">Sno</th>
                                        <th>Service Name</th>
                                        <th>Category</th> 
                                        <th>Type</th>
                                        <th>Rate</th>
                                        <th>Total GST Amount</th> 
                                        <th>Total Amount</th> 
                                      </tr>
                                    </thead>
                                    <tbody  className="fixed-div">

                                    {
                                       servicelist.map((val,i)=>{

                                            return(
                                              <tr>
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
                                                <input type="text"  onChange={(e)=>{this.eventHandle(e,"customer_name")}} className={(errors.customer_name && error_status)?'invalid':''} value={val.selected.service_category} placeholder="Category"/>
                                              </td> 
                                              <td className="input-field">
                                                <input type="text"  onChange={(e)=>{this.eventHandle(e,"customer_name")}} className={(errors.customer_name && error_status)?'invalid':''} value={customer_name} placeholder="Type"/>
                                              </td>
                                              <td className="input-field">
                                                <input type="text"  onChange={(e)=>{this.eventHandle(e,"customer_name")}} className={(errors.customer_name && error_status)?'invalid':''} value={val.selected.rate} placeholder="Rate"/>
                                              </td>
                                              <td className="input-field">
                                                <input type="text"  onChange={(e)=>{this.eventHandle(e,"customer_name")}} className={(errors.customer_name && error_status)?'invalid':''} value={customer_name} placeholder="Total GST Amount"/>
                                              </td>
                                              <td className="input-field">
                                                <input type="text"  onChange={(e)=>{this.eventHandle(e,"customer_name")}} className={(errors.customer_name && error_status)?'invalid':''} value={customer_name} placeholder="Total Amount"/>
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
                                        <th>Total GST Amount</th> 
                                        <th>Total Amount</th> 
                                      </tr>
                                    </thead>
                                  </table>
                             </div>






                                <div className="input-field col s6">
                                  <DatePicker selected={picker_date} placeholderText="From Date" dateFormat="DD/MM/YYYY"  readOnly={true} className="datepicker form-control" onChange={this.handleChange} />
                                  <label htmlFor="text-input" className={(errors.lead_date)?'':'active'}>Follow Up Date</label>
                                </div> 
 
                                <div className="input-field col s6"> 
                                  <textarea onChange={(e)=>{this.eventHandle(e,"requirement")}} className={(errors.requirement && error_status)?'materialize-textarea invalid':'materialize-textarea'}>{requirement}</textarea>
                                  <label htmlFor="text-input" className={(errors.requirement)?'':'active'}>Requirement</label>
                                </div> 

                                <div className="input-field col s6"> 
                                  <textarea onChange={(e)=>{this.eventHandle(e,"comments")}} className={(errors.comments && error_status)?'materialize-textarea invalid':'materialize-textarea'}>{comments}</textarea>
                                  <label htmlFor="text-input" className={(errors.comments)?'':'active'}>Comments</label>
                                </div> 
 
                                
                   
                                <div className="input-field col s6">
                                   <select className={`browser-default ${(errors.lead_status && error_status)?'invalid':''}`} value={lead_status}  onChange={(e)=>{this.eventHandle(e,"lead_status")}}>
                                      <option  value=''>Select Source</option>
                                        {
                                          leadstatus && leadstatus.map((val,i)=>{
                                              return (<option title={i} key={i} value={i}>{val}</option>)
                                          })
                                        } 
                                      </select>   
                                </div>  
                              </div>

                             <div className="input-field col s12 right">
                                <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                                <button type="button" onClick={(e)=>{this.close_lead()}}  className="btn-sm btn-default">Cancel</button>&nbsp;&nbsp;
                                
                            </div>
                            <br/><br/><br/> 
                            </form>
     
            </div> 
          </div>
  
        )
  }



}

export default Header;


