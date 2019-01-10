import React from "react";
import { Link } from "react-router";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { permissionCheck } from "./../core/permission";
import http from "./../core/http-call";
import fetchInvoice from "./../actions/invoiceActions";
import { render } from "react-dom";
import CountUp from "react-countup";
import moment from 'moment';
import { Tooltip } from "react-lightweight-tooltip";
import ReactTooltip from 'react-tooltip';


var param = require("jquery-param");

const Style = {
  content: {
    backgroundColor: "#fff",
    color: "#000"
  },
  tooltip: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    border: "1px solid #c0cddc",
    minWidth: "200px"
  },
  arrow: {
    borderTop: "solid #039be5 10px"
  }
};

class Submenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        month: "",
        year: "",
        search_term: "",
        startDate: "",
        endDate: "",
        limit: process.perpage,
        page: 1
      },
      data: [],
      preloader: true
    };
    this.fetchData = this.fetchData.bind(this);
    this.fetch_invoice = this.fetch_invoice.bind(this);
  }
  componentDidMount() {
    this.fetchData();
    this.fetch_invoice();
  }
  fetchData() {
    http.post("/loadDashboard", param(this.state.params)).then(resp => {
      this.setState({ data: resp.data, preloader: false });
    });
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
        {pathname == "/dashboard/" && (
          <div
            className="col s12"
            style={{ backgroundColor: "#eef1f5", textAlign: "center" }}
          >
            <div className="rows" style={{ height: "260px" }}>
              <div className="col s4 dashboard_portlet">
                <div className="portlet-title  dashboard_title font_cyan">
                  <div className="col s12 center rows">
                    <div className="col s5" style={{textAlign:'right'}}>
                      <i className="small material-icons">assessment</i>
                    </div>
                    <div className="col s7" style={{textAlign:'left'}}>
                      <span>Occupancy</span>
                    </div>
                  </div>
                </div>
                <div className="col s12 center split">
                  <div className="running-num">
                    <CountUp start={0} end={data.workSpaceoccupancy} />%
                  </div>
                </div>
                <div className="rows col s12 align-helper">
                  <div className="col s4">
                    <div>{data.officeSpaceoccupancy}%</div>
                    <div className="helper">Office</div>
                  </div>
                  <div className="col s4">
                    <div>{data.workSpaceoccupancy}%</div>
                    <div className="helper">Workstation</div>
                  </div>
                  <div className="col s4 sub_slots">
                    <div>{data.totalcustomers}</div>
                    <div className="helper">No of Customers</div>
                  </div>
                </div>
                <div className="rows col s12">
                  <div className="col s4" />
                  <div className="col s4" />
                  <div className="col s4 sub_slots">
                    <Tooltip
                      content={[
                        <div className="border-box">
                          <Link
                            className="bordered-list"
                            to="/reports/client-details-listing">
                            Client Details Listing
                          </Link>
                        </div>,
                        <div className="border-box">
                          <Link
                            className="bordered-list"
                            to="/reports/office-expriation-report">
                            Office Expiration Report
                          </Link>
                        </div>,
                        <div className="border-box">
                          <Link
                            className="bordered-list"
                            to="/reports/office-occupancy-report">
                            Office Occupancy
                          </Link>
                        </div>
                      ]}
                      styles={Style}
                    >
                      <a className="dashboard-link">
                        <i
                          className="fa fa-arrow-circle-o-right"
                          aria-hidden="true"
                        />
                      </a>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="col s4 dashboard_portlet">
                <div className="portlet-title  dashboard_title font_purple">
                  <div className="col s12 center">
                    <div className="col s5" style={{textAlign:'right'}}>
                      <i className="small material-icons">layers</i>
                    </div>
                    <div className="col s7" style={{textAlign:'left'}}>
                       <span>Invoiced</span>
                    </div>
                  </div>
                </div>
                <div className="col s12 center split">
                  <div className="running-num">
                    INR <CountUp start={22000} end={data.cumulativeAmount} />
                  </div>
                </div>
				
                <div className="rows col s12 align-helper">
                  <div className="col s6">
                    <div>{data.cumulativePreAmount?data.cumulativePreAmount:0}</div>
                    <div className="helper">Last Month</div>
                  </div>
                  <div className="col s6">
                    <div>{data.cumulativeAmount?data.cumulativeAmount:0}</div>
                    <div className="helper">Current Month</div>
                  </div>
                </div>
                <div className="rows col s12">
                  <div className="col s4" />
                  <div className="col s4" />
                  <div className="col s4 sub_slots">
                    <Tooltip
                      content={[
                        <div className="border-box">
                          <Link
                            className="bordered-list"
                            to="/reports/invoice-listing"
                          >
                            Invoice Listing
                          </Link>
                        </div>,
                        <div className="border-box">
                          <Link
                            className="bordered-list"
                            to="/reports/total-service-invoiced"
                          >
                            Total Service Invoiced
                          </Link>
                        </div>,
                        <div className="border-box">
                          <Link
                            className="bordered-list"
                            to="/reports/total-service-uninvoiced"
                          >
                            Total Service Un-Invoiced
                          </Link>
                        </div>
                      ]}
                      styles={Style}
                    >
                      <a className="dashboard-link">
                        <i
                          className="fa fa-arrow-circle-o-right"
                          aria-hidden="true"
                        />
                      </a>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="col s4 dashboard_portlet">
                <div className="portlet-title  dashboard_title font_orange">
                  <div className="col s12 center">
                    <div className="col s5" style={{textAlign:'right'}}>
                      <i className="small material-icons">attach_money</i>
                    </div>
                    <div className="col s7" style={{textAlign:'left'}}>
                      <span>Received</span>
                    </div>                   
                  </div>
                </div>
                <div className="col s12 center split">
                  <div className="running-num">
                    INR{" "}
                    <CountUp start={1700} end={data.cumulativeReceiptAmount} />
                  </div>
                </div>
                <div className="rows col s12 align-helper">
                  <div className="col s6">
                    <div>{data.cumulativePreReceiptAmount}</div>
                    <div className="helper">Last Month</div>
                  </div>
                  <div className="col s6">
                    <div>{data.cumulativeReceiptAmount}</div>
                    <div className="helper">Current Month</div>
                  </div>
                </div>
                <div className="rows col s12">
                  <div className="col s4" />
                  <div className="col s4" />
                  <div className="col s4 sub_slots">
                    <Tooltip
                      content={[
                        <div className="border-box">
                          <Link
                            className="bordered-list"
                            to="/reports/receipt-listing"
                          >
                            Receipt Listing Report
                          </Link>
                        </div>,
                        <div className="border-box">
                          <Link
                            className="bordered-list"
                            to="/reports/ageing-report"
                          >
                            Ageing Report
                          </Link>
                        </div>
                      ]}
                      styles={Style}
                    >
                      <a className="dashboard-link">
                        <i
                          className="fa fa-arrow-circle-o-right"
                          aria-hidden="true"
                        />
                      </a>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            <div className="rows col s12">
              <div className="col s4 dashboard_portlet">
                <div className="portlet-title  dashboard_title font_orange">
                  <div className="col s12 center">
                    <div className="col s5" style={{textAlign:'right'}}>
                      <i className="small material-icons">person_add</i>
                    </div>
                    <div className="col s7" style={{textAlign:'left'}}>
                      <span>Opportunities</span>
                    </div>
                  </div>
                </div>
                <div className="col s12 center split">
                  <div className="running-num">
                    <CountUp start={0} end={data.hotLead} />
                  </div>
                </div>
                <div className="rows col s12 align-helper">
                  <div className="col s4">
                    <div>{data.wonLead}</div>
                    <div className="helper">Won Leads</div>
                  </div>
                  <div className="col s4">
                    <div>{data.coldLead}</div>
                    <div className="helper">Cold Leads</div>
                  </div>
                  <div className="col s4 sub_slots">
                    <div>{data.lostLead}</div>
                    <div className="helper">Lost Leads</div>
                  </div>
                </div>
              </div>

              <div className="col s4 dashboard_portlet">
                <div className="portlet-title  dashboard_title font_blue">
                  <div className="col s12 center">
                    <div className="col s5" style={{textAlign:'right'}}>
                       <i className="small material-icons">business</i>
                    </div>
                    <div className="col s7" style={{textAlign:'left'}}>
                     <span>Companies</span>
                    </div>                     
                  </div>
                </div>
                <div className="col s12 center split">
                  <div className="running-num">
                    <CountUp start={0} end={data.currentMonthActiveCustomers} />
                  </div>
                </div>
                <div className="rows col s12 align-helper">
                  <div className="col s4">
                      <ReactTooltip id='arrivals' aria-haspopup='true' role='example'>
                         <table className="striped">
                                <thead>
                                  <tr>
                                    <th className="leftAlignText">Company Name</th>
                                    <th>Ref No</th>
                                    <th>Start Date</th> 
                                  </tr>
                                </thead>
                                <tbody>
                                {
                                  data.arrivalDetails && data.arrivalDetails.map((val,i)=>{
 
                                    return(
                                      <tr key={i}>
                                          <td className="leftAlignText">{val.company_name}</td> 
                                          <td>{val.reference_no}</td>
                                          <td>{val.start_date=moment(new Date(val.start_date.substr(0, val.start_date.length-9))).format("DD-MM-YYYY")}
                                          </td>
                                      </tr>
                                      )
                                  })
                               }
                        {
                          (data.arrivalDetails && data.arrivalDetails.length===0 )&&
                            <tr>  
                                <td colSpan="9" className="center red-text">No Record Found...!</td> 
                            </tr> 
                        }
                        </tbody>
                      </table> 
                    </ReactTooltip>




                    <div>{data.arrivals}</div>
                    <div className="helper" data-tip data-for='arrivals'>Arrivals</div>
                  </div>
                 
				  <div className="col s4">
            <ReactTooltip id='renewals' aria-haspopup='true' role='example' >
                        <table className="striped">
                                <thead>
                                  <tr>
                                    <th className="leftAlignText">Company Name</th>
                                    <th className="leftAlignText">Ref No</th>
                                    <th className="leftAlignText">End Date</th> 
                                  </tr>
                                </thead>
                                <tbody>
                                {
                                  data.renewalDetails && data.renewalDetails.map((val,i)=>{
 
                                    return(
                                      <tr key={i}>
                                          <td className="leftAlignText">{val.company_name}</td> 
                                          <td className="leftAlignText">{val.reference_no}</td>
                                          <td className="leftAlignText">{val.end_date=moment(new Date(val.end_date.substr(0, val.end_date.length-9))).format("DD-MM-YYYY")}</td>       
                                      </tr>
                                      )
                                  })
                               }
                        {
                          (data.renewalDetails && data.renewalDetails.length===0 )&&
                            <tr>  
                                <td colSpan="9" className="center red-text">No Record Found...!</td> 
                            </tr> 
                        }
                        </tbody>
                      </table> 
                      </ReactTooltip>
                    <div>{data.renewals}</div>
                    <div className="helper" data-tip data-for='renewals' >Renewals</div>
                  </div>
				   <div className="col s4">
            <ReactTooltip id='moveouts' aria-haspopup='true' role='example'>
                          <table className="striped">
                                <thead>
                                  <tr>
                                    <th className="leftAlignText">Company Name</th>
                                    <th>Cabin Name</th>
                                    <th>Move-out Date </th>
                                  </tr>
                                </thead>
                                <tbody>
                                {
                                  data.terminatedDetails && data.terminatedDetails.map((val,i)=>{
 
                                    return(
                                      <tr key={i}>
                                          <td className="leftAlignText">{val.company_name}</td> 
                                          <td>{val.cabinname}</td>
                                          <td> {val.terminate_date=moment(new Date(val.terminate_date.substr(0, val.terminate_date.length-9))).format("DD-MM-YYYY")}</td>
                                      </tr>
                                      )
                                  })
                               }
                        {
                          (data.terminatedDetails && data.terminatedDetails.length===0 )&&
                            <tr>  
                                <td colSpan="9" className="center red-text">No Record Found...!</td> 
                            </tr> 
                        }
                        </tbody>
                      </table> 
                      </ReactTooltip>
                    <div>{data.terminations}</div>
                    <div className="helper" data-tip data-for='moveouts' >Move-out</div>
                  </div>
                </div>
              </div>
              <div className="col s4 dashboard_portlet">
                <div className="portlet-title  dashboard_title font_purple">
                  <div className="col s12 center">
                    <div className="col s5" style={{textAlign:'right'}}>
                      <i className="small material-icons">card_membership</i>
                    </div>
                    <div className="col s7" style={{textAlign:'left'}}>
                     <span>Members</span>
                    </div>                    
                  </div>
                </div>
                <div className="col s12 center split">
                  <div className="running-num">
                    <CountUp start={0} end={data.currentMonthActiveMembers} />
                  </div>
                </div>
                <div className="rows col s12 align-helper">
                  <div className="col s6">
                    <div>{data.currentMonthActiveMembers}</div>
                    <div className="helper">Last Month</div>
                  </div>
                  <div className="col s6">
                    <div>{data.currentMonthActiveMembers}</div>
                    <div className="helper">Current Month</div>
                  </div>
                </div>
              </div>

              {/*
              //   <div className="col l3 m3 s12" style={{margin: '5px', padding: '12px 20px 15px', width: '50%', height: '286px', backgroundColor:'#fff'}}> 
              //     <h5 className="hdng_ttle">Center Cummulative Status</h5>
              //     <div className="clr_tagline">Total billing-Current Month  </div>
              //     <h4>INR <CountUp start={22000} end={data.cumulativeAmount} /></h4>
              //     <span className="clr_tagline">Hot Leads</span>
              //     <h4><CountUp start={0} end={data.totalHotLead} /></h4>
              //     <span className="clr_tagline"></span>
              //   </div>*/}

              {/*
                <div className="col l3 m3 s12" style={{margin: '5px', padding: '12px 20px 15px', width: '24%', height: '260px', backgroundColor:'#fff'}}>
                  <h5 className="hdng_ttle">Center Status</h5>
                  <div className="clr_tagline">New Arrivals,Moves, Renewals & Terminations</div>
                  <table className="clr_tagline">
                  <tbody>
                    <tr>
                      <td className="fnt_87 fnt_wt600">New Arrivals</td>
                      <td>Tot</td>
                      <td>22-08-17</td>
                    </tr>
                    <tr>
                      <td className="fnt_87 fnt_wt600">Moves</td>
                      <td>Tot</td>
                      <td>22-08-17</td>
                    </tr>
                    <tr>
                      <td className="fnt_87 fnt_wt600">Renewals</td>
                      <td>Tot</td>
                      <td>22-08-17</td>
                    </tr>
                    <tr>
                      <td className="fnt_87 fnt_wt600">Terminations</td>
                      <td>Tot</td>
                      <td>22-08-17</td>
                    </tr>
                  </tbody>
                  </table>
                </div>
              */}

              {/*
              <div className="rows">
                <div className="col l6 m6 s12" style={{margin: '5px', padding: '12px 20px 15px', width: '48%', backgroundColor:'#fff'}}>
                  <h5 className="hdng_ttle">Money Management</h5>
                  <div className="clr_tagline">Upto Jan 2017</div>
                  <div>
                    <img src="images/graph1.png" className="responsive-img width_hndrdprcnt" />
                  </div>
                </div>
                <div className="col l6 m6 s12" style={{margin: '5px', padding: '12px 20px 15px', width: '48%', backgroundColor:'#fff'}}>
                  <h5 className="hdng_ttle">Amount Vs Work</h5>
                  <div className="clr_tagline">Upto Jul 2017</div>
                  <div>
                  <img src="images/graph2.jpg" className="responsive-img width_hndrdprcnt" />
                  </div>
                </div>
              </div>
            */}
            </div>
          </div>
        )}
        {pathname == "/leads/" && (
          <div
            className="col s12"
            style={{ backgroundColor: "none !important" }}
          >
            <div className="">
              {permissionCheck("leads", "New") && (
                <Link to="/leads/enquiry" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_grey tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        contact_phone
                      </i>
                    </div>
                    Enquiry
                  </div>
                </Link>
              )}
              {permissionCheck("leads") && (
                <Link to="/leads/leads" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_red tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        assessment
                      </i>
                    </div>
                    Lead Status
                  </div>
                </Link>
              )}
              {permissionCheck("leads") && (
                <Link to="/leads/agreement" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        card_giftcard
                      </i>
                    </div>
                    Agreement
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
        {pathname == "/customers/" && (
          <div className="col s12">
            <div className="rows">
              {permissionCheck("leads") && (
                <Link to="/customers/client-setting/" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        settings
                      </i>
                    </div>
                    Client Settings
                  </div>
                </Link>
              )}
              {permissionCheck("leads") && (
                <Link
                  to="/customers/client-setting/externalcustomer/"
                  className="text-white"
                >
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_d_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        person_pin
                      </i>
                    </div>
                    External Customer
                  </div>
                </Link>
              )}
              {permissionCheck("leads") && (
                <Link to="/customers/serviceallocation/" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_violet tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        assignment_turned_in
                      </i>
                    </div>
                    Service Allocation
                  </div>
                </Link>
              )}
              {permissionCheck("leads") && (
                <Link to="/customers/feedback/" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        comment
                      </i>
                    </div>
                    Feedback
                  </div>
                </Link>
              )}
              {permissionCheck("leads") && (
                <Link to="/customers/notification/" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_grey tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        notifications
                      </i>
                    </div>
                    Notification
                  </div>
                </Link>
              )}
             
            </div>
          </div>
        )}
        {pathname == "/billing/" && (
          <div className="col s12">
            <div className="rows">
              {permissionCheck("leads") && (
                <Link
                  to="/billing/proforma-billing-action/"
                  className="text-white"
                >
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        local_atm
                      </i>
                    </div>
                    <div>Proforma Billing</div>
                  </div>
                </Link>
              )}

              {permissionCheck("leads") && (
                <Link to="/billing/group-billing" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_d_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        group_work
                      </i>
                    </div>
                    <div>Group Billing</div>
                  </div>
                </Link>
              )}

              {permissionCheck("leads") && (
                <Link to="/billing/creditnote" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_violet tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        credit_cards
                      </i>
                    </div>
                    <div>Credit Note</div>
                  </div>
                </Link>
              )}
              {permissionCheck("leads") && (
                <Link to="/billing/receipt" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        receipt
                      </i>
                    </div>
                    <div>Receipt</div>
                  </div>
                </Link>
              )}
              {permissionCheck("gst") && (
                <Link to="/billing/bill-reporting" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        layers
                      </i>
                    </div>
                    <div>Invoice</div>
                  </div>
                </Link>
              )}

              {permissionCheck("gst") && (
                <Link
                  to="/billing/proformabill-reporting"
                  className="text-white"
                >
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        call_to_action
                      </i>
                    </div>
                    <div>Proforma Invoice</div>
                  </div>
                </Link>
              )}

              {permissionCheck("customer") && (
                <Link to="/billing/externalcustomer" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        local_atm
                      </i>
                    </div>
                    <div>External Billing</div>
                  </div>
                </Link>
              )}

              {permissionCheck("leads") && (
                <Link to="/billing/tally-export" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        launch
                      </i>
                    </div>
                    <div>Tally Export</div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
        {pathname == "/billing/proforma-billing-action/" && (
          <div className="col s12">
            <div className="rows">
              {permissionCheck("leads") && (
                <Link
                  to="/billing/proforma-billing-action/create"
                  className="text-white"
                >
                  {" "}
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        create
                      </i>
                    </div>
                    <div>Create</div>
                  </div>
                </Link>
              )}
              {permissionCheck("leads") && (
                <Link
                  to="/billing/proforma-billing-action/posting"
                  className="text-white"
                >
                  {" "}
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        near_me
                      </i>
                    </div>
                    <div>Posting</div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
        {pathname == "/reports/" && (
          <div className="col s12">
            <div className="rows">
              <Link to="/reports/client-details-listing" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_d_blue tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      details
                    </i>
                  </div>
                  Client Details Listing
                </div>
              </Link>

              <Link to="/reports/invoice-listing" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      layers
                    </i>
                  </div>
                  Invoice Listing
                </div>
              </Link>
              <Link
                to="/reports/office-expriation-report"
                className="text-white"
              >
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      restore
                    </i>
                  </div>
                  Office Expriation Report
                </div>
              </Link>

              <Link to="/reports/total-service-invoiced" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_violet tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      receipt
                    </i>
                  </div>
                  Total Service(Invoiced)
                </div>
              </Link>
              <Link
                to="/reports/total-service-uninvoiced-proforma"
                className="text-white"
              >
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      money_off
                    </i>
                  </div>
                  Total Services (Uninvoiced)
                </div>
              </Link> 
              <Link to="/reports/receipt-listing" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_grey  tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      receipt
                    </i>
                  </div>
                  Receipt Listing Report
                </div>
              </Link>
              <Link to="/reports/ageing-report" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_red tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      restore
                    </i>
                  </div>
                  Ageing Report
                </div>
              </Link>
              <Link to="/reports/customer-ageing-report" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      person_pin
                    </i>
                  </div>
                  Customer Ageing Report
                </div>
              </Link>

              <Link
                to="/reports/office-occupancy-report"
                className="text-white"
              >
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      domain
                    </i>
                  </div>
                  Office Occupancy
                </div>
              </Link>

              <Link to="/reports/soa-report" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_d_blue tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      restore
                    </i>
                  </div>
                  SOA Report
                </div>
              </Link>
            </div>
          </div>
        )}

        {pathname == "/settings" && (
          <div className="col s12">
            <div className="rows">
              <Link to="/settings/general/" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_d_blue tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      settings_applications
                    </i>
                  </div>
                  General Setting
                </div>
              </Link>
              <Link to="/settings/accounts/" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_violet tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      settings
                    </i>
                  </div>
                  Account Setting
                </div>
              </Link>
              <Link to="/settings/integration/" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      settings_input_component
                    </i>
                  </div>
                  Integration Setting
                </div>
              </Link>
              <Link to="/settings/helpdesk/" className="text-white">
                <div className="col l2 m2 s12 center blk">
                  <div className="col l2 m2 s12 center invntry_blk_grey tile">
                    <i className="large material-icons d-blk tile_d-blk">
                      help
                    </i>
                  </div>
                  Help Desk
                </div>
              </Link>
            </div>
          </div>
        )}
        {pathname == "/settings/helpdesk/" && (
          <div className="col s12">
            <div className="rows">
              {permissionCheck("package") && (
                <Link
                  to="/settings/helpdesk/department/"
                  className="text-white"
                >
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_grey tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        account_balance_wallet
                      </i>
                    </div>
                    Department
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/helpdesk/employee/" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_red tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        account_box
                      </i>
                    </div>
                    Employee
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/helpdesk/category/" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        category
                      </i>
                    </div>
                    Help Desk Category
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
        {pathname == "/settings/accounts/" && (
          <div className="col s12">
            <div className="rows">
              {permissionCheck("package") && (
                <Link
                  to="/settings/accounts/accounttype"
                  className="text-white"
                >
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_grey tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        account_balance_wallet
                      </i>
                    </div>
                    Account Type
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link
                  to="/settings/accounts/accounthead"
                  className="text-white"
                >
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_red tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        account_box
                      </i>
                    </div>
                    Account Head
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/accounts/ledger" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        contacts
                      </i>
                    </div>
                    Ledger
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/accounts/gst" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        money
                      </i>
                    </div>
                    GST Master
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/accounts/kyc" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_d_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        check_box
                      </i>
                    </div>
                    KYC
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/accounts/payment" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_violet tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        local_atm
                      </i>
                    </div>
                    Payment
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
        {pathname == "/settings/general/" && (
          <div className="col s12">
            <div className="rows">
              {permissionCheck("business") && (
                <Link to="/settings/general/business" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
                      <i className="large material-icons d-blk tile_d-blk" />
                    </div>
                    Group Details
                  </div>
                </Link>
              )}
              {permissionCheck("centername") && (
                <Link to="/settings/general/centername" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_grey tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        details
                      </i>
                    </div>
                    Center Details
                  </div>
                </Link>
              )}
              {permissionCheck("officespace") && (
                <Link to="/settings/general/officespace" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_red tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        space_bar
                      </i>
                    </div>
                    Space Master
                  </div>
                </Link>
              )}
              {permissionCheck("officetype") && (
                <Link to="/settings/general/officetype" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        merge_type
                      </i>
                    </div>
                    Office Types
                  </div>
                </Link>
              )}
              {permissionCheck("officecategory") && (
                <Link
                  to="/settings/general/officecategory"
                  className="text-white"
                >
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        category
                      </i>
                    </div>
                    Office Category
                  </div>
                </Link>
              )}
              {permissionCheck("service") && (
                <Link to="/settings/general/service" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_d_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        room_service
                      </i>
                    </div>
                    Service Master
                  </div>
                </Link>
              )}

              {permissionCheck("package") && (
                <Link to="/settings/general/amenities" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_violet tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        equalizer
                      </i>
                    </div>
                    Amenities Master
                  </div>
                </Link>
              )}

              {permissionCheck("package") && (
                <Link
                  to="/settings/general/servicecategory"
                  className="text-white"
                >
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        local_laundry_service
                      </i>
                    </div>
                    Service Category
                  </div>
                </Link>
              )}

              {permissionCheck("users") && (
                <Link to="/settings/general/users" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_grey tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        supervised_user_circle
                      </i>
                    </div>
                    Users
                  </div>
                </Link>
              )}
              {permissionCheck("roles") && (
                <Link to="/settings/general/roles" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_red tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        verified_user
                      </i>
                    </div>
                    Roles & Permission
                  </div>
                </Link>
              )}
              {permissionCheck("menu") && (
                <Link to="/settings/general/menu" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                      <i className="large material-icons d-blk tile_d-blk" />
                    </div>
                    Menu Master
                  </div>
                </Link>
              )}

              {permissionCheck("language") && (
                <Link to="/settings/general/language" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        language
                      </i>
                    </div>
                    Language Master
                  </div>
                </Link>
              )}
              {permissionCheck("label") && (
                <Link to="/settings/general/label" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_d_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        label
                      </i>
                    </div>
                    Label Master
                  </div>
                </Link>
              )}

              {permissionCheck("package") && (
                <Link to="/settings/general/leadsource" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_violet tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        layers
                      </i>
                    </div>
                    Lead Source
                  </div>
                </Link>
              )}

              {permissionCheck("package") && (
                <Link to="/settings/general/product" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        card_giftcard
                      </i>
                    </div>
                    Product
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/general/unit" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_grey tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        ac_unit
                      </i>
                    </div>
                    Unit
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/general/country" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_red tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        place
                      </i>
                    </div>
                    Country
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/general/state" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_cyan tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        directions
                      </i>
                    </div>
                    State
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/general/city" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_yellow tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        streetview
                      </i>
                    </div>
                    City
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/general/Area" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_d_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        domain
                      </i>
                    </div>
                    Floor
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link to="/settings/general/Room" className="text-white">
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_violet tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        store
                      </i>
                    </div>
                    Room
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link
                  to="/settings/general/templatecategory"
                  className="text-white"
                >
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        dashboard
                      </i>
                    </div>
                    Template Category
                  </div>
                </Link>
              )}
              {permissionCheck("package") && (
                <Link
                  to="/settings/general/templatemaster"
                  className="text-white"
                >
                  <div className="col l2 m2 s12 center blk">
                    <div className="col l2 m2 s12 center invntry_blk_grey tile">
                      <i className="large material-icons d-blk tile_d-blk">
                        menu
                      </i>
                    </div>
                    Template Master
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
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
)(Submenu);
export default Submenu;

// {/*
//   <Link to="/reports/customer-overrides" className="text-white">
//     <div className="col l2 m2 s12 center invntry_blk_violet tile">
//       <div>Customer Overrides</div>
//     </div>
//   </Link>
// */}

// {
//   <Link to="/reports/office-occupancy" className="text-white">
//  <div className="col l2 m2 s12 center invntry_blk_l_blue tile">
//      <i className="large material-icons d-blk tile_d-blk">near_me</i>
//    <div>Office Occupancy</div>
//     </div>
// </Link>

// }

// ////////////////////////
// <Link
//   to="/reports/daily-activity-report_inv"
//   className="text-white"
// >
//   <div className="col l2 m2 s12 center invntry_blk_red tile">
//     <i className="large material-icons d-blk tile_d-blk">
//       local_activity
//     </i>
//     <div>Daily Activity Report (Invoiced)</div>
//   </div>
// </Link>
// <Link
//   to="/reports/daily-activity-report_uninv"
//   className="text-white"
// >
//   <div className="col l2 m2 s12 center invntry_blk_grey tile">
//     <i className="large material-icons d-blk tile_d-blk">
//       announcement
//     </i>
//     <div>Daily Activity Report (Uninvoiced)</div>
//   </div>
// </Link>



// /////////////////////for helpdesk

 // {permissionCheck("leads") && (
 //                <Link to="/customers/helpdesk/" className="text-white">
 //                  <div className="col l2 m2 s12 center blk">
 //                    <div className="col l2 m2 s12 center invntry_blk_red tile">
 //                      <i className="large material-icons d-blk tile_d-blk">
 //                        help
 //                      </i>
 //                    </div>
 //                    Help Desk
 //                  </div>
 //                </Link>
 //              )}