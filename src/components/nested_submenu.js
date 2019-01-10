import React from "react";
import { Link } from "react-router";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { permissionCheck } from "./../core/permission";
import http from "./../core/http-call";
import fetchInvoice from "./../actions/invoiceActions";
import { render } from "react-dom";
import CountUp from "react-countup";
import Tabs from "react-simpletabs";

var param = require("jquery-param");
var classNames = require('classnames');

class NestedSubmenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        month: "04",
        year: "2018",
        search_term: "",
        startDate: "",
        endDate: "",
        limit: process.perpage,
        page: 1,
        activeTab: '1'
      },
      data: [],
      preloader: true
    };
    this.fetch_invoice = this.fetch_invoice.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {

  }

toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  fetch_invoice() {
    let self = this;
    setTimeout(() => {
      debugger;
      self.props.fetchInvoice(self.state.params).then(() => {
        self.setState({ preloader: false });
      });
    }, 2);
  }

  render() {
    let { data } = this.state;
    // let path=this.props.params.path;
    let pathname = this.props.location.pathname;
    return (
      <div>
        <Tabs style={{overflowY: 'inherit'}}>
          <Tabs.Panel title='PROFORMA'>
              {permissionCheck("leads") && (
                <Link
                  to="/billing/proforma-billing-action/"
                  className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_grey tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        local_atm
                      </i>
                    </div>
                    Proforma Billing
                  </div>
                </Link>
              )}
              {permissionCheck("gst") && (
                <Link to="/billing/proformabill-reporting" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_red tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      call_to_action
                    </i>
                  </div>
                  Proforma Invoice
                  </div>
                </Link>
              )}
          </Tabs.Panel>
          <Tabs.Panel title='BILLING'>
             {permissionCheck("leads") && (
                <Link to="/billing/group-billing" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      group_work
                    </i>
                  </div>
                  Group Billing
                  </div>
                </Link>
              )}

              {permissionCheck("customer") && (
                <Link to="/billing/externalcustomer" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      local_atm
                    </i>
                  </div>
                  External Billing
                  </div>
                </Link>
              )}
               {permissionCheck("gst") && (
                <Link to="/billing/bill-reporting" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_d_blue tile">
                    <i className="large material-icons d-blk tile_d-blk">
                       layers
                    </i>
                  </div>
                  Invoice
                  </div>
                </Link>
              )}
          </Tabs.Panel>
          <Tabs.Panel title='RECEIPT'>
            {permissionCheck("leads") && (
              <Link to="/billing/receipt" className="text-white">
                <div className="col l2 m2 s12 center blk">
                <div className="col l2 m2 s12 center invntry_blk_violet tile">
                  <i className="large material-icons d-blk tile_d-blk">
                    receipt
                  </i>
                </div>
                Receipt
                </div>
              </Link>
            )}
            
          </Tabs.Panel>
          <Tabs.Panel title='OTHERS'>  
              {permissionCheck("leads") && (
                <Link
                  to="/billing/creditnote"
                  className="text-white">
                  <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      credit_cards
                    </i>
                  </div>
                  Credit Note
                  </div>
                </Link>
              )}
              {permissionCheck("leads") && (
                <Link to="/billing/creditnote" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_grey tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      launch
                    </i>
                  </div>
                  Tally Export
                  </div>
                </Link>
              )}
          </Tabs.Panel>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.invoiceReducer
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchInvoice }, dispatch);
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(NestedSubmenu);
export default NestedSubmenu;
