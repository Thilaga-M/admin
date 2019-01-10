import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchLanguage(params) {
  return {
    type: 'FETCH_LANGUAGE',
    payload: http.get('/language',{params:params})
  };
}

export function viewLanguage(id) {
  return http.get('/language/'+id,{params:{}})
}

export function addLanguage(data,para) {
  return http.post('/language'+para,param(data))
}

export function deleteLanguage(id) {
  return http.delete('/language/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 