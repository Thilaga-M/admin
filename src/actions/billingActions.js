import http from '../core/http-call';
import axiosCancel from 'axios-cancel';
var param= require('jquery-param');
 
export function fetchBilling(params) {
  return {
    type: 'FETCH_BILLING',
    payload: http.get('/billings',{params:params})
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
 
export function servicesuggest(params) {
  axiosCancel(http, { debug: false});
  const requestId = 'servicesuggest';
  let https =  http({
                  method:'post',
                  url:'/services/service_docid',
                  data:param({keywords:params}),
                  requestId:requestId
                })
  http.cancel(requestId);
  return https;
}

export function serviceBaseTax(service_id) {
   return http.get('/billings/tax/'+service_id);  
}
 