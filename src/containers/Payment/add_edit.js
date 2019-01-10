import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPayment , update_fetch_status, viewPayment } from '../../actions/paymentActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

 var validateCols={
		payment_mode:{
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
          payment_mode:'',
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
       viewPayment(this.props.params.id).then((res)=>{
         if(res.data.status===200){
			 console.log(res);
          let data=res.data.data;
            this.setState({
              payment_mode:data.payment_mode,
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
        let {payment_mode,note,status} =this.state;
        
		validateCols.payment_mode.value=payment_mode;
		validateCols.status.value=status;

		let errors= validationCheck(validateCols);
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              payment_mode:payment_mode,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addPayment(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/accounts/payment");
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
    let {payment_mode,note,status,error_status,title,preloader} = this.state;

    let role=permissionCheck("payment",title);
      if(!role)
        return <Nopermission/>

  		validateCols.payment_mode.value=payment_mode;
		validateCols.status.value=status;

		let errors= validationCheck(validateCols);

          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} PAYMENT
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"payment_mode")}} className={(errors.payment_mode.msg && error_status)?'invalid':''} value={payment_mode} />
                              <label className={(errors.payment_mode.msg)?'':'active'}>Payment Mode</label>
							  {(errors.payment_mode.msg && error_status) ? (<div className="validation-error">{errors.payment_mode.msg}</div>):('')}
                          </div>

                                                      
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        <Link to="settings/accounts/payment" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
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
  data: state.paymentReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;