import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  viewcompany,
  updateFinance,
  fetchEmployee,
  update_fetch_status
} from "../../actions/customerActions";
import browserHistory from "../../core/History";
import { Link } from "react-router";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";

function validate(
  primary_contact,
  invoice_contact1,
  invoice_contact2,
  collocation_contact,
  gst_status
) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let numbers = /^\d{10}$/;
  let regs = /^\d+$/;
  return {
    primary_contact: primary_contact.length === 0,
    invoice_contact1: invoice_contact1.length === 0,
    invoice_contact2: invoice_contact2.length === 0,
    collocation_contact: collocation_contact.length === 0,
    gst_status: gst_status.length === 0
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      primary_contact: "",
      invoice_contact1: "",
      invoice_contact2: "",
      collocation_contact: "",
      gst_status: 0,
      finance_email: "",
      employees: [],
      error_status: false,
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
        console.log(res);
        if (res.data.status === 200) {
          let data = res.data.data;
          this.setState({
            primary_contact: data.primary_contact,
            invoice_contact1: data.invoice_contact1,
            invoice_contact2: data.invoice_contact2,
            collocation_contact: data.collocation_contact,
            finance_email: data.finance_email,
            gst_status: data.gst_status,
            error_status: true,
            preloader: false
          });
        }
      });
    }

    fetchEmployee({
      cust_hid: localStorage.getItem("cust_hid"),
      limit: 1000,
      page: 1
    }).then(res => {
      if (res.data.status === 200) {
        let data = res.data.result.data;
        this.setState({ employees: data });
      }
    });
  }

  eventHandle(e, key, val) {
    this.setState({ [key]: key === "gst_status" ? val : e.target.value });
  }

  onsubmit() {
    let {
      primary_contact,
      invoice_contact1,
      invoice_contact2,
      collocation_contact,
      gst_status,
      finance_email
    } = this.state;
    let errors = validate(
      primary_contact,
      invoice_contact1,
      invoice_contact2,
      collocation_contact,
      gst_status
    );
    let isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({ preloader: true });
    isDisabled = true;
    if (isDisabled) {
      let params = {
        primary_contact: primary_contact,
        invoice_contact1: invoice_contact1,
        invoice_contact2: invoice_contact2,
        collocation_contact: collocation_contact,
        gst_status: gst_status,
        finance_email: finance_email
      };
      let cust_hid = localStorage.getItem("cust_hid");
      updateFinance(params, cust_hid).then(res => {
        if (res.data.status === 200) {
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
      primary_contact,
      invoice_contact1,
      invoice_contact2,
      collocation_contact,
      employees,
      title,
      preloader,
      error_status,
      gst_status,
      finance_email
    } = this.state;
    let errors = validate(
      primary_contact,
      invoice_contact1,
      invoice_contact2,
      collocation_contact,
      gst_status
    );
    let role = permissionCheck("customer", title);
    if (!role) return <Nopermission />;
    return (
      <div className="portlet">
        <div className="transition-item detail-page">
          <div className="main-content">
            <div className="col s12 portlet-title">
              <div className="caption">FINANCIAL SETTING</div>
            </div>
            <form method="post" encType="multipart/form-data">
              <div className="row">
                <div className="input-field col s4">
                  <select
                    className={`browser-default ${
                      errors.primary_contact && error_status ? "invalid" : ""
                    }`}
                    value={primary_contact}
                    onChange={e => {
                      this.eventHandle(e, "primary_contact");
                    }}
                  >
                    <option value="">Select Primary Contact</option>
                    {employees &&
                      employees.map((val, i) => {
                        return (
                          <option title={i} key={i} value={val.custemp_id}>
                            {val.first_name}
                          </option>
                        );
                      })}
                  </select>
                </div>

                <div className="input-field col s4">
                  <select
                    className={`browser-default ${
                      errors.invoice_contact1 && error_status ? "invalid" : ""
                    }`}
                    value={invoice_contact1}
                    onChange={e => {
                      this.eventHandle(e, "invoice_contact1");
                    }}
                  >
                    <option value="">Select Invoice Contact1</option>
                    {employees &&
                      employees.map((val, i) => {
                        return (
                          <option title={i} key={i} value={val.custemp_id}>
                            {val.first_name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="input-field col s4">
                  <select
                    className={`browser-default ${
                      errors.invoice_contact2 && error_status ? "invalid" : ""
                    }`}
                    value={invoice_contact2}
                    onChange={e => {
                      this.eventHandle(e, "invoice_contact2");
                    }}
                  >
                    <option value="">Select Invoice Contact2</option>
                    {employees &&
                      employees.map((val, i) => {
                        return (
                          <option title={i} key={i} value={val.custemp_id}>
                            {val.first_name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>

              <div className="row">
                

                <div className="input-field col s4">
                  <select
                    className={`browser-default ${
                      errors.collocation_contact && error_status
                        ? "invalid"
                        : ""
                    }`}
                    value={collocation_contact}
                    onChange={e => {
                      this.eventHandle(e, "collocation_contact");
                    }}
                  >
                    <option value="">Select Collocation Contact</option>
                    {employees &&
                      employees.map((val, i) => {
                        return (
                          <option title={i} key={i} value={val.custemp_id}>
                            {val.first_name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="input-field col s4">
                  <input
                    type="text"
                    onChange={e => {
                      this.eventHandle(e, "finance_email");
                    }}
                    value={finance_email}
                  />
                  <label className={"active"}>Email Address</label>
                </div>
                <div className="input-field col s4">
                  <input
                    type="radio"
                    id="inline-radio1"
                    name="inline-radios"
                    checked={gst_status == 0 ? true : false}
                  />
                  <label
                    htmlFor="Hot Lead"
                    onClick={e => {
                      this.eventHandle(e, "gst_status", 0);
                    }}
                  >
                    CGST/SGST
                  </label>

                  <input
                    type="radio"
                    id="inline-radio2"
                    name="inline-radios"
                    checked={gst_status == 1 ? true : false}
                  />
                  <label
                    htmlFor="Cold Lead"
                    onClick={e => {
                      this.eventHandle(e, "gst_status", 1);
                    }}
                  >
                    IGST
                  </label>
                </div>
                
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <div className="card-footer center">
                    
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
                      to="customers/client-setting/customer-setting"
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
