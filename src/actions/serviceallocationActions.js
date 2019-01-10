import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchServiceallocation(params) {
  return {
    type: 'FETCH_SERVICEALLOCATION',
    payload: http.get('/serviceallocation',{params:params})
  };
}

export function viewServiceallocation(id) {
  return http.get('/serviceallocation/'+id,{params:{}})
}

export function officespacelist(id) {
  return http.get('/officespacelist',{params:{}})
}

export function servicemasterlist(id) {
  return http.get('/servicemasterlist',{params:{}})
}
export function viewBill(id) {
  return http.get('/viewbill/'+id,{params:{}})
}

export function confirmBill(id) {
  return http.get('/volumesalesconfirm/'+id,{params:{}})
}

export function addServiceallocation(data,para) {
  return http.post('/serviceallocation'+para,param(data))
}

export function deleteServiceallocation(id) {
  return http.delete('/serviceallocation/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 