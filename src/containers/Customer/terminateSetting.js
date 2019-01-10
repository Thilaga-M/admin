import React, { Component } from "react";
import { Link } from "react-router";
import Preloader from "./../../core/Preloader";
import {
  fetchCustomerSpace,
  terminateUnits
} from "../../actions/customerActions";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import browserHistory from "../../core/History";

class TerminateClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cabinList: [],
      isEnabled: false,
      preloader: false,
      note: "",
      terminate_date: ""
    };
    this.approveUnit = this.approveUnit.bind(this);
    this.handleChangeTerminate = this.handleChangeTerminate.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount = () => {
    if (localStorage.getItem("cust_hid")) {
      this.setState({ preloader: true });
      fetchCustomerSpace(localStorage.getItem("cust_hid")).then(res => {
        if (res.data.status === 200) {
          this.setState({ preloader: false, cabinList: res.data.cabinList });
        }
      });
    }
  };

  handleChangeTerminate(date, e) {
    this.setState({
      terminate_date: moment(date)
    });
  }
  approveUnit(e, key, source) {
    this.state.cabinList[key][source] = !this.state.cabinList[key][source];
    this.state.cabinList[key][source] = this.state.cabinList[key][source]
      ? 1
      : 0;

    this.state.isEnabled = this.state.cabinList.some(unit => unit.verify);
    this.setState({
      cabinList: this.state.cabinList,
      isEnabled: this.state.isEnabled
    });
    console.log(this.state);
  }

  submit = () => {
    let { cabinList, note, terminate_date } = this.state;
    if (
      terminate_date === null ||
      terminate_date === "" ||
      terminate_date === undefined
    ) {
      alert("Enter Terminate Date");
      return false;
    }
    if (note === null || note === "" || note === undefined) {
      alert("Enter note");
      return false;
    }
    if (!localStorage.getItem("cust_hid")) {
      alert("Enter note");
      return false;
    }
    this.setState({ preloader: false });
    let params = {
      terminate_date: moment(new Date(terminate_date)).format("YYYY-MM-DD"),
      note: note,
      cabinList: cabinList.filter(unit => unit.verify === 1),
      cust_hid: localStorage.getItem("cust_hid")
    };
    let para = "";
    terminateUnits(params).then(res => {
      if (res.data.status === 200) {
        alert("Processed Successfully");
        browserHistory.push("/customers/client-setting/customer-setting");
      } else {
        alert("Please enter required feilds...");
        this.setState({ preloader: false });
      }
    });
  };
  render() {
    let { cabinList, isEnabled, preloader, note, terminate_date } = this.state;
    return (
      <div className="portlet_table">
        <div className="transition-item detail-page">
          <div className="main-content">
            <div className="col s12 portlet-title">
              <div className="caption">TERMINATE UNITS</div>
            </div>
            <div>
              {cabinList && (
                <div>
                  <br />
                  <table className="striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th className="center-align">Office No</th>
                        <th className="center-align">No of work station</th>
                        <th className="center-align">Area (m2)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cabinList &&
                        cabinList.map((val, i) => {
                          return (
                            <tr key={i}>
                              <td className="center-align">
                                <input
                                  type="checkbox"
                                  className="filled-in"
                                  checked={val.verify ? true : false}
                                  value="{val.verify}"
                                />
                                <label
                                  onClick={e => {
                                    this.approveUnit(e, i, "verify");
                                  }}
                                  htmlFor="inline-checkbox1"
                                />
                                &nbsp;&nbsp;
                              </td>
                              <td className="center-align">{val.cabinname}</td>
                              <td className="center-align">
                                {val.no_of_work_station}
                              </td>
                              <td className="center-align">{val.area}</td>
                            </tr>
                          );
                        })}

                      {cabinList &&
                        cabinList.length === 0 && (
                          <tr>
                            <td colSpan="4" className="center red-text">
                              No Record Found...!
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                  {isEnabled && (
                    <div className="row">
                      <div className="input-field col s6">
                        <DatePicker
                          showYearDropdown
                          showMonthDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={20}
                          selected={terminate_date}
                          dateFormat="DD/MM/YYYY"
                          readOnly={true}
                          className="datepicker form-control"
                          onChange={this.handleChangeTerminate}
                        />
                        <label
                          htmlFor="text-input"
                          className={this.state.terminate_date ? "" : "active"}
                        >
                          Termination Date
                        </label>
                      </div>
                      <div className="input-field col s6">
                        <textarea
                          onChange={e => {
                            this.setState({ note: e.target.value });
                          }}
                          className={
                            this.state.note.length === 0
                              ? "materialize-textarea invalid"
                              : "materialize-textarea"
                          }
                          value={note}
                        />
                        <label
                          htmlFor="text-input"
                          className={
                            this.state.note.length === 0 ? "" : "active"
                          }
                        >
                          Note
                        </label>
                      </div>
                    </div>
                  )}
                  <div className="row">
                    <div
                      className="input-field col s12"
                      style={{ textAlign: "center" }}
                    >
                      {isEnabled && (
                        <button
                          type="button"
                          onClick={e => {
                            this.submit();
                          }}
                          className="btn btn-sm btn-danger"
                        >
                          Terminate
                        </button>
                      )}
                      &nbsp;&nbsp;
                      <Link
                        to="/customers/client-setting/customer-setting"
                        className="btn btn-sm btn-default"
                      >
                        Cancel
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              <br />
              {preloader && <Preloader />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TerminateClient;
