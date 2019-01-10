import http from '../core/http-call';
var param= require('jquery-param');


export function fetchTemplateMaster(params) {
  return {
    type: 'FETCH_TEMPLATEMASTER',
    payload: http.get('/templatemaster',{params:params})
  };
}

export function viewTemplateMaster(id) {
  return http.get('/templatemaster/'+id,{params:{}})
}

export function addTemplateMaster(data,para) {
  return http.post('/templatemaster'+para,param(data))
}

export function deleteTemplateMaster(id) {
  return http.delete('/templatemaster/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}

export function getTemplateCategory() {
  return http.get('/getTemplateCategoryList',{params:{}})
}