import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchBusiness(params) {
  return {
    type: 'FETCH_BUSINESS',
    payload: http.get('/business',{params:params})
  };
}

export function viewBusiness(id) {
  return http.get('/business/'+id,{params:{}})
}

export function addBusiness(data,para) {
  return http.post('/business'+para,param(data))
}

export function deleteBusiness(id) {
  return http.delete('/business/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 
 