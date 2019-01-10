import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchLeads(params) {
  return {
    type: 'FETCH_LEADS',
    payload: http.get('/leads',{params:params})
  };
}

export function viewLeads(id) {
  return http.get('/leads/'+id,{params:{}})
}

export function getCenter() {
  return http.get('/getcenter',{params:{}})
}

export function getSalesPerson(id) {
  return http.get('/getsalesperson/'+id,{params:{}})
}

export function convertCustomer(id) {
  return http.get('/leadsconvert/'+id,{params:{}})
}

export function officeType() {
  return http.get('/officetype',{params:{}})
}

export function leadSoucre() {
  return http.get('/LeadSourceMaster',{params:{}})
}
 
export function addLeads(data) {
  return http.post('/leads',param(data))
}

export function enquiry(data,para) {
  return http.post('/enquiry'+para,param(data))
}

export function deleteLeads(id) {
  return http.delete('/leads/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}