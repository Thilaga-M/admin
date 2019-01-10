import React,{ Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state={ 
                search_term: '',
                start: Date.now() / 1000,
                end: 0, 
                height:'0%',
                startDate: '',
                endDate:'',
                range:1
           }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.reset = this.reset.bind(this);
    this.searchTerm = this.searchTerm.bind(this);
   }
   componentWillReceiveProps(props){
     if (this.state.height==='0%' && props.filtershow) {
       this.setState({height:'100%'})
      }
   }

   handleChange(date) {
     this.setState({
      startDate: date,
      start:Date.parse(date)  / 1000,
      end: 0
    });
  }
  
  handleChangeEnd(date) {
     this.setState({
       endDate: date,
       end:Date.parse(date) / 1000
    });
  }

  searchTerm(e){
     this.setState({
       search_term: e.currentTarget.value 
    }); 
  }

  quicksearch(range){

    var d = new Date();
    var start = 0;
    var end = 86399000;
    if (range ===1) {
      end = start = d.getTime();
    }
    else if (range ===2) {
      end = start = d.setDate(d.getDate() - 1);
    }
    else if (range ===3) {
      end = d.setTime(d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000);
      start = d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000);
    }
    else if (range ===4) {
      end = d.setTime(d.getTime() - d.getDate() * 24 * 60 * 60 * 1000);
      start = d.setDate(1);
    }
     this.setState({
          startDate: '',
          endDate: '',
          start: start / 1000,
          end:end / 1000,
          range:range
    }); 
  }

  reset(){
    this.setState({ 
                search_term: '',
                start: Date.now() / 1000,
                end: 0, 
                startDate: '',
                endDate:'',
                range:1
           })
  }

  closeNav(){
     this.setState({ height:'0%'});
   } 
   applyFilter(){
       if(this.props.module==='billing')
       { 
        this.props.billingfilter({search_term:this.state.search_term,start:this.state.start,end:this.state.end});
       }
        this.setState({ height:'0%'});
   } 

  render() {
    return (
            <div className="overlay" style={{height:this.state.height}}>
                <div className="overlay-content">
                   <div className="btn-group full-width" data-toggle="buttons" aria-label="First group">
                      <label className={(this.state.range===1)?"label-btn btn btn-outline-secondary active":"label-btn btn btn-outline-secondary" } onClick={this.quicksearch.bind(this,1)}>
                        <input type="radio" name="options" id="option1"/> Today
                      </label>
                      <label className={(this.state.range===2)?"label-btn btn btn-outline-secondary active":"label-btn btn btn-outline-secondary" } onClick={this.quicksearch.bind(this,2)}>
                        <input type="radio" name="options" id="option2" /> Yesterday
                      </label>
                      <label className={(this.state.range===3)?"label-btn btn btn-outline-secondary active":"label-btn btn btn-outline-secondary" } onClick={this.quicksearch.bind(this,3)}>
                        <input type="radio" name="options" id="option2" /> Last Week
                      </label>
                      <label className={(this.state.range===4)?"label-btn btn btn-outline-secondary active":"label-btn btn btn-outline-secondary" } onClick={this.quicksearch.bind(this,4)}>
                        <input type="radio" name="options" id="option3"/> Last Month
                      </label>
                    </div>
 
                    <div className="form-group">
                         <div className="input-group left-date"> 
                           <DatePicker selected={this.state.startDate} placeholderText="From Date" dateFormat="DD/MM/YYYY"  readOnly={true} className="datepicker form-control" onChange={this.handleChange} />
                        </div>
                       <div className="input-group right-date">
                        <DatePicker selected={this.state.endDate} placeholderText="To Date" dateFormat="DD/MM/YYYY"  readOnly={true} className="datepicker form-control" onChange={this.handleChangeEnd} />
                      </div> 
                    </div>

                    <div className="input-group" style={{paddingTop:'10px',paddingLeft:'4px',paddingRight:'4px'}}>
                         <input type="text" id="input1-group2" name="input1-group2" className="form-control" onChange={this.searchTerm} value={this.state.search_term} placeholder="Search..."/>
                    </div>


                    <div className="buttons">
                         <span><button type="button" onClick={this.reset.bind(this)} className="btn btn-outline-danger btn-sm active">Clear</button></span>
                         <span><button type="button" onClick={this.closeNav.bind(this)} className="btn btn-outline-danger btn-sm active">Close</button></span>
                         <span><button type="button" onClick={this.applyFilter.bind(this)}  className="btn btn-sm btn-warning active">Apply</button></span>
                    </div>
                  
                </div>
            </div>
          )
  }
}

export default Filter;


