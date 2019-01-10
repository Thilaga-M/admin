import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchServicecategory(params) {
  return {
    type: 'FETCH_SERVICECATEGORY',
    payload: http.get('/servicecategory',{params:params})
  };
}

export function viewServicecategory(id) {
  return http.get('/servicecategory/'+id,{params:{}})
}

export function officespacelist(id) {
  return http.get('/officespacelist',{params:{}})
}

export function addServicecategory(data,para) {
  return http.post('/servicecategory'+para,param(data))
}

export function deleteServicecategory(id) {
  return http.delete('/servicecategory/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 