import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addCity , update_fetch_status, viewCity ,getCountryList,getStateList} from '../../actions/cityActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

 var validateCols={
		city_name:{
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
          city_name:'',
		  country_id:'',
			  state_id:'',
          status:1,
		  countryall:[],
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
	  this.getStateLists=this.getStateLists.bind(this);

       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewCity(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
          this.getStateLists(data.country_id);
            this.setState({
              city_name:data.city_name,
      				country_id:data.country_id,
      				  state_id:data.state_id,
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
		getStateLists(id)
	{
	   getStateList(id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({stateall:data});
          }  
       })
	}
    eventHandle(e,key){
      this.setState({[key]:e.target.value});

	   if(key=="country_id"){
		  this.getStateLists(e.target.value);
	  }
    }
	

    onsubmit(){
        let {city_name,status,country_id,state_id} =this.state;
        
		validateCols.city_name.value=city_name;
		validateCols.status.value=status;
		validateCols.country_id.value=country_id;
		validateCols.state_id.value=state_id;
		let errors= validationCheck(validateCols);
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              city_name:city_name,
			country_id:country_id,
				  state_id:state_id,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addCity(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/general/city");
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
    let {city_name,country_id,state_id,status,error_status,title,preloader,countryall,stateall} = this.state;

    let role=permissionCheck("city",title);
      if(!role)
        return <Nopermission/>

  		validateCols.city_name.value=city_name;
		validateCols.status.value=status;
		validateCols.country_id.value=country_id;
		validateCols.state_id.value=state_id;
		let errors= validationCheck(validateCols);

          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} CITY
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                        
						<div className="row">
                          <div className="input-field col s4">
							   <select className={`browser-default ${(errors.country_id.msg && error_status)?'invalid':''}`} value={country_id} onChange={(e)=>{this.eventHandle(e,"country_id")}} >
                                <option  value=''>Select Country</option>
                                  {
                                    countryall && countryall.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.country_id}>{val.country_name}</option>)
                                    })
                                  } 
                                </select>
									{(errors.country_id.msg && error_status) ? (<div className="validation-error">{errors.country_id.msg}</div>):('')}
							</div>
                          <div className="input-field col s4">
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
                          <div className="input-field col s4">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"city_name")}} className={(errors.city_name.msg && error_status)?'invalid':''} value={city_name} />
                              <label className={(errors.city_name.msg)?'':'active'}>City Name</label>
							  {(errors.city_name.msg && error_status) ? (<div className="validation-error">{errors.city_name.msg}</div>):('')}
                          </div>                                                      
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                        &nbsp;&nbsp;
                        <Link to="settings/general/city" className="btn btn-sm btn-default">Cancel</Link>
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
  data: state.cityReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;