import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import Path from "../../core/Config";

class TallyExport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date: "",
      end_date: "",
      startDate: "",
      endDate: ""
    };
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
  }

  handleChangeStart(date, e) {
    let startdate = moment(new Date(date)).format("YYYY-MM-DD");
    this.setState({
      start_date: moment(date),
      startDate: startdate
    });
  }
  handleChangeEnd(date, e) {
    let enddate = moment(new Date(date)).format("YYYY-MM-DD");
    this.setState({
      endDate: enddate,
      end_date: moment(date)
    });
  }

  submit = () => {};
  render() {
    return (
      <div className="portlet">
        <div className="transition-item detail-page">
          <div className="main-content div-center">
            <div className="col s12 portlet-title">
              <div className="caption">Tally Export</div>
            </div>

            <div className="row">
              <div className="input-field col s6  margin-s6">
                <DatePicker
                  selected={this.state.start_date}
                  dateFormat="DD/MM/YYYY"
                  readOnly={true}
                  className="datepicker form-control"
                  onChange={this.handleChangeStart}
                />
                <label className={""}>Start Date</label>
              </div>
              <div className="input-field col s6 margin-s6">
                <DatePicker
                  selected={this.state.end_date}
                  dateFormat="DD/MM/YYYY"
                  readOnly={true}
                  className="datepicker form-control"
                  onChange={this.handleChangeEnd}
                />
                <label className={""}>End Date</label>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <a
                  className={
                    this.state.start_date && this.state.end_date
                      ? "btn btn-sm btn-danger center"
                      : "btn btn-sm btn-danger center disabled"
                  }
                  href={
                    Path.apiUrl +
                    `/getTallyXml?startDate=` +
                    this.state.startDate +
                    `&endDate=` +
                    this.state.endDate
                  }
                  target="_blank"
                >
                  Export Tally XML
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TallyExport;
