import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchGst(params) {
  return {
    type: 'FETCH_GST',
    payload: http.get('/gst',{params:params})
  };
}

export function viewGst(id) {
  return http.get('/gst/'+id,{params:{}})
}

export function getAccountTypeList() {
  return http.get('/getAccountTypeList',{params:{}})
}

export function getAccountHeadList(id) {
  return http.get('/getAccountHeadList/'+id,{params:{}})
}


export function addGst(data,para) {
  return http.post('/gst'+para,param(data))
}

export function deleteGst(id) {
  return http.delete('/gst/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 