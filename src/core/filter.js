import React,{ Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state={ 
                search_term: '',
                follow_date:0,
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
    this.statusSearch = this.statusSearch.bind(this);
   }
   componentWillReceiveProps(props){
     if (this.state.height==='0%' && props.filtershow) {
       this.setState({height:'100%'})
      }
   }

   handleChange(date) {
     this.setState({
      startDate: date,
      start:Date.parse(date)  / 1000 
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
  btnChange(e){
     this.setState({
       follow_date:(this.state.follow_date)?0:1
    },()=>{
     this.props.btnChange(this.state.follow_date);
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
       
        this.props.filterSearch({search_term:this.state.search_term,start:this.state.start,end:this.state.end});
       
   } 

   statusSearch(e){
      this.props.statusSearch(e.target.value);
   } 
   salesSearch(e){
      this.props.salesSearch(e.target.value);
   } 

  render() {

    let {addbtn,statusSearch,salesData}=this.props;
    let {follow_date}=this.state;
    let leadstatus=["New","Hot","Cold","Lost","Won"];
 
    return (
            <div className="filter">
              <div className="filterSearch">
              
                <div className="col s2" style={{margin:'10px'}}>
                  <DatePicker selected={this.state.startDate}
                  selectsStart
                  startDate={this.state.startDate}
                  endDate={this.state.endDate} 
                  placeholderText="From Date" 
                  dateFormat="DD/MM/YYYY"  
                  readOnly={true} 
                  className="datepicker form-control" 
                  onChange={this.handleChange} />
                </div>

                <div className="col s2" style={{margin:'10px'}}>
                  <DatePicker selected={this.state.endDate}
                  selectsEnd
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  placeholderText="To Date" 
                  dateFormat="DD/MM/YYYY"  
                  readOnly={true} 
                  className="datepicker form-control" 
                  onChange={this.handleChangeEnd} />
                </div>

                <div className="col s2" style={{margin:'10px'}}>
                 <input type="text" id="input1-group2" name="input1-group2" className="form-control" onChange={this.searchTerm} value={this.state.search_term} placeholder="Search..."/>
                </div>
                <div className="col s5" style={{margin:'10px'}}>

                 <button style={{float:"left"}} type="button" onClick={this.applyFilter.bind(this)}  className="btn filterBtn">Search</button>&nbsp;&nbsp;
                 { addbtn && 
                    <Link style={{float:"left",marginLeft:"6px"}} to={`/${addbtn}`}> <button type="button" className="btn filterBtn">Add</button></Link>
                 } 
                 {
                  statusSearch && 
                   <button style={{float:"left",marginTop:"4px",marginRight:"6px",marginLeft:"6px"}} type="button" onClick={this.btnChange.bind(this)}  className={`filterBtn btn ${(follow_date)?"green":"grey"}`}>Today Follow Up</button>
                }
                {
                  statusSearch && 
                  <select style={{width:"145px",float:"left",marginTop:"2px"}} className="browser-default"  onChange={(e)=>{this.statusSearch(e)}}>
                    <option  value=''>Search Status</option>
                      {
                        leadstatus && leadstatus.map((val,i)=>{ 
                            return (<option title={i} key={i} value={i}>{val}</option>) 
                        })
                      } 
                    </select>
                }
                {
                  statusSearch && 
                  <select className="browser-default" style={{width: '127px', marginLeft: '6px',
                  float: 'left', marginTop: '2px'}}  onChange={(e)=>{this.salesSearch(e)}}>
                  <option  value=''>Sales Person</option>
                    {
                      salesData && salesData.map((val,i)=>{
                          return (<option title={i} key={i} value={val.user_id}>{val.name}</option>)
                      })
                    }
                  </select>
                }
                </div>
              </div>
            </div>
          )
  }
}

export default Filter;


