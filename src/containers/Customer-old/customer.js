import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchCustomers, createCustomer } from '../../actions/customersActions';
import { Link } from 'react-router';

require("./customer.css");
 
class Customers extends React.Component {
  constructor(props) {
    super(props);
    this.state={
       userData:[],
       showstatus:false
    }
   }

  componentWillMount(){
    if(this.props.data.fetched===false){
        this.props.fetchCustomers();
    }
  }

 /* createCustomer(){

    this.setState({showstatus:true});
 
    return false;
    var userData={
          'username':'admintest',
          'gender':0,
          'dob':'1986-05-06',
          'email':'test@gmial.com',
          'password':'test@123',
          'mobile':'9900181254',
          'remarks':'testing' 
        }
    this.props.createCustomer(userData);
  }
 */
  render() {
    const { data  } = this.props;
     return (
             <div className="transition-item list-page">
 
                 <div className="list-group">
                 {
                  data.customers.map((user, i) => {
                      return (<div key={i} className="item  col-xs-4 col-lg-4 list-group-item">
                            <Link to={`/customers/${user.id}`} >
                              <div className="thumbnail">
                                  <img className="group list-group-image" src="" alt=""/>
                                  <div className="caption">
                                      <h5 className="group inner list-group-item-heading">{user.first_name}</h5> 
                                          <ul className="horizontal-bars">
                                                <li>
                                                    <div className="title">Email ID</div>
                                                    <div className="bars">
                                                        {user.email}
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="title">Mobile</div>
                                                    <div className="bars">
                                                        {user.mobile}
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="title">Gender</div>
                                                    <div className="bars">
                                                         {(user.gender===0)?'Male':'Female'}
                                                    </div>
                                                </li>
                                          </ul>
                                   </div>
                              </div>
                            </Link>
                      </div>)
                    })
                  } 
                  </div>
               </div>  
          
 
    )
  }
}


const mapStateToProps = (state) => ({
  data: state.customersReducer,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchCustomers, createCustomer },dispatch);
}

const CustomerContainer = connect(mapStateToProps,
  mapDispatchToProps, null, { withRef: true }
)(Customers)

export default CustomerContainer;