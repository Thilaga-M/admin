import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Link } from "react-router";
import http from "./http-call";
import { fetchService } from "./../actions/serviceActions";

var param = require("jquery-param");
class ReportFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        bill_status: 1
      },

      company_name: "",
      service_name: "",
      follow_date: 0,
      start: Date.now() / 1000,
      end: 0,
      height: "0%",
      startDate: "",
      endDate: "",
      range: 1,
      companyList: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.reset = this.reset.bind(this);
    this.statusSearch = this.statusSearch.bind(this);
  }
  componentWillReceiveProps(props) {
    if (this.state.height === "0%" && props.filtershow) {
      this.setState({ height: "100%" });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    http.get("/receiptcustomer", { params: {} }).then(res => {
      this.setState({ companyList: res.data.data });
    });

    let self = this;
    setTimeout(() => {
      self.props.fetchService(self.state.params).then(() => {
        self.setState({ preloader: false });
      });
    }, 2);
  }

  eventHandle = (e, key) => {
    this.setState({ [key]: e.target.value });
  };
  handleChange(date) {
    this.setState({
      startDate: moment(date),
      start: Date.parse(date) / 1000
    });
  }

  handleChangeEnd(date) {
    this.setState({
      endDate: moment(date),
      end: Date.parse(date) / 1000
    });
  }

  btnChange(e) {
    this.setState(
      {
        follow_date: this.state.follow_date ? 0 : 1
      },
      () => {
        this.props.btnChange(this.state.follow_date);
      }
    );
  }

  quicksearch(range) {
    var d = new Date();
    var start = 0;
    var end = 86399000;
    if (range === 1) {
      end = start = d.getTime();
    } else if (range === 2) {
      end = start = d.setDate(d.getDate() - 1);
    } else if (range === 3) {
      end = d.setTime(
        d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000
      );
      start = d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000);
    } else if (range === 4) {
      end = d.setTime(d.getTime() - d.getDate() * 24 * 60 * 60 * 1000);
      start = d.setDate(1);
    }
    this.setState({
      startDate: "",
      endDate: "",
      start: start / 1000,
      end: end / 1000,
      range: range
    });
  }

  reset() {
    this.setState({
      company_name: "",
      service_name: "",
      start: Date.now() / 1000,
      end: 0,
      startDate: "",
      endDate: "",
      range: 1
    });
  }

  closeNav() {
    this.setState({ height: "0%" });
  }

  statusSearch(e) {
    this.props.statusSearch(e.target.value);
  }
  salesSearch(e) {
    this.props.salesSearch(e.target.value);
  }

  callPrint(e) {
    this.props.callPrint();
  }
  callExcel(e) {
    this.props.callExcel();
  }

  applyFilter() {
    this.props.filterSearch({
      company_name: this.state.company_name,
      service_name: this.state.service_name,
      start: this.state.start,
      end: this.state.end,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      displayFilter: this.state.displayFilter,
      periodFilter: this.state.periodFilter
    });
  }

  handleclick(e){
    this.setState({selected:e.target.value,center:e.target.options[e.target.selectedIndex].text});
  }
  changeCenter(){
  localStorage.setItem("c_id",this.state.selected);
  localStorage.setItem("centerName",this.state.center);
  this.setState({selected:'',center:''});
  location.reload();
  }

  render() {

    let clength = localStorage.getItem("clength");
    let username = localStorage.getItem("username");
    let c_id = localStorage.getItem("c_id");
    let business_name = localStorage.getItem("business_name");
    let Cresult =JSON.parse(localStorage.getItem("Cresult"));
    let centerName=localStorage.getItem("centerName");
    if(clength>1 && !c_id){
      setTimeout(()=>{
        this.popup();
      },5);
      }else{
        centerName=(centerName)?centerName:(Cresult)?Cresult[0].centername:'';
      }



    const { data } = this.props;
    let { addbtn, statusSearch, salesData } = this.props;
    let {
      follow_date,
      companyList,
      company_name,
      services,
      service_name,
      displayFilter,
      periodFilter
    } = this.state;
    let leadstatus = ["New", "Hot", "Cold", "Lost", "Won"];
    return (
      <div className="filter">
        <div className="filterSearch"  style={{marginBottom: '0%'}}>
          <div className="col s2" style={{margin:'5px'}}>
            <select value={this.state.selected}  onChange={(e)=>{this.handleclick(e)}} >
                      <option>Select Center</option>
                      {
                        Cresult && Cresult.map((val,i)=>{
                            return (<option title={i} key={i} value={val.c_id}>{val.centername}</option>)
                        })
                      } 
                </select> 
          </div>
          <div className="col s2" style={{margin:'5px'}}>
            <DatePicker
              selected={this.state.startDate}
              selectsStart
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              placeholderText="From Date"
              dateFormat="DD/MM/YYYY"
              readOnly={true}
              className="datepicker form-control"
              onChange={this.handleChange}
            />
          </div>

          <div className="col s2" style={{margin:'5px'}}>
            <DatePicker
              selected={this.state.endDate}
              selectsEnd
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              placeholderText="To Date"
              dateFormat="DD/MM/YYYY"
              readOnly={true}
              className="datepicker form-control"
              onChange={this.handleChangeEnd}
            />
          </div>


         <div className="input-field col s2" style={{ marginTop: "2px",margin:'5px'}}>
            <select
              value={company_name}
              onChange={e => {
                this.eventHandle(e, "company_name");
              }}
            >
              <option value="">Select Company Name</option>
              {companyList &&
                companyList.map((val, i) => {
                  return (
                    <option title={i} key={i} value={val.company_name}>
                      {val.company_name}
                    </option>
                  );
                })}
            </select>
          </div>
          
          <div className="col s5" style={{ width: "28.6667%" ,margin:'5px'}}>
            <button
              style={{ float: "left" }}
              type="button"
              onClick={this.applyFilter.bind(this)}
              className="btn filterBtn"
            >
              Submit
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              onClick={this.callPrint.bind(this)}
              className="btn filterBtn"
            >
              Print
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              onClick={this.callExcel.bind(this)}
              className="btn filterBtn"
            >
              Excel
            </button>
            &nbsp;&nbsp;
            {statusSearch && (
              <button
                style={{
                  float: "left",
                  marginTop: "4px",
                  marginRight: "6px",
                  marginLeft: "6px"
                }}
                type="button"
                onClick={this.btnChange.bind(this)}
                className={`filterBtn btn ${follow_date ? "green" : "grey"}`}
              >
                Today Follow Up
              </button>
            )}
            {statusSearch && (
              <select
                style={{ width: "145px", float: "left", marginTop: "2px" }}
                className="browser-default"
                onChange={e => {
                  this.statusSearch(e);
                }}
              >
                <option value="">Search Status</option>
                {leadstatus &&
                  leadstatus.map((val, i) => {
                    return (
                      <option title={i} key={i} value={i}>
                        {val}
                      </option>
                    );
                  })}
              </select>
            )}
            {statusSearch && (
              <select
                className="browser-default"
                style={{
                  width: "127px",
                  marginLeft: "6px",
                  float: "left",
                  marginTop: "2px"
                }}
                onChange={e => {
                  this.salesSearch(e);
                }}
              >
                <option value="">Sales Person</option>
                {salesData &&
                  salesData.map((val, i) => {
                    return (
                      <option title={i} key={i} value={val.user_id}>
                        {val.name}
                      </option>
                    );
                  })}
              </select>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.serviceReducer
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchService }, dispatch);
};

const ReportFilterContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(ReportFilter);

export default ReportFilterContainer;
