import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listallcompany,fetchCustomer,fetchSpace} from '../../actions/customerActions';
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
                cust_hid:localStorage.getItem("cust_hid"), 
                limit:10,
                page:1
        }, 
      preloader:true
    }
    this.fetchData = this.fetchData.bind(this);  
    this.redirect = this.redirect.bind(this);  
    this.PagenationChange = this.PagenationChange.bind(this);
   }

  componentDidMount(){
        this.fetchData();
  }
  fetchData(){

        fetchSpace(this.state.params).then((res)=>{
           this.setState({data:res.data.result,preloader:false})
       });
  }
  redirect(e,val){
      localStorage.setItem("space_id",val);
      if(localStorage.getItem("allocate_id")==3)//For booking
      {
        browserHistory.push('customers/serviceallocation/company-list/employee-list/space-allocation/booking');  
      }
      browserHistory.push('customers/serviceallocation/company-list/employee-list/space-allocation/service-add');
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
                <div className="col s12 portlet-title"> 
                      <div className="caption">SPACE
                      </div>
                    </div>
                { action.indexOf("View")!==-1 &&
                  <div  className="col s12">
                      <div className="rows">
                        {
                          data.data && data.data.map((val,i)=>{
                            return (<div key={i} onClick={(e)=>this.redirect(e,val.cust_did)} style={{height: '25%'}} className="col m3 s12 center button_cli">
                              <div>{val.cabinname}</div>
                              <div>{val.cabin_no}</div>
                            </div>)
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