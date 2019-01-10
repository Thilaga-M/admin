import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addPackage , update_fetch_status, viewPackage } from '../../actions/packageActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
function validate(packagename,rate,status) {
   let regs = /^\d+$/;   
   return {
    packagename:packagename.length===0,
    rate:!regs.test(rate), 
    status:status.length===0, 
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          packagename:'',
          rate:'',
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
       viewPackage(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              packagename:data.packagename,
              rate:data.rate,
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
        let {packagename,rate,status} =this.state;
        let errors = validate(packagename,rate,status);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              packagename:packagename,
              rate:rate,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addPackage(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/package");
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
    let {packagename,rate,status,error_status,title,preloader} = this.state;

    let role=permissionCheck("package",title);
      if(!role)
        return <Nopermission/>
    let errors = validate(packagename,rate,status);
  
          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="talign-demo">
                      <h5 className="center-align">{title} Package</h5> 
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"packagename")}} className={(errors.packagename && error_status)?'invalid':''} value={packagename} />
                              <label className={(errors.packagename)?'':'active'}>Package</label>
                          </div>

                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"rate")}} className={(errors.rate && error_status)?'invalid':''} value={rate} />
                              <label className={(errors.rate)?'':'active'}>Rate</label>
                          </div>                               
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        <Link to="settings/package" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
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
  data: state.packagenameReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const CenterAEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default CenterAEContainer;