import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addAccounttype , update_fetch_status, viewAccounttype } from '../../actions/accounttypeActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

 var validateCols={
		accounttype:{
				required:true,
				msg:'',
				value:''
			},
     note:{
				required:true,
					value:'',
					msg:'',
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
          accounttype:'',
          note:'',
          status:1,
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewAccounttype(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              accounttype:data.accounttype,
              note:data.note,
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
        let {accounttype,note,status} =this.state;
        
		validateCols.accounttype.value=accounttype;
		validateCols.note.value=note;
		validateCols.status.value=status;

		let errors= validationCheck(validateCols);
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              accounttype:accounttype,
              note:note,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addAccounttype(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/accounts/accounttype");
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
    let {accounttype,note,status,error_status,title,preloader} = this.state;

    let role=permissionCheck("accounttype",title);
      if(!role)
        return <Nopermission/>

  		validateCols.accounttype.value=accounttype;
		validateCols.note.value=note;
		validateCols.status.value=status;

		let errors= validationCheck(validateCols);

          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} ACCOUNT TYPE
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s6">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"accounttype")}} className={(errors.accounttype.msg && error_status)?'invalid':''} value={accounttype} />
                              <label className={(errors.accounttype.msg)?'':'active'}>Account Type</label>
							  {(errors.accounttype.msg && error_status) ? (<div className="validation-error">{errors.accounttype.msg}</div>):('')}
                          </div>

                          <div className="input-field col s6">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"note")}} className={(errors.note.msg && error_status)?'invalid':''} value={note} />
                              <label className={(errors.note.msg)?'':'active'}>Note</label>
  							  {(errors.note.msg && error_status) ? (<div className="validation-error">{errors.note.msg}</div>):('')}
                          </div>                               
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        <Link to="settings/accounts/accounttype" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
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
  data: state.accounttypeReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;