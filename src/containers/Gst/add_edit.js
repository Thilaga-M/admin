import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addGst , update_fetch_status, viewGst,getAccountTypeList,getAccountHeadList } from '../../actions/gstActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import {validationCheck} from './../../core/validation';

var validateCols={
        tax_name:{
          required:true,
          value:'',
          msg:'',
      },
        rate:{
          required:true,
          value:'',
          msg:'',
      },
        accheadid:{
          required:true,
          value:'',
          msg:'',
      },
        acctypeid:{
          required:true,
          value:'',
          msg:'',
      },
    };

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          tax_name:'',
          rate:'',
          status:1,
          accheadid:'',
          acctypeid:'',
          accheadid_all:[],
          acctypeid_all:[],
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
      this.accountHead=this.accountHead.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentDidMount(){
      if(this.props.params.id){
       viewGst(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.accountHead(data.acctypeid);
            this.setState({
              tax_name:data.tax_name,
              rate:data.rate,
              accheadid:data.accheadid,
              acctypeid:data.acctypeid,
               preloader:false,
              status:1
            })
         }

       })
      }

      getAccountTypeList().then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({acctypeid_all:data});
          }  
      })

    }

    accountHead(id){
       getAccountHeadList(id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({accheadid_all:data});
          }  
      })
    }

 
    eventHandle(e,key){
      if(key=="acctypeid"){
        this.accountHead(e.target.value);
      }
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {tax_name,rate,status,accheadid,acctypeid} =this.state;
        let errors= validationCheck(validateCols);
       let isDisabled = Object.keys(errors).some(x =>errors[x].msg);
        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              tax_name:tax_name,
              accheadid:accheadid,
              acctypeid:acctypeid,
              rate:rate,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addGst(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/gst");
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
    let {tax_name,rate,status,error_status,title,preloader,accheadid,acctypeid,accheadid_all,acctypeid_all} = this.state;

    let role=permissionCheck("gst",title);
      if(!role)
        return <Nopermission/>
        validateCols.tax_name.value=tax_name;
        validateCols.rate.value=rate;
        validateCols.accheadid.value=accheadid;
        validateCols.acctypeid.value=acctypeid;
      let errors= validationCheck(validateCols);
  
          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} GST
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">

                        <div className="row">
                          <div className="input-field col s6">
                             <select className={`browser-default ${(errors.acctypeid.msg && error_status)?'invalid':''}`} value={acctypeid} onChange={(e)=>{this.eventHandle(e,"acctypeid")}}>
                                <option  value=''>Select Account Type</option>
                                  {
                                    acctypeid_all && acctypeid_all.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.acctypeid}>{val.accounttype}</option>)
                                    })
                                  } 
                                </select> 
                              {(errors.acctypeid.msg && error_status) ? (<div className="validation-error">{errors.acctypeid.msg}</div>):('')}
                          </div>
                          <div className="input-field col s6">
                             <select className={`browser-default ${(errors.accheadid.msg && error_status)?'invalid':''}`} value={accheadid} onChange={(e)=>{this.eventHandle(e,"accheadid")}}>
                                <option  value=''>Select Account Head</option>
                                  {
                                    accheadid_all && accheadid_all.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.accheadid}>{val.accountname}</option>)
                                    })
                                  } 
                                </select> 
                              {(errors.accheadid.msg && error_status) ? (<div className="validation-error">{errors.accheadid.msg}</div>):('')}
                          </div>
                        </div>

                        <div className="row">
                          <div className="input-field col s6">
                              <input type="text"  value={tax_name} />
                              <label className='active'>GST Tax name</label> 
                          </div>
                          <div className="input-field col s6">
                              <input type="text"    className={(errors.rate.msg && error_status)?'invalid':''} value={rate} />
                              <label className={(errors.rate.msg)?'':'active'}>Rate</label>
                              { 
                                  errors.rate.msg && error_status &&
                                  <div className="validation-error">{errors.rate.msg}</div>
                              }
                          </div>                               
                        </div>
                        
                        <div className="row" style={{marginTop: '2%'}}>
                          <div className="card-footer right">
                            <Link to="settings/accounts/gst" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
                            <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                          </div>
                        </div>
                      </form> 
                    </div> 
                    <br/>
                     { preloader && <Preloader/> }
                  </div> 
                </div>
              )
  }
}
 
 
const mapStateToProps = (state) => ({
  data: state.gstReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;