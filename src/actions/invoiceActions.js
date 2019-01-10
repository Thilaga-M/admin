import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchInvoice(params) {
  return {
    type: 'FETCH_INVOICE',
    payload: http.get('/invoice',{params:params})
  };
}

export function viewInvoice(id) {
  return http.get('/invoice/'+id,{params:{}})
}

export function sendPDFInvoice(id) {
  return http.get('/sendpdfinvoice/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 