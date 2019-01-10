import http from "../core/http-call";
//import axiosCancel from 'axios-cancel';
var param = require("jquery-param");

export function fetchType(params) {
  return {
    type: "FETCH_TYPE",
    payload: http.get("/officetype", { params: params })
  };
}

export function viewType(id) {
  return http.get("/officetype/" + id, { params: {} });
}

export function addType(data, para) {
  return http.post("/officetype" + para, param(data));
}

export function deleteType(id) {
  return http.delete("/officetype/" + id, { params: {} });
}

export function update_fetch_status(params) {
  return {
    type: "UPDATE_FETCH_STATUS",
    payload: false
  };
}
