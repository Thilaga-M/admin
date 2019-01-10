import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPincode , update_fetch_status, viewPincode ,getCountryList,getStateList,getCityList} from '../../actions/pincodeActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

 var validateCols={
		pincode:{
				required:true,
				msg:'',
				value:''
			}, 
		country_id:{
				required:true,
				msg:'',
				value:''
			}, 
		state_id:{
				required:true,
				msg:'',
				value:''
			}, 
				city_id:{
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
          pincode:'',
		  country_id:'',
		  state_id:'',
          city_id:'',
          status:1,
		  countryall:[],
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
	  this.getStateLists=this.getStateLists.bind(this);
	  this.getCityLists=this.getCityLists.bind(this);


       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewPincode(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.getStateLists(data.country_id);
            this.getCityLists(data.state_id);

            this.setState({
              pincode:data.pincode,
				country_id:data.country_id,
				  state_id:data.state_id,
  				  city_id:data.city_id,
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
	 


	   getStateLists(id){

		   getStateList(id).then((res)=>{
			 if(res.data.status===200){
			  let data=res.data.data;
				this.setState({stateall:data});
			  }  
		   })

	   }
	getCityLists(id){
		getCityList(id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({cityall:data});
          }  
       })
	}

    eventHandle(e,key){
      this.setState({[key]:e.target.value});
	   if(key=="country_id"){
		  this.getStateLists(e.target.value);
	  }
	   if(key=="state_id"){
		  this.getCityLists(e.target.value);
	  }
    }
	

    onsubmit(){
        let {pincode,status,country_id,state_id,city_id} =this.state;
        
		validateCols.pincode.value=pincode;
		validateCols.status.value=status;
		validateCols.country_id.value=country_id;
		validateCols.state_id.value=state_id;
		validateCols.city_id.value=city_id;
		let errors= validationCheck(validateCols);
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              pincode:pincode,
			country_id:country_id,
				  state_id:state_id,
				   city_id:city_id,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addPincode(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/pincode");
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
    let {pincode,country_id,state_id,city_id,status,error_status,title,preloader,countryall,stateall,cityall} = this.state;

    let role=permissionCheck("package",title);
      if(!role)
        return <Nopermission/>

  		validateCols.pincode.value=pincode;
		validateCols.status.value=status;
		validateCols.country_id.value=country_id;
		validateCols.state_id.value=state_id;
		validateCols.city_id.value=city_id;
		let errors= validationCheck(validateCols);

          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="talign-demo">
                      <h5 className="center-align">{title} Pincode</h5> 
                    </div>
                      <form method="post" encType="multipart/form-data">
                       <div className="row">
                          <div className="input-field col s12">
							   <select className={`browser-default ${(errors.country_id.msg && error_status)?'invalid':''}`} value={country_id} onChange={(e)=>{this.eventHandle(e,"country_id")}} >
                                <option  value=''>Select Country</option>
                                  {
                                    countryall && countryall.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.country_id}>{val.country_name}</option>)
                                    })
                                  } 
                                </select> {country_id}
									{(errors.country_id.msg && error_status) ? (<div className="validation-error">{errors.country_id.msg}</div>):('')}
							</div>
						</div>
								<div className="row">
                          <div className="input-field col s12">
							   <select className={`browser-default ${(errors.state_id.msg && error_status)?'invalid':''}`} value={state_id} onChange={(e)=>{this.eventHandle(e,"state_id")}} >
                                <option  value=''>Select State</option>
                                  {
                                    stateall && stateall.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.state_id}>{val.state_name}</option>)
                                    })
                                  } 
                                </select> 
									{(errors.state_id.msg && error_status) ? (<div className="validation-error">{errors.state_id.msg}</div>):('')}
							</div>
						</div>

											<div className="row">
                          <div className="input-field col s12">
							   <select className={`browser-default ${(errors.state_id.msg && error_status)?'invalid':''}`} value={city_id} onChange={(e)=>{this.eventHandle(e,"city_id")}} >
                                <option  value=''>Select City</option>
                                  {
                                    cityall && cityall.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.city_id}>{val.city_name}</option>)
                                    })
                                  } 
                                </select> 
									{(errors.city_id.msg && error_status) ? (<div className="validation-error">{errors.city_id.msg}</div>):('')}
							</div>
						</div>
						 <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"pincode")}} className={(errors.pincode.msg && error_status)?'invalid':''} value={pincode} />
                              <label className={(errors.pincode.msg)?'':'active'}>Pincode Number</label>
							  {(errors.pincode.msg && error_status) ? (<div className="validation-error">{errors.pincode.msg}</div>):('')}
                          </div>                                                      
                        </div>
						
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        <Link to="settings/pincode" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
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
  data: state.pincodeReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;