import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import {  Link } from 'react-router';
import browserHistory from './../../core/History';

class Header extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      pagename:this.props.pagename.children.props.route.name,
      link:this.props.pagename.children.props.route.link
    };
  }

  componentWillReceiveProps(nextProps){
     this.setState({pagename:nextProps.pagename.children.props.route.name,link:nextProps.pagename.children.props.route.link})
    return setTimeout(()=>{
      return true;
    },30);
  }
   toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }
  logout(){
    localStorage.clear();
     browserHistory.push('/pages/login');
  }

  render() {
    console.log(this.state.link)
    return (
      <header className="app-header navbar">
       {
        (this.state.link)?
          <Link to={this.state.link} className="link-btn navbar-toggler mobile-sidebar-toggler hidden-lg-up"><i className="icon-arrow-left icons"></i></Link> 
          :
          <div className="link-btn navbar-toggler mobile-sidebar-toggler hidden-lg-up" onClick={this.mobileSidebarToggle}>&#9776;</div>
       }

         <span className="navbar-brand text-center" style={{color:"#fff"}} >{this.state.pagename}</span>
          <ul className="nav navbar-nav hidden-md-down">
          <li className="nav-item">
            <a className="nav-link navbar-toggler sidebar-toggler" onClick={this.sidebarToggle} href="#">&#9776;</a>
          </li> 
        </ul> 
        <ul className="nav navbar-nav ml-auto">
 
          <li className="nav-item">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <a onClick={this.toggle} className="nav-link dropdown-toggle nav-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded={this.state.dropdownOpen}>
                {/*<img src={'img/avatars/6.jpg'} className="img-avatar" alt="img/avatars/6.jpg"/>*/}
                <span className="hidden-md-down">admin</span>
              </a>

              <DropdownMenu className="dropdown-menu-right">
     
                <DropdownItem onClick={this.logout.bind(this)}><i className="fa fa-lock"></i> Logout</DropdownItem>

              </DropdownMenu>
            </Dropdown>
          </li> 
        </ul>
      </header>
    )
  }
}

export default Header;
