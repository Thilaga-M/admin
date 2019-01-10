import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchLedger(params) {
  return {
    type: 'FETCH_LEDGER',
    payload: http.get('/Ledger',{params:params})
  };
}

export function viewLedger(id) {
  return http.get('/Ledger/'+id,{params:{}})
}

export function addLedger(data,para) {
  return http.post('/Ledger'+para,param(data))
}

export function deleteLedger(id) {
  return http.delete('/Ledger/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}

export function getAccountHeadList() {
  return http.get('/getAccountHeadAll',{params:{}})
}
 