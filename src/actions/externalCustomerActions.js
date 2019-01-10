import http from '../core/http-call';
var param= require('jquery-param');


export function fetchExternalCustomer(params) {
  return {
    type: 'FETCH_EXTERNALCUSTOMER',
    payload: http.get('/externalcustomer',{params:params})
  };
}

export function viewExternalCustomer(id) {
  return http.get('/externalcustomer/'+id,{params:{}})
}

export function addExternalCustomer(data,para) {
  return http.post('/externalcustomer'+para,param(data))
}

export function deleteExternalCustomer(id) {
  return http.delete('/externalcustomer/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}