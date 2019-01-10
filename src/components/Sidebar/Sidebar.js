import React, { Component } from 'react';
import { Link } from 'react-router'

class Sidebar extends Component {

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  render() {
    return (

      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-item">
              <Link to={'/centername'} className="nav-link" activeClassName="active">Center Name</Link>
            </li> 
            <li className="nav-item">
              <Link to={'/officespace'} className="nav-link" activeClassName="active">Office Space</Link>
            </li>
            <li className="nav-item">
              <Link to={'/menu'} className="nav-link" activeClassName="active">Menu</Link>
            </li>
            <li className="nav-item">
              <Link to={'/business'} className="nav-link" activeClassName="active">Business Center</Link>
            </li>
            <li className="nav-item">
              <Link to={'/users'} className="nav-link" activeClassName="active">Users</Link>
            </li>
            <li className="nav-item">
              <Link to={'/roles'} className="nav-link" activeClassName="active">Roles</Link>
            </li>

            <li className="nav-item">
              <Link to={'/officetype'} className="nav-link" activeClassName="active">Office Type</Link>
            </li>
            <li className="nav-item">
              <Link to={'/officecategory'} className="nav-link" activeClassName="active">Office Category</Link>
            </li>
            <li className="nav-item">
              <Link to={'/package'} className="nav-link" activeClassName="active">Package</Link>
            </li>
            <li className="nav-item">
              <Link to={'/service'} className="nav-link" activeClassName="active">Service</Link>
            </li>
            <li className="nav-item">
              <Link to={'/leads'} className="nav-link" activeClassName="active">Leads</Link>
            </li>
            <li className="nav-item">
              <Link to={'/customer'} className="nav-link" activeClassName="active">Customer</Link>
            </li>

           </ul>
        </nav>
      </div>
    )
  }
}

export default Sidebar;
