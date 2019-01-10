import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');

export function fetchReceipt(params) {
  return {
    type: 'FETCH_RECEIPT',
    payload: http.get('/receipt',{params:params})
  };
}

export function addReceipt(data,para) {
  return http.post('/receipt'+para,param(data))
}
export function addAdvance(data,para) {
  return http.post('/advancereceipt'+para,param(data))
}


export function previewReceipt(id) {
  return http.get('/previewreceipt/'+id,{params:{}})
}


export function receiptAdvance(id) {
  return http.get('/advancereceiptlist/'+id,{params:{}})
}

export function getCustomerList() {
  return http.get('/receiptcustomer',{params:{}})
}

export function getPaymentList() {
  return http.get('/PaymentMaster',{params:{}})
}

export function getBankList() {
  return http.get('/bankmaster',{params:{}})
}


export function getLedgerBankList() {
  return http.get('/ledgerbanklist',{params:{}})
}

export function getInvoiceList(id) {
  return http.get('/receipttrans/'+id,{params:{}})
}


export function deleteReceipt(id) {
  //return http.delete('/receipt/'+id,{params:{}})
}

export function viewReceipt(data) {
  return http.post('/receipt',param(data))
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}