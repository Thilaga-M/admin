import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addLedger , update_fetch_status, viewLedger ,getAccountHeadList} from '../../actions/ledgerActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

 var validateCols={
		ledgername:{
				required:true,
				msg:'',
				value:''
			}, 
		accheadid:{
				required:true,
				msg:'',
				value:''
			}, 
		note:{
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
          ledgername:'',
		      accheadid:'',
          status:1,
		      note:'',
		      accountheadList:[],
          isBank:'',
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewLedger(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              ledgername:data.ledgername,
				      note:(data.note==null) ? '':data.note,
				      accheadid:data.accheadid,
              isBank:data.isBank,
              preloader:false,
              status:1
            })
         }

       })
      }
	    getAccountHeadList().then((res)=>{
			
         if(res.data.status===200){
          let data=res.data.data;		  
            this.setState({accountheadList:data});
			
          }  
       })
    }

	   

     eventHandle(e,key){
      if(key=="isBank")
      {
        e.target.value=(e.target.value)?0:1;
      }
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {ledgername,note,status,accheadid,isBank} =this.state;
        
		validateCols.ledgername.value=ledgername;
		validateCols.note.value=note;
		validateCols.status.value=status;
		validateCols.accheadid.value=accheadid;
		let errors= validationCheck(validateCols);
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              ledgername:ledgername,
              note:note,
			        accheadid:accheadid,
              isBank:isBank,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addLedger(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/accounts/ledger");
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
    let {ledgername,note,accheadid,status,error_status,title,preloader,accountheadList,isBank} = this.state;

    let role=permissionCheck("ledger",title);
      if(!role)
        return <Nopermission/>

  		validateCols.ledgername.value=ledgername;
		validateCols.status.value=status;
		validateCols.note.value=note;
		validateCols.accheadid.value=accheadid;
		let errors= validationCheck(validateCols);

          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} LEDGER
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"ledgername")}} className={(errors.ledgername.msg && error_status)?'invalid':''} value={ledgername} />
                              <label className={(errors.ledgername.msg)?'':'active'}>Ledger Name</label>
							  {(errors.ledgername.msg && error_status) ? (<div className="validation-error">{errors.ledgername.msg}</div>):('')}
                          </div>                                                      
                        </div>
						<div className="row">
                          <div className="input-field col s6">
							   <select className={`browser-default ${(errors.accheadid.msg && error_status)?'invalid':''}`} value={accheadid} onChange={(e)=>{this.eventHandle(e,"accheadid")}}>
                                <option  value=''>Select Account Head</option>
                                  {
                                    accountheadList && accountheadList.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.accheadid}>{val.accountname}</option>)
                                    })
                                  } 
                                </select> 
									{(errors.accheadid.msg && error_status) ? (<div className="validation-error">{errors.accheadid.msg}</div>):('')}
							</div>
                          <div className="input-field col s6">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"note")}} className={(errors.note.msg && error_status)?'invalid':''} value={note} />
                              <label className={(errors.note.msg)?'':'active'}>Note</label>
							  {(errors.note.msg && error_status) ? (<div className="validation-error">{errors.note.msg}</div>):('')}
                          </div>                                                      
                        </div>

                        <div className="input-field col s6">
                                <input type="checkbox"  className="filled-in" checked={(isBank)?true:false} value={isBank}/>
                                <label onClick={(e)=>{this.eventHandle(e,"isBank")}} htmlFor="Bank">Bank</label>
                        </div>

                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        <Link to="settings/accounts/ledger" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
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
  data: state.ledgerReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;