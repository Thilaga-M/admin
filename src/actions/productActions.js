import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchProduct(params) {
  return {
    type: 'FETCH_PRODUCT',
    payload: http.get('/ProductMaster',{params:params})
  };
}

export function viewProduct(id) {
  return http.get('/ProductMaster/'+id,{params:{}})
}

export function addProduct(data,para) {
  return http.post('/ProductMaster'+para,param(data))
}

export function deleteProduct(id) {
  return http.delete('/ProductMaster/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 