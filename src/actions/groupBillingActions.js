import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');

export function addGroupBilling(data,para) {
  return http.post('/groupbilling?centerid='+localStorage.getItem("c_id"),param(data))
}


export function groupBillPosting(data) {
  return http.post('/groupbillconfirm',param(data))
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}