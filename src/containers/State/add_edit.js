import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addState , update_fetch_status, viewState ,getCountryList} from '../../actions/stateActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

 var validateCols={
		state_name:{
				required:true,
				msg:'',
				value:''
			}, 
		country_id:{
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
          state_name:'',
		  country_id:'',
          status:1,
		  countryall:[],
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewState(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              state_name:data.state_name,
				      country_id:data.country_id,
               preloader:false,
              status:1
            })
         }

       })
      }
	    getCountryList().then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({countryall:data});
          }  
       })
    }

	   

    eventHandle(e,key){
      this.setState({[key]:e.target.value});
	 
    }

    onsubmit(){
        let {state_name,status,country_id} =this.state;
        
		validateCols.state_name.value=state_name;
		validateCols.status.value=status;
		validateCols.country_id.value=country_id;
		let errors= validationCheck(validateCols);
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              state_name:state_name,
			country_id:country_id,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addState(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/general/state");
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
    let {state_name,country_id,status,error_status,title,preloader,countryall} = this.state;

    let role=permissionCheck("state",title);
      if(!role)
        return <Nopermission/>

  		validateCols.state_name.value=state_name;
		validateCols.status.value=status;
		validateCols.country_id.value=country_id;
		let errors= validationCheck(validateCols);

          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} STATE
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"state_name")}} className={(errors.state_name.msg && error_status)?'invalid':''} value={state_name} />
                              <label className={(errors.state_name.msg)?'':'active'}>State Name</label>
							  {(errors.state_name.msg && error_status) ? (<div className="validation-error">{errors.state_name.msg}</div>):('')}
                          </div>                                                      
                        </div>
						<div className="row">
                          <div className="input-field col s12">
							   <select className={`browser-default ${(errors.country_id.msg && error_status)?'invalid':''}`} value={country_id} onChange={(e)=>{this.eventHandle(e,"country_id")}}>
                                <option  value=''>Select Country</option>
                                  {
                                    countryall && countryall.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.country_id}>{val.country_name}</option>)
                                    })
                                  } 
                                </select> 
									{(errors.country_id.msg && error_status) ? (<div className="validation-error">{errors.country_id.msg}</div>):('')}
							</div>
						</div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                        &nbsp;&nbsp;
                        <Link to="settings/general/state" className="btn btn-sm btn-default">Cancel</Link>
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
  data: state.stateReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;