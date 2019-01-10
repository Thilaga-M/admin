import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAgreement,deleteAgreement } from '../../actions/agreementActions';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import Pagination from "react-js-pagination";
import Filter from './../../core/filter'; 
import LeadsUpdate from './leadupdate'; 

const $=window.$;
  
class Agree extends React.Component {
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
      leadid:'',
      editlead:false
    }
    this.fetchData = this.fetchData.bind(this); 
    this.convertCustomer = this.convertCustomer.bind(this); 
    this.delete = this.delete.bind(this);  
    this.filterSearch = this.filterSearch.bind(this);  
    this.PagenationChange = this.PagenationChange.bind(this);  
    this.edit_lead = this.edit_lead.bind(this);  
    this.close_lead = this.close_lead.bind(this);  
   }
  componentWillMount(){
        this.fetchData();
      /*if(this.props.data.fetched===false){
        this.fetchData();
      }else{
        this.setState({preloader:false});
      }*/
  }

  componentDidMount(){
   $('.modal').modal({dismissible: false});
  }

 
  fetchData(){
    let self = this;
    setTimeout(()=>{
       self.props.fetchAgreement(self.state.params).then(()=>{
        self.setState({preloader:false});
       });
     },1)
  }

  delete(id){

    let del=confirm("Are you sure, do you want delete?");
    if(del){
      let page=1;
      this.setState({preloader:true,params:{...this.state.params,page}});
      deleteAgreement(id).then((res)=>{
        if(res.data.status===200){
          this.fetchData();
        }else{
          alert("Not delete");
          this.setState({preloader:false});
        }
     }) 
    }
  }
  convertCustomer(id){
    /*this.setState({preloader:true});
      convertCustomer(id).then((res)=>{
        if(res.data.status===200){
          this.fetchData();
        }else{
          alert("Not convert to customer");
          this.setState({preloader:false});
        }
     }) */
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
  edit_lead(id){
     this.setState({editlead:true,leadid:id});
     $('#leadUpdate').modal('open');
  }
 close_lead(){
     this.setState({editlead:false});
     $('#leadUpdate').modal('close');
  }
   render() {
    let role=permissionCheck("leads");
      if(!role)
        return <Nopermission/>
    let action=(role.permission)?role.permission.split(","):[];
    const { data  } = this.props;
    let {preloader,leadid,editlead}=this.state; 
    let current_page=(data)?data.current_page:0;
    let per_page=(data)?data.per_page:0;
    let total=(data)?data.total:0;
    let leadstatus=["New","Hot","Cold","Won","Lost"];
    let leadcolor=["green","blue","red","red","red"];

        return (
            <div className="portlet_table">
             <div className="transition-item list-page">
                <div className="main-content">
                  <div className="col s12 portlet-title"> 
                    <div className="caption">AGREEMENT
                    </div>
                  </div>
                  <Filter  filterSearch={this.filterSearch.bind(this)}  addbtn={(action.indexOf("New")!==-1)?"leads/add-agreement":""}/>

                { action.indexOf("View")!==-1 &&
                <table className="striped">
                                <thead>
                                  <tr>
                                    <th>S.No</th>
                                    <th>Reference No</th>
                                    <th className="leftAlignText">Company Name</th>
                                    <th className="leftAlignText">First Name</th>
                                    <th>Contact No</th> 
                                    <th className="leftAlignText">Email ID</th> 
                                    <th>Agreement Date</th>  
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                {
                                  data.data && data.data.map((val,i)=>{
 
                                    return(
                                      <tr key={i}>
                                          <td>{i+1}</td>
                                          <td>{val.reference_no}</td>
                                          <td className="leftAlignText">{val.company_name}</td>
                                          <td className="leftAlignText">{val.first_name}</td> 
                                          <td>{val.contact_number}</td>
                                          <td className="leftAlignText">{val.emailid}</td>
                                          <td>{val.agreement_date}</td> 
                                          <td>
                                            { action.indexOf("Edit")!==-1 &&
                                            <Link to={`leads/edit-agreement/${val.ag_hid}`}><i className="material-icons dp48 invalid">edit</i></Link> 
                                               
                                            }
                                          </td>
                                      </tr>
                                      )
                                  })
                               }
                        {
                          (data.data && data.data.length===0 )&&
                            <tr>  
                                <td colSpan="9" className="center red-text">No Record Found...!</td> 
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
  data: state.agreementReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchAgreement },dispatch);
}

const LeadsContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(Agree)

export default LeadsContainer;