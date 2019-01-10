import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchReceipt} from '../../actions/receiptActions';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import Pagination from "react-js-pagination";
import Filter from './../../core/filter'; 
import PreviewReceiptModule from './PreviewReceiptModule';

const $=window.$;  
class Receipt extends React.Component {
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
      previewReceipt:false,
      receiptID:''
    }
    this.fetchData = this.fetchData.bind(this);     
    this.filterSearch = this.filterSearch.bind(this);  
    this.PagenationChange = this.PagenationChange.bind(this); 
    this.receiptPreview=this.receiptPreview.bind(this);
    this.closePreview=this.closePreview.bind(this);
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
       self.props.fetchReceipt(self.state.params).then(()=>{
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
  

  receiptPreview(receiptId)
    {
       this.setState({previewReceipt:true,receiptID:receiptId});
       $('#previewreceiptmodule').modal('open');
    }

   closePreview(){     
      this.setState({previewReceipt:false,receiptID:''});      
      $('#previewreceiptmodule').modal('close');
    }

   render() {
    let role=permissionCheck("leads");
      if(!role)
        return <Nopermission/>
    const { data  } = this.props;
     let {preloader,previewReceipt,receiptID}=this.state; 
    let current_page=(data)?data.current_page:0;
    let per_page=(data)?data.per_page:0;
    let total=(data)?data.total:0;
    let action=(role.permission)?role.permission.split(","):[];
       return (
          <div className="portlet_table">
            <div className="transition-item list-page">

                  <div id="previewreceiptmodule" className="modal" style={{width:"85vw",height:"100vh"}}>
                          <div className="modal-content">
                                
                               {
                                 previewReceipt &&
                                <PreviewReceiptModule closePreview={this.closePreview} receiptID={receiptID}/>
                              }

                          </div>
                    </div>

                <div className="main-content">
                <div className="col s12 portlet-title"> 
                  <div className="caption">RECEIPT
                  </div>
                </div>
                <Filter  filterSearch={this.filterSearch.bind(this)} addbtn="billing/add-receipt"/>
                { action.indexOf("View")!==-1 &&
                <table className="striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Receipt No</th>
                      <th>Receipt Amount</th> 
                      <th className="leftAlignText">Comment</th>
                       <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    data.data && data.data.map((val,i)=>{

                      return(
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td>{val.receipt_no}</td>
                            <td>{val.amount_paid+val.advance_amount}</td>
                            <td className="leftAlignText">{val.comments}</td>
                            <td>                            
                            <button type="button" onClick={(e)=>{this.receiptPreview(val.receipt_hid)}}  className="btn btn-sm btn-danger">View</button>
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
  data: state.receiptReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchReceipt },dispatch);
}

const Container = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(Receipt)

export default Container;