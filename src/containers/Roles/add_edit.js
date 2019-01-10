import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addRoles , update_fetch_status, viewRoles,fetchMenu } from '../../actions/rolesActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
  
function validate(rolename,description,status) {
   let regs = /^\d+$/;   
   return {
    rolename:rolename.length===0,
    description:description.length===0,//!regs.test(description), 
    status:status.length===0, 
  };
}

class AddEdit extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          loading: false,
          rolename:'',
          menus:[],
          description:'',
          error_status:false,
          preloader:(this.props.params.id)?true:false,
          status:1,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.permissionSelect=this.permissionSelect.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentWillMount(){
 
      fetchMenu().then((res)=>{
         if(res.data.status===200){
          let datam=res.data.result.data;

           if(this.props.params.id){
                 viewRoles(this.props.params.id).then((res)=>{
                   if(res.data.status===200){
                    let data=res.data.data;
                    let tempData=[];
                    data.permission.map((val,i)=>{
                       // console.log(val.pagename,val.permission)
                        tempData[val.pagename]=val.permission.split(",");
                    });

                    let  temp = datam.map((val,i)=>{

                      let perarr=tempData[val.menuname];
                      if(perarr){
                       return {pagename:val.menuname,"View":(perarr.indexOf("View")!==-1)?"View":'',"New":(perarr.indexOf("New")!==-1)?"New":'',"Edit":(perarr.indexOf("Edit")!==-1)?"Edit":'',"Delete":(perarr.indexOf("Delete")!==-1)?"Delete":'',}
                      }else{
                        return {pagename:val.menuname,"View":'',"New":'',"Edit":'',"Delete":''}
                      }
                    }); 

                      this.setState({
                        rolename:data.rolename,
                        //permissionData:data.permissionData,
                        error_status:true,
                        description:data.description,
                        status:1,
                        preloader:false,
                        menus:temp
                      })
                   }

                 })
                }else{
                  let  temp = datam.map((val,i)=>{
                       return {pagename:val.menuname,"View":'',"New":'',"Edit":'',"Delete":''}
                    }); 
                    this.setState({menus:temp,preloader:false})
                }
      
         }

       })
    }
  
    eventHandle(e,key){
      this.setState({[key]:e.target.value});
    }

    onsubmit(){
        let {rolename,description,status,menus} =this.state;
        let errors = validate(rolename,description,status);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
         this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              rolename:rolename,
              description:description,
              menuval:menus,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addRoles(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("settings/general/roles");
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

    permissionSelect(e,key,source){
      this.state.menus[key][source]=(this.state.menus[key][source])?'':source;
      this.setState({menus: this.state.menus});
    }
  
  render() {
    let {rolename,description,status,menus,error_status,title,preloader} = this.state;

    let role=permissionCheck("roles",title);
      if(!role)
        return <Nopermission/>

   // let {datamenu} = this.props;
let errors = validate(rolename,description,status);

let permissionLopp = menus.map((val,i)=>{
  if(val.pagename!=="centername"){
      return(<tr key={i}>
                <td> {val.pagename}</td>
                <td>
                   <div > 
                     <input type="checkbox" className="filled-in"  checked={(val.View)?true:false} value="View"/>
                    <label htmlFor="inline-checkbox1" onClick={(e)=>{this.permissionSelect(e,i,"View")}}>View</label> &nbsp;&nbsp;

                    <input type="checkbox"  className="filled-in" checked={(val.New)?true:false} value="New"/>
                    <label onClick={(e)=>{this.permissionSelect(e,i,"New")}} htmlFor="inline-checkbox2">New</label>&nbsp;&nbsp;

                    <input type="checkbox" className="filled-in" checked={(val.Edit)?true:false} value="Edit"/>
                    <label onClick={(e)=>{this.permissionSelect(e,i,"Edit")}} htmlFor="inline-checkbox3">Edit</label>&nbsp;&nbsp;
                    
                    <input type="checkbox" className="filled-in" checked={(val.Delete)?true:false} value="Delete"/>
                    <label  onClick={(e)=>{this.permissionSelect(e,i,"Delete")}}  htmlFor="inline-checkbox4">Delete</label>
                  </div>
                
                </td>
            </tr>
      )
    }

})
 

          return (
                <div className="portlet">
                  <div className="transition-item detail-page">
                   <div className="main-content div-center">

                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} ROLE
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                       <div className="row">


                          <div className="input-field col s4">
                            <input type="text"  onChange={(e)=>{this.eventHandle(e,"rolename")}} className={(errors.rolename && error_status)?'invalid':''} value={rolename} />
                            <label className={(errors.rolename)?'':'active'}>Role Name</label>
                          </div>

                          <div className="input-field col s4">
                            <input type="text"  onChange={(e)=>{this.eventHandle(e,"description")}} className={(errors.description && error_status)?'invalid':''} value={description} />
                            <label className={(errors.description)?'':'active'}>Description</label>
                          </div> 
                          <div className="input-field col s4">
                           <table>
                                <thead>
                                  <tr>
                                    <th>Page Name</th>
                                    <th>Permisssion</th> 
                                  </tr>
                                </thead>
                                <tbody>
                                { permissionLopp}
                                  
                                  
                                </tbody>
                              </table> 
                          </div>
                          <div className="input-field col s4">
                            <div className="card-footer right">
                              
                              <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                              &nbsp;&nbsp;
                              <Link to="settings/general/roles" className="btn btn-sm btn-default">Cancel</Link>
                            </div>
                          </div>
                    </div> 
                  </form>
                  <br/>
                  </div> 
                   { preloader && <Preloader/> }                     
                  </div> 
              </div>
              )
  }
}
 
 
const mapStateToProps = (state) => ({
  data: state.rolesReducer,
  datamenu: state.menuReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const RolesAEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default RolesAEContainer;