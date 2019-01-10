import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');

export function addProformaBilling(data,para) {
  return http.post('/profamabilling'+para,param(data))
}

export function loadProformaBills(data,para) {
  return http.post('/loadProformaBills'+para,param(data))
}

export function proformaBillSave(data) {
  return http.post('/profamabillconfirm',param(data))
}

export function proformaBillPosting(data) {
  return http.post('/proformabillposting',param(data))
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}