import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchKYC(params) {
  return {
    type: 'FETCH_KYC',
    payload: http.get('/KYCMaster',{params:params})
  };
}

export function viewKYC(id) {
  return http.get('/KYCMaster/'+id,{params:{}})
}

export function addKYC(data,para) {
  return http.post('/KYCMaster'+para,param(data))
}

export function deleteKYC(id) {
  return http.delete('/KYCMaster/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 