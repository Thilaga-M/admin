import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchBilling, createCustomer } from '../../actions/billingActions';
import {  Nav, NavItem, NavLink, } from 'reactstrap';
import classnames from 'classnames'; 
import { Link } from 'react-router';

import Filter from './../Common/filter'; 

require("./billing.css");
 
class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        userData:[],
        showstatus:false,
        filtershow:false,
        activeTab:'1',
        params:{
                bill_status: 0,
                btype:'',
                search_term: '',
                start:  Date.now() / 1000,
                end: 0, 
                limit:20,
                offset:0 
          } 
        
    }
    this.billStatus = this.billStatus.bind(this); 
    this.fetchData = this.fetchData.bind(this); 
   }
  componentWillMount(){
    if(this.props.data.fetched===false){
        this.fetchData();
      }
  }

  billStatus(tab,bill_status,btype) {
    this.setState({filtershow:false})
   if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
    this.setState({params:{...this.state.params,bill_status,btype}})
    this.fetchData();
  }

  fetchData(){
    let self = this;
    setTimeout(()=>{
       self.props.fetchBilling(self.state.params);
     },2)
  }
 
  filterpopup(){
    this.setState({filtershow:true})
   } 
  billingfilter(data){ 
    this.setState({filtershow:false});
    let self = this;
    let search_term=data.search_term;
    let start=data.start;
    let end=data.end;
    self.setState({params:{...self.state.params,search_term,start,end}})
    this.fetchData();
  }
   render() {
    const { data  } = this.props;
       return (
             <div className="transition-item list-page">
                <div className="main-content">
                   <Nav tabs className={classnames({ billings:1 })} style={{width:'100%'}}>
                      <NavItem  className={classnames({tabsli:1 })}>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.billStatus('1','',''); }}>
                          All
                        </NavLink>
                      </NavItem>
                      <NavItem className={classnames({tabsli:1 })}>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.billStatus('2',0,''); }}>
                          Done
                        </NavLink>
                      </NavItem>
                      <NavItem className={classnames({tabsli:1 })}>
                        <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.billStatus('3',1,''); }}>
                          Saved
                        </NavLink>
                      </NavItem>
                      <NavItem className={classnames({ tabsli:1 })}>
                        <NavLink className={classnames({ active: this.state.activeTab === '4' })} onClick={() => { this.billStatus('4',0,0); }}>
                          Pending
                        </NavLink>
                      </NavItem>
                      <NavItem>
                           <i onClick={() => { this.filterpopup(12) }} className="icon-equalizer icons font-2xl d-block filter-icon"></i>
                       </NavItem>
                  </Nav> 
                 <div className="list-group">
                 {
                  data.billData.map((bill, i) => {

                    var bill_status = (bill.bill_status === 1) ? "Saved" : "Done";

                      return (<div key={i} className="billings  col-xs-4 col-lg-4 list-group-item">
                            {/*<Link to={`/customers/${bill.id}`} >*/}
                              <div className="thumbnail">
                                  <img className="group list-group-image" src="" alt=""/>
                                  <div className="caption">
                                      <h5 className="group inner list-group-item-heading">Ref :#{bill.reference_no}</h5> 
                                          <ul className="horizontal-bars">
                                                <li>
                                                    <div className="title">Customer Name</div>
                                                    <div className="bars">{bill.customer_name}</div>
                                                </li>
                                                <li>
                                                    <div className="title">Billed Amount</div>
                                                    <div className="bars">{bill.bill_amt}</div>
                                                </li>
                                                <li>
                                                    <div className="title">Paid Amount</div>
                                                    <div className="bars">{bill.paid_amt} </div>
                                                </li>
                                                <li>
                                                    <div className="title">Pending Amount</div>
                                                    <div className="bars">{bill.pending_amt}</div>
                                                </li> 
                                                <li>
                                                    <div className="title">Returned Amount</div>
                                                    <div className="bars">{bill.surplus_amt}</div>
                                                </li>
                                                <li>
                                                    <div className="title">Status</div>
                                                    <div className="bars"> { bill_status }</div>
                                                </li>
                                                <li>
                                                    <div className="title">Bill Date</div>
                                                    <div className="bars">{bill.payment_date}</div>
                                                </li>
                                          </ul>
                                   </div>
                              </div>
                           {/* </Link> */}
                      </div>)
                    })
                  } 

                  {
                    data.billData.length===0 && 
                    
                              <div className="btn btn-secondary btn-sm">
                                   No Record Found
                              </div>
                           
                   }
                  </div>
                </div> 
                 <Link to="/addbill"><span className="float">+</span> </Link>
                   <Filter  openfilter="100%" filtershow={this.state.filtershow} billingfilter={this.billingfilter.bind(this)} module="billing"/> 
            </div>
  
    )
  }
}


const mapStateToProps = (state) => ({
  data: state.billingReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchBilling, createCustomer },dispatch);
}

const BillingContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(Billing)

export default BillingContainer;