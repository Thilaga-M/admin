import React from 'react';
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
                limit:10,
                page:1
        }, 
      preloader:false
    }
    this.redirect = this.redirect.bind(this);   
   }
 
  redirect(e,val){
      if(val==0)localStorage.setItem("billtype",1);//If service allocation is 0, Recurring     
      if(val==1)localStorage.setItem("billtype",1);//If service allocation is 1, One time
      if(val==2)localStorage.setItem("billtype",2);//If service allocation is 2, volume sales

      localStorage.setItem("allocate_id",val);
      
      browserHistory.push('/customers/serviceallocation/company-list/');
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
                      <div className="caption">SERVICE ALLOCATION
                      </div>
                    </div>
                { action.indexOf("View")!==-1 &&
                  <div  className="col s12">
                      <div className="rows">
                          <div className="col l2 m2 s12 center button_cli" onClick={(e)=>this.redirect(e,0)}>
                            <div>Recurring</div>
                          </div>
                          <div className="col l2 m2 s12 center button_cli" onClick={(e)=>this.redirect(e,1)}>
                            <div>One Time</div>
                          </div> 
                          <div className="col l2 m2 s12 center button_cli" onClick={(e)=>this.redirect(e,2)}>
                            <div>Direct Bill</div>
                          </div>

                           <div className="col l2 m2 s12 center button_cli">
                            <a target="_blank" href="http://ec2-35-154-222-199.ap-south-1.compute.amazonaws.com/booking/web/"><div>Booking</div></a>
                          </div>
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