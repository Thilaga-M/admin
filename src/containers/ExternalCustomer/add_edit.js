import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addExternalCustomer , update_fetch_status, viewExternalCustomer } from '../../actions/externalCustomerActions';
import { getCountryList,getStateList,getCityList,getPincodeList} from '../../actions/pincodeActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
  
function validate(company_name,contact_number,contact_name,emailid,gst_no,address1,address2,country,state,city,pincode) {
   return {
    company_name:company_name.length===0, 
    contact_number:contact_number.length===0,
    contact_name:contact_name.length===0,
    emailid:emailid.length===0,
    gst_no:gst_no.length===0,
    address1:address1.length===0,
    address2:address2.length===0,
    country:country.length===0,
    state:state.length===0,
    city:city.length===0,
    pincode:pincode.length===0
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          company_name:'',
          contact_number:'',
          contact_name:'',
          emailid:'',
          gst_no:'',
          address1:'',
          address2:'',
          country:'',countryall:[],state:'',stateall:[],city:'',cityall:[],pincode:'', 
          error_status:false,
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewExternalCustomer(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
          this.getCityLists(data.state);
          this.getStateLists(data.country);
            this.setState({
              company_name:data.company_name,
              contact_number:data.contact_number,
              contact_name:data.contact_name,
              emailid:data.emailid,
              gst_no:data.gst_no,
              address1:data.address1,
              address2:data.address2,
              country:data.country,
              state:data.state,
              city:data.city,
              pincode:data.pincode,
              error_status:true,
              preloader:false,
            })
         }

       })
      }

      getCountryList().then((res)=>{
        if(res.data.status===200){
         let data=res.data.data;
           this.setState({countryall:data});
         }
 
      }) 

    }

    getStateLists(id){
      getStateList(id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({stateall:data});
          }
  
      })
    }
    
    getCityLists(id){
      getCityList(id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({cityall:data});
          }
  
      })
    }
  
    eventHandle(e,key){

      if(key==="country"){
        this.getStateLists(e.target.value);
      }else if(key==="state"){
        this.getCityLists(e.target.value);
      }

      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {company_name,contact_number,contact_name,emailid,gst_no,address1,address2,country,state,city,pincode} =this.state;
        let errors = validate(company_name,contact_number,contact_name,emailid,gst_no,address1,address2,country,state,city,pincode);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
         this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              company_name:company_name,
              contact_number:contact_number,
              contact_name:contact_name,
              emailid:emailid,
              gst_no:gst_no,
              address1:address1,
              address2:address2,
              country:country,
              state:state,
              city:city,
              pincode:pincode
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addExternalCustomer(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("customers/client-setting/externalcustomer");
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
    let {company_name,contact_number,contact_name,emailid,gst_no,address1,address2,country,state,city,pincode,error_status,title,preloader,stateall,cityall,countryall} = this.state;

    let role=permissionCheck("customer",title);
      if(!role)
        return <Nopermission/>
    let errors = validate(company_name,contact_number,contact_name,emailid,gst_no,address1,address2,country,state,city,pincode);
  
          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div>

                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} EXTERNAL CUSTOMER
                      </div>
                    </div>
                         
                    <form method="post">
                      <div className="row">
                        <div className="input-field col s4">
                            <input type="text"  onChange={(e)=>{this.eventHandle(e,"company_name")}} className={(errors.company_name && error_status)?'invalid':''} value={company_name} />
                            <label className={(errors.company_name)?'':'active'}>Company Name</label>
                        </div> 
                        <div className="input-field col s4">
                            <input type="text"  onChange={(e)=>{this.eventHandle(e,"contact_name")}} className={(errors.contact_name && error_status)?'invalid':''} value={contact_name} />
                            <label className={(errors.contact_name)?'':'active'}>Contact Name</label>
                        </div> 
                        <div className="input-field col s4">
                            <input type="text"  onChange={(e)=>{this.eventHandle(e,"contact_number")}} className={(errors.contact_number && error_status)?'invalid':''} value={contact_number} />
                            <label className={(errors.contact_number)?'':'active'}>Contact Number</label>
                        </div> 
                      </div>
                      <div className="row">
                        <div className="input-field col s4">
                            <input type="text"  onChange={(e)=>{this.eventHandle(e,"emailid")}} className={(errors.emailid && error_status)?'invalid':''} value={emailid} />
                            <label className={(errors.emailid)?'':'active'}>Email</label>
                        </div> 
                        <div className="input-field col s4">
                            <input type="text"  onChange={(e)=>{this.eventHandle(e,"gst_no")}} className={(errors.gst_no && error_status)?'invalid':''} value={gst_no} />
                            <label className={(errors.gst_no)?'':'active'}>GST No</label>
                        </div>
                        <div className="input-field col s4">
                              <textarea  onChange={(e)=>{this.eventHandle(e,"address1")}} className={(errors.address1 && error_status)?'invalid':''} value={address1} />
                              <label className={(errors.address1)?'':'active'}>Address1</label>
                        </div>   
                      </div>
                      <div className="row">
                        <div className="input-field col s4">
                            <textarea  onChange={(e)=>{this.eventHandle(e,"address2")}} className={(errors.address2 && error_status)?'invalid':''} value={address2} />
                            <label className={(errors.address2)?'':'active'}>Address2</label>
                        </div>
                        <div className="input-field col s4">
                                <select className={`browser-default ${(errors.country && error_status)?'invalid':''}`} value={country} onChange={(e)=>{this.eventHandle(e,"country")}} >
                                        <option  value=''>Select Country</option>
                                          {
                                            countryall && countryall.map((val,i)=>{
                                                return (<option title={i} key={i} value={val.country_id}>{val.country_name}</option>)
                                            })
                                          } 
                                  </select> 
                                  {(errors.country && error_status) ? (<div className="validation-error">{errors.country}</div>):('')}
                        </div>
                        <div className="input-field col s4">
                            <select className={`browser-default ${(errors.state && error_status)?'invalid':''}`} value={state} onChange={(e)=>{this.eventHandle(e,"state")}} >
                                  <option  value=''>Select State</option>
                                    {
                                      stateall && stateall.map((val,i)=>{
                                          return (<option title={i} key={i} value={val.state_id}>{val.state_name}</option>)
                                      })
                                    } 
                            </select> 
                            {(errors.state && error_status) ? (<div className="validation-error">{errors.state}</div>):('')}
                         </div>        
                    </div>
                    <div className="row">
                      <div className="input-field col s4">
                            <select className={`browser-default ${(errors.city && error_status)?'invalid':''}`} value={city} onChange={(e)=>{this.eventHandle(e,"city")}} >
                                  <option  value=''>Select City</option>
                                    {
                                      cityall && cityall.map((val,i)=>{
                                          return (<option title={i} key={i} value={val.city_id}>{val.city_name}</option>)
                                      })
                                    } 
                            </select> 
                            {(errors.city && error_status) ? (<div className="validation-error">{errors.city}</div>):('')}
                      </div>
                      <div className="input-field col s4">
                          <input type="text" onChange={(e)=>{this.eventHandle(e,"pincode")}} className={(errors.pincode && error_status)?'invalid':''} maxLength={15} value={pincode}/>
                          <label htmlFor="text-input" className={(errors.pincode)?'':'active'}>Pincode</label>
                      </div>

                   </div>   
                     </form>
                     <br/>
                   <div className="card-footer">
                    <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>&nbsp;&nbsp;
                    <Link to="customers/client-setting/externalcustomer" className="btn btn-sm btn-default">Cancel</Link>
                  </div>
              </div> 
              <br/>
              { preloader && <Preloader/> }
            </div> 
          </div> 
              )
  }
}
 
 
const mapStateToProps = (state) => ({
  data: state.externalcustomerReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const ExternalCustomerContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default ExternalCustomerContainer;