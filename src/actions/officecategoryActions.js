import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchCategory(params) {
  return {
    type: 'FETCH_CATEGORY',
    payload: http.get('/officecategory',{params:params})
  };
}

export function viewCategory(id) {
  return http.get('/officecategory/'+id,{params:{}})
}

export function addCategory(data,para) {
  return http.post('/officecategory'+para,param(data))
}

export function deleteCategory(id) {
  return http.delete('/officecategory/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
