import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addProformaBilling,
  update_fetch_status,
  proformaBillSave
} from "../../actions/proformaBillingActions";
import browserHistory from "../../core/History";
import { Link } from "react-router";
import { permissionCheck } from "./../../core/permission";
import Nopermission from "./../../components/Nopermission";
import Preloader from "./../../core/Preloader";
import { validationCheck } from "./../../core/validation";
import Profamapreview from "./proformapreview";
import VerifiedProfamaBilldetails from "./verifyproformabilling";
const $ = window.$;
var validateCols = {
  billingMonth: {
    required: true,
    value: "",
    msg: ""
  },
  billingYear: {
    required: true,
    value: "",
    msg: ""
  }
};

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      billingMonth: "",
      billingYear: "",
      status: 1,
      finalData: "",
      preloader: this.props.params.id ? true : false,
      title: this.props.params.id ? "Edit" : "New",
      finalData: "",
      previewBill: false,
      verifiedBill: false,
      isEnabled: false
    };
    this.eventHandle = this.eventHandle.bind(this);
    this.approveBill = this.approveBill.bind(this);
    this.showBillPreview = this.showBillPreview.bind(this);
    this.closeBillPreview = this.closeBillPreview.bind(this);
    this.postbill = this.postbill.bind(this);
    this.closeVerifyBill = this.closeVerifyBill.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
  }

  showBillPreview(previewInvoiceData, companyName) {
    this.setState({
      previewBill: true,
      previewInvoiceData: previewInvoiceData,
      previewCompanyName: companyName
    });
    $("#BillPreview").modal("open");
  }

  closeBillPreview() {
    this.setState({
      previewBill: false,
      previewInvoiceData: "",
      previewCompanyName: ""
    });
    $("#BillPreview").modal("close");
  }

  showVerifyBill() {
    let finalData = this.state.finalData;

    finalData = finalData.filter(bill => bill.verify === 1);

    if (finalData.length > 0) {
      this.setState({ verifiedBillData: finalData, verifiedBill: true });
      $("#VerifiedProfamaBilldetails").modal("open");
    }
  }

  closeVerifyBill() {
    this.setState({ verifiedBill: false });
    $("#VerifiedProfamaBilldetails").modal("close");
  }
  eventHandle(e, key) {
    this.setState({ [key]: e.target.value });
  }

  approveBill(e, key, source) {
    this.state.finalData[key][source] = !this.state.finalData[key][source];
    this.state.finalData[key][source] = this.state.finalData[key][source]
      ? 1
      : 0;

    this.state.isEnabled = this.state.finalData.some(bill => bill.verify);
    this.setState({
      finalData: this.state.finalData,
      isEnabled: this.state.isEnabled
    });
  }

  postbill() {
    let { billingYear, billingMonth, verifiedBillData } = this.state;

    if (verifiedBillData.length > 0) {
      proformaBillSave({
        data: JSON.stringify(verifiedBillData),
        year: billingYear,
        month: billingMonth
      }).then(res => {
        if (res.data.status === 200) {
          this.setState({ preloader: false });
          this.props.update_fetch_status();
          alert("Proforma Bill(s) Created successfully");

          this.setState({ verifiedBillData: "", verifiedBill: false });
          $("#VerifiedProfamaBilldetails").modal("close");
          browserHistory.push("/billing/proformabill-reporting");
        } else {
          alert("Please enter required feilds...");
          this.setState({ error_status: true, preloader: false });
        }
      });
    }
  }

  onsubmit() {
    let { billingYear, billingMonth, status } = this.state;
    let errors = validationCheck(validateCols);
    let isDisabled = Object.keys(errors).some(x => errors[x].msg);
    this.setState({ preloader: true });
    if (isDisabled === false) {
      let params = {
        billingYear: billingYear,
        billingMonth: billingMonth
      };
      let para = this.props.params.id ? "/" + this.props.params.id : "";
      addProformaBilling(params, para).then(res => {
        if (res.data.status === 200) {
          this.state.finalData = res.data.data;
          console.log(this.state.finalData);
          this.setState({ preloader: false });
          this.props.update_fetch_status();

          // browserHistory.push("/billing/group-billing");
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
      billingYear,
      billingMonth,
      status,
      error_status,
      title,
      preloader,
      billingMonthData,
      billingYearData,
      finalData,
      previewBill,
      previewInvoiceData,
      verifiedBill,
      isEnabled,
      verifiedBillData,
      previewCompanyName
    } = this.state;
    billingMonthData = [
      { month: "01", monthName: "January" },
      { month: "02", monthName: "February" },
      { month: "03", monthName: "March" },
      { month: "04", monthName: "April" },
      { month: "05", monthName: "May" },
      { month: "06", monthName: "June" },
      { month: "07", monthName: "July" },
      { month: "08", monthName: "August" },
      { month: "09", monthName: "September" },
      { month: "10", monthName: "October" },
      { month: "11", monthName: "November" },
      { month: "12", monthName: "December" }
    ];
    billingYearData = [{ year: "2017" }, { year: "2018" }, { year: "2019" }];

    let role = permissionCheck("gst", title);
    if (!role) return <Nopermission />;
    validateCols.billingYear.value = billingYear;
    validateCols.billingMonth.value = billingMonth;
    let errors = validationCheck(validateCols);

    return (
      <div className="portlet">
        <div className="transition-item detail-page">
          <div className="main-content div-center">
            <div id="BillPreview" className="modal" style={{ width: "65%" }}>
              <div className="modal-content">
                <h6>Profama Invoice</h6>
                {previewBill && (
                  <Profamapreview
                    closeBillPreview={this.closeBillPreview}
                    invoiceData={previewInvoiceData}
                    previewCompanyName={previewCompanyName}
                  />
                )}
              </div>
            </div>
            <div
              id="VerifiedProfamaBilldetails"
              className="modal"
              style={{ width: "65%" }}
            >
              <div className="modal-content">
                <h6>Bill for posting</h6>
                {verifiedBill && (
                  <VerifiedProfamaBilldetails
                    closeVerifyBillDetails={this.closeVerifyBill}
                    postBill={this.postbill}
                    verifiedBillData={verifiedBillData}
                  />
                )}
              </div>
            </div>
            <div className="col s12 portlet-title">
              <div className="caption">PROFORMA BILLING</div>
            </div>
            <form method="post">
              <div className="row">
                <div className="input-field col s6 margin-s6" >
                  <select
                    className={`browser-default ${
                      errors.billingMonth.msg && error_status ? "invalid" : ""
                    }`}
                    value={billingMonth}
                    onChange={e => {
                      this.eventHandle(e, "billingMonth");
                    }}
                  >
                    <option value="">Select Billing Month</option>
                    {billingMonthData &&
                      billingMonthData.map((val, i) => {
                        return (
                          <option title={i} key={i} value={val.month}>
                            {val.monthName}
                          </option>
                        );
                      })}
                  </select>
                  {errors.billingMonth.msg && error_status ? (
                    <div className="validation-error">
                      {errors.billingMonth.msg}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="input-field col s6 margin-s6">
                  <select
                    className={`browser-default ${
                      errors.billingYear.msg && error_status ? "invalid" : ""
                    }`}
                    value={billingYear}
                    onChange={e => {
                      this.eventHandle(e, "billingYear");
                    }}
                  >
                    <option value="">Select Billing Year</option>
                    {billingYearData &&
                      billingYearData.map((val, i) => {
                        return (
                          <option title={i} key={i} value={val.year}>
                            {val.year}
                          </option>
                        );
                      })}
                  </select>
                  {errors.billingYear.msg && error_status ? (
                    <div className="validation-error">
                      {errors.billingYear.msg}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12 center">
                  <button
                    type="button"
                    onClick={e => {
                      this.onsubmit();
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
          {finalData && (
            <div>
              <br />
              <table className="striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="leftAlignText">Company Name</th>
                    <th className="center-align">Total Amount</th>
                    <th className="center-align">Action</th>
                    <th className="center-align">Approve Bill</th>
                  </tr>
                </thead>
                <tbody>
                  {finalData &&
                    finalData.map((val, i) => {
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td className="leftAlignText">{val.company_name}</td>
                          <td className="center-align">{val.amount}</td>
                          <td className="center-align">
                            <Link
                              to=""
                              className="btn btn-sm btn-danger"
                              onClick={e => {
                                this.showBillPreview(
                                  val.serviceList,
                                  val.company_name
                                );
                              }}
                            >
                              View
                            </Link>
                          </td>
                          <td className="center-align">
                            <input
                              type="checkbox"
                              className="filled-in"
                              checked={val.verify ? true : false}
                              value="{val.verify}"
                            />
                            <label
                              onClick={e => {
                                this.approveBill(e, i, "verify");
                              }}
                              htmlFor="inline-checkbox1"
                            />
                            &nbsp;&nbsp;
                          </td>
                        </tr>
                      );
                    })}

                  {finalData && finalData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="center red-text">
                        No Record Found...!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {isEnabled && (
                <div className="row">
                  <div
                    className="input-field col s12"
                    style={{ textAlign: "center" }}
                  >
                    <button
                      type="button"
                      onClick={e => {
                        this.showVerifyBill();
                      }}
                      className="btn btn-sm btn-danger"
                    >
                      Approve Bill
                    </button>
                    &nbsp;&nbsp;
                  </div>
                </div>
              )}
            </div>
          )}

          <br />
          {preloader && <Preloader />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.groupBillingReducer
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ update_fetch_status }, dispatch);
};

const AEContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(AddEdit);

export default AEContainer;
