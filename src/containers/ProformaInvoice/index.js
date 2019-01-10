import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchInvoice,viewInvoice } from '../../actions/proformaInvoiceActions';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import Pagination from "react-js-pagination";
import Filter from './../../core/filter'; 
  
class Invoice extends React.Component {
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
       self.props.fetchInvoice(self.state.params).then(()=>{
        self.setState({preloader:false});
       });
     },2)
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
    let role=permissionCheck("gst");
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
                    <div className="caption">PROFORMA INVOICE
                    </div>
                  </div>
                <Filter  filterSearch={this.filterSearch.bind(this)} />
                { action.indexOf("View")!==-1 &&
                <table className="striped">
                  <thead>
                    <tr>
                      <th className="leftAlignText">Company Name</th>
                      <th>Bill No</th> 
                      <th>Bill Date</th> 
                      <th>Bill Amount</th> 
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    data.data && data.data.map((val,i)=>{

                      return(
                        <tr key={i}>
                            <td className="leftAlignText">{val.company_name}</td>
                            <td>{val.proforma_billno}</td>
                            <td>{val.bill_date}</td>
                            <td>{val.total_amt}</td>
                            <td>
                            { action.indexOf("Edit")!==-1 &&
                              <Link to={`billing/proforma-invoice/${val.bill_hid}`}><i className="material-icons dp48 invalid">edit</i></Link>
                            }&nbsp;&nbsp;
                            
                            </td>
                        </tr>
                        )
                    })
                   }
                        {
                          (data.data && data.data.length===0 )&&
                            <tr>  
                                <td colSpan="6" className="center red-text">No Record Found...!</td> 
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
  data: state.invoiceReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchInvoice },dispatch);
}

const Container = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(Invoice)

export default Container;