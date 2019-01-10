import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addFeedback , update_fetch_status, viewFeedback } from '../../actions/feedbackActions';
import browserHistory from '../../core/History';
import { Link } from 'react-router';
import {permissionCheck} from './../../core/permission';
import Nopermission from './../../components/Nopermission';
import Preloader from './../../core/Preloader';
import {validationCheck} from './../../core/validation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

var validateCols={
        feedback_name:{
          required:true,
          value:'',
          msg:'',
      },
        validFrom:{
          required:true,
          value:'',
          msg:'',
      },
        validTo:{
          required:true,
          value:'',
          msg:'',
      },
        description:{
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
          feedback_name:'',
          validFrom:'',
          status:1,
          validTo:'',
          description:'',
          questions:[{quest:'',type:['text','ckeckbox','radio'],typevals:[""],selectedtype:"text"}],
          preloader:(this.props.params.id)?true:false,
          title:(this.props.params.id)?"Edit":"New"
        }
      this.eventHandle=this.eventHandle.bind(this);
      this.onsubmit=this.onsubmit.bind(this);
      this.handleChangeStart=this.handleChangeStart.bind(this);
      this.handleChangeEnd=this.handleChangeEnd.bind(this);
       // this.totalCalculation=this.totalCalculation.bind(this);
    }

    componentDidMount(){
      if(this.props.params.id){
       viewFeedback(this.props.params.id).then((res)=>{
         if(res.data.status===200){
          let data=res.data.data;
          const questions=data.questions.map((val,i)=>{
            return ({quest:val.question_name,type:['text','ckeckbox','radio'],typevals:val.question_values.split(","),selectedtype:val.question_type});
          });
            this.setState({
              feedback_name:data.feedback_name,
              description:data.description,
              validTo:moment(data.validTo),
              validFrom:moment(data.validFrom),
              questions:questions,
               preloader:false,
              status:1
            })
         }

       })
      }
    }

    handleChangeStart(date,e) {
       this.setState({
        validFrom: moment(date)
      });
    }
    handleChangeEnd(date,e) {
       this.setState({
        validTo: moment(date)
      }); 
    }

 
    eventHandle(e,key,k,m){
      if(k>=0){
        if(m>=0){
          this.state.questions[k][key][m]=e.target.value;
        }
        else{
          if(key==="selectedtype"){
            this.state.questions[k]["typevals"]=[""];
          }
          this.state.questions[k][key]=e.target.value;
        }
        this.setState({questions:this.state.questions});
      }else{
        this.setState({[key]:e.target.value});
      }
    }
    addQuestion(){
     const  questions={quest:'',type:['text','ckeckbox','radio'],typevals:[""],selectedtype:"text"};
      this.setState({questions:[...this.state.questions,questions]});
    }
    addOptions(k){
     this.state.questions[k]["typevals"].push("");
      this.setState({questions:this.state.questions});
    }
    removeOptions(k,i){
      if(i>=0){
        this.state.questions[k]["typevals"].splice(i,1);
      }else{
        this.state.questions.splice(k,1);
      }
      this.setState({questions:this.state.questions});
    }

    onsubmit(){
        let {feedback_name,questions,status,validTo,validFrom,description} =this.state;
 
        let errors= validationCheck(validateCols);
        let isDisabled = Object.keys(errors).some(x =>errors[x].msg);
        this.setState({preloader:true});
        if(isDisabled===false){
             let params={
              feedback_name:feedback_name,
              questions:questions,
              description:description,
              validTo:moment(new Date(validTo)).format("YYYY-MM-DD"),
              validFrom:moment(new Date(validFrom)).format("YYYY-MM-DD"),
              status:status
            }
            let para=(this.props.params.id)?'/'+this.props.params.id:'';
            addFeedback(params,para).then((res)=>{
                if(res.data.status===200){
                   this.props.update_fetch_status();
                   browserHistory.push("customers/feedback/");
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
    let {feedback_name,validFrom,error_status,title,preloader,validTo,description,questions} = this.state;
 console.log(this.state);
    let role=permissionCheck("gst",title);
      if(!role)
        return <Nopermission/>
        validateCols.feedback_name.value=feedback_name;
        validateCols.validFrom.value=validFrom;
        validateCols.validTo.value=validTo;
        validateCols.description.value=description;
      let errors= validationCheck(validateCols);
  
          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content">
                    <div className="col s12 portlet-title"> 
                      <div className="caption">{title} FEEDBACK
                      </div>
                    </div>
                      <form method="post" encType="multipart/form-data">

                        <div className="row">
                          <div className="input-field col s4">
                            <input type="text" onChange={(e)=>{this.eventHandle(e,"feedback_name")}} className={(errors.feedback_name.msg && error_status)?'invalid':''} value={feedback_name}/>
                                   <label  className={(errors.feedback_name.msg)?'':'active'}>Feedback Name</label>
                                  {(errors.feedback_name.msg && error_status) ? (<div className="validation-error">{errors.feedback_name.msg}</div>):('')} 
                          </div>

                           <div className="input-field col s4">
                            <DatePicker selected={validFrom} dateFormat="DD/MM/YYYY"  readOnly={true} className={(errors.validFrom.msg && error_status)?'datepicker form-control invalid':'datepicker form-control'} onChange={this.handleChangeStart} />
                            <label  className={(errors.validFrom.msg)?'':'active'}>Valid From Date</label>
                            {(errors.validFrom.msg && error_status) ? (<div className="validation-error">{errors.validFrom.msg}</div>):('')}
                          </div> 
                          <div className="input-field col s4">
                          <DatePicker selected={validTo} dateFormat="DD/MM/YYYY"  readOnly={true}  className={(errors.validTo.msg && error_status)?'datepicker form-control invalid':'datepicker form-control'} onChange={this.handleChangeEnd} />
                                    <label  className={(errors.validTo.msg)?'':'active'}>Valid To Date</label>
                                  {(errors.validTo.msg && error_status) ? (<div className="validation-error">{errors.validTo.msg}</div>):('')}
                          </div>
                        </div>  

                        <div className="row">
                          <div className="input-field col s4">
                            <textarea onChange={(e)=>{this.eventHandle(e,"description")}} className={(errors.description.msg && error_status)?'materialize-textarea invalid':'materialize-textarea'} value={description}/>
                            <label  className={(errors.description.msg)?'':'active'}>Description</label>
                            {(errors.description.msg && error_status) ? (<div className="validation-error">{errors.description.msg}</div>):('')}
                          </div>
                        </div>

                        <div className="row">
                          <div className="input-field col s4">
                          Questions:-
                          </div>
                          <div className="input-field col s4">
                          <button type="button" onClick={(e)=>{this.addQuestion()}} className="btn btn-sm btn-primary">Add Question</button>
                          </div>
                        </div> 
 
                        <div className="row">
                             {
                               questions && questions.map((val,i)=>{
                                return (
                                  <div className="question-tag">
                                    <div className="row">
                                      <div className="input-field col s4">
                                        <input type="text" onChange={(e)=>{this.eventHandle(e,"quest",i)}} value={val.quest}/>
                                        <label  className={(!val.quest)?'':'active'}>Question</label>  
                                      </div>
                                      <div className="input-field col s4">
                                        <select className={`browser-default selectOptions`} value={val.selectedtype} onChange={(e)=>{this.eventHandle(e,"selectedtype",i)}} >
                                                {
                                                  val.type && val.type.map((value,k)=>{
                                                      return (<option title={k} key={k} value={value} >{value}</option>)
                                                  })
                                                }
                                        </select>
                                        {
                                        val.selectedtype!=="text" &&
                                        <a className="btn-floating plus-btn"  onClick={(e)=>{this.addOptions(i)}} >+</a> 
                                        }
                                      </div>
                                      {
                                        questions.length>1 &&
                                          <div className="input-field col s4">
                                              <a className="btn-floating minus-btn move-right"  onClick={(e)=>{this.removeOptions(i)}} >x</a> 
                                          </div>
                                      }
                                    </div>

                                    <div className="row">
                                      {
                                        val.selectedtype!=="text" && val.typevals.map((typeval,j)=>{
                                          return (
                                            <div className="input-field col s4" key={j}>
                                              <input type="text" className="text-input" onChange={(e)=>{this.eventHandle(e,"typevals",i,j)}} value={typeval}/>
                                              <label  className={(!typeval)?'':'active'}>Please enter feedback { val.selectedtype } Name</label> 
                                              {
                                                val.typevals.length>1 &&
                                                <a className="btn-floating minus-btn"  onClick={(e)=>{this.removeOptions(i,j)}} >x</a> 
                                              }
                                          </div>
                                          )
                                        }) 
                                     }
                                    </div>
                                  </div>
                                  )
                               })

                             }
                        </div> 
                        
                        <div className="row">
                          <div className="card-footer right">
                            <button type="button" onClick={(e)=>{this.onsubmit()}} className="btn btn-sm btn-primary">Save</button>
                            &nbsp;&nbsp;
                            <Link to="customers/feedback/" className="btn btn-sm btn-default">Cancel</Link>
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
  data: state.feedbackReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ update_fetch_status },dispatch);
}

const AEContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(AddEdit)

export default AEContainer;