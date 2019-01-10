import http from "../core/http-call";
//import axiosCancel from 'axios-cancel';
var param = require("jquery-param");

export function fetchAgreement(params) {
  return {
    type: "FETCH_AGREEMENT",
    payload: http.get("/agreement", { params: params })
  };
}

export function getWonLead(id) {
  return http.get("/leadCode/" + id, { params: {} });
}

export function viewAgreement(id) {
  return http.get("/agreement/" + id, { params: {} });
}
export function sendEmailAgreement(id) {
  return http.get("/sendemailagreement/" + id, { params: {} });
}

export function confirmAgreement(data) {
  return http.post("/confirmagreement", param(data));
}
export function previewEmailAgreement(id) {
  return http.get("/previewemailagreement/" + id, { params: {} });
}

export function addAgreement(data, para) {
  return http.post("/agreement" + para, param(data));
}

export function deleteAgreement(id) {
  return http.delete("/agreement/" + id, { params: {} });
}

export function customerAgreementList(id) {
  return http.get("/customeragreementlist/" + id, { params: {} });
}

export function renewalAgreement(id, data) {
  return http.post("/aggrementRenewal/" + id, param(data));
}

export function getCustomerDetails(id) {
  return http.get("/viewcompanyprofile/" + id, { params: {} });
}

export function update_fetch_status(params) {
  return {
    type: "UPDATE_FETCH_STATUS",
    payload: false
  };
}
