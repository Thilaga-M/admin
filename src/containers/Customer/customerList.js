import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listallcompany,fetchCustomer} from '../../actions/customerActions';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import Pagination from "react-js-pagination";
import Filter from './../../core/filter';
import browserHistory from './../../core/History';
 
class CustomerList extends React.Component {
  constructor(props) {
    super(props);
    this.state={
       data:[],
        params:{
                search_term: '',
                startDate: '',
                endDate:'',  
                limit:18,
                page:1
        }, 
      preloader:true
    }
    this.fetchData = this.fetchData.bind(this);  
    this.redirect = this.redirect.bind(this);  
    this.PagenationChange = this.PagenationChange.bind(this);
    this.viewInactive = this.viewInactive.bind(this);  
    
   }

  componentDidMount(){
        this.fetchData();
  }
  fetchData(){
        listallcompany(this.state.params).then((res)=>{
        this.setState({data:res.data.result,preloader:false})
       });
  }
  viewInactive(){
    browserHistory.push('/customers/client-setting-inactive/');

  }


  redirect(e,val){
      localStorage.setItem("cust_hid",val);
      browserHistory.push('/customers/client-setting/customer-setting');
  }
 
  PagenationChange(page) {
     this.setState({params:{...this.state.params,page},preloader:true});
     this.fetchData();
  }
  
   render() {
       let role=permissionCheck("customer");
      if(!role)
        return <Nopermission/>
    const { data} = this.state;
    let action=(role.permission)?role.permission.split(","):[];
    let {preloader}=this.state; 
    let current_page=(data)?data.current_page:0;
    let per_page=(data)?data.per_page:0;
    let total=(data)?data.total:0;
       return (
             <div className="transition-item list-page">
                <div className="main-content">
                  <div className="col s5 rightAlign">
                    <button type="button" onClick={this.viewInactive} className="btn btn-sm btn-primary">
                       View Inactive  
                    </button>
                  </div>


                  {action.indexOf("View")!==-1 &&
                    <div  className="col s12">
                        <div className="rows">
                          {
                            data.data && data.data.sort((a, b) => a.company_name > b.company_name) && data.data.map((val,i)=>{
                                return val.status == 1 ?
                                <div key={i} onClick={(e)=>this.redirect(e,val.cust_hid)} className="col m3 s12 center button_cli" 
                                  style={{backgroundColor: '#32c5d2'}}>
                                  <div>{val.company_name}</div>
                                </div>
                                :
                                <h1></h1>
                            })
                          }
                        </div>
                    </div>
                  }
 
                    {
                      (total>per_page) &&
                      <div className="paginate-div" >
                         <Pagination
                              activePage={current_page}
                              itemsCountPerPage={per_page}
                              totalItemsCount={total} 
                              pageRangeDisplayed={5}
                              onChange={this.PagenationChange}
                            />
                      </div>
                    }
               </div>
               { preloader && <Preloader/> }
            </div> 
  
    )
  }
}


const mapStateToProps = (state) => ({
  data: state.customerReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchCustomer},dispatch);
}

const Container = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(CustomerList)

export default Container;