import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { addCustomer , update_fetch_status, viewCustomer, officespacelist} from '../../actions/customerActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

function validate(customer_name,company_name,address,discount,office_space_ids,allocate_office_price,annexure,status,phone,mobile,email) { 
   let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
   let numbers =  /^\d{10}$/;  
   let regs = /^\d+$/;   
   return {
    customer_name:customer_name.length===0,
    company_name:company_name.length===0,
    address:address.length===0,
    email: reg.test(email) === false,
   // customer_type:customer_type.length===0,
    discount:!regs.test(discount),
    phone:!numbers.test(phone),
    mobile:!numbers.test(mobile),
    office_space_ids:office_space_ids.length===0,
    allocate_office_price:allocate_office_price.length===0,
    annexure:annexure.length===0,
/*    agreement_start_date: annexure.length===0,
    agreement_end_date:annexure.length===0,*/
    status:status.length===0, 
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          spacelist:[],
          loading: false,
          customer_name:'',
          company_name:'',
          address:'',
          email:'',
          phone:'',
          mobile:'',
          customer_type:'',
          discount:'',
          agreement_start_date:'',
          agreement_end_date:'',
          office_space_ids:"",
          allocate_office_price:"",
          allocate_discount_price:"",
          annexure:"", 
          status:1,
          error_status:false,
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
      this.multiselect=this.multiselect.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewCustomer(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              customer_name:data.customer_name,
              company_name:data.company_name,
              address:data.address,
              email:data.email,
              mobile:data.mobile,
              phone:data.phone,
              discount:data.discount,
              //agreement_start_date:data.agreement_start_date,
              //agreement_end_date:data.agreement_end_date,
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

      officespacelist(this.props.params.id).then((res)=>{
         if(res.data.status===200){
            let data=res.data.data;
            this.setState({spacelist:data,preloader:false})
          }
      })
      //console.log(this.props.params.id);
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
        let {customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,allocate_discount_price,status,phone,mobile,email} =this.state;
        let errors = validate(customer_name,company_name,address,discount,office_space_ids,allocate_office_price,annexure,status,phone,mobile,email);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({preloader:true});
        if(isDisabled===false){ 
             let params={
              customer_name:customer_name,
              company_name:company_name,
              address:address,
              email:email,
              mobile:mobile,
              phone:phone,
              discount:discount,
              //agreement_start_date:agreement_start_date,
              //agreement_end_date:agreement_end_date,
              allocate_discount_price:allocate_discount_price,
              office_space_ids:office_space_ids.join(","),
              allocate_office_price:allocate_office_price,
              annexure:annexure,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addCustomer(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("leads/online-agreement");
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
  multiselect(e){

        //..this.setState({[key]:e.target.value});
  var options = e.target.selectedOptions;
 
 var value = [];
 var rate = 0;
 var space = 0;
  for (var i = 0, l = options.length; i < l; i++) {
      value.push(options[i].value);
      let index=options[i].title;
     rate=(rate+this.state.spacelist[index].rate); 
     space=(space+this.state.spacelist[index].area); 
  }
  let discount=(this.state.discount)?(rate*this.state.discount)/100:0;
  this.setState({office_space_ids:value , allocate_office_price:rate,allocate_discount_price:(rate-discount)});
 

  }
  render() {
    let {customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,status,spacelist,allocate_discount_price,error_status,title,preloader,phone,mobile,email} = this.state;
    let errors = validate(customer_name,company_name,address,discount,office_space_ids,allocate_office_price,annexure,status,phone,mobile,email);
    let role=permissionCheck("customer",title);
      if(!role)
        return <Nopermission/>
          return (
                <div className="portlet">
                  <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="talign-demo">
                      <h5 className="center-align">{title} Online Agreement</h5> 
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"company_name")}} className={(errors.company_name && error_status)?'invalid':''} value={company_name} />
                              <label className={(errors.company_name)?'':'active'}>Company Name</label>
                          </div>  

                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"customer_name")}} className={(errors.customer_name && error_status)?'invalid':''} value={customer_name} />
                              <label className={(errors.customer_name)?'':'active'}>Contact Name</label>
                          </div> 

                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"phone")}} className={(errors.phone && error_status)?'invalid':''} maxLength={10} value={phone} />
                              <label className={(errors.phone)?'':'active'}>Phone No</label>
                          </div> 

                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"mobile")}} className={(errors.mobile && error_status)?'invalid':''} maxLength={10} value={mobile} />
                              <label className={(errors.mobile)?'':'active'}>Mobile No</label>
                          </div> 
                          
                          <div className="input-field col s12">
                              <input type="email"  onChange={(e)=>{this.eventHandle(e,"email")}} className={(errors.email && error_status)?'invalid':''} value={email} />
                              <label className={(errors.email)?'':'active'}>Email Id</label>
                          </div> 

                          <div className="input-field col s12">
                            <textarea rows="5" onChange={(e)=>{this.eventHandle(e,"address")}} className={`materialize-textarea ${(errors.address && error_status)?'invalid':''} `} value={address} ></textarea>
                            <label  className={(errors.address)?'':'active'}>Address</label>
                          </div> 

                          {/*<div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"customer_type")}} className={(errors.customer_type && error_status)?'invalid':''} value={customer_type} />
                              <label className={(errors.customer_type)?'':'active'}>Customer Type</label>
                          </div> */}

                          <div className="input-field col s12">
                            <select className={`browser-default ${(errors.office_space_ids && error_status)?'invalid':''}`} value={office_space_ids}  onChange={(e)=>{this.multiselect(e)}} multiple={true}>
                                  {
                                    spacelist && spacelist.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.office_space_ids}>{val.cabinname}</option>)
                                    })
                                  } 
                                </select>  
                          </div> 

                          <div className="input-field col s12">
                              <input type="text"  maxLength={10}  /*onChange={(e)=>{this.eventHandle(e,"allocate_office_price")}}*/ className={(errors.allocate_office_price && error_status)?'invalid':''} value={allocate_office_price} />
                              <label className={(errors.allocate_office_price)?'':'active'}>Allocate Office Price</label>
                          </div> 

                          <div className="input-field col s12">
                              <input type="text" onChange={(e)=>{this.eventHandle(e,"discount")}} className={(errors.discount && error_status)?'invalid':''} value={discount} />
                              <label className={(errors.discount)?'':'active'}>Discount %</label>
                          </div> 

                          <div className="input-field col s12">
                              <input type="text"  /*onChange={(e)=>{this.eventHandle(e,"allocate_discount_price")}}*/  className={(errors.allocate_discount_price && error_status)?'invalid':''} value={allocate_discount_price}/>
                              <label className={(errors.allocate_discount_price)?'':'active'}>Allocate Discount Price</label>
                          </div> 

                          {/*<div className="input-field col s12">
                              <input type="text" maxLength={10} onChange={(e)=>{this.eventHandle(e,"agreement_start_date")}} className={(errors.agreement_start_date && error_status)?'invalid':''} value={agreement_start_date} />
                              <label className={(errors.agreement_start_date)?'':'active'}>Agreement Start Date</label>
                          </div>

                          <div className="input-field col s12">
                              <input type="text" maxLength={10} onChange={(e)=>{this.eventHandle(e,"agreement_end_date")}} className={(errors.agreement_end_date && error_status)?'invalid':''} value={agreement_end_date} />
                              <label className={(errors.agreement_end_date)?'':'active'}>Agreement End Date</label>
                          </div>*/}  

                          <div className="input-field col s12">
                            <textarea rows="5" onChange={(e)=>{this.eventHandle(e,"annexure")}} className={`materialize-textarea ${(errors.annexure && error_status)?'invalid':''} `} value={annexure} ></textarea>
                            <label  className={(errors.annexure)?'':'active'}>Annexure</label>
                          </div>                             

                           </div>
                          <br/><br/>
                        </form>
                          <div className="card-footer">
                            <Link to="leads/online-agreement" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
                            <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                          </div>
                          <br/> 
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