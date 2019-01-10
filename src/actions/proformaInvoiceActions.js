import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchInvoice(params) {
  return {
    type: 'FETCH_INVOICE',
    payload: http.get('/profamainvoice',{params:params})
  };
}

export function viewInvoice(id) {
  return http.get('/profamainvoice/'+id,{params:{}})
}

export function sendPDFInvoice(id) {
  return http.get('/sendpdfproformainvoice/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 