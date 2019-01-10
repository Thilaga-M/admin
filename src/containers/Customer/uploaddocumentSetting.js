import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { fetchDocumentList,update_fetch_status} from '../../actions/uploadDocumentActions';   
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import axios, { post } from 'axios';
import Path from '../../core/Config';

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
                cust_hid:'',
                note:'',
                customerfile:'',
                documentList:'',
                error_status:false,
                preloader:(this.props.params.id)?true:false,
                title:(this.props.params.id)?"Edit":"New"
        }    
   
      this.uploadDocument = this.uploadDocument.bind(this);
      this.eventHandle = this.eventHandle.bind(this);
      
     }

    componentDidMount(){
      let cust_hid=localStorage.getItem("cust_hid");
      
      if(cust_hid){
       fetchDocumentList(cust_hid).then((res)=>{
        console.log(res);
         if(res.data.status===200){
          let data=res.data.data; 
            this.setState({                 
                  cust_hid:cust_hid,
                  documentList:data,
                  preloader:false
            })

         }

       })
      }
    }

    eventHandle(e,key)
    {
       this.setState({[key]:e.target.value});
    }
 uploadDocument(){

    if(this.state.note == undefined || this.state.note == "" || this.state.note == null)
    {
      alert("Enter Note");
      return false;
    }
    this.setState({preloader:true});
    let formData = new FormData();
    let imagefile = document.querySelector('#file');
    formData.append("customerfile", imagefile.files[0]);
    formData.append('cust_hid',this.state.cust_hid);
    formData.append('note',this.state.note);
    
    axios.post(Path.apiUrl+'/uploadDocument', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': "Bearer "+localStorage.getItem("token")
      }
    }).then((response) => {
      
            if(response.data.status===200){
                  alert("Uploaded Successfully");
                   this.setState({preloader:false});                   
                   browserHistory.push("/customers/client-setting/");
             } else if(response.data.status===401){
                  alert(response.data.msg);
                   this.setState({preloader:false});                   
             }
    })
    .catch((e) => 
    {
      console.error(e);
    });
  
  }

  render() {
    let {preloader,title,documentList,note} =this.state;

    
    let role=permissionCheck("customer",title);
      if(!role)
        return <Nopermission/>
      let action=(role.permission)?role.permission.split(","):[];
          return (
                <div className="portlet">
                  <div className="transition-item detail-page">
                   <div className="main-content">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">UPLOAD DOCUMENT
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
 
                          <div className="row"> 
                              <div className="input-field col s6">
                                <div className="card-footer">
                                  <input type="file" id="file"/>
                                </div>
                               </div>
                          </div>
                          <div className="row"> 
                                <div className="input-field col s6">
                                   <textarea onChange={(e)=>{this.eventHandle(e,"note")}} className='materialize-textarea' value={note}/>
                                  <label  className='active'>Note</label>
                               </div>
                          </div>

                          <div className="row"> 
                              <div className="input-field col s6">
                                <div className="card-footer ">                                
                                  <button type="button" onClick={(e)=>{this.uploadDocument()}} className="btn btn-sm btn-primary">Upload</button>&nbsp;&nbsp;
                                  <Link to="customers/client-setting/customer-setting" className="btn btn-sm btn-default">Cancel</Link>
                                </div>
                               </div>
                           </div>
                        </form>  


                 <br/>        
                  <div className="row"> 
                              <div className="input-field col s12">
                <table className="striped" style={{marginTop:'0%'}}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>File Name</th>
                      <th>Note</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    documentList && documentList.map((val,i)=>{

                      return(
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td>{val.file_name}</td>
                            <td>{val.note}</td>
                            <td>                            
                            
                             { action.indexOf("Edit")!==-1 &&
                               <a href={`${Path.apiUrl}/downloadDocument/${val.doc_id}`} target="_blank"><i className="material-icons dp48 invalid">archive</i></a>                              
                             }                           
                            </td>
                        </tr>
                        )
                    })
                   }
                  {
                    (documentList && documentList.length===0 )&&
                      <tr>  
                          <td colSpan="4" className="center red-text">No Record Found...!</td> 
                      </tr> 
                  }
                  
                  </tbody>
                </table> 
                  </div>
                  </div>
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
  return bindActionCreators({ update_fetch_status },dispatch);
}

const CustomerAEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default CustomerAEContainer;