import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');

export function fetchCreditNote(params) {
  return {
    type: 'FETCH_CREDITNOTE',
    payload: http.get('/creditnote',{params:params})
  };
}

export function addCreditNote(data,para) {
  return http.post('/creditnote'+para,param(data))
}

export function getCustomerList() {
  return http.get('/receiptcustomer',{params:{}})
}

export function getInvoiceList(id) {
  return http.get('/receipttrans/'+id,{params:{}})
}

export function getCreditNoteList(data) {
  return http.post('/creditnotelist',param(data))
}

export function viewCreditNote(data) {
  return http.post('/receipt',param(data))
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}