import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { addServiceallocation , update_fetch_status, viewServiceallocation, servicemasterlist} from '../../actions/serviceallocationActions';
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

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          servicelist:[{value:'',list:[],selected:[]}],
          loading: false,
          customer_name:'',
          company_name:'',
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
          status:1,
          error_status:false,
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
      this.onChangetext=this.onChangetext.bind(this);
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

      servicemasterlist(this.props.params.id).then((res)=>{
         if(res.data.status===200){
            let data=res.data.data;
            this.setState({servicelist:data,preloader:false})
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
        let {customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,allocate_discount_price,status,servicelist,total_amt} =this.state;
        let errors = validate(customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,status);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        isDisabled=false;
        this.setState({preloader:true});
        if(isDisabled===false){ 
             let params={
              cust_id:1,
             employee_id:1,
              office_space_ids:'data.office_space_ids',             
               serviceList:servicelist,
                total_amt :total_amt, 
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addServiceallocation(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("customers/servicealloaction");
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
  /*onChangetext(e,i){
     this.state.servicelist[i].value=e.target.value;
     this.setState({servicelist:this.state.servicelist});
   }
   onSelectedtext(val,i){
     this.state.servicelist[i].value=val;
     this.setState({servicelist:[...this.state.servicelist,...[{value:'',list:[],businessid:'',createdby:'',createdon:'',quantitytype:'',rate:'',sc_id:'',service_category:'',servicename:'',servicetype:'',sm_id:'',status:''}]]});
   }*/

   onChangetext( e ,i) {
    this.state.servicelist[i].value=e.target.value;
    this.setState({loading:true,loader:true,servicelist:this.state.servicelist});
      axiosCancel(xhr, { debug: false});
      const requestId = 'areasuggest';
      xhr.get('/service',{params:{search_term:'',limit:10,page:1}},{requestId:requestId}).then((res)=>{
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
          this.state.servicelist[i].list=[];
          this.state.servicelist[i].value=val;
          this.state.servicelist[i].selected=list["result"];
          this.setState({loading:false,loader:false,servicelist:[...this.state.servicelist,...[{value:'',list:[],selected:[]}]]});
        }else{
          alert("Service already exist...!");
        }
  }
  onRowchange(e,val,k) { 
    this.state.servicelist[k].selected[val]=e.target.value;
    let sum=0

    this.state.servicelist.map((val,i) => {
      if(parseInt(this.state.servicelist[i].selected["qty"]) > 0 && parseInt(this.state.servicelist[i].selected["rate"]) > 0){
    		 this.state.servicelist[i].selected["amount"]=parseInt(this.state.servicelist[i].selected["qty"])*parseInt(this.state.servicelist[i].selected["rate"]);
          sum=parseFloat(parseFloat(sum)+parseFloat(this.state.servicelist[i].selected["amount"]));           
      }
     });
 

    this.setState({servicelist:this.state.servicelist,total_amt:sum});
  }
 

  render() {
    let {customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,status,servicelist,allocate_discount_price,error_status,title,preloader,value,areas,area,qty,amount,total_amt} = this.state;

    let errors = validate(customer_name,company_name,address,customer_type,discount,agreement_start_date,agreement_end_date,office_space_ids,allocate_office_price,annexure,status);
    let css= {   
          position: 'fixed',
          overflow: 'auto',
          zIndex:1,
          maxHeight: '50%',  
        };

    let role=permissionCheck("customer",title);
      if(!role)
        return <Nopermission/>
          return (
            <div className="portlet">
                  <div className="transition-item detail-page">
                   <div className="main-content">
                    <div className="talign-demo">
                      <h6 className="center-align">{title} Service Alloaction</h6> 
                    </div>
                         
                            <div className="input-field col s6">
                                Company info 
                            </div>
                            
                            <div className="input-field col s6">
                                Address
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
                                                <input type="text"  value={val.selected.service_category} placeholder="Category"/ >
                                              </td> 
                                              <td className="input-field">
                                                <input type="hidden"  className={(errors.customer_name && error_status)?'invalid':''} value={val.selected.servicetype} placeholder="Type" />
												<input type="text"   value={(val.selected.servicetype==0)?"Recurring":"One Time"} placeholder="Type" />
                                              </td>
                                              <td className="input-field">
                                                <input type="text"  className={(errors.customer_name && error_status)?'invalid':''} value={val.selected.rate} placeholder="Rate" />
                                              </td>
                                              <td className="input-field">
											    <input type="text"  onChange={(e)=>{this.onRowchange(e,"qty",i)}} className={(errors.qty && error_status)?'invalid':''} value={qty} placeholder="Qty"/>
                                              </td>
                                              <td className="input-field">
                                                <input type="text"  className={(errors.amount && error_status)?'invalid':''} value={val.selected.amount} placeholder="Total Amount"/>
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
                        
                        <br/><br/>
                           <div className="card-footer right">
                            <Link to="customers/serviceallocation" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
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