import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  fetchCustomerList,
  fetchCustomer
} from "../../actions/customerActions";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import browserHistory from "./../../core/History";

class CustomerSetting extends React.Component {
  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  redirect(e, val) {
    if (val == "agreement-extension") {
      //For Generating New Agreement
      localStorage.removeItem("renewalStatus");
      localStorage.setItem("extensionStatus", true);
      browserHistory.push("leads/add-agreement");
    } else {
      browserHistory.push("/customers/client-setting/" + val);
    }
  }

  render() {
    let role = permissionCheck("customer");
    if (!role) return <Nopermission />;
    let action = role.permission ? role.permission.split(",") : [];
    return (
      <div className="transition-item list-page">
        <div className="main-content">
          {action.indexOf("View") !== -1 && (
            <div className="col s12">
              <div className="rows">
                <div
                  onClick={e => this.redirect(e, "company-setting")}
                  className="col l2 m2 s12 center button_cli button_cli_settings"
                  style={{ backgroundColor: "#32c5d2" }}
                >
                  <div>Company Setting</div>
                </div>

                <div
                  onClick={e => this.redirect(e, "client-setting")}
                  className="col l2 m2 s12 center button_cli button_cli_settings"
                  style={{ backgroundColor: "#32c5d2" }}
                >
                  <div>Client contact Setting</div>
                </div>

                <div
                  onClick={e => this.redirect(e, "finance-setting")}
                  className="col l2 m2 s12 center button_cli button_cli_settings"
                  style={{ backgroundColor: "#32c5d2" }}
                >
                  <div>Financial Setting</div>
                </div>

                <div
                  onClick={e => this.redirect(e, "payment-setting")}
                  className="col l2 m2 s12 center button_cli button_cli_settings"
                  style={{ backgroundColor: "#32c5d2" }}
                >
                  <div>Payment details</div>
                </div>

                <div
                  onClick={e => this.redirect(e, "uploaddocument-setting")}
                  className="col l2 m2 s12 center button_cli button_cli_settings"
                  style={{ backgroundColor: "#32c5d2" }}
                >
                  <div>Upload Document</div>
                </div>

                <div
                  onClick={e => this.redirect(e, "agreement-renewal")}
                  className="col l2 m2 s12 center button_cli button_cli_settings"
                  style={{ backgroundColor: "#32c5d2" }}
                >
                  <div>Renewal</div>
                </div>

                <div
                  onClick={e => this.redirect(e, "agreement-extension")}
                  className="col l2 m2 s12 center button_cli button_cli_settings"
                  style={{ backgroundColor: "#32c5d2" }}
                >
                  <div>Extend</div>
                </div>

                <div
                  onClick={e => this.redirect(e, "terminate-unit")}
                  className="col l2 m2 s12 center button_cli button_cli_settings"
                  style={{ backgroundColor: "#32c5d2" }}
                >
                  <div>Terminate</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.customerReducer
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchCustomer }, dispatch);
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(CustomerSetting);

export default Container;
