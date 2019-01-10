import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchUnit(params) {
  return {
    type: 'FETCH_UNIT',
    payload: http.get('/UnitMaster',{params:params})
  };
}

export function viewUnit(id) {
  return http.get('/UnitMaster/'+id,{params:{}})
}

export function addUnit(data,para) {
  return http.post('/UnitMaster'+para,param(data))
}

export function deleteUnit(id) {
  return http.delete('/UnitMaster/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 