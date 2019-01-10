import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchAccounthead(params) {
  return {
    type: 'FETCH_ACCOUNTHEAD',
    payload: http.get('/AccountHead',{params:params})
  };
}

export function viewAccounthead(id) {
  return http.get('/AccountHead/'+id,{params:{}})
}

export function addAccounthead(data,para) {
  return http.post('/AccountHead'+para,param(data))
}

export function deleteAccounthead(id) {
  return http.delete('/AccountHead/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}

export function getAccountTypeList() {
  return http.get('/getAccountTypeList',{params:{}})
}
 