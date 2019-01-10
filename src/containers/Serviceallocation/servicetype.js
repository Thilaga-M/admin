import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchServiceallocation,deleteServiceallocation,servicemasterlist} from '../../actions/serviceallocationActions';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import Pagination from "react-js-pagination";
import Filter from './../../core/filter';
 
class Serviceallocation extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        params:{
                search_term: '',
                startDate: '',
                endDate:'',  
                limit:process.perpage,
                page:1
        }, 
      preloader:true,
      spacelist:[]
    }
    this.fetchData = this.fetchData.bind(this); 
    this.delete = this.delete.bind(this); 
    this.filterSearch = this.filterSearch.bind(this);  
    this.PagenationChange = this.PagenationChange.bind(this); 
    this.servicelistFetch = this.servicelistFetch.bind(this); 
   }
  componentWillMount(){
    if(this.props.data.fetched===false){
        this.fetchData()
      }
      else{
        this.servicelistFetch();
      }
      
  }
  servicelistFetch(){
    servicemasterlist(this.props.params.c_id).then((res)=>{
         if(res.data.status===200){
            let data=res.data.data;
            this.setState({spacelist:data,preloader:false})
          }
      })
  }
  fetchData(){
    let self = this;
    setTimeout(()=>{
       self.props.fetchServiceallocation(self.state.params).then(()=>{
          this.servicelistFetch();
       });
     },2)
  }

  delete(id){

    let del=confirm("Are you sure, do you want delete?");
    if(del){
      let page=1;
      this.setState({preloader:true,params:{...this.state.params,page}});
      deleteServiceallocation(id).then((res)=>{
        if(res.data.status===200){
          this.fetchData();
        }else{
          alert("Not delete");
          this.setState({preloader:true});
        }
     }) 
    }
  }
   filterSearch(data){ 
    this.setState({preloader:true});
    let self = this;
    let search_term=data.search_term;
    let startDate=data.start;
    let endDate=data.end;
    self.setState({params:{...self.state.params,search_term,startDate,endDate}})
    this.fetchData();
  }
  PagenationChange(page) {
     this.setState({params:{...this.state.params,page},preloader:true});
     this.fetchData();
  }
  
   render() {
       let role=permissionCheck("customer");
      if(!role)
        return <Nopermission/>
    const { data,spacelist} = this.props;
    let action=(role.permission)?role.permission.split(","):[];
    let {preloader}=this.state; 
    let current_page=(data)?data.current_page:0;
    let per_page=(data)?data.per_page:0;
    let total=(data)?data.total:0;
       return (
             <div className="transition-item list-page">
                <div className="main-content">
                  <div className="col s12 portlet-title"> 
                      <div className="caption">SERVICE TYPE
                      </div>
                    </div>
                <Filter  filterSearch={this.filterSearch.bind(this)}  addbtn={(action.indexOf("New")!==-1)?"customers/serviceallocation/company-list/employee-list/space-allocation/service-type/service-add":""}/>
     
                { action.indexOf("View")!==-1 &&
                <table className="striped">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Company Name</th>
                      <th>Address</th> 
                      <th>Discount</th>
                      <th>Total GST Amount</th> 
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    data.data && data.data.map((val,i)=>{

                      return(
                        <tr key={i}>
                            <td>{val.company_name}</td>
                            <td>{val.customer_name}</td>
                            <td>{val.address}</td> 
                            <td>{val.allocate_office_price}</td>
                            <td>{val.discount}</td>
                            <td>{val.allocate_discount_price}</td> 
                            <td>
                              <span className={`badge ${(val.status===1)?'badge-success':'badge-danger'}`}>{(val.status===1)?'Active':'InActive'}</span>
                            </td>
                            <td>
                              { action.indexOf("Edit")!==-1 &&
                                <Link to={`customers/serviceallocation/company-list/employee-list/space-allocation/service-type/service-edit/${val.sa_hid}`}><i className="material-icons dp48 invalid">edit</i></Link>
                              }&nbsp;&nbsp;
                              {action.indexOf("Delete")!==-1 &&
                                <span onClick={(e)=>{this.delete(val.sa_hid)}} ><i className="material-icons dp48 invalid">delete</i></span>
                              }
                            </td>
                        </tr>
                        )
                    })
                  }
                        {
                          (data.data && data.data.length===0 )&&
                            <tr>  
                                <td colSpan="12" className="center red-text">No Record Found...!</td> 
                            </tr> 
                        }
                        
                        </tbody>
                      </table> 
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
  data: state.serviceallocationReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchServiceallocation },dispatch);
}

const Container = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(Serviceallocation)

export default Container;