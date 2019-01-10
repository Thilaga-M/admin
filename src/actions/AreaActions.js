import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchArea(params) {
  return {
    type: 'FETCH_Area',
    payload: http.get('/FloorMaster',{params:params})
  };
}

export function viewArea(id) {
  return http.get('/FloorMaster/'+id,{params:{}})
}

export function addArea(data,para) {
  return http.post('/FloorMaster'+para,param(data))
}

export function deleteArea(id) {
  return http.delete('/FloorMaster/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
export function Download() {
  return http.get('/getTallyXml',{params:{}})
}

 