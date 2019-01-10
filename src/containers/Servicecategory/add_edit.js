import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addServicecategory , update_fetch_status, viewServicecategory } from '../../actions/servicecategoryActions';
import { getAccountTypeList} from '../../actions/accountheadActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {validationCheck} from './../../core/validation';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

var validateCols={
	service_category:{
				required:true,
				msg:'',
				value:''
			}, 
	acctypeid:{
				required:true,
				msg:'',
				value:''
			},
    status:{
				required:true,
					value:'',
					msg:'',
			}
};


class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          service_category:'',
          group_consolidation:1,
	      acctypeid:'',
          status:1,
	      accounttypeList:[],
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentDidMount(){
      if(this.props.params.id){
       viewServicecategory(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              service_category:data.service_category,
              preloader:false,
			  acctypeid:data.acctypeid,
        group_consolidation:data.group_consolidation,
              status:1
            })
         }

       })
      }
	   	getAccountTypeList().then((res)=>{
			console.log("result="+res);
         if(res.data.status===200){
          let data=res.data.data;
		  console.log("data"+data);
            this.setState({accounttypeList:data});
          }  
       })
    }

 
    eventHandle(e,key,val){
      console.log(e,key,val);
      this.setState({[key]:(key==='group_consolidation')?val:e.target.value});
    }

    onsubmit(){

        let {service_category,status,acctypeid,group_consolidation} =this.state;
		
		validateCols.service_category.value=service_category;
		validateCols.status.value=status;
		validateCols.acctypeid.value=acctypeid;
   // validateCols.group_consolidation.value=group_consolidation;
		let errors= validationCheck(validateCols);

		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

		this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              service_category:service_category,
              status:status,
              acctypeid:acctypeid,
              group_consolidation:group_consolidation
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addServicecategory(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/general/servicecategory");
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
    let {service_category,status,error_status,title,preloader,acctypeid,accounttypeList,group_consolidation} = this.state;

    let role=permissionCheck("servicecategory",title);
      if(!role)
        return <Nopermission/>
		validateCols.service_category.value=service_category;
		validateCols.status.value=status;
		validateCols.acctypeid.value=acctypeid;
   // validateCols.group_consolidation.value=group_consolidation;
		let errors= validationCheck(validateCols);
  
          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} SERVICE CATEGORY
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
								<div className="row">
                          <div className="input-field col s4">
							   <select className={`browser-default ${(errors.acctypeid.msg && error_status)?'invalid':''}`} value={acctypeid} onChange={(e)=>{this.eventHandle(e,"acctypeid")}}>
                                <option  value=''>Select Account Type</option>
                                  {
                                    accounttypeList && accounttypeList.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.acctypeid}>{val.accounttype}</option>)
                                    })
                                  } 
                                </select> 
									{(errors.acctypeid.msg && error_status) ? (<div className="validation-error">{errors.acctypeid.msg}</div>):('')}
							</div>

                          <div className="input-field col s4">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"service_category")}} className={(errors.service_category.msg && error_status)?'invalid':''} value={service_category} />
                              <label className={(errors.service_category.msg)?'':'active'}>Service Category</label>
							{(errors.service_category.msg && error_status) ? (<div className="validation-error">{errors.service_category.msg}</div>):('')}
                          </div>                              
                       <label htmlFor="Groupconsolidation">Group Consolidation</label> <br/>
                          <input type="radio" id="inline-radio1" name="inline-radios" checked={(group_consolidation==0)?true:false}/>
                          <label htmlFor="Recurring" onClick={(e)=>{this.eventHandle(e,"group_consolidation",0)}}>False&nbsp;</label>

                          <input type="radio" id="inline-radio2" name="inline-radios" checked={(group_consolidation==1)?true:false}/>
                          <label htmlFor="Onetime" onClick={(e)=>{this.eventHandle(e,"group_consolidation",1)}}>True</label> 
                        <br/> 
                        </div>                              
                      </form>
                      <div className="card-footer right">
                        
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                        &nbsp;&nbsp;
                        <Link to="settings/servicecategory" className="btn btn-sm btn-default">Cancel</Link>
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
  data: state.servicecategoryReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;