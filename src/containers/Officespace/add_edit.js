import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addSpace , update_fetch_status, viewSpace,getofficetype } from '../../actions/officespaceActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

function validate(cabin_no,no_of_work_station,area,rate,status) {
   let regs = /^\d+$/;   
   return {
    cabin_no:cabin_no.length===0,
    no_of_work_station:no_of_work_station.length===0,
    area:area.length===0,//!regs.test(area),
    rate:!regs.test(rate),

  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          cabin_no:'',
          no_of_work_station:'',
          slistoffice:[],
          otm_id:'',
          area:'',
          rate:'',
          cabinname:'',
           preloader:(this.props.params.id)?true:false,
          status:1,
          error_status:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewSpace(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              cabin_no:data.cabin_no,
              no_of_work_station:data.no_of_work_station,
              area:data.area,
              rate:data.rate,
              otm_id:data.otm_id,
              error_status:true,
              preloader:false,
             
              status:1
            })
         }

       })
      }
       getofficetype().then((res)=>{
        if(res.data.status===200){
          this.setState({slistoffice:res.data.result.data}); 
        }
      })
    }

 
    eventHandle(e,key){
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {otm_id,cabin_no,no_of_work_station,area,rate,status} = this.state;
        let errors = validate(cabin_no,no_of_work_station,area,rate);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
         this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              cabin_no:cabin_no,
              no_of_work_station:no_of_work_station,
              area:area,
              otm_id:otm_id,
              rate:rate,
              cabinname:cabin_no,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addSpace(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/general/officespace");
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
    let {otm_id,slistoffice,cabin_no,no_of_work_station,area,rate,status,error_status,title,preloader} = this.state;

    let role=permissionCheck("officespace",title);
      if(!role)
        return <Nopermission/>

    let errors = validate(cabin_no,no_of_work_station,area,rate);
  
          return ( 
              <div className="portlet">
                 <div className="transition-item detail-page">
                  <div className="main-content div-center">

                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} OFFICE SPACE 
                      </div>
                    </div>
                    <form method="post" encType="multipart/form-data">
                      <div className="row">

                         <div className="col s4 input-field">
                            <select className={`browser-default ${(errors.otm_id && error_status)?'invalid':''}`} value={otm_id}  onChange={(e)=>{this.eventHandle(e,"otm_id")}} >
                                  <option value=''>Select Office Type</option>
                                  {
                                    slistoffice && slistoffice.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.otm_id}>{val.officetype}</option>)
                                    })
                                  } 
                                </select>  
                          </div>


                        {/* <div className="col s4 input-field">
                          <div className={`col-md-9 ${(errors.cabinname)?'has-danger':''}`}>
                            <input type="text" onChange={(e)=>{this.eventHandle(e,"cabinname")}} className={(errors.cabinname && error_status)?'invalid':''} value={cabinname} />
                          <label className={(errors.cabinname)?'':'active'}>Cabin Name</label>
                          </div>
                        </div>  */}


                        <div className="col s4 input-field">
                            <input type="text" onChange={(e)=>{this.eventHandle(e,"cabin_no")}} className={(errors.cabin_no && error_status)?'invalid':''} value={cabin_no}/>
                           <label className={(errors.cabin_no)?'':'active'}>Cabin Number</label>
                        </div> 

                       <div className="col s4 input-field">
                            <input type="text" onChange={(e)=>{this.eventHandle(e,"no_of_work_station")}} className={(errors.no_of_work_station && error_status)?'invalid':''} value={no_of_work_station}/>
                            <label className={(errors.no_of_work_station)?'':'active'}>No Of Work Station</label>
                        </div> 

                        <div className="col s4 input-field">
                            <input type="text" onChange={(e)=>{this.eventHandle(e,"area")}} className={(errors.area && error_status)?'invalid':''} value={area} />
                            <label className={(errors.area)?'':'active'}>Area</label>
                        </div>

                        <div className="col s4 input-field">
                            <input type="text" onChange={(e)=>{this.eventHandle(e,"rate")}} className={(errors.rate && error_status)?'invalid':''} value={rate} />
                            <label className={(errors.rate)?'':'active'}>Rate</label>
                        </div>
                      </div>
                        
                      </form> 
                       <br/>
                          <div className="card-footer right">
                            
                            <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                            &nbsp;&nbsp;
                            <Link to="settings/general/officespace" className="btn btn-sm btn-default">Cancel</Link>
                          </div>
                    </div> 
                    <br/>
                    { preloader && <Preloader/> }
                  </div>  
              </div>
              )
  }
}
 
 
const mapStateToProps = (state) => ({
  data: state.cabin_noReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const CenterAEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default CenterAEContainer;