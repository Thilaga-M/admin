import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import { viewCustomer } from '../../actions/customersActions';

require("./customer.css");
  
class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state={
       userData:[],
       showstatus:false,
        activeTab: '1'
    }
    this.toggle = this.toggle.bind(this);
   }

  componentWillMount(){
     this.props.viewCustomer(this.props.params.custid);
  }

   toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
 
  render() {
    const { customer  } = this.props;
          return (
                 <div className="transition-item detail-page">

                 <Link  className="navbar-toggler mobile-sidebar-toggler hidden-lg-up" to="/customers">Back</Link>
 
                 <div className="col-md-6 mb-2">
                      <Nav tabs>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                          > Summary
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                          >
                            Invoice
                          </NavLink>
                        </NavItem> 
                      </Nav>
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                           {customer.first_name}
                        </TabPane>
                        <TabPane tabId="2">
                           {customer.mobile}
                           
                        </TabPane> 
                      </TabContent>
                </div>
              </div> )
  }
}


const mapStateToProps = (state) => ({
  customer: state.customersReducer.customer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ viewCustomer },dispatch);
}

const CustomerDetailContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(CustomerDetail)

export default CustomerDetailContainer;