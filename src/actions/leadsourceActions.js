import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchLeadsource(params) {
  return {
    type: 'FETCH_LEADSOURCE',
    payload: http.get('/LeadSourceMaster',{params:params})
  };
}

export function viewLeadsource(id) {
  return http.get('/LeadSourceMaster/'+id,{params:{}})
}

export function addLeadsource(data,para) {
  return http.post('/LeadSourceMaster'+para,param(data))
}

export function deleteLeadsource(id) {
  return http.delete('/LeadSourceMaster/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 