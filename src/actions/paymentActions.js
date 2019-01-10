import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchPayment(params) {
  return {
    type: 'FETCH_PAYMENT',
    payload: http.get('/PaymentMaster',{params:params})
  };
}

export function viewPayment(id) {
  return http.get('/PaymentMaster/'+id,{params:{}})
}

export function addPayment(data,para) {
  return http.post('/PaymentMaster'+para,param(data))
}

export function deletePayment(id) {
  return http.delete('/PaymentMaster/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 