import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchExternalCustomer,deleteExternalCustomer } from '../../actions/externalCustomerActions';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import Pagination from "react-js-pagination";
import Filter from './../../core/filter'; 
  
class ExternalCustomer extends React.Component {
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
      preloader:true
    }
    this.fetchData = this.fetchData.bind(this); 
    this.delete = this.delete.bind(this); 
        this.filterSearch = this.filterSearch.bind(this);  
    this.PagenationChange = this.PagenationChange.bind(this); 
   }
  componentWillMount(){
    if(this.props.data.fetched===false){
        this.fetchData();
      }else{
        this.setState({preloader:false});
      }
  }

 
  fetchData(){
    let self = this;
    setTimeout(()=>{
       self.props.fetchExternalCustomer(self.state.params).then(()=>{
        self.setState({preloader:false});
       });
     },2)
  }

  delete(id){

    let del=confirm("Are you sure, do you want delete?");
    if(del){
      let page=1;
      this.setState({preloader:true,params:{...this.state.params,page}});
      deleteExternalCustomer(id).then((res)=>{
        if(res.data.status===200){
          this.fetchData();
        }else{
          alert("Not delete");
          this.setState({preloader:false});
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
    const { data  } = this.props;
        let {preloader}=this.state; 
    let current_page=(data)?data.current_page:0;
    let per_page=(data)?data.per_page:0;
    let total=(data)?data.total:0;
    let action=(role.permission)?role.permission.split(","):[];
       return (
            <div className="portlet_table">
             <div className="transition-item list-page">
                <div className="main-content">
                  <div className="col s12 portlet-title"> 
                      <div className="caption">EXTERNAL CUSTOMER
                      </div>
                    </div>
                 <Filter  filterSearch={this.filterSearch.bind(this)}  addbtn={(action.indexOf("New")!==-1)?"customers/client-setting/add-externalcustomer":""}/>
                { action.indexOf("View")!==-1 &&

                              <table className="striped">
                                <thead>
                                  <tr>
                                    <th>Reference No</th> 
                                    <th className="leftAlignText">Company Name</th>
                                    <th className="leftAlignText">Contact Name</th>
                                    <th>GST No</th> 
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                {
                                  data.data && data.data.map((val,i)=>{

                                    return(
                                      <tr key={i}>
                                          
                                          <td>{val.external_referenceno}</td>
                                          <td className="leftAlignText">{val.company_name}</td>
                                          <td className="leftAlignText">{val.contact_name}</td>
                                          <td>{val.gst_no}</td>
                                          <td>
                                             { action.indexOf("Edit")!==-1 &&
                                                <Link to={`customers/client-setting/edit-externalcustomer/${val.cust_hid}`}><i className="material-icons dp48 invalid">edit</i></Link>
                                              }&nbsp;&nbsp;
                                             {action.indexOf("Delete")!==-1 &&
                                                <span onClick={(e)=>{this.delete(val.cust_hid)}} ><i className="material-icons dp48 invalid">delete</i></span>
                                              }
                                          </td>
                                      </tr>
                                      )
                                  })
                                 }
                        {
                          (data.data && data.data.length===0 )&&
                            <tr>  
                                <td colSpan="5" className="center red-text">No Record Found...!</td> 
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
  data: state.externalcustomerReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchExternalCustomer },dispatch);
}

const OfficetypeContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(ExternalCustomer)

export default OfficetypeContainer;