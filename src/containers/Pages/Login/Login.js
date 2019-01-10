import React, { Component } from 'react';
import http from '../../../core/http-call';
import browserHistory from '../../../core/History';
//import { browserHistory } from 'react-router';

var qs = require('qs');
const $=window.$;
function validate(name,pass) { 
   return { 
    name:name.length===0,
    pass:pass.length===0
  };
}

class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      error_status:false,
      valid_status:false,
      name:'',
      pass:''
    }
    //this.login=this.login.bind(this);
  }

  componentWillMount(){
     let token=localStorage.getItem("token");
     if(token){
        browserHistory.push('/leads/leads');
     }
    //localStorage.clear();
    
   }
  componentDidMount(){
   this.function();  
    
   } 

 function() {

   $(".input input").focus(function() {

      $(this).parent(".input").each(function() {
         $("label", this).css({
            "line-height": "18px",
            "font-size": "18px",
            "font-weight": "100",
            "top": "0px"
         })
         $(".spin", this).css({
            "width": "100%"
         })
      });
   }).blur(function() {
      $(".spin").css({
         "width": "0px"
      })
      if ($(this).val() == "") {
         $(this).parent(".input").each(function() {
            $("label", this).css({
               "line-height": "60px",
               "font-size": "24px",
               "font-weight": "300",
               "top": "10px"
            })
         });

      }
   });

   $(".button").click(function(e) {
      var pX = e.pageX,
         pY = e.pageY,
         oX = parseInt($(this).offset().left),
         oY = parseInt($(this).offset().top);

      $(this).append('<span class="click-efect x-' + oX + ' y-' + oY + '" style="margin-left:' + (pX - oX) + 'px;margin-top:' + (pY - oY) + 'px;"></span>')
      $('.x-' + oX + '.y-' + oY + '').animate({
         "width": "500px",
         "height": "500px",
         "top": "-250px",
         "left": "-250px",

      }, 600);
      $("button", this).addClass('active');
   })

   $(".alt-2").click(function() {
      if (!$(this).hasClass('material-button')) {
         $(".shape").css({
            "width": "100%",
            "height": "100%",
            "transform": "rotate(0deg)"
         })

         setTimeout(function() {
            $(".overbox").css({
               "overflow": "initial"
            })
         }, 600)

         $(this).animate({
            "width": "140px",
            "height": "140px"
         }, 500, function() {
            $(".box").removeClass("back");

            $(this).removeClass('active')
         });

         $(".overbox .title").fadeOut(300);
         $(".overbox .input").fadeOut(300);
         $(".overbox .button").fadeOut(300);

         $(".alt-2").addClass('material-buton');
      }

   })

   $(".material-button").click(function() {

      if ($(this).hasClass('material-button')) {
         setTimeout(function() {
            $(".overbox").css({
               "overflow": "hidden"
            })
            $(".box").addClass("back");
         }, 200)
         $(this).addClass('active').animate({
            "width": "700px",
            "height": "700px"
         });

         setTimeout(function() {
            $(".shape").css({
               "width": "50%",
               "height": "50%",
               "transform": "rotate(45deg)"
            })

            $(".overbox .title").fadeIn(300);
            $(".overbox .input").fadeIn(300);
            $(".overbox .button").fadeIn(300);
         }, 700)

         $(this).removeClass('material-button');

      }

      if ($(".alt-2").hasClass('material-buton')) {
         $(".alt-2").removeClass('material-buton');
         $(".alt-2").addClass('material-button');
      }

   });

};

  handleChange(event) {
     this.setState({
      [event.target.id]:event.target.value,
      [event.target.name]:false,
      error_status:false,
      msg:''
    });
  }
  login(event){

        let {name,pass} =this.state;
        let errors = validate(name,pass);
        let isDisabled = Object.keys(errors).some(x => errors[x]);
        if(isDisabled===false){
 
           http({
            method: 'post',
            url: '/login',
             data:qs.stringify({
              username: this.state.name,
              password: this.state.pass
            })
          }).then((resp)=>{
            if(resp.data.status===200 && resp.data.token){
              localStorage.setItem("token",resp.data.token);
              localStorage.setItem("m_status",resp.data.results.m_status);
              localStorage.setItem("permission",JSON.stringify(resp.data.results.permission));
              localStorage.setItem("Cresult",JSON.stringify(resp.data.Cresult));
              localStorage.setItem("clength",resp.data.Cresult.length);
              localStorage.setItem("business_name",resp.data.business_name);
              localStorage.setItem("username",resp.data.username);
              localStorage.setItem("c_id",'');
              browserHistory.push('/leads/leads');
            }else{
               this.setState({ error_status:true,msg:resp.data.message});
            }
          }) ;
        }else{
            this.setState({valid_status:true})
        }

  }
 
  render() {
     let {name,pass,valid_status,error_status,msg} =this.state;
     let errors = validate(name,pass);
    return (
  <div className="row">
      <div className="col s8">
        <img className="responsive-img" src="../../images/background.jpg" />
      </div>
      <div className="col s4" style={{backgroundColor:'#fff',height:'-webkit-fill-available',margin:'0px !important',width: '32.9999%',
      marginLeft: '0px',marginRight: '0px', padding: '4%'}}>
         <div className="col s2">
         </div>
         <div className=" col s7">
           <img className="responsive-img" src="../../../images/coaider_logo.png" />
         </div>
         <div className="col s3">
         </div>
         <div className="row"> 
            <div className=" col s8">
             <div className="card-title">LOGIN</div>
            </div>
            <div className="col s4">
            </div>
         </div>
        <div className="input-field col s12">
          <input  type="text" id="name"  onChange={this.handleChange.bind(this)}  className={(errors.name && valid_status)?'invalid':''} value={this.state.name} className="validate" />
          <label for="first_name">First Name</label>
        </div>
        <div className="input-field col s12">
          <input type="password" id="pass"  onChange={this.handleChange.bind(this)} onKeyPress={(e)=>{ if(e.charCode==13){this.login()}}} value={this.state.pass}  className={(errors.pass && valid_status)?'invalid':''} className="validate" />
          <label for="last_name">Password</label>
        </div>
        <div className="row"> 
          <div className="col s4">
         </div>
         <div className="input">
             {  error_status &&
                <p  style={{color:'red'}}>{msg}</p>
              }
          </div>
         <div className=" col s8 input-field">
             <button className="btn waves-effect waves-light btn-cust" type="submit" name="action" onClick={this.login.bind(this)}>LOGIN
              <i className="material-icons right">check</i>
            </button>
         </div>
         
        </div>
     </div>
      
    </div>


// /////////////////

    // <div className="col s12" style={{backgroundColor:'#fff !important'}}>
    //   <div className="col s6">
    //     <div className="container login-page" style={{left: '0px',top: '0px',overflow: 'hidden',margin: '0px',padding: '0px',
    //     height: '669px',width: '850px',position: 'absolute'}}>
    //     </div>
    //   </div>
    //   <div className="col s6">
    //   <h1 style={{textAlign:'center',color:'#1e8fc6'}}></h1>
    //     <div className="div-center">
    //         <form  method="post" encType="multipart/form-data" style={{marginLeft: '5px',marginRight: '5px'}}>
    //               <div className="materialContainer">
    //                  <div className="box">
    //                     <h4 className="logo1"></h4>
    //                     <div className="title">LOGIN</div>
    //                     <div className="input">
    //                        <label htmlFor="name" style={{fontSize: '16px !important',top: '-10px'}}>Username</label>
    //                        <input type="text" id="name"  onChange={this.handleChange.bind(this)}  className={(errors.name && valid_status)?'invalid':''} value={this.state.name}/>
    //                     </div>
    //                     <div className="input">
    //                        <label htmlFor="pass" style={{fontSize: '16px !important',top: '-10px'}}>Password</label>
    //                        <input type="password" id="pass"  onChange={this.handleChange.bind(this)} onKeyPress={(e)=>{ if(e.charCode==13){this.login()}}} value={this.state.pass}  className={(errors.pass && valid_status)?'invalid':''}/>
    //                     </div>
    //                     <div className="input">
    //                        {  error_status &&
    //                           <p  style={{color:'red'}}>{msg}</p>
    //                         }
    //                     </div>
    //                     <div className="button login">
    //                        <button type="button" onClick={this.login.bind(this)}><span>GO</span><i className="fa fa-check"></i></button>
    //                     </div>
    //                  </div>
    //               </div>
    //             </form>
    //     </div>
    //   </div>
    // </div>
    );
  }
}


export default Login;
