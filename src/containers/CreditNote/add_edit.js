import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getCustomerList,getInvoiceList,update_fetch_status} from '../../actions/creditnoteActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import {validationCheck} from './../../core/validation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import CreditNoteModule from './CreditNoteModule';

const $=window.$;
class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          cust_hid:'',
          companyList:[],
          invoiceList:[],
          preloader:(this.props.params.id)?true:false,
          title:"Credit Note",
          showCreditNoteModule:false,
          invoiceno:'',
          transactionid:''         
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.showCreditNote=this.showCreditNote.bind(this);
      this.closeCreditNote=this.closeCreditNote.bind(this);
    }

     
    componentDidMount(){

     getCustomerList().then((res)=>{
           if(res.data.status===200){
            let data=res.data.data;
              this.setState({companyList:data});
            }
    
      }) 
 
    }

    getInvoiceList(id){
      getInvoiceList(id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({invoiceList:data});
          }

      })
    }
    eventHandle(e,key){      
      this.setState({[key]:e.target.value});
        if(key==="cust_hid"){
          this.getInvoiceList(e.target.value);
      }
    }
    
    showCreditNote(invoiceno,transactionid,company_name)
    {
       this.setState({showCreditNoteModule:true,invoiceno:invoiceno,transactionid:transactionid,company_name:company_name});
       $('#creditnotemodule').modal('open');
    }

   closeCreditNote(){     
      this.setState({showCreditNoteModule:false,invoiceno:'',transactionid:'',company_name:''});      
      $('#creditnotemodule').modal('close');
    }

  render() {
   
         let {cust_hid,title,preloader,companyList,invoiceList,showCreditNoteModule,invoiceno,transactionid,company_name} = this.state;
    
   let role=permissionCheck("customer");

      if(!role)
        return <Nopermission/>
        
          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content">
                    <div id="creditnotemodule" className="modal" style={{width:"85vw",height:"100vh"}}>
                          <div className="modal-content">
                                
                               {
                                 showCreditNoteModule &&
                                <CreditNoteModule closeCreditNote={this.closeCreditNote} cust_hid="{cust_hid}" invoiceno={invoiceno} transactionid={transactionid} company_name={company_name}/>
                              }

                          </div>
                    </div>
                   <div className="col s12 portlet-title"> 
                      <div className="caption">CREDIT NOTE
                      </div>
                    </div>
                     <form method="post">
                            <div className="row">
                                <div className="input-field col s6">
                                  <select className={`browser-default ${''}`} value={cust_hid}  onChange={(e)=>{this.eventHandle(e,"cust_hid")}}>
                                      <option  value=''>Select Company Name</option>
                                        {
                                          companyList && companyList.map((val,i)=>{
                                              return (<option title={i} key={i} value={val.cust_hid}>{val.company_name}</option>)
                                          })
                                        } 
                                      </select> 
                                      
                                </div>
                               
                            </div>                                        

                    <div className="row">

                                <div className="input-field col s12">
 
                                  <table className="striped ">
                                    <thead>
                                      <tr>
                                       <th>#</th>                                        
                                        <th>Invoice No</th>                                       
                                        <th>Invoice Date</th>
                                        <th>Due Date</th>
                                        <th>Total Exc Tax</th>                                      
                                        <th>Tax</th> 
                                        <th>Total Inc Tax</th>                         
                                        
                                      </tr>
                                    </thead>
                                    <tbody>

                                    {
                                       invoiceList.map((val,i)=>{

                                            return(
                                              <tr key={i}>
                                               <td>
                                                 {i+1}
                                                </td>
                                                <td>
                                                 <a onClick={(e)=>{this.showCreditNote(`${val.ref_no}`,`${val.transaction_id}`,`${val.company_name}`)}}> {val.ref_no}</a>
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
                                              
                                            </tr>)
                                    })
                                    }
                                    </tbody>
                                   
                                  </table>
                             </div> 
                             </div>
                              

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
  data: state.creditnoteReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;