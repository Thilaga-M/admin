import http from '../core/http-call';
var param= require('jquery-param');


export function fetchTemplateCategory(params) {
  return {
    type: 'FETCH_TEMPLATECATEGORY',
    payload: http.get('/templatecategory',{params:params})
  };
}

export function viewTemplateCategory(id) {
  return http.get('/templatecategory/'+id,{params:{}})
}

export function addTemplateCategory(data,para) {
  return http.post('/templatecategory'+para,param(data))
}

export function deleteTemplateCategory(id) {
  return http.delete('/templatecategory/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 