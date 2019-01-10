import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {  Link } from 'react-router';
import browserHistory from './../../core/History';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';
import { Tooltip, Infotip } from '@trendmicro/react-tooltip';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-tooltip/dist/react-tooltip.css';


const $=window.$;
class Header extends Component {
	constructor(props){
	    super(props); 
	    this.state={selected:localStorage.getItem("centername"),center:''}
	    this.redirect =this.redirect.bind(this);
	    this.logout =this.logout.bind(this);
	    this.popup =this.popup.bind(this);
	    this.handleclick =this.handleclick.bind(this);
	    this.openCenter =this.openCenter.bind(this);
	    this.changeCenter =this.changeCenter.bind(this);
      this.state = {
       addMenu: false,
       updateMenu: false,
     };
     this.new = this.new.bind(this);
     this.update = this.update.bind(this);

     this.hideAddMenu = this.hideAddMenu.bind(this);
     this.hideUpdateMenu = this.hideUpdateMenu.bind(this);

	  }

  new(event) {
    event.preventDefault();
    this.setState({ addMenu: true }, () => {
    document.addEventListener('click', this.hideAddMenu);
    });
  }
  update(event) {
    event.preventDefault();
    this.setState({ updateMenu: true }, () => {
    document.addEventListener('click', this.hideUpdateMenu);
    });
  }

  hideAddMenu() {
    this.setState({ addMenu: false }, () => {
      document.removeEventListener('click', this.hideAddMenu);
    });

  }
  hideUpdateMenu() {
    this.setState({ updateMenu: false }, () => {
      document.removeEventListener('click', this.hideUpdateMenu);
    });

  }

   redirect(path){
     browserHistory.push(path);
   }
   logout(){
     localStorage.clear();
     location.reload();
     browserHistory.push('/pages/login');
  }
  popup(){
   	    $('#modal1').modal('open');
  }
  openCenter(){
  	 $('#modal1').modal('open');
  }
  handleclick(e){
    this.setState({selected:e.target.value,center:e.target.options[e.target.selectedIndex].text});
  }
  changeCenter(){
    $('#modal1').modal('close'); 
 	localStorage.setItem("c_id",this.state.selected);
 	localStorage.setItem("centerName",this.state.center);
 	this.setState({selected:'',center:''});
 	location.reload();
  }
  render() {
  	let clength = localStorage.getItem("clength");
  	let username = localStorage.getItem("username");
  	let c_id = localStorage.getItem("c_id");
  	let business_name = localStorage.getItem("business_name");
  	let Cresult =JSON.parse(localStorage.getItem("Cresult"));
  	let centerName=localStorage.getItem("centerName");
  	if(clength>1 && !c_id){
 	  	setTimeout(()=>{
	   		this.popup();
	  	},5);
	}else{
		centerName=(centerName)?centerName:(Cresult)?Cresult[0].centername:'';
	}
	setTimeout(()=>{
	   		$('.modal').modal({dismissible: false});
	},3);

	let pathname=this.props.pagename.location.pathname;
  
  		return(

  				<div >
  				{ clength>1 &&
  				<div id="modal1" className="modal">
				    <div className="modal-content">
				      <h5>Center List</h5> 
		       			<select className="browser-default" value={this.state.selected}  onChange={(e)=>{this.handleclick(e)}} >
		       				<option>Select Center</option>
                  {
                    Cresult && Cresult.map((val,i)=>{
                        return (<option title={i} key={i} value={val.c_id}>{val.centername}</option>)
                    })
                  } 
                </select>  
				    </div>
				    <div className="modal-footer">
				      <button onClick={()=>{this.changeCenter()}} className="waves-effect waves-green btn-flat">Change</button>
				    </div>
				  </div>
				}
<SideNav
    onSelect={(selected) => {
        // Add your code here
    }} >

      <SideNav.Toggle  style={{backgroundColor:' #17C4BB', display:'none'}} className="sidenav---expanded---1KdUL"/>
        <div  style={{height:'64px' ,boxShadow:'none'}}>
          <div className="input-field col s2">
            <a href="#" className="brand-logo">
              <span><i className="small material-icons" style={{margin: '0% 2% 0% 0%',float:'none'}}>grid_on</i></span>
              <span>
                <a  href="#"  onClick={()=>{this.openCenter()}} className="navbar-brand---1HEM4">
                  {business_name}&nbsp;&nbsp;{centerName}
                </a>
              </span>
            </a> 
          </div>
          <div className="input-field col s1" style={{width: '16.333333% '}}>
            <div className="dd-wrapper">
              <div className="dd-header">
                <div className="dd-header-title"></div>
              </div>
              <ul className="dd-list">
                <li className="dd-list-item"></li>
                <li className="dd-list-item"></li>
                <li className="dd-list-item"></li>
              </ul>
            </div>
          <div className="col s6">
            <div  className="Dropdown" style = {{width:"200px"}} >
               <div className="Button" style={{textAlign:'center'}} onClick={this.new}>
                  <i className="small material-icons header-icon"  >add</i>
                 <span className="header-dropdown-text">New</span>
               </div>

                { this.state.addMenu ? (
                <ul  className="ul">
                   <li className="li"><a className="dropdown-item" href="/leads/enquiry">Enquiry</a></li>
                   <li className="li"><a className="dropdown-item" href="/leads/add-agreement">Agreement</a></li>
                   <li className="li"><a className="dropdown-item" href="/customers/serviceallocation/">Service Allocation</a></li>
                   <li className="li"><a className="dropdown-item" href="/customers/serviceallocation/">Volume Sales</a></li>
                   <li className="li"><a className="dropdown-item" href="/billing/add-receipt">Receipt</a></li>
                   <li className="li"><a className="dropdown-item" href="/customers/client-setting/add-client">Customer</a></li>
                </ul>
              ):
              (
                null
              )
              }

             </div>
          </div>
          <div className="col s6">
            <div  className="Dropdown" style = {{width:"200px"}} >
                   <div className="Button" style={{textAlign:'center'}} onClick={this.update}>
                      <i className="small material-icons header-icon"  >edit</i>
                     <span className="header-dropdown-text">Update</span>
                   </div>

                    { this.state.updateMenu ? (
                    <ul  className="ul">
                       <li className="li"><a className="dropdown-item" href="/leads/leads">Lead</a></li>
                       <li className="li"><a className="dropdown-item" href="/customers/client-setting/">Customer</a></li>
                    </ul>
                  ):
                  (
                    null
                  )
                  }
                 </div>

            </div>
          </div>
          <div className="col s4"></div>
          <div className="col s6" style={{width: '67%'}}>
            <ul  className="right hide-on-med-and-down header-span">
              <li>
                <i className="small material-icons d-blk" style={{margin: '-5px 0px 0px 7px'}}>mail_outline</i>
                <span className="Badge Badge-default"> 9 </span>
              </li>
              <li>
                <i className="small material-icons d-blk" style={{margin: '-5px 0px 0px 7px'}}>calendar_today</i>
                <span className="Badge Badge-default"> 4 </span>
              </li>
              <li>
                <i className="small material-icons d-blk" style={{margin: '-5px 0px 0px 7px'}}>person</i>
                <span style={{marginLeft: '17%'}}>{username}</span>
              </li>
              <li>
                <i className="small material-icons d-blk" onClick={()=>{this.logout()}} style={{margin: '-17px 0px 0px 20px'}}>input</i>
              </li>
            </ul>
          </div>
        </div>
    <SideNav.Nav defaultSelected="dashboard" style={{height: '600px'}}>  
      <Tooltip content="Dashboard">
        <NavItem eventKey="dashboard" onClick={()=>{this.redirect("dashboard/")}} className={(pathname=="/dashboard/")?"active":''}>
              <NavIcon>
                  <i className="small material-icons d-blk"  style={{ fontSize: '1.75em' }}>dashboard </i>
              </NavIcon>
              <NavText>
                  Dashboard
              </NavText>
          </NavItem>
          </Tooltip>
        <Tooltip content="Leads">
        <NavItem eventKey="leads" onClick={()=>{this.redirect("leads/")}} 
        href="#test2" className={(pathname=="/leads/")?"active":''}>
            <NavIcon>
               <i className="small material-icons d-blk">contact_phone</i>
            </NavIcon>
            <NavText>
                Leads
            </NavText>
        </NavItem>
        </Tooltip>
        <Tooltip content="Customer">
        <NavItem eventKey="customers" onClick={()=>{this.redirect("customers/")}} 
        href="#test3" className={(pathname=="/customers/")?"active":''}>
            <NavIcon>
                <i className="small material-icons d-blk">people</i>
            </NavIcon>
            <NavText >
                Customer
            </NavText>          
        </NavItem>
        </Tooltip>
        <Tooltip content="Billing">
        <NavItem eventKey="billing" onClick={()=>{this.redirect("billing/")}} 
        href="#test4" className={(pathname=="/billing/")?"active":''}>
            <NavIcon>
                <i className="small material-icons d-blk">payment</i>
            </NavIcon>
            <NavText >
                Billing
            </NavText>
        </NavItem>
        </Tooltip>
        <Tooltip content="Reports">
         <NavItem eventKey="reports" onClick={()=>{this.redirect("reports/")}} 
         href="#test4" className={(pathname=="/reports/")?"active":''}>
            <NavIcon>
              <i className="small material-icons d-blk">view_list</i>
            </NavIcon>
            <NavText >
                Reports
            </NavText>
        </NavItem>
        </Tooltip>
        <Tooltip content="Settings">
         <NavItem eventKey="setting" onClick={()=>{this.redirect("settings")}} 
         href="#test5" className={(pathname=="/settings/")?"active":''}>
            <NavIcon>
                <i className="small material-icons d-blk">settings</i>
            </NavIcon>
            <NavText>
              Settings
            </NavText>
        </NavItem>
        </Tooltip>
    </SideNav.Nav>
</SideNav>		
</div> 
  )
}

}

export default Header;

   ////////////
            // <NavItem eventKey="customers/clientSetting">
            //     <NavText>
            //        Client Setting
            //     </NavText>
            // </NavItem>
            // <NavItem eventKey="customers/externalCustomer">
            //     <NavText>
            //        External Customer
            //     </NavText>
            // </NavItem>
            // <NavItem eventKey="customers/serviceAllocation">
            //     <NavText>
            //        Service Allocation
            //     </NavText>
            // </NavItem>
            // <NavItem eventKey="customers/feedback">
            //     <NavText>
            //       Feedback
            //     </NavText>
            // </NavItem>
            // <NavItem eventKey="customers/notification">
            //     <NavText>
            //       Notification
            //     </NavText>
            // </NavItem>