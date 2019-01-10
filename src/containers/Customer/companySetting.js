import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addCustomer,
  update_fetch_status,
  viewcompany,
  officespacelist,
  updatecompany
} from "../../actions/customerActions";
import {
  getCountryList,
  getStateList,
  getCityList,
  getPincodeList
} from "../../actions/pincodeActions";
import { officeType } from "../../actions/leadsActions";
import browserHistory from "../../core/History";
import { Link } from "react-router";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
function validate(
  customer_name,
  company_name,
  address,
  discount,
  office_space_ids,
  allocate_office_price,
  annexure,
  status,
  phone,
  mobile,
  email
) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let numbers = /^\d{10}$/;
  let regs = /^\d+$/;
  return {
    customer_name: customer_name.length === 0,
    company_name: company_name.length === 0,
    address: address.length === 0,
    email: reg.test(email) === false,
    // customer_type:customer_type.length===0,
    discount: !regs.test(discount),
    phone: !numbers.test(phone),
    mobile: !numbers.test(mobile),
    office_space_ids: office_space_ids.length === 0,
    allocate_office_price: allocate_office_price.length === 0,
    annexure: annexure.length === 0,
    /*    agreement_start_date: annexure.length===0,
agreement_end_date:annexure.length===0,*/
    status: status.length === 0
  };
}
class AddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cust_hid: "",
      company_name: "",
      office_space_ids: "",
      type_data: [],
      address1: "",
      address2: "",
      contact_number: "",
      emailid: "",
      country: "",
      countryall: [],
      state: "",
      stateall: [],
      city: "",
      cityall: [],
      pincode: "",
      pincodeAll: [],
      industry_type: "",
      center_country: "",
      home_center: "",
      status: "",
      loading: false,
      error_status: false,
      extension: "",
      preloader: this.props.params.id ? true : false,
      title: this.props.params.id ? "Edit" : "New"
    };
    this.eventHandle = this.eventHandle.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
  }
  componentDidMount() {
    let cust_hid = localStorage.getItem("cust_hid");
    if (cust_hid) {
      viewcompany(cust_hid).then(res => {
        if (res.data.status === 200) {
          let data = res.data.data;
          this.getCityLists(data.state);
          this.getPincodeLists(data.city);
          this.getStateLists(data.country);
          this.setState({
            cust_hid: data.cust_hid,
            company_name: data.company_name,
            address1: data.address1,
            address2: data.address2,
            contact_number: data.contact_number,
            emailid: data.emailid,
            country: data.country,
            state: data.state,
            city: data.city,
            pincode: data.pincode,
            industry_type: data.industry_type,
            center_country: data.center_country,
            home_center: data.home_center,
            status: data.status,
            extension: data.extension,
            error_status: true,
            preloader: false
          });
        }
      });
    }
    getCountryList().then(res => {
      if (res.data.status === 200) {
        let data = res.data.data;
        this.setState({ countryall: data });
      }
    });
    officeType().then(res => {
      if (res.data.status === 200) {
        let data = res.data.result.data;
        this.setState({ type_data: data });
      }
    });
    //console.log(this.props.params.id);
  }
  getStateLists(id) {
    getStateList(id).then(res => {
      if (res.data.status === 200) {
        let data = res.data.data;
        this.setState({ stateall: data });
      }
    });
  }
  getCityLists(id) {
    getCityList(id).then(res => {
      if (res.data.status === 200) {
        let data = res.data.data;
        this.setState({ cityall: data });
      }
    });
  }
  getPincodeLists(id) {
    getPincodeList(id).then(res => {
      if (res.data.status === 200) {
        let data = res.data.data;
        this.setState({ pincodeAll: data });
      }
    });
  }
  eventHandle(e, key) {
    if (key === "country") {
      this.getStateLists(e.target.value);
    } else if (key === "state") {
      this.getCityLists(e.target.value);
    } else if (key === "city") {
      this.getPincodeLists(e.target.value);
    } else {
      this.setState({ [key]: e.target.value });
    }
  }
  onsubmit() {
    let {
      cust_hid,
      company_name,
      address1,
      address2,
      contact_number,
      emailid,
      country,
      state,
      city,
      pincode,
      industry_type,
      center_country,
      home_center,
      status,
      extension
    } = this.state;
    let errors = validate(
      company_name,
      address1,
      address2,
      contact_number,
      emailid,
      country,
      state,
      city,
      pincode,
      industry_type,
      center_country,
      home_center,
      status
    );
    let isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({ preloader: true });
    if (isDisabled) {
      let params = {
        company_name: company_name,
        address1: address1,
        address2: address2,
        contact_number: contact_number,
        emailid: emailid,
        country: country,
        state: state,
        city: city,
        pincode: pincode,
        industry_type: industry_type,
        center_country: center_country,
        home_center: home_center,
        status: status,
        extension: extension
      };
      let cust_hid = localStorage.getItem("cust_hid");
      updatecompany(params, cust_hid).then(res => {
        if (res.data.status === 200) {
          // this.props.update_fetch_status();
          browserHistory.push("customers/client-setting/customer-setting");
        } else {
          alert("Please enter required feilds...");
          this.setState({ error_status: true, preloader: false });
        }
      });
    } else {
      this.setState({ error_status: true, preloader: false });
    }
  }
  render() {
    let {
      company_name,
      address1,
      address2,
      contact_number,
      emailid,
      country,
      state,
      city,
      pincode,
      industry_type,
      center_country,
      home_center,
      error_status,
      status,
      preloader,
      title,
      office_space_ids,
      type_data,
      pincodeAll,
      stateall,
      cityall,
      countryall,
      extension
    } = this.state;
    let errors = validate(
      company_name,
      address1,
      contact_number,
      emailid,
      country,
      state,
      city,
      pincode,
      industry_type,
      center_country,
      home_center,
      status
    );
    let role = permissionCheck("customer", title);
    if (!role) return;
    <Nopermission />;
    return (
      <div className="portlet">
        <div className="transition-item detail-page">
          <div className="main-content">
            <div className="col s12 portlet-title">
              <div className="caption">COMPANY SETTING</div>
            </div>
            <form method="post" encType="multipart/form-data">
              <div className="col s12" style={{ margin: "2%" }}>
                <h7 className="sub-header">COMPANY ADDRESS</h7>
                <div className="row">
                  {/*
                  <div className="input-field col s4">
                     <input type="text"  onChange={(e)=>{this.eventHandle(e,"home_center")}} className={(errors.home_center && error_status)?'invalid':''} value={home_center} />
                     <label className={(errors.home_center)?'':'active'}>Home Center</label>
                  </div>
                  */}
                  <div className="input-field col s4">
                    <input
                      type="text"
                      onChange={e => {
                        this.eventHandle(e, "company_name");
                      }}
                      className={
                        errors.company_name && error_status ? "invalid" : ""
                      }
                      value={company_name}
                    />
                    <label className={errors.company_name ? "" : "active"}>
                      Company Name
                    </label>
                  </div>
                  <div className="input-field col s4">
                    <input
                      type="text"
                      onChange={e => {
                        this.eventHandle(e, "contact_number");
                      }}
                      className={
                        errors.contact_number && error_status ? "invalid" : ""
                      }
                      maxLength={15}
                      value={contact_number}
                    />
                    <label className={errors.contact_number ? "" : "active"}>
                      Contact No
                    </label>
                  </div>
                  <div className="input-field col s4">
                    <input
                      type="email"
                      onChange={e => {
                        this.eventHandle(e, "emailid");
                      }}
                      className={
                        errors.emailid && error_status ? "invalid" : ""
                      }
                      value={emailid}
                    />
                    <label className={errors.emailid ? "" : "active"}>
                      Email Id
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s4">
                    <textarea
                      rows="5"
                      onChange={e => {
                        this.eventHandle(e, "address1");
                      }}
                      className={`materialize-textarea ${
                        errors.address1 && error_status ? "invalid" : ""
                      } `}
                      value={address1}
                    />
                    <label className={errors.address1 ? "" : "active"}>
                      Address Line 1
                    </label>
                  </div>
                  <div className="input-field col s4">
                    <textarea
                      rows="5"
                      onChange={e => {
                        this.eventHandle(e, "address2");
                      }}
                      className={`materialize-textarea ${
                        errors.address2 && error_status ? "invalid" : ""
                      } `}
                      value={address2}
                    />
                    <label className={errors.address2 ? "" : "active"}>
                      Address Line 2
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s4">
                    <select
                      className={`browser-default ${
                        errors.center_country && error_status ? "invalid" : ""
                      }`}
                      value={center_country}
                      onChange={e => {
                        this.eventHandle(e, "center_country");
                      }}
                    >
                      <option value="">Select Center Country</option>
                      {countryall &&
                        countryall.map((val, i) => {
                          return (
                            <option title={i} key={i} value={val.country_id}>
                              {val.country_name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="input-field col s4">
                    <select
                      className={`browser-default ${
                        errors.country && error_status ? "invalid" : ""
                      }`}
                      value={country}
                      onChange={e => {
                        this.eventHandle(e, "country");
                      }}
                    >
                      <option value="">Select Country</option>
                      {countryall &&
                        countryall.map((val, i) => {
                          return (
                            <option title={i} key={i} value={val.country_id}>
                              {val.country_name}
                            </option>
                          );
                        })}
                    </select>
                    {errors.country && error_status ? (
                      <div className="validation-error">{errors.country}</div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="input-field col s4">
                    <select
                      className={`browser-default ${
                        errors.state && error_status ? "invalid" : ""
                      }`}
                      value={state}
                      onChange={e => {
                        this.eventHandle(e, "state");
                      }}
                    >
                      <option value="">Select State</option>
                      {stateall &&
                        stateall.map((val, i) => {
                          return (
                            <option title={i} key={i} value={val.state_id}>
                              {val.state_name}
                            </option>
                          );
                        })}
                    </select>
                    {errors.state && error_status ? (
                      <div className="validation-error">{errors.state}</div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s4">
                    <select
                      className={`browser-default ${
                        errors.city && error_status ? "invalid" : ""
                      }`}
                      value={city}
                      onChange={e => {
                        this.eventHandle(e, "city");
                      }}
                    >
                      <option value="">Select City</option>
                      {cityall &&
                        cityall.map((val, i) => {
                          return (
                            <option title={i} key={i} value={val.city_id}>
                              {val.city_name}
                            </option>
                          );
                        })}
                    </select>
                    {errors.city && error_status ? (
                      <div className="validation-error">{errors.city}</div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="input-field col s4">
                    <input
                      type="text"
                      onChange={e => {
                        this.eventHandle(e, "pincode");
                      }}
                      className={
                        errors.pincode && error_status ? "invalid" : ""
                      }
                      maxLength={15}
                      value={pincode}
                    />
                    <label
                      htmlFor="text-input"
                      className={errors.pincode ? "" : "active"}
                    >
                      Pincode
                    </label>
                  </div>
                </div>
              </div>
              <div className="col s12" style={{ margin: "2%" }}>
                <h7 className="sub-header">COMPANY DETAILS</h7>
                <div className="row">
                  <div className="input-field col s4">
                    <select
                      className={`browser-default ${
                        errors.industry_type && error_status ? "invalid" : ""
                      }`}
                      value={industry_type}
                      onChange={e => {
                        this.eventHandle(e, "industry_type");
                      }}
                    >
                      <option value="">Select Office Type</option>
                      {type_data &&
                        type_data.map((val, i) => {
                          return (
                            <option title={i} key={i} value={val.officetype}>
                              {val.officetype}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="input-field col s4">
                    <textarea
                      rows="5"
                      onChange={e => {
                        this.eventHandle(e, "extension");
                      }}
                      className={`materialize-textarea ${
                        errors.extension && error_status ? "invalid" : ""
                      } `}
                      value={extension}
                    />
                    <label className={errors.extension ? "" : "active"}>
                      Extension
                    </label>
                  </div>
                  <div className="input-field col s4">
                    <input
                      type="radio"
                      id="inline-radio1"
                      name="inline-radios"
                      checked={status == 0 ? true : false}
                    />
                    <label
                      htmlFor="Hot Lead"
                      onClick={e => {
                        //this.eventHandle(e, "status", 0);
                        this.setState({ status: 0 });
                      }}
                    >
                      InActive
                    </label>
                    <input
                      type="radio"
                      id="inline-radio2"
                      name="inline-radios"
                      checked={status == 1 ? true : false}
                    />
                    <label
                      htmlFor="Cold Lead"
                      onClick={e => {
                        this.setState({ status: 1 });
                      }}
                    >
                      Active
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <div className="card-footer">
                    
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
                    <Link
                      to="leads/online-agreement"
                      className="btn btn-sm btn-default"
                    >
                      Cancel
                    </Link>
                    
                  </div>
                </div>
              </div>
            </form>
          </div>
          {preloader && <Preloader />}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  data: state.customerReducer
});
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ update_fetch_status }, dispatch);
};
const CustomerAEContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(AddEdit);
export default CustomerAEContainer;
