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
    }
  }
 
  render() {
    let layout=this.props
    let mobiles=document.body.classList;
    if(mobiles.length===6)
      document.body.classList.toggle('sidebar-mobile-show'); 
 
    return (
         <div className="app" style={{backgroundColor: '#eef1f5'}}>
          <Header pagename={layout}/>  
          <div className="app-body" style={{backgroundColor: '#eef1f5'}}>
            <Sidebar {...this.props}/>
            
             { this.state.width && (this.state.width>770)?
                <main className="main">
                   <div className="container-fluid">
                    {this.props.children}
                  </div>
                </main>
              :
              <main className="main">
                <PageTransition timeout={500} > 
                  {this.props.children}
                </PageTransition>
              </main>
              }
           
            <Aside/>
          </div> 
        </div> 
    );
  }
}

export default Layout;
