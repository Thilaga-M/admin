import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addMenu , update_fetch_status, viewMenu } from '../../actions/menuActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
  
function validate(menuname,status) {
   let regs = /^\d+$/;   
   return {
    menuname:menuname.length===0,
    status:status.length===0, 
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          menuname:'',
          status:1,
          error_status:false,
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
      if(this.props.params.id){
       viewMenu(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              menuname:data.menuname,
              error_status:true,
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
        let {menuname,status} =this.state;
        let errors = validate(menuname,status);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              menuname:menuname,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addMenu(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/general/menu");
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
    let {menuname,status,title,error_status,preloader} = this.state;
    let role=permissionCheck("menu",title);
      if(!role)
        return <Nopermission/>

    let errors = validate(menuname,status);
  
          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="talign-demo">
                      <h5 className="center-align">{title} Menu</h5> 
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                          <div className="input-field col s12">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"menuname")}} className={(errors.menuname && error_status)?'invalid':''} value={menuname} />
                              <label className={(errors.menuname)?'':'active'}>Menu</label>
                          </div>

                       </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        <Link to="settings/general/menu" className="btn btn-sm btn-danger">Cancel</Link>&nbsp;&nbsp;
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
  data: state.menuReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const CenterAEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default CenterAEContainer;