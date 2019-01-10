import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchCenter(params) {
  return {
    type: 'FETCH_CENTER',
    payload: http.get('/centername',{params:params})
  };
}

export function viewCenter(id) {
  return http.get('/centername/'+id,{params:{}})
}

export function addCenter(data,para) {
  return http.post('/centername'+para,param(data))
}

export function deleteCenter(id) {
  return http.delete('/centername/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 