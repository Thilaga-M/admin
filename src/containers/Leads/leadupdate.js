import React, { Component } from "react";
import { Link } from "react-router";
import browserHistory from "./../../core/History";
import moment from "moment";
import Preloader from "./../../core/Preloader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  leadSoucre,
  officeType,
  viewLeads,
  addLeads,
  getCenter,
  getSalesPerson
} from "../../actions/leadsActions";

const $ = window.$;
function validate(
  first_name,
  company_name,
  emailid,
  lds_id,
  contact_number,
  lead_status,
  sales_id,
  cent_id
) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let regs = /^\d+$/;
  let numbers = /^\d{10}$/;
  return {
    first_name: first_name.length === 0,
    company_name: company_name.length === 0,
    emailid: reg.test(emailid) === false,
    lds_id: lds_id.length === 0,
    contact_number: !numbers.test(contact_number),
    lead_status: lead_status.length === 0,
    sales_id: sales_id.length === 0,
    cent_id: cent_id.length === 0
  };
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      first_name: "",
      last_name: "",
      company_name: "",
      office_type: "",
      lead_source: "",
      emailid: "",
      enq_id: "",
      lead_code: "",
      lds_id: "",
      otm_id: "",
      lds_data: [],
      type_data: [],
      centerData: [],
      salesData: [],
      contact_number: "",
      error_status: false,
      preloader: true,
      lead_status: 1,
      sales_id: "",
      cent_id: "",
      no_of_seats: "",
      proposal_value: "",
      lead_status_read: "",
      exp_start_date: "", //moment(),
      title: "Edit"
    };
    this.eventHandle = this.eventHandle.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
    this.close_lead = this.close_lead.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.salesName = this.salesName.bind(this);
    this.handleChangeAgreement = this.handleChangeAgreement.bind(this);
    this.genrateAgreement = this.genrateAgreement.bind(this);
    // this.totalCalculation=this.totalCalculation.bind(this);
  }

  componentDidMount() {
    if (this.props.leadid) {
      viewLeads(this.props.leadid).then(res => {
        if (res.data.status === 200) {
          let data = res.data.data;
          this.salesName(data.cent_id);
          this.setState({
            requirement: data.requirement,
            lead_date: data.lead_date,
            comments: data.comments,
            first_name: data.first_name,
            last_name: data.last_name,
            company_name: data.company_name,
            emailid: data.emailid,
            lds_id: data.lds_id,
            otm_id: data.otm_id,
            enq_id: data.enq_id,
            lead_code: data.lead_code,
            office_type: data.office_type,
            lead_source: data.lead_source,
            picker_date:
              data.lead_date != "0000-00-00 00:00:00"
                ? moment(data.lead_date)
                : "",
            contact_number: data.contact_number,
            error_status: true,
            lead_status: data.lead_status,
            lead_status_read: data.lead_status,
            exp_start_date:
              data.exp_start_date != "0000-00-00 00:00:00"
                ? moment(data.exp_start_date)
                : "",
            no_of_seats: data.no_of_seats,
            proposal_value: data.proposal_value,
            cent_id: data.cent_id ? data.cent_id : "",
            sales_id: data.sales_id ? data.sales_id : "",
            preloader: false
          });
        }
      });
    }
    leadSoucre().then(res => {
      if (res.data.status === 200) {
        let data = res.data.result.data;
        this.setState({ lds_data: data });
      }
    });

    officeType().then(res => {
      if (res.data.status === 200) {
        let data = res.data.result.data;
        this.setState({ type_data: data });
      }
    });

    getCenter().then(res => {
      if (res.data.status === 200) {
        let data = res.data.data;
        this.setState({ centerData: data });
      }
    });
  }

  salesName(id) {
    getSalesPerson(id).then(res => {
      if (res.data.status === 200) {
        let data = res.data.data;
        this.setState({ salesData: data });
      }
    });
  }
  eventHandle(e, key, val) {
    if (key === "otm_id") {
      let office_type =
        e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
      this.setState({ otm_id: e.target.value, office_type: office_type });
    } else if (key === "cent_id") {
      this.salesName(e.target.value);
      this.setState({ [key]: key === "status" ? val : e.target.value });
    } else {
      this.setState({ [key]: key === "status" ? val : e.target.value });
    }
  }

  handleChange(date) {
    this.setState({
      picker_date: moment(date),
      lead_date: moment(date)
    });
  }

  handleChangeAgreement(date, e) {
    this.setState({
      exp_start_date: moment(date)
    });
  }

  onsubmit() {
    let {
      exp_start_date,
      no_of_seats,
      proposal_value,
      cent_id,
      sales_id,
      enq_id,
      lead_code,
      first_name,
      office_type,
      last_name,
      company_name,
      emailid,
      lds_id,
      otm_id,
      contact_number,
      lead_source,
      requirement,
      lead_date,
      comments,
      lead_status
    } = this.state;
    let errors = validate(
      first_name,
      company_name,
      emailid,
      lds_id,
      contact_number,
      lead_status,
      sales_id,
      cent_id
    );
    this.setState({ preloader: true });
    console.log(sales_id);
    let isDisabled = Object.keys(errors).some(x => errors[x]);
    if (isDisabled === false) {
      let params = {
        first_name: first_name,
        last_name: last_name,
        company_name: company_name,
        office_type: office_type,
        lead_source: lead_source,
        requirement: requirement,
        lead_date: moment(new Date(lead_date)).format("YYYY-MM-DD HH:mm:ss"),
        comments: comments,
        lead_status: lead_status,
        emailid: emailid,
        enq_id: enq_id,
        lead_code: lead_code,
        otm_id: otm_id,
        lds_id: lds_id,
        contact_number: contact_number,
        lead_status: lead_status,
        exp_start_date: moment(new Date(exp_start_date)).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        no_of_seats: no_of_seats,
        proposal_value: proposal_value,
        cent_id: cent_id,
        sales_id: sales_id
      };

      //let para=(this.props.params.id)?'/'+this.props.params.id:'';
      addLeads(params).then(res => {
        if (res.data.status === 200) {
          this.props.add_lead();
          //browserHistory.push("/leads/leads");
        } else {
          alert("Please enter required feilds...");
          this.setState({ error_status: true, preloader: false });
        }
      });
    } else {
      this.setState({ error_status: true, preloader: false });
    }
  }
  close_lead() {
    this.props.close_lead();
  }
  genrateAgreement(val) {
    //Remove the status for agreement renewal & extend if exist
    localStorage.removeItem("extensionStatus");
    localStorage.removeItem("renewalStatus");
    localStorage.removeItem("renewalStatus");

    localStorage.setItem("lead_id", val);
    this.props.close_lead();
    browserHistory.push("/leads/add-agreement");
  }
  render() {
    let leadstatus = ["New", "Hot", "Cold", "Lost"];
    let {
      lead_status_read,
      lead_code,
      first_name,
      last_name,
      company_name,
      emailid,
      lds_id,
      contact_number,
      title,
      error_status,
      preloader,
      lds_data,
      otm_id,
      type_data,
      office_type,
      lead_source,
      requirement,
      lead_date,
      comments,
      lead_status,
      picker_date,
      sales_id,
      cent_id,
      centerData,
      salesData,
      exp_start_date,
      no_of_seats,
      proposal_value
    } = this.state;
    console.log(this.state);

    let errors = validate(
      first_name,
      company_name,
      emailid,
      lds_id,
      contact_number,
      lead_status,
      sales_id,
      cent_id
    );

    return (
      <div>
        <form method="post" encType="multipart/form-data">
          <div className="row">
            <div className="input-field col s6 align-input">
              <input
                type="text"
                onChange={e => {this.eventHandle(e, "first_name");}}
                className={errors.first_name && error_status ? "invalid" : ""}
                value={first_name}/>
              <label
                htmlFor="text-input"
                className={errors.first_name ? "" : "active"}>
                First Name
              </label>
            </div>
            <div className="input-field col s6 align-input">
              <input
                type="text"
                onChange={e => {
                  this.eventHandle(e, "last_name");
                }}
                className={errors.last_name && error_status ? "invalid" : ""}
                value={last_name}/>
              <label
                htmlFor="text-input"
                className={errors.last_name ? "" : "active"}
              >
                Last Name
              </label>
            </div>

            <div className="input-field col s6 align-input">
              <input
                type="text"
                onChange={e => {
                  this.eventHandle(e, "company_name");
                }}
                className={errors.company_name && error_status ? "invalid" : ""}
                value={company_name}
              />
              <label
                htmlFor="textarea-input"
                className={errors.company_name ? "" : "active"}
              >
                Comapny Name
              </label>
            </div>

            <div className="input-field col s6 align-input">
              <input
                type="text"
                onChange={e => {
                  this.eventHandle(e, "emailid");
                }}
                className={errors.emailid && error_status ? "invalid" : ""}
                value={emailid}
              />
              <label
                htmlFor="text-input"
                className={errors.emailid ? "" : "active"}
              >
                Email ID
              </label>
            </div>

            <div className="input-field col s6 align-input">
              <input
                type="text"
                onChange={e => {
                  this.eventHandle(e, "contact_number");
                }}
                className={
                  errors.contact_number && error_status ? "invalid" : ""
                }
                maxLength={10}
                value={contact_number}
              />
              <label
                htmlFor="text-input"
                className={errors.contact_number ? "" : "active"}
              >
                contact_number Number
              </label>
            </div>

            <div className="input-field col s6 align-input">
              <DatePicker
                selected={picker_date}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                placeholderText="From Date"
                dateFormat="DD/MM/YYYY HH:mm"
                readOnly={true}
                className="datepicker form-control"
                onChange={this.handleChange}
              />
              <label
                htmlFor="text-input"
                className={errors.lead_date ? "" : "active"}
              >
                Follow Up Date
              </label>
            </div>

            <div className="input-field col s6 align-input">
              <textarea
                onChange={e => {
                  this.eventHandle(e, "requirement");
                }}
                className={
                  errors.requirement && error_status
                    ? "materialize-textarea invalid"
                    : "materialize-textarea"
                }
                value={requirement}
              />
              <label
                htmlFor="text-input"
                className={errors.requirement ? "" : "active"}
              >
                Requirement
              </label>
            </div>

            <div className="input-field col s6  align-input">
              <textarea
                onChange={e => {
                  this.eventHandle(e, "comments");
                }}
                className={
                  errors.comments && error_status
                    ? "materialize-textarea invalid"
                    : "materialize-textarea"
                }
                value={comments}
              />
              <label
                htmlFor="text-input"
                className={errors.comments ? "" : "active"}
              >
                Comments
              </label>
            </div>

            <div className="input-field col s6 align-input">
              <select
                className={`browser-default ${
                  errors.otm_id && error_status ? "invalid" : ""
                }`}
                value={otm_id}
                onChange={e => {
                  this.eventHandle(e, "otm_id");
                }}
              >
                <option value="">Select Office Type</option>
                {type_data &&
                  type_data.map((val, i) => {
                    return (
                      <option title={i} key={i} value={val.otm_id}>
                        {val.officetype}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="input-field col s6 align-input">
              <select
                className={`browser-default ${
                  errors.lead_status && error_status ? "invalid" : ""
                }`}
                value={lead_status}
                onChange={e => {
                  this.eventHandle(e, "lead_status");
                }}
              >
                <option value="">Select status</option>
                {leadstatus &&
                  leadstatus.map((val, i) => {
                    if (i > 0) {
                      return (
                        <option title={i} key={i} value={i}>
                          {val}
                        </option>
                      );
                    }
                  })}
              </select>
            </div>

            <div className="input-field col s6 align-input">
              <DatePicker
                selected={exp_start_date}
                placeholderText="Expected Start date"
                dateFormat="DD/MM/YYYY"
                readOnly={true}
                className="datepicker form-control"
                onChange={this.handleChangeAgreement}
              />
            </div>

            <div className="input-field col s6 align-input">
              <input
                type="text"
                onChange={e => {
                  this.eventHandle(e, "no_of_seats");
                }}
                className={errors.no_of_seats && error_status ? "invalid" : ""}
                value={no_of_seats}
              />
              <label
                htmlFor="text-input"
                className={errors.no_of_seats ? "" : "active"}
              >
                No Of Seats
              </label>
            </div>

            <div className="input-field col s6 align-input">
              <select
                className={`browser-default ${
                  errors.cent_id && error_status ? "invalid" : ""
                }`}
                value={cent_id}
                onChange={e => {
                  this.eventHandle(e, "cent_id");
                }}
              >
                <option value="">Select Center</option>
                {centerData &&
                  centerData.map((val, i) => {
                    return (
                      <option title={i} key={i} value={val.c_id}>
                        {val.centername}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="input-field col s6 align-input">
              <select
                className={`browser-default ${
                  errors.sales_id && error_status ? "invalid" : ""
                }`}
                value={sales_id}
                onChange={e => {
                  this.eventHandle(e, "sales_id");
                }}
              >
                <option value="">Select Sales Person</option>
                {salesData &&
                  salesData.map((val, i) => {
                    return (
                      <option title={i} key={i} value={val.user_id}>
                        {val.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="input-field col s6 align-input">
              <input
                type="text"
                onChange={e => {
                  this.eventHandle(e, "proposal_value");
                }}
                className={
                  errors.proposal_value && error_status ? "invalid" : ""
                }
                maxLength={10}
                value={proposal_value}
              />
              <label
                htmlFor="text-input"
                className={errors.proposal_value ? "" : "active"}
              >
                proposal Value
              </label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12 right">
              <button
                type="button"
                onClick={e => {
                  this.onsubmit();
                }}
                className="btn btn-sm btn-primary"
              >
                Save
              </button>
              &nbsp;&nbsp;
              <button
                type="button"
                onClick={e => {
                  this.close_lead();
                }}
                className="btn-sm btn-default"
              >
                Cancel
              </button>
              
              &nbsp;&nbsp;
              {lead_status_read == 1 && (
                <button
                  type="button"
                  onClick={e => {
                    this.genrateAgreement(lead_code);
                  }}
                  className="btn btn-sm btn-primary"
                >
                  Genrate Agreement
                </button>
              )}
            </div>
          </div>
          <br/>
          <br/>
          <br/>
        </form>
        {preloader && <Preloader />}
      </div>
    );
  }
}

export default Header;
