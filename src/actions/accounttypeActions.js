import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchAccounttype(params) {
  return {
    type: 'FETCH_ACCOUNTTYPE',
    payload: http.get('/AccountType',{params:params})
  };
}

export function viewAccounttype(id) {
  return http.get('/AccountType/'+id,{params:{}})
}

export function addAccounttype(data,para) {
  return http.post('/AccountType'+para,param(data))
}

export function deleteAccounttype(id) {
  return http.delete('/AccountType/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 