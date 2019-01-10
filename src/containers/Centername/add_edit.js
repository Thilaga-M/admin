import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addCenter,
  update_fetch_status,
  viewCenter
} from "../../actions/centernameActions";
import browserHistory from "../../core/History";
import { Link } from "react-router";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";

function validate(
  centername,
  address,
  map_latitude,
  map_longitude,
  contact_number,
  total_sqft,
  emergency_contact,
  status,
  reference_code,
  agreement_reference_year
) {
  
  //let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
  let numbers = /^\d{10}$/;
  let regs = /^\d+$/;
  return {
    centername: centername.length === 0,
    address: address.length === 0,
    map_latitude: map_latitude.length === 0,
    map_longitude: map_longitude.length === 0,
    contact_number: !numbers.test(contact_number),
    total_sqft: !regs.test(total_sqft),
    emergency_contact: !numbers.test(emergency_contact),
    status: status.length === 0,
    reference_code: reference_code.length === 0,
    agreement_reference_year:agreement_reference_year.length ===0
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      centername: "",
      address: "",
      map_latitude: "",
      map_longitude: "",
      contact_number: "",
      total_sqft: "",
      emergency_contact: "",
      preloader: this.props.params.c_id ? true : false,
      floor_plan_image: "",
      error_status: false,
      status: 1,
      title: this.props.params.c_id ? "Edit" : "New",
      reference_code:"",
      agreement_reference_year:""

    };
    this.eventHandle = this.eventHandle.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
  
  }

  componentWillMount() {
    if (this.props.params.c_id) {
      viewCenter(this.props.params.c_id).then(res => {
        if (res.data.status === 200) {
          let data = res.data.data;
          this.setState({
            centername: data.centername,
            address: data.address,
            map_latitude: data.map_latitude ? data.map_latitude : "",
            map_longitude: data.map_longitude ? data.map_longitude : "",
            contact_number: data.contact_number,
            total_sqft: data.total_sqft,
            emergency_contact: data.emergency_contact,
            floor_plan_image: data.floor_plan_image,
            error_status: true,
            preloader: false,
            status: 1,
            reference_code:data.reference_code?data.reference_code:"",
            agreement_reference_year:(data.agreement_reference_year) ? data.agreement_reference_year : "",

          });
        }
      });
    }
  }

  eventHandle(e, key, val) {
    this.setState({ [key]: key === "status" ? val : e.target.value });
  }

  onsubmit() {
    let {
      centername,
      address,
      map_latitude,
      map_longitude,
      contact_number,
      total_sqft,
      emergency_contact,
      floor_plan_image,
      status,
      reference_code,
      agreement_reference_year
    } = this.state;
    let errors = validate(
      centername,
      address,
      map_latitude,
      map_longitude,
      contact_number,
      total_sqft,
      emergency_contact,
      status,
      reference_code,
      agreement_reference_year
    );
    let isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({ preloader: true });
    if (isDisabled === false) {
      let params = {
        centername: centername,
        address: address,
        map_latitude: map_latitude,
        map_longitude: map_longitude,
        contact_number: contact_number,
        total_sqft: total_sqft,
        emergency_contact: emergency_contact,
        floor_plan_image: "floor_plan_image",
        status: status,
        reference_code,
        agreement_reference_year
      };
      let para = this.props.params.c_id ? "/" + this.props.params.c_id : "";
      addCenter(params, para).then(res => {
        if (res.data.status === 200) {
          this.props.update_fetch_status();
          browserHistory.push("settings/general/centername");
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
      centername,
      address,
      map_latitude,
      map_longitude,
      contact_number,
      total_sqft,
      emergency_contact,
      floor_plan_image,
      status,
      error_status,
      title,
      preloader,
      reference_code,
      agreement_reference_year
    } = this.state;
    let errors = validate(
      centername,
      address,
      map_latitude,
      map_longitude,
      contact_number,
      total_sqft,
      emergency_contact,
      status,
      reference_code,
      agreement_reference_year
    );

    let role = permissionCheck("centername", title);
    if (!role) return <Nopermission />;

    return (
      <div className="portlet">
        <div className="transition-item detail-page">
          <div className="main-content div-center">
            <div className="col s12 portlet-title">
              <div className="caption">CENTER</div>
            </div>
            <form method="post" encType="multipart/form-data">
              <div className="row">
                <div className="input-field col s12">
                  <input
                    type="text"
                    onChange={e => {
                      this.eventHandle(e, "centername");
                    }}
                    className={
                      errors.centername && error_status ? "invalid" : ""
                    }
                    value={centername}
                  />
                  <label className={errors.centername ? "" : "active"}>
                    Center Name
                  </label>
                </div>
                <div className="input-field col s12">
                  <textarea
                    rows="5"
                    onChange={e => {
                      this.eventHandle(e, "address");
                    }}
                    className={`materialize-textarea ${
                      errors.address && error_status ? "invalid" : ""
                    } `}
                    value={address}
                  />
                  <label className={errors.address ? "" : "active"}>
                    Address
                  </label>
                </div>

                <div className="input-field col s12">
                  <input
                    type="text"
                    onChange={e => {
                      this.eventHandle(e, "map_latitude");
                    }}
                    className={
                      errors.map_latitude && error_status ? "invalid" : ""
                    }
                    value={map_latitude}
                  />
                  <label className={errors.map_latitude ? "" : "active"}>
                    Map Latitude
                  </label>
                </div>
                <div className="input-field col s12">
                  <input
                    type="text"
                    onChange={e => {
                      this.eventHandle(e, "map_longitude");
                    }}
                    className={
                      errors.map_longitude && error_status ? "invalid" : ""
                    }
                    value={map_longitude}
                  />
                  <label className={errors.map_longitude ? "" : "active"}>
                    Map Longitude
                  </label>
                </div>

                <div className="input-field col s12">
                  <input
                    type="text"
                    onChange={e => {
                      this.eventHandle(e, "contact_number");
                    }}
                    className={
                      errors.contact_number && error_status ? "invalid" : ""
                    }
                    value={contact_number}
                    maxLength={10}
                  />
                  <label className={errors.contact_number ? "" : "active"}>
                    Contact Number
                  </label>
                </div>

                <div className="input-field col s12">
                  <input
                    type="text"
                    onChange={e => {
                      this.eventHandle(e, "total_sqft");
                    }}
                    className={
                      errors.total_sqft && error_status ? "invalid" : ""
                    }
                    value={total_sqft}
                  />
                  <label className={errors.total_sqft ? "" : "active"}>
                    Total sqft
                  </label>
                </div>

                <div className="input-field col s12">
                  <input
                    type="text"
                    maxLength={10}
                    onChange={e => {
                      this.eventHandle(e, "emergency_contact");
                    }}
                    className={
                      errors.emergency_contact && error_status ? "invalid" : ""
                    }
                    value={emergency_contact}
                  />
                  <label className={errors.emergency_contact ? "" : "active"}>
                    Emergency Contact
                  </label>
                </div>
                
                <div className="input-field col s12">
                  <input
                    type="text"
                    maxLength={2}
                    onChange={e => {
                      this.eventHandle(e, "reference_code");
                    }}
                    className={
                      errors.reference_code && error_status ? "invalid" : ""
                    }
                    value={reference_code}
                  />
                  <label className={errors.reference_code ? "" : "active"}>
                    Center Reference Code
                  </label>
                </div>

                <div className="input-field col s12">
                  <input
                    type="text"
                    maxLength={4}
                    onChange={e => {
                      this.eventHandle(e, "agreement_reference_year");
                    }}
                    className={
                      errors.agreement_reference_year && error_status ? "invalid" : ""
                    }
                    value={agreement_reference_year}
                  />
                  <label className={errors.agreement_reference_year ? "" : "active"}>
                    Agreement Reference Year
                  </label>
                </div>


                <div className="file-field input-field col s12">
                  <div className="btn">
                    <span>File</span>
                    <input type="file" />
                  </div>
                </div>

                <div className="input-field col s12">
                  <input
                    type="radio"
                    id="inline-radio1"
                    name="inline-radios"
                    checked={status == 0 ? true : false}
                  />
                  <label
                    htmlFor="Hot Lead"
                    onClick={e => {
                      this.eventHandle(e, "status", 0);
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
                      this.eventHandle(e, "status", 1);
                    }}
                  >
                    Active
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
                to="settings/general/centername"
                className="btn btn-sm btn-default"
              >
                Cancel
              </Link>
              
            </div>
            <br />
          </div>
          {preloader && <Preloader />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.centernameReducer
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ update_fetch_status }, dispatch);
};

const CenterAEContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(AddEdit);

export default CenterAEContainer;
