import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchCustomer,deleteEmployee,officespacelist,fetchEmployee} from '../../actions/customerActions';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import Pagination from "react-js-pagination";
import Filter from './../../core/filter';
 
class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.state={
        params:{
                search_term: '',
                startDate: '',
                endDate:'', 
                cust_hid:localStorage.getItem("cust_hid"), 
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
    this.officelistFetch = this.officelistFetch.bind(this); 
   }
  componentWillMount(){
     
        this.fetchData();
   
       // this.officelistFetch();
    
      
  }
  officelistFetch(){
    officespacelist(this.props.params.c_id).then((res)=>{
         if(res.data.status===200){
            let data=res.data.data;
            this.setState({spacelist:data,preloader:false})
          }
      })
  }
  fetchData(){
        fetchEmployee(this.state.params).then((res)=>{
           if(res.data.status===200){
            let data=res.data.result.data;
            this.setState({data:data,preloader:false})
          }
       }); 
  }

  delete(id){

    let del=confirm("Are you sure, do you want delete?");
    if(del){
      let page=1;
      this.setState({preloader:true,params:{...this.state.params,page}});
      deleteEmployee(id).then((res)=>{
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
    const { spacelist} = this.props;
    const { data} = this.state;
    let action=(role.permission)?role.permission.split(","):[];
    let {preloader}=this.state; 
    let current_page=(data)?data.current_page:0;
    let per_page=(data)?data.per_page:0;
    let total=(data)?data.total:0;

    console.log(data);
       return (
            <div className="portlet_table">
             <div className="transition-item list-page">
                <div className="main-content">
                 <div className="col s12 portlet-title"> 
                      <div className="caption">CLIENT SETTING
                      </div>
                    </div>
                <Filter  filterSearch={this.filterSearch.bind(this)}  addbtn={(action.indexOf("New")!==-1)?"customers/client-setting/add-client":""}/>
     
                { action.indexOf("View")!==-1 &&
                <table className="striped">
                                <thead>
                                  <tr>
                                    <th className="leftAlignText">First Name</th>
                                    <th className="leftAlignText">Last Name</th>
                                    <th className="leftAlignText">Emailid</th>
                                    <th className="leftAlignText">Address</th>
                                    <th>Contact Number</th> 
                                    <th>Invoice cc status</th>
                                    <th>Email cc status</th>
                                    <th>Marketing cc status</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                {
                                  data && data.map((val,i)=>{
 
                                    return(
                                      <tr key={i}>
                                          <td className="leftAlignText">{val.first_name}</td>
                                          <td className="leftAlignText">{val.last_name}</td> 
                                          <td className="leftAlignText">{val.emailid}</td>
                                          <td className="leftAlignText">{val.address1}</td>
                                          <td>{val.contact_number}</td>
                                          <td>{(val.invoice_cc_status===1)?'Yes':'No'}</td>
                                          <td>{(val.email_cc_status===1)?'Yes':'No'}</td>
                                          <td>{(val.marketing_cc_status===1)?'Yes':'No'}</td> 
                                          <td>
                                            <span className={`badge ${(val.status===1)?'badge-success':'badge-danger'}`}>{(val.status===1)?'Active':'InActive'}</span>
                                          </td>
                                          <td>
                                            { action.indexOf("Edit")!==-1 &&
                                              <Link to={`customers/client-setting/edit-client/${val.custemp_id}`}><i className="material-icons dp48 invalid">edit</i></Link>
                                            }&nbsp;&nbsp;
                                            {action.indexOf("Delete")!==-1 &&
                                              <span onClick={(e)=>{this.delete(val.custemp_id)}} ><i className="material-icons dp48 invalid">delete</i></span>
                                            }
                                          </td>
                                      </tr>
                                      )
                                  })
                                }
                        {
                          (data && data.length===0 )&&
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
          </div>
    )
  }
}


const mapStateToProps = (state) => ({
  data: state.customerReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchCustomer },dispatch);
}

const CustomerContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(Customer)

export default CustomerContainer;