import React, { Component } from "react";
import { Link } from "react-router";
import browserHistory from "./../../core/History";
import moment from "moment";
import Preloader from "./../../core/Preloader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import moment from 'moment';

import {
  getCreditNoteList,
  addCreditNote
} from "../../actions/creditnoteActions";

const $ = window.$;

class CreditNoteModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      preloader: false,
      credit_date: "",
      serviceItemList: [],
      comments: ""
    };

    this.onsubmit = this.onsubmit.bind(this);
    this.closemodal = this.closemodal.bind(this);
    this.handleChangeReceiptDate = this.handleChangeReceiptDate.bind(this);
  }

  componentDidMount() {
    if (this.props.invoiceno) {
      let params = {
        invoiceno: this.props.invoiceno,
        transactionid: this.props.transactionid
      };
      getCreditNoteList(params).then(res => {
        console.log("response", res);
        if (res.data.status === 200) {
          this.setState({
            serviceItemList: res.data.serviceItems,
            preloader: false
          });
        }
      });
    }
  }

  handleChangeReceiptDate(date, e) {
    this.setState({
      credit_date: date
    });
  }

  onsubmit() {
    if (this.state.credit_date.length == 0) {
      alert("Enter credit date");
      return false;
    }

    if (this.state.comments == "" || this.state.comments.length == 0) {
      alert("Enter your Comment");
      return false;
    }

    this.setState({ preloader: true });

    let params = {
      credit_date: moment(new Date(this.state.credit_date)).format(
        "YYYY-MM-DD"
      ),
      comments: this.state.comments,
      invoiceno: this.props.invoiceno,
      transactionid: this.props.transactionid
    };
    let para = "";
    addCreditNote(params, para).then(res => {
      if (res.data.status === 200) {
        this.setState({ preloader: false });
        this.closemodal();
      } else {
        alert("Please enter required feilds...");
        this.setState({ preloader: false });
      }
    });
  }

  closemodal() {
    this.props.closeCreditNote();
  }

  dateFormat(dateString) {
    var splitArr = dateString.split(" ");
    var dateObj = splitArr[0].split("-");
    return dateObj[2] + "-" + dateObj[1] + "-" + dateObj[0];
  }

  render() {
    let { preloader, credit_date, serviceItemList } = this.state;

    return (
      <div>
        <div>
          <div className="row">
            <div className="input-field col s12 center">
              <h6>Credit Note</h6>
            </div>
          </div>

          <div>
            <div className="row">
              <div className="input-field col s6">
                Customer Name : {this.props.company_name}
              </div>
              <div className="input-field col s6">
                <DatePicker
                  selected={credit_date}
                  dateFormat="DD/MM/YYYY"
                  readOnly={true}
                  className="datepicker form-control"
                  onChange={this.handleChangeReceiptDate}
                />
                <label className={""}>Credit Date</label>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col s12">
                <table className="striped">
                  <thead className="fixed-header">
                    <tr>
                      <th>Service Name</th>
                      <th>From Period</th>
                      <th>To Period</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody className="fixed-div">
                    {serviceItemList.map((val, i) => {
                      return (
                        <tr key={i}>
                          <td>{val.service_master_name}</td>
                          <td>{this.dateFormat(val.from_period)}</td>
                          <td>{this.dateFormat(val.to_period)}</td>
                          <td>{val.qty}</td>
                          <td>{val.invoice_amount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <textarea
                  onChange={e => {
                    this.setState({ comments: e.target.value });
                  }}
                  className={"materialize-textarea"}
                  value={this.state.comments}
                />
                <label className={"active"}>Comment</label>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <button
                  type="button"
                  onClick={e => {
                    this.onsubmit();
                  }}
                  className="btn btn-sm btn-danger center"
                >
                  Submit
                </button>
                &nbsp;{" "}
                <button
                  type="button"
                  onClick={e => {
                    this.closemodal();
                  }}
                  className="btn btn-sm btn-default"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        {preloader && <Preloader />}
      </div>
    );
  }
}

export default CreditNoteModule;
