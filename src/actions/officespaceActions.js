import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchSpace(params) {
  return {
    type: 'FETCH_SPACE',
    payload: http.get('/officespace',{params:params})
  };
}

export function viewSpace(id) {
  return http.get('/officespace/'+id,{params:{}})
}

export function getofficetype(id) {
  return http.get('/officetype',{params:{limit:1000,page:1}})
}

export function addSpace(data,para) {
  return http.post('/officespace'+para,param(data))
}

export function deleteSpace(id) {
  return http.delete('/officespace/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}