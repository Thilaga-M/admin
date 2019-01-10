import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addTemplateMaster , update_fetch_status, viewTemplateMaster, getTemplateCategory } from '../../actions/templateMasterActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import { Editor } from '@tinymce/tinymce-react';

 var validateCols={
    template_name:{
				required:true,
				msg:'',
				value:''
      },
      template_description:{
				required:true,
				msg:'',
				value:''
      },
      template_category:{
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
          template_name:'',
          template_description:'',
          template_code:(this.props.params.id)?"":"<p>This is the initial content of the editor</p>",
          categoryList:[],
          template_category:'',
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       
    }

    handleEditorChange = (e) => {
      console.log('Content was updated:', e.target.getContent());
      
     this.setState({"template_code":e.target.getContent()});
    }

    
    componentWillMount(){
      if(this.props.params.id){
       viewTemplateMaster(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
          console.log(data);
            this.setState({
              template_name:data.template_name,
              template_category:data.template_category,
              template_description:data.template_description,
              template_code:data.template_code,
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

 
    eventHandle(e,key){
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {template_name,template_category,template_description,template_code} =this.state;
        
		validateCols.template_name.value=template_name;
		validateCols.template_description.value=validateCols.template_description;
    validateCols.template_category.value=validateCols.template_category;
    let errors= validationCheck(validateCols);
    
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              template_name:template_name,
              template_description:template_description,
              template_category:template_category,
              template_code:template_code,

            }
            console.log(params);
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addTemplateMaster(params,para).then((res)=>{
              console.log(res);
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/general/templatemaster");
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
    let {template_name,template_description,template_category,categoryList,template_code,error_status,title,preloader} = this.state;

    let role=permissionCheck("service",title);
      if(!role)
      return <Nopermission/>

  		validateCols.template_name.value=template_name;
      validateCols.template_description.value=validateCols.template_description;
      validateCols.template_category.value=validateCols.template_category;

		let errors= validationCheck(validateCols);

          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                     <div className="col s12 portlet-title"> 
                        <div className="caption">{title} TEMPLATE MASTER
                        </div>
                      </div>
                      <form method="post" encType="multipart/form-data">

                        <div className="row">
                          <div className="input-field col s4">
                          <select className={`browser-default ${(errors.template_category.msg && error_status)?'invalid':''}`} value={template_category} onChange={(e)=>{this.eventHandle(e,"template_category")}}>
                                <option  value=''>Select Template Category</option>
                                  {
                                    categoryList && categoryList.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.id}>{val.category_name}</option>)
                                    })
                                  } 
                          </select>
                          </div>

                          <div className="input-field col s4">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"template_name")}} className={(errors.template_name.msg && error_status)?'invalid':''} value={template_name} />
                              <label className={(errors.template_name.msg)?'':'active'}>Template Name</label>
							  {(errors.template_name.msg && error_status) ? (<div className="validation-error">{errors.template_name.msg}</div>):('')}
                          </div>                                                      
                          <div className="input-field col s4">
                          <textarea  onChange={(e)=>{this.eventHandle(e,"template_description")}} className={(errors.template_description && error_status)?'invalid':''} value={template_description} />
                              <label className={(errors.template_description)?'':'active'}>Template Description</label>
                          </div>
                        </div>

                        <div class="row">
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


                        <br/>                                
                      </form>
                      <div className="card-footer center">
                        
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                        &nbsp;&nbsp;
                        <Link to="settings/general/templatemaster" className="btn btn-sm btn-default">Cancel</Link>
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
  data: state.templatemasterReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;