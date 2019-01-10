import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchLeads,
  deleteLeads,
  convertCustomer,
  getSalesPerson
} from "../../actions/leadsActions";
import { Link } from "react-router";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
import Pagination from "react-js-pagination";
import Filter from "./../../core/filter";
import LeadsUpdate from "./leadupdate";

const $ = window.$;

class Centername extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        search_term: "",
        startDate: "",
        endDate: "",
        sales_id: "",
        searchStatus: "",
        follow_date: 0,
        limit: process.perpage,
        page: 1
      },
      preloader: true,
      leadid: "",
      editlead: false,
      salesData: []
    };
    this.fetchData = this.fetchData.bind(this);
    this.convertCustomer = this.convertCustomer.bind(this);
    this.delete = this.delete.bind(this);
    this.filterSearch = this.filterSearch.bind(this);
    this.PagenationChange = this.PagenationChange.bind(this);
    this.edit_lead = this.edit_lead.bind(this);
    this.close_lead = this.close_lead.bind(this);
    this.add_lead = this.add_lead.bind(this);
    this.statusSearch = this.statusSearch.bind(this);
    this.btnChange = this.btnChange.bind(this);
  }
  componentWillMount() {
    this.fetchData();
    /* if(this.props.data.fetched===false){
      }else{
        this.setState({preloader:false});
      }*/
  }

  componentDidMount() {
    $(".modal").modal({ dismissible: false });
    getSalesPerson(0).then(res => {
      if (res.data.status === 200) {
        let data = res.data.data;
        this.setState({ salesData: data });
      }
    });
  }

  fetchData() {
    let self = this;
    setTimeout(() => {
      self.props.fetchLeads(self.state.params).then(() => {
        self.setState({ preloader: false });
      });
    }, 1);
  }

  delete(id) {
    let del = confirm("Are you sure, do you want delete?");
    if (del) {
      let page = 1;
      this.setState({
        preloader: true,
        params: { ...this.state.params, page }
      });
      deleteLeads(id).then(res => {
        if (res.data.status === 200) {
          this.fetchData();
        } else {
          alert("Not delete");
          this.setState({ preloader: false });
        }
      });
    }
  }
  convertCustomer(id) {
    this.setState({ preloader: true });
    convertCustomer(id).then(res => {
      if (res.data.status === 200) {
        this.fetchData();
      } else {
        alert("Not convert to customer");
        this.setState({ preloader: false });
      }
    });
  }

  filterSearch(data) {
    this.setState({ preloader: true });
    let self = this;
    let search_term = data.search_term;
    let startDate = data.start;
    let endDate = data.end;
    let follow_date = data.follow_date;
    let page = 1;
    self.setState({
      params: {
        ...self.state.params,
        search_term,
        startDate,
        endDate,
        page,
        follow_date
      }
    });
    this.fetchData();
  }
  PagenationChange(page) {
    this.setState({ params: { ...this.state.params, page }, preloader: true });
    this.fetchData();
  }
  edit_lead(id) {
    this.setState({ editlead: true, leadid: id });
    $("#leadUpdate").modal("open");
  }
  add_lead() {
    this.close_lead();
    this.fetchData();
  }
  close_lead() {
    this.setState({ editlead: false });
    $("#leadUpdate").modal("close");
  }
  statusSearch(searchStatus) {
    this.setState({
      params: { ...this.state.params, searchStatus, page: 1 },
      preloader: true
    });
    this.fetchData();
  }
  salesSearch(sales_id) {
    this.setState({
      params: { ...this.state.params, sales_id, page: 1 },
      preloader: true
    });
    this.fetchData();
  }
  btnChange(follow_date) {
    this.setState({
      params: {
        search_term: "",
        startDate: "",
        endDate: "",
        searchStatus: "",
        follow_date: follow_date,
        limit: process.perpage,
        page: 1
      },
      preloader: true
    });
    this.fetchData();
  }
  render() {
    let role = permissionCheck("leads");
    if (!role) return <Nopermission />;
    let action = role.permission ? role.permission.split(",") : [];
    const { data } = this.props;
    let { preloader, leadid, editlead, salesData } = this.state;
    let current_page = data ? data.current_page : 0;
    let per_page = data ? data.per_page : 0;
    let total = data ? data.total : 0;
    let leadstatus = ["New", "Hot", "Cold", "Lost", "Won"];
    let leadcolor = ["yellow", "blue", "orange", "red", "green"];

    setTimeout(() => {
      $(".tooltipped").tooltip({ delay: 10 });
    }, 10);

    return (
      <div className="portlet_table" style={{paddngLeft:'0px !important', paddingRight:'0px !important'}}>
        <div className="transition-item list-page">
          <div className="main-content">
            <div className="col s12 portlet-title">
              <div className="caption">LEAD STATUS</div>
            </div>
            <Filter
              filterSearch={this.filterSearch.bind(this)}
              statusSearch={this.statusSearch.bind(this)}
              btnChange={this.btnChange.bind(this)}
              salesData={salesData}
              salesSearch={this.salesSearch.bind(this)}
            />
            <div id="leadUpdate" className="modal">
              <div className="modal-content">
                <div className="col s12 portlet-title">
                  <div className="caption">Lead Update</div>
                  {editlead && (
                  <LeadsUpdate
                    close_lead={this.close_lead}
                    add_lead={this.add_lead}
                    leadid={leadid}
                  />
                )}
                </div>              
              </div>
            </div>

            {action.indexOf("View") !== -1 && (
              <table className="striped">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Lead ID</th>
                    <th className="leftAlignText" style={{paddingLeft:'20px'}}>Company Name</th>
                    <th className="leftAlignText" >First Name</th>
                    {/*<th>Last Name</th>
                                    <th>Email ID</th>  */}
                    <th>Contact No</th>
                    {/* <th>Requirement</th> */}
                    <th>Lead source</th>
                    <th>Lead Status</th>
                    <th>Lead Date</th>
                    <th>follow Up Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data &&
                    data.data.map((val, i) => {
                      var requirement = `<div><table style={{color:'#fff'}} className="striped"><tr> 
                        <th>S.no</th>
                        <th>Enquiry Date</th>
                        <th>Requirement</th>
                        <th>Comments</th>
                        <th>FollowUp Date</th>
                        <th>Entered BY</th>
                        <th>Status</th>
                     </tr>`;
                      let tooltip = val.groupdata.map((vals, k) => {
                        requirement +=
                          `<tr style={{backgroundColor:'#fefefe'}}>
                             <td>` +
                                (k + 1) +
                                `
                             </td>
                             <td>` +
                                vals.lead_date +
                                `
                             </td>
                             <td>` +
                                vals.requirement +
                                `
                             </td>
                             <td>` +
                                vals.comments +
                                `
                             </td>
                             <td>` +
                                vals.follow_date +
                                `
                             </td>
                             <td>` +
                                vals.username +
                                `
                             </td>
                             <td>` +
                                leadstatus[vals.lead_status] +
                                `
                             </td>
                          </tr>`;
                      });
                      requirement += `</div></table>`;
                      let slno = (current_page - 1) * per_page + i + 1;
                      return (
                        <tr key={i}>
                          <td>{slno}</td>
                          <td
                            className="tooltipped"
                            data-position="top"
                            data-html={true}
                            data-delay="50"
                            data-tooltip={requirement}
                          >
                            {val.lead_code}{" "}
                          </td>
                          <td className="leftAlignText" style={{paddingLeft:'20px'}}>{val.company_name}</td>
                          <td className="leftAlignText">{val.first_name}</td>
                          {/* <td>{val.last_name}</td>
                                          <td>{val.emailid}</td> */}
                          <td>{val.contact_number}</td>
                          {/* <td>{val.requirement}</td>  */}
                          <td>{val.lead_source_name}</td>
                          <td>
                            <span  
                              className={`text-white badge ${
                                leadcolor[val.lead_status]
                              }`}
                            >
                              {leadstatus[val.lead_status]}
                            </span>
                          </td>
                          <td>{val.lead_date}</td>
                          <td>{val.follow_date}</td>
                          <td>
                            {action.indexOf("Edit") !== -1 &&
                              val.lead_status != 4 && (
                                <i
                                  className="material-icons dp48 invalid"
                                  onClick={e => {
                                    this.edit_lead(val.lead_id);
                                  }}
                                >
                                  edit
                                </i>
                              )}
                          </td>
                        </tr>
                      );
                    })}
                  {data.data &&
                    data.data.length === 0 && (
                      <tr>
                        <td colSpan="9" className="center red-text">
                          No Record Found...!
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            )}
            {total > per_page && (
                <Pagination
                  activePage={current_page}
                  itemsCountPerPage={per_page}
                  totalItemsCount={total}
                  pageRangeDisplayed={5}
                  onChange={this.PagenationChange}
                />
            )}
          </div>
          {preloader && <Preloader />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.leadsReducer
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchLeads }, dispatch);
};

const LeadsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Centername);

export default LeadsContainer;
