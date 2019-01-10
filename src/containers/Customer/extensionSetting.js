import React from "react";
import { customerAgreementList } from "../../actions/agreementActions";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
import browserHistory from "./../../core/History";

class AgreementList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      preloader: true
    };
    this.fetchData = this.fetchData.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  componentDidMount() {
    this.fetchData(localStorage.getItem("cust_hid"));
  }

  fetchData(id) {
    customerAgreementList(id).then(res => {
      console.log("25", res);
      this.setState({ data: res.data, preloader: false });
    });
  }

  redirect(e, val) {
    localStorage.removeItem("renewalStatus");
    localStorage.setItem("extensionStatus", true);
    browserHistory.push("leads/add-agreement/");
  }

  render() {
    let role = permissionCheck("customer");
    if (!role) return <Nopermission />;
    const { data } = this.state;
    let action = role.permission ? role.permission.split(",") : [];
    let { preloader } = this.state;

    return (
      <div className="transition-item list-page">
        <div className="main-content">
          {action.indexOf("View") !== -1 && (
            <div className="col s12">
              <div className="rows">
                {data.data &&
                  data.data.map((val, i) => {
                    return (
                      <div
                        key={i}
                        onClick={e => this.redirect(e, val.ag_hid)}
                        className="col m3 s12 center button_cli"
                        style={{ backgroundColor: "#32c5d2" }}
                      >
                        <div>{val.reference_no}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
        {preloader && <Preloader />}
      </div>
    );
  }
}

export default AgreementList;
