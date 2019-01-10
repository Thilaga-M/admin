import React, { Component } from 'react';
import moment from 'moment';
import { fetchKYCDocumentList} from '../../actions/uploadDocumentActions';
import axios, { post } from 'axios';
import Path from '../../core/Config';

const $=window.$;


class Header extends Component {
  constructor(props) {
    super(props);
        this.state={
          documentList: '',
          note:''
          }
      this.close=this.close.bind(this);
      this.submit=this.submit.bind(this);
      this.eventHandle = this.eventHandle.bind(this);
    }
    
    componentDidMount(){
      let cust_hid=localStorage.getItem("cust_hid");
      let doc_type_id=this.props.kyc_id;
      console.log(cust_hid,doc_type_id);
      if(cust_hid && doc_type_id){
       fetchKYCDocumentList(cust_hid,doc_type_id).then((res)=>{
        console.log(res);
         if(res.data.status===200){
          let data=res.data.data; 
            this.setState({  
                  documentList:data
            })

         }

       })
      }
    }
      
   eventHandle(e,key)
    {
       this.setState({[key]:e.target.value});
    }
        
  submit()
  {
    if(this.state.note == undefined || this.state.note == "" || this.state.note == null)
    {
      alert("Enter Note");
      return false;
    }
    
    let formData = new FormData();
    let imagefile = document.querySelector('#file');
    formData.append("customerfile", imagefile.files[0]);
    formData.append('cust_hid',localStorage.getItem("cust_hid"));
    formData.append('doc_type_id',this.props.kyc_id);
    formData.append('note',this.state.note);
    
    axios.post(Path.apiUrl+'/uploadDocument', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': "Bearer "+localStorage.getItem("token")
      }
    }).then((response) => {
      
            if(response.data.status===200){
                  alert("Uploaded Successfully");
                  this.props.closeKYCDocs();
             } else if(response.data.status===401){
                  alert(response.data.msg);                   
             }
    })
    .catch((e) => 
    {
      console.error(e);
    });
  }
  close(){
    this.props.closeKYCDocs();
  }
  
  render() {   
     let {documentList,note} =this.state;
    
              return (
                       <div>

                       
                        <div className="row"> 
                              <div className="input-field col s12">
                                <table className="striped">
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
                                               <a href={`${Path.apiUrl}/downloadDocument/${val.doc_id}`} target="_blank"><i className="material-icons dp48 invalid">archive</i></a>                              
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
                        <br/>
                        <form method="post" encType="multipart/form-data">
  
                          <div className="row"> 
                              <div className="input-field col s2">
                                <div className="card-footer center">
                                  Document  
                                </div>
                               </div>
                              <div className="input-field col s4">
                                <div className="card-footer center">
                                  <input type="file" id="file"/>
                                </div>
                               </div>
                                <div className="input-field col s6">
                                   <textarea onChange={(e)=>{this.eventHandle(e,"note")}} className='materialize-textarea' value={note}/>
                                  <label  className='active'>Note</label>
                               </div>
                           </div>

                            <div className="row">
                              <div className="input-field col s12" style={{textAlign:'center'}}>
                                <button type="button" onClick={(e)=>{this.submit()}}  className="btn btn-sm btn-danger">Confirm</button>&nbsp;&nbsp;                               
                                <button type="button" onClick={(e)=>{this.close()}}  className="btn btn-sm btn-default">Close</button>&nbsp;&nbsp;                               
                              </div>
                            </div>
                        </form>



                      </div>
                         )
  }



}

export default Header;


