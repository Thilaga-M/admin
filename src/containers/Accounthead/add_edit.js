import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addAccounthead , update_fetch_status, viewAccounthead ,getAccountTypeList} from '../../actions/accountheadActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

 var validateCols={
		accountname:{
				required:true,
				msg:'',
				value:''
			}, 
		acctypeid:{
				required:true,
				msg:'',
				value:''
			}, 
		note:{
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
          accountname:'',
		  acctypeid:'',
			  note:'',
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
       viewAccounthead(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              accountname:data.accountname?data.accountname:'',
				note:data.note?data.note:'',

				acctypeid:data.acctypeid?data.acctypeid:'',
               preloader:false,
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

	   

    eventHandle(e,key){
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {accountname,note,status,acctypeid} =this.state;
        
		validateCols.accountname.value=accountname;
		validateCols.note.value=note;
		validateCols.status.value=status;
		validateCols.acctypeid.value=acctypeid;
		let errors= validationCheck(validateCols);
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              accountname:accountname,
              note:note,
			acctypeid:acctypeid,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addAccounthead(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/accounts/accounthead");
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
    let {accountname,acctypeid,note,status,error_status,title,preloader,accounttypeList} = this.state;

    let role=permissionCheck("accounthead",title);
      if(!role)
        return <Nopermission/>

  		validateCols.accountname.value=accountname;
		validateCols.status.value=status;
		validateCols.note.value=note;
		validateCols.acctypeid.value=acctypeid;
		let errors= validationCheck(validateCols);

          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} ACCOUNT HEAD
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
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"accountname")}} className={(errors.accountname.msg && error_status)?'invalid':''} value={accountname} />
                              <label className={(errors.accountname.msg)?'':'active'}>Account Head Name</label>
							  {(errors.accountname.msg && error_status) ? (<div className="validation-error">{errors.accountname.msg}</div>):('')}
                          </div>                                                      
                          <div className="input-field col s4">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"note")}} className={(errors.note.msg && error_status)?'invalid':''} value={note} />
                              <label className={(errors.note.msg)?'':'active'}>Note</label>
							  {(errors.note.msg && error_status) ? (<div className="validation-error">{errors.note.msg}</div>):('')}
                          </div>                                                      
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        <Link to="settings/accounts/accounthead" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
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
  data: state.accountheadReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;