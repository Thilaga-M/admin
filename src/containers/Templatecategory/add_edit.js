import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addTemplateCategory , update_fetch_status, viewTemplateCategory } from '../../actions/templatecategoryActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

 var validateCols={
    category_name:{
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
          category_name:'',
          status:1,
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       
    }

    componentWillMount(){
      if(this.props.params.id){
       viewTemplateCategory(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              category_name:data.category_name,
               preloader:false,
              status:1
            })
         }

       })
      }
    }

 
    eventHandle(e,key){
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {category_name,status} =this.state;
        
		validateCols.category_name.value=category_name;
		

		let errors= validationCheck(validateCols);
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              category_name:category_name,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addTemplateCategory(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/general/templatecategory");
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
    let {category_name,status,error_status,title,preloader} = this.state;

    let role=permissionCheck("service",title);
      if(!role)
      return <Nopermission/>

  		validateCols.category_name.value=category_name;
		

		let errors= validationCheck(validateCols);

          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} TEMPLATE CATEGORY
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"category_name")}} className={(errors.category_name.msg && error_status)?'invalid':''} value={category_name} />
                              <label className={(errors.category_name.msg)?'':'active'}>Category Name</label>
							  {(errors.category_name.msg && error_status) ? (<div className="validation-error">{errors.category_name.msg}</div>):('')}
                          </div>

                                                      
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                        &nbsp;&nbsp;
                        <Link to="settings/general/templatecategory" className="btn btn-sm btn-default">Cancel</Link>
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
  data: state.templateCategoryReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;