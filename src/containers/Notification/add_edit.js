import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addNotification , update_fetch_status, viewNotification, getTemplateCategory,getTemplateList,viewTemplateMaster,getCustomerList } from '../../actions/notificationActions';

import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import { Editor } from '@tinymce/tinymce-react';

 var validateCols={
    notification_name:{
				required:true,
				msg:'',
				value:''
      },
      notification_description:{
				required:true,
				msg:'',
				value:''
      },
      template_category:{
				required:true,
				msg:'',
				value:''
      },
      template_id:{
        required:true,
        msg:'',
        value:''
      }      
};


class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          notification_name:'',
          notification_description:'',
          template_code:(this.props.params.id)?"":"<p>This is the initial content of the editor</p>",
          categoryList:[],
          template_category:'',
          templateMasterList:[],
          companyMasterList:[],
          template_id:'',
          notification_to_send:0,
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
      this.sendNotification=this.sendNotification.bind(this);
       
    }

    handleEditorChange = (e) => {
      console.log('Content was updated:', e.target.getContent());      
     this.setState({"template_code":e.target.getContent()});
    }

    
    componentWillMount(){
      if(this.props.params.id){
       viewNotification(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
          console.log(data);
            this.setState({
              notification_name:data.notification_name,
              template_category:data.template_category,
              notification_description:data.notification_description,
              template_code:data.template_code,
              template_id:data.template_id,
              notification_to_send:data.notification_to_send,
               preloader:false,
              status:1
            })
         }

       })
      }

      
      getTemplateCategory().then((res)=>{
        if(res.data.status===200){
          let data=res.data.data;
          console.log(data);
            this.setState({categoryList:data});
          }  

      })
    }

    getTemplateLists(id)
	{
	   getTemplateList(id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({templateMasterList:data});
          }  
       })

    }

    getTemplateDetails(id)
	{

        viewTemplateMaster(id).then((res)=>{
            if(res.data.status===200){
              
             let data=res.data.data;
           
               this.setState({                                 
                 template_code:data.template_code,
                  preloader:false,
                 status:1
               })

               
            }
   
          })

          getCustomerList().then((res)=>{
            if(res.data.status===200){
             let data=res.data.data;
               this.setState({companyMasterList:data});
             }  
          })
    }
    
    eventHandle(e,key,val){
      if(key=="template_category"){
        this.getTemplateLists(e.target.value);        
      }
      if(key=="template_id"){
        this.getTemplateDetails(e.target.value);        
      }
      if(key=="notification_to_send"){
        
        this.setState({[key]:val});
      }
      else
      {
        this.setState({[key]:e.target.value});
      }
      
    }

    sendNotification(e,key,source)
    {
      
      this.state.companyMasterList[key][source]=!this.state.companyMasterList[key][source];
      this.state.companyMasterList[key][source]=this.state.companyMasterList[key][source]?1:0;
      this.setState({companyMasterList:this.state.companyMasterList});

    }
    onsubmit(){
    let {notification_name,template_category,notification_description,template_code,notification_to_send,template_id,companyMasterList} =this.state;
        
	validateCols.notification_name.value=notification_name;
	validateCols.notification_description.value=validateCols.notification_description;
    validateCols.template_category.value=validateCols.template_category;
    let errors= validationCheck(validateCols);
    
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

    let customerList="";  

    if(notification_to_send==1)
    {
      companyMasterList.map((val,i)=>{
      
        if(val.verify==1)
        {
          customerList += val.cust_hid+"|";
        }
      });
      if(customerList=="")
      {
        alert("Select atleast a single customer");
        isDisabled=true;
        return false;
      }
    }
    
        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              notification_name:notification_name,
              notification_description:notification_description,
              template_category:template_category,
              template_code:template_code,
              notification_to_send:notification_to_send,
              template_id:template_id,
              customerList:customerList
            }
            console.log(params);
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addNotification(params,para).then((res)=>{
              console.log(res);
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/customers/notification/");
                }
                else{
                  alert("Please enter required feilds...");
                   this.setState({error_status:true,preloader:false});
                }
            });
        }else{
           this.setState({error_status:true,preloader:false});
        }
    }
  
  render() {
    let {notification_name,notification_description,template_category,categoryList,templateMasterList,template_id,template_code,error_status,title,preloader,notification_to_send,companyMasterList} = this.state;

    let role=permissionCheck("service",title);
      if(!role)
      return <Nopermission/>

  	  validateCols.notification_name.value=notification_name;
      validateCols.notification_description.value=validateCols.notification_description;
      validateCols.template_category.value=validateCols.template_category;
      validateCols.template_id.value=validateCols.template_id;

		let errors= validationCheck(validateCols);
    let individualCustomersStyle={overflow: 'auto',maxHeight:'100px'};
          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} NOTIFICATIONS
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">

                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"notification_name")}} className={(errors.notification_name.msg && error_status)?'invalid':''} value={notification_name} />
                              <label className={(errors.notification_name.msg)?'':'active'}>Notification Name</label>
							  {(errors.notification_name.msg && error_status) ? (<div className="validation-error">{errors.notification_name.msg}</div>):('')}
                          </div>                                                      
                        </div>

                        <div class="row">
                          <div className="input-field col s12">
                          <textarea  onChange={(e)=>{this.eventHandle(e,"notification_description")}} className={(errors.notification_description && error_status)?'invalid':''} value={notification_description} />
                              <label className={(errors.notification_description)?'':'active'}>Notification Description</label>
                          </div>
                        </div>


                        <div className="row">
                          <div className="input-field col s12">
                          <select className={`browser-default ${(errors.template_category.msg && error_status)?'invalid':''}`} value={template_category} onChange={(e)=>{this.eventHandle(e,"template_category")}}>
                                <option  value=''>Select Template Category</option>
                                  {
                                    categoryList && categoryList.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.id}>{val.category_name}</option>)
                                    })
                                  } 
                          </select>
                          </div>
                          </div>

                          <div className="row">
                          <div className="input-field col s12">
                          <select className={`browser-default ${(errors.template_id.msg && error_status)?'invalid':''}`} value={template_id} onChange={(e)=>{this.eventHandle(e,"template_id")}}>
                                <option  value=''>Select Template Name</option>
                                  {
                                    templateMasterList && templateMasterList.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.template_id}>{val.template_name}</option>)
                                    })
                                  } 
                          </select>
                          </div>
                          </div>  
                        
                        {template_id && <div class="row">
                        <div className="input-field col s12">
                          <Editor
                              initialValue={template_code}
                              init={{
                                plugins: 'link image code',
                                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                              }}
                              onChange={this.handleEditorChange}
                            /><br/> <br/> 
                          </div>

                        </div>
                        }
                        {template_id && <div className="row">             
                        <div className="input-field col s12">
                            <input type="radio" id="inline-radio1" name="notification_to_send" checked={notification_to_send == 0?true:false}/>
                            <label htmlFor="notification_to_send" onClick={(e)=>{this.eventHandle(e,"notification_to_send",0)}}>ALL</label>

                            <input type="radio" id="inline-radio2" name="notification_to_send" checked={(notification_to_send==1)?true:false}/>
                            <label htmlFor="notification_to_send" onClick={(e)=>{this.eventHandle(e,"notification_to_send",1)}}>INDIVIDUAL</label> 
                        </div>
                        </div>
                        }
                        {(notification_to_send === 1 && companyMasterList.length > 0) && <div className="row">             
                        <div className="input-field col s12" style={individualCustomersStyle}>
                        {
                              companyMasterList.map((val,i)=>{

                              return(
                              <div key={i}><input type="checkbox"  className="filled-in" checked={(val.verify == 1)?true:false} value="{val.verify}"/><label  onClick={(e)=>{this.sendNotification(e,i,"verify")}} htmlFor="inline-checkbox1">{val.company_name}</label></div>
                            );
                            }
                          )
                        }
                        </div>
                        </div>

                        }

                        <br/>                                
                      </form>
                      <div className="card-footer center">
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>&nbsp;&nbsp;
                        <Link to="customers/notification/" className="btn btn-sm btn-default">Cancel</Link>
                      </div>
                      <br/><br/>
                    </div> 
                    <br/>
                     { preloader && <Preloader/> }

                     
                  </div>

                </div> 
              )
  }
}
 
 

const mapStateToProps = (state) => ({
  data: state.notificationReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;