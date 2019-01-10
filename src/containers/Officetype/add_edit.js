import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addType,
  update_fetch_status,
  viewType
} from "../../actions/officetypeActions";
import browserHistory from "../../core/History";
import { Link } from "react-router";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";

function validate(officetype, status) {
  return {
    officetype: officetype.length === 0,
    status: status.length === 0
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      officetype: "",
      status: 1,
      error_status: false,
      preloader: this.props.params.id ? true : false,
      title: this.props.params.id ? "Edit" : "New",
      is_virtual: 0
    };
    this.eventHandle = this.eventHandle.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
    // this.totalCalculation=this.totalCalculation.bind(this);
  }

  componentWillMount() {
    if (this.props.params.id) {
      viewType(this.props.params.id).then(res => {
        if (res.data.status === 200) {
          let data = res.data.data;
          this.setState({
            officetype: data.officetype,
            is_virtual: data.is_virtual,
            status: data.status,
            error_status: true,
            preloader: false
          });
        }
      });
    }
  }

  eventHandle(e, key) {
    this.setState({ [key]: e.target.value });
  }

  handlechange = key => {
    this.setState({ [key]: this.state[key] ? 0 : 1 });
  };

  onsubmit() {
    let { officetype, status, is_virtual } = this.state;
    let errors = validate(officetype, status);
    let isDisabled = Object.keys(errors).some(x => errors[x]);
    this.setState({ preloader: true });
    if (isDisabled === false) {
      let params = {
        officetype: officetype,
        is_virtual: is_virtual,
        status: status
      };
      let para = this.props.params.id ? "/" + this.props.params.id : "";
      addType(params, para).then(res => {
        if (res.data.status === 200) {
          this.props.update_fetch_status();
          browserHistory.push("settings/general/officetype");
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
      officetype,
      status,
      error_status,
      title,
      preloader,
      is_virtual
    } = this.state;

    let role = permissionCheck("officetype", title);
    if (!role) return <Nopermission />;
    let errors = validate(officetype, status);

    return (
      <div className="portlet">
        <div className="transition-item detail-page">
          <div className="main-content div-center">
            <div className="col s12 portlet-title">
              <div className="caption">{title} OFFICE TYPE</div>
            </div>

            <form method="post" encType="multipart/form-data">
              <div className="row">
                <div className="input-field col s6">
                  <input
                    type="text"
                    onChange={e => {
                      this.eventHandle(e, "officetype");
                    }}
                    className={
                      errors.officetype && error_status ? "invalid" : ""
                    }
                    value={officetype}
                  />
                  <label className={errors.officetype ? "" : "active"}>
                    Office Type
                  </label>
                </div>
                <div className="input-field col s6">
                  <input
                    type="checkbox"
                    className="filled-in"
                    checked={is_virtual == 1 ? true : false}
                    value={is_virtual}
                  />
                  <label
                    htmlFor="inline-checkbox1"
                    onClick={e => {
                      this.handlechange("is_virtual");
                    }}
                  >
                    Is Virtual
                  </label>{" "}
                  &nbsp;&nbsp;
                </div>
              </div>
            </form>
            <br />
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
                to="settings/general/officetype"
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
