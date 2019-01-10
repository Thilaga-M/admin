import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchService(params) {
  return {
    type: 'FETCH_SERVICE',
    payload: http.get('/service',{params:params})
  };
}

export function viewService(id) {
  return http.get('/service/'+id,{params:{}})
}

export function addService(data,para) {
  return http.post('/service'+para,param(data))
}

export function deleteService(id) {
  return http.delete('/service/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
export function getUnits(id) {
  return http.get('/UnitMaster',{params:{search_term: '',startDate: '',endDate:'',limit:1000, page:1}})
} 
export function fetchServicecategory() {
  var params={
                search_term: '',
                startDate: '',
                endDate:'',  
                limit:1000,
                page:1
        };
 return http.get('/servicecategory',{params:params});
}

/* 
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
}*/
 