import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addKYC , update_fetch_status, viewKYC } from '../../actions/kycActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

 var validateCols={
		kyc_name:{
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
          kyc_name:'',
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
       viewKYC(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              kyc_name:data.kyc_name,
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
        let {kyc_name,status} =this.state;
        
		validateCols.kyc_name.value=kyc_name;
		validateCols.status.value=status;

		let errors= validationCheck(validateCols);
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              kyc_name:kyc_name,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addKYC(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/kyc");
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
    let {kyc_name,status,error_status,title,preloader} = this.state;

    let role=permissionCheck("kyc",title);
      if(!role)
        return <Nopermission/>

  		validateCols.kyc_name.value=kyc_name;
		validateCols.status.value=status;

		let errors= validationCheck(validateCols);

          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} KYC
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"kyc_name")}} className={(errors.kyc_name.msg && error_status)?'invalid':''} value={kyc_name} />
                              <label className={(errors.kyc_name.msg)?'':'active'}>KYC Name</label>
							  {(errors.kyc_name.msg && error_status) ? (<div className="validation-error">{errors.kyc_name.msg}</div>):('')}
                          </div>

                                                      
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        <Link to="settings/accounts/kyc" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
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
  data: state.kycReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;