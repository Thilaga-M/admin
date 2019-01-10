import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addService,
  update_fetch_status,
  viewService,
  fetchServicecategory,
  getUnits
} from "../../actions/serviceActions";
import browserHistory from "../../core/History";
import { Link } from "react-router";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";

function validate(
  servicename,
  servicetype /*,quantitytype*/,
  rate,
  status,
  sc_id,
  service_category,
  incometype,
  refundable_deposit
) {
  let regs = /^\d+$/;
  return {
    servicename: servicename.length === 0,
    servicetype: servicetype.length === 0,
    sc_id: sc_id.length === 0,
    service_category: service_category.length === 0,
    // quantitytype:!regs.test(quantitytype),
    rate: !regs.test(rate),
    status: status.length === 0
    //incometype: incometype.length === 0,
    //refundable_deposit: refundable_deposit.length === 0
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      servicename: "",
      servicetype: 1,
      sc_id: "",
      service_category: "",
      slistcategory: [],
      slistunits: [],
      unit_id: "",
      quantitytype: "",
      error_status: false,
      gst_applicable: 1,
      rate: "",
      preloader: this.props.params.id ? true : false,
      status: 1,
      title: this.props.params.id ? "Edit" : "New",
      incometype: "",
      refundable_deposit: ""
    };
    this.eventHandle = this.eventHandle.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
    // this.totalCalculation=this.totalCalculation.bind(this);
  }

  componentWillMount() {
    fetchServicecategory().then(res => {
      if (res.data.status === 200) {
        this.setState({ slistcategory: res.data.result.data });
      }
    });
    getUnits().then(res => {
      if (res.data.status === 200) {
        this.setState({ slistunits: res.data.result.data });
      }
    });

    if (this.props.params.id) {
      viewService(this.props.params.id).then(res => {
        if (res.data.status === 200) {
          let data = res.data.data;
          this.setState({
            servicename: data.servicename,
            servicetype: data.servicetype,
            sc_id: data.sc_id,
            unit_id: data.unit_id,
            service_category: data.service_category,
            quantitytype: data.quantitytype,
            error_status: true,
            gst_applicable: data.gst_applicable,
            rate: data.rate,
            status: 1,
            preloader: false,
            incometype: data.incometype,
            refundable_deposit: data.refundable_deposit
          });
        }
      });
    }
    //console.log(this.props.params.id);
  }

  eventHandle(e, key, val) {
    if (key === "sc_id") {
      let scategory =
        e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
      this.setState({ sc_id: e.target.value, service_category: scategory });
    } else {
      this.setState({
        [key]:
          key === "servicetype" ||
          key === "gst_applicable" ||
          key === "refundable_deposit" ||
          key === "incometype"
            ? val
            : e.target.value
      });
    }
  }

  onsubmit() {
    let {
      unit_id,
      servicename,
      servicetype,
      quantitytype,
      rate,
      status,
      sc_id,
      service_category,
      gst_applicable,
      incometype,
      refundable_deposit
    } = this.state;
    let errors = validate(
      servicename,
      servicetype /*,quantitytype*/,
      rate,
      status,
      sc_id,
      service_category,
      incometype,
      refundable_deposit
    );
    let isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({ preloader: true });
    if (isDisabled === false) {
      let params = {
        servicename: servicename,
        servicetype: servicetype,
        sc_id: sc_id,
        unit_id: unit_id,
        service_category: service_category,
        rate: rate,
        gst_applicable: gst_applicable,
        status: status,
        incometype,
        refundable_deposit
      };
      let para = this.props.params.id ? "/" + this.props.params.id : "";
      addService(params, para).then(res => {
        if (res.data.status === 200) {
          this.props.update_fetch_status();
          browserHistory.push("settings/general/service");
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
      slistunits,
      unit_id,
      servicename,
      servicetype,
      quantitytype,
      rate,
      status,
      error_status,
      title,
      preloader,
      sc_id,
      service_category,
      slistcategory,
      gst_applicable,
      incometype,
      refundable_deposit
    } = this.state;
    let role = permissionCheck("service", title);
    if (!role) return <Nopermission />;
    let errors = validate(
      servicename,
      servicetype /*,quantitytype*/,
      rate,
      status,
      sc_id,
      service_category,
      incometype,
      refundable_deposit
    );
    return (
      <div className="portlet">
        <div className="transition-item detail-page">
          <div className="main-content div-center">
            <div className="col s12 portlet-title">
              <div className="caption">{title} SERVICE</div>
            </div>
            <form method="post" encType="multipart/form-data">
              <div className="row">
                <div className="input-field col s3">
                  <select
                    className={`browser-default ${
                      errors.sc_id && error_status ? "invalid" : ""
                    }`}
                    value={sc_id}
                    onChange={e => {
                      this.eventHandle(e, "sc_id");
                    }}
                  >
                    <option value="">Select service category</option>
                    {slistcategory &&
                      slistcategory.map((val, i) => {
                        return (
                          <option title={i} key={i} value={val.sc_id}>
                            {val.service_category}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="input-field col s3">
                  <input
                    type="text"
                    onChange={e => {
                      this.eventHandle(e, "servicename");
                    }}
                    className={
                      errors.servicename && error_status ? "invalid" : ""
                    }
                    value={servicename}
                  />
                  <label className={errors.servicename ? "" : "active"}>
                    Service Name
                  </label>
                </div>

                <div className="input-field col s3">
                  <input
                    type="text"
                    onChange={e => {
                      this.eventHandle(e, "rate");
                    }}
                    className={errors.rate && error_status ? "invalid" : ""}
                    value={rate}
                  />
                  <label className={errors.rate ? "" : "active"}>Rate</label>
                </div>

                <div className="input-field col s3">
                  <select
                    className={`browser-default ${
                      errors.unit_id && error_status ? "invalid" : ""
                    }`}
                    value={unit_id}
                    onChange={e => {
                      this.eventHandle(e, "unit_id");
                    }}
                  >
                    <option value="">Select Unit</option>
                    {slistunits &&
                      slistunits.map((val, i) => {
                        return (
                          <option title={i} key={i} value={val.unit_id}>
                            {val.unit_name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s6">
                  <input
                    type="radio"
                    id="inline-radio11"
                    name="inline-radios2"
                    checked={gst_applicable == 0 ? true : false}
                  />
                  <label
                    htmlFor="GST Applicable"
                    onClick={e => {
                      this.eventHandle(e, "gst_applicable", 0);
                    }}
                  >
                    GST Not Applicable
                  </label>

                  <input
                    type="radio"
                    id="inline-radio22"
                    name="inline-radios2"
                    checked={gst_applicable == 1 ? true : false}
                  />
                  <label
                    htmlFor="GST Applicable"
                    onClick={e => {
                      this.eventHandle(e, "gst_applicable", 1);
                    }}
                  >
                    GST applicable
                  </label>
                </div>

                <div className="input-field col s6">
                  <input
                    type="radio"
                    id="inline-radio1"
                    name="inline-radios"
                    checked={servicetype == 0 ? true : false}
                  />
                  <label
                    htmlFor="Hot Lead"
                    onClick={e => {
                      this.eventHandle(e, "servicetype", 0);
                    }}
                  >
                    Recurring
                  </label>

                  <input
                    type="radio"
                    id="inline-radio2"
                    name="inline-radios"
                    checked={servicetype == 1 ? true : false}
                  />
                  <label
                    htmlFor="Cold Lead"
                    onClick={e => {
                      this.eventHandle(e, "servicetype", 1);
                    }}
                  >
                    One Time
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s3">Income Type</div>
                <div className="input-field col s6">
                  <input
                    type="radio"
                    id="incometype_rental"
                    name="incometype"
                    checked={incometype == "R" ? true : false}
                  />
                  <label
                    htmlFor="incometype_rental"
                    onClick={e => {
                      this.eventHandle(e, "incometype", "R");
                    }}
                  >
                    {" "}
                    Rental
                  </label>
                  &nbsp;
                  <input
                    type="radio"
                    id="incometype_service"
                    name="incometype"
                    checked={incometype == "S" ? true : false}
                  />
                  <label
                    htmlFor="incometype_service"
                    onClick={e => {
                      this.eventHandle(e, "incometype", "S");
                    }}
                  >
                    {" "}
                    Service
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s3">Refundable Deposit</div>
                <div className="input-field col s6">
                  <input
                    type="radio"
                    id="refundable_deposit_yes"
                    name="refundable_deposit"
                    checked={refundable_deposit == 1 ? true : false}
                  />
                  <label
                    htmlFor="refundable_deposit_yes"
                    onClick={e => {
                      this.eventHandle(e, "refundable_deposit", 1);
                    }}
                  >
                    {" "}
                    Yes
                  </label>
                  &nbsp;
                  <input
                    type="radio"
                    id="refundable_deposit_no"
                    name="refundable_deposit"
                    checked={refundable_deposit == 0 ? true : false}
                  />
                  <label
                    htmlFor="refundable_deposit_no"
                    onClick={e => {
                      this.eventHandle(e, "refundable_deposit", 0);
                    }}
                  >
                    {" "}
                    No
                  </label>
                </div>
              </div>
            </form>
            <br />
            <div className="card-footer right">
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
                to="settings/general/service"
                className="btn btn-sm btn-default"
              >
                Cancel
              </Link>
              
            </div>
          </div>
          <br />
          {preloader && <Preloader />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.serviceReducer
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ update_fetch_status }, dispatch);
};

const ServiceAEContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(AddEdit);

export default ServiceAEContainer;
