import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchLabel(params) {
  return {
    type: 'FETCH_LABEL',
    payload: http.get('/label',{params:params})
  };
}

export function fetchLanguages() {
  return  http.get('/language',{params:{limit:50,offset:0} });
}

export function viewLabel(id) {
  return http.get('/label/'+id,{params:{}})
}

export function addLabel(data,para) {
  return http.post('/label'+para,param(data))
}

export function deleteLabel(id) {
  return http.delete('/label/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 