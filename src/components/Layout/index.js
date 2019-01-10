import React, { Component } from 'react';
//import { browserHistory } from 'react-router';
import PageTransition from 'react-router-page-transition';
import Breadcrumbs from 'react-breadcrumbs';
 
import browserHistory from '../../core/History';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Aside from '../../components/Aside/';


class Layout extends Component {

  constructor(props){
    super(props);
    this.state={
      loading:true,
      width:document.body.clientWidth
    }
  }

  componentWillMount(){
     this.tokenCheck();
  }
  componentDidMount(){
    var self=this;
     window.onresize = function(event) {
       self.setState({width:document.body.clientWidth});
      };
  }

  componentWillUpdate(){
    this.tokenCheck();
  }

  tokenCheck(){
    if(!localStorage.getItem("token")){
     browserHistory.push('/pages/login');
    window.location.reload(true);
    }
  }
 
  render() {
    let layout=this.props;
    let pathname=this.props.location.pathname;
    
    return (
         <div className="row"> 
         <div className="col s12" style={{backgroundColor: '#eef1f5'}}> 
	          <Header pagename={layout}/> 

	          <div className="col s12 header-div" style={{backgroundColor: 'rgb(238, 241, 245) !important',width: '92%', margin: '6% 0% 0% 7%'}}> 
             <Breadcrumbs wrapperElement="ol" wrapperClass="breadcrumb mb-0" itemClass="breadcrumb-item" separator="" routes={this.props.routes} params={{params:this.props.pathname}}/>
	           	{this.props.children}
	           </div>
         </div> 
         </div> 
    );
  }
}

export default Layout;
