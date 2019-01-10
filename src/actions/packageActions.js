import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchPackage(params) {
  return {
    type: 'FETCH_PACKAGE',
    payload: http.get('/package',{params:params})
  };
}

export function viewPackage(id) {
  return http.get('/package/'+id,{params:{}})
}

export function addPackage(data,para) {
  return http.post('/package'+para,param(data))
}

export function deletePackage(id) {
  return http.delete('/package/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 