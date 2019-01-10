import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addRoom , update_fetch_status, viewRoom ,getFloorList} from '../../actions/RoomActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import {validationCheck} from './../../core/validation';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';

 var validateCols={
		room_name:{
				required:true,
				msg:'',
				value:''
			}, 
      description:{
        required:true,
        msg:'',
        value:''
      }, 
     capacity:{
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
          room_name:'',
          description:'',
          capacity:'',
          floor_id:'',
          name:'',
          flootlistcategry:[],
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
       viewRoom(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
            this.setState({
              room_name:data.room_name,
              description:data.description,
              capacity:data.capacity,
              floor_id:data.floor_id,
              name:data.name,
              preloader:false,
              status:1
            })
         }

       })
      }

       getFloorList().then((res)=>{
        console.log(res);
        if(res.data.status===200){
          this.setState({flootlistcategry:res.data.data}); 
        }
      })

    }

 
    eventHandle(e,key){
      this.setState({[key]:e.target.value});
      
    }

    onsubmit(){
      
    let {room_name,description,capacity,floor_id,status} =this.state;
		validateCols.room_name.value=room_name;
    validateCols.description.value=description;
    validateCols.capacity.value=capacity;
		validateCols.status.value=status;
		let errors= validationCheck(validateCols);
		let isDisabled = Object.keys(errors).some(x =>errors[x].msg);

        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              room_name:room_name,
              description:description,
              capacity:capacity,
              floor_id:floor_id,
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addRoom(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("/settings/general/Room");
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
    let {room_name,description,capacity,status,error_status,title,preloader,flootlistcategry} = this.state;
    
       
      let role=permissionCheck("room",title);

      if(!role)
        return <Nopermission/>

  		validateCols.room_name.value=room_name;
      validateCols.description.value=description;
      validateCols.capacity.value=capacity;
		  validateCols.status.value=status;

		let errors= validationCheck(validateCols);

          return (
              <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content div-center">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} ROOM
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">
                        <div className="row">
                        <div className="input-field col s3">
                           <select className={`browser-default`} onChange={(e)=>{this.eventHandle(e,"floor_id")}}>
                                <option  value=''>Select Area</option>
                                  {
                                    flootlistcategry && flootlistcategry.map((val,i)=>{
                                        return (<option title={i} key={i} value={val.floor_id}>{val.name}</option>)
                                    })
                                  } 
                                </select> 

                        </div>
                          <div className="input-field col s3">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"room_name")}} className={(errors.room_name.msg && error_status)?'invalid':''} value={room_name} />
                              <label className={(errors.room_name.msg)?'':'active'}>Room name</label>
							                {(errors.room_name.msg && error_status) ? (<div className="validation-error">{errors.room_name.msg}</div>):('')}
                          </div>
                          <div className="input-field col s3">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"description")}} className={(errors.description.msg && error_status)?'invalid':''} value={description} />
                              <label className={(errors.description.msg)?'':'active'}>Description</label>
                              {(errors.description.msg && error_status) ? (<div className="validation-error">{errors.description.msg}</div>):('')}
                          </div>

                          <div className="input-field col s3">
                              <input type="text"  onChange={(e)=>{this.eventHandle(e,"capacity")}} className={(errors.capacity.msg && error_status)?'invalid':''} value={capacity} />
                              <label className={(errors.capacity.msg)?'':'active'}>Capacity</label>
                              {(errors.capacity.msg && error_status) ? (<div className="validation-error">{errors.capacity.msg}</div>):('')}
                          </div>




                                                      
                        </div>
                        <br/>                               
                      </form>
                      <div className="card-footer right">
                        
                        <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                        &nbsp;&nbsp;
                        <Link to="settings/general/Room" className="btn btn-sm btn-default">Cancel</Link>
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
  data: state.RoomReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;