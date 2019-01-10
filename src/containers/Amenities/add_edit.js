import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addAmenities , update_fetch_status, viewAmenities } from '../../actions/amenitiesActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
function validate(amenities_values,status) {
   let regs = /^\d+$/;   
   return {
    amenities_values:amenities_values.length===0,
    status:status.length===0, 
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          amenities_values:'',
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
       viewAmenities(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              amenities_values:data.amenities_values,
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
        let {amenities_values,status} =this.state;
        let errors = validate(amenities_values,status);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              amenities_values:amenities_values,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addAmenities(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/amenities");
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
    let {amenities_values,status,error_status,title,preloader} = this.state;

    let role=permissionCheck("amenities",title);
      if(!role)
        return <Nopermission/>
    let errors = validate(amenities_values,status);
  
          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                      <div className="col s12 portlet-title"> 
                        <div className="caption">{title} AMENITIES
                        </div>
                      </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"amenities_values")}} className={(errors.amenities_values && error_status)?'invalid':''} value={amenities_values} />
                              <label className={(errors.amenities_values)?'':'active'}>Amenities</label>
                          </div>                               
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                        &nbsp;&nbsp;
                        <Link to="/settings/general/amenities" className="btn btn-sm btn-default">Cancel</Link>
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
  data: state.amenitiesReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;