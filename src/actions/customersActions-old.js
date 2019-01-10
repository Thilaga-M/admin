import http from '../core/http-call';
var param= require('jquery-param');
 
export function fetchCustomers() {
  return {
    type: 'FETCH_CUSTOMER',
    payload: http.get('/customers')
  };
}
 
export function viewCustomer(custid) {
   return {
    type: 'VIEW_CUSTOMER',
    payload: http.get('/customers/'+custid+'?id='+custid)
  };
}

export function createCustomer(data) {
   return {
    type: 'CREATE_CUSTOMER',
    payload:http.post('/customers',param(data)) 
  } 
}

/*
export function getCustomers(){
  let request=new axios({url:"/customers?limit=10"});
  return request;
}

export function fetchCustomers(datas){  
  let request=new axios({url:'/customers',params:datas});
  return request;
}

export function getCityState(pincode){    
  let request=new axios({url:'/customer/'+pincode+'?pincode='+pincode});
  return request;
}

export function getSingleCustomer(custid){
  let request=new axios({url:'/customers/'+custid+'?id='+custid});
  return request;
}

export function updateCustomers(data){  
  let request = new axios({url: 'customers' + (data.customer.id ? '/' +data.customer.id :''), method: 'post', data: $.param(data), headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }})
  return request;
}

export function fetchSearchCustomer(datas){
  // let arr =JSON.stringify({"name":"test","id":34});
  // console.log(arr);    
  let request=new axios({url:'/customers/search',method:'post', data: qs.stringify(datas), headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }});
  return request;
}

export function customerInvoice(uid){ 
  let request=new axios({url:'/billings?uid='+uid});
  return request;
}*/
