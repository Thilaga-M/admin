import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import promise from 'redux-promise-middleware';

import centernameReducer from './reducers/centernameReducer'; 
import officespaceReducer from './reducers/officespaceReducer'; 
import officetypeReducer from './reducers/officetypeReducer'; 
import officecategoryReducer from './reducers/officecategoryReducer'; 
import packageReducer from './reducers/packageReducer'; 
import serviceReducer from './reducers/serviceReducer'; 
import leadsReducer from './reducers/leadsReducer'; 
import customerReducer from './reducers/customerReducer'; 
import menuReducer from './reducers/menuReducer'; 
import rolesReducer from './reducers/rolesReducer'; 
import businessReducer from './reducers/businessReducer'; 
import usersReducer from './reducers/usersReducer'; 
import languageReducer from './reducers/languageReducer'; 
import labelReducer from './reducers/labelReducer'; 
import gstReducer from './reducers/gstReducer'; 
import amenitiesReducer from './reducers/amenitiesReducer'; 
import serviceallocationReducer from './reducers/serviceallocationReducer'; 
import servicecategoryReducer from './reducers/servicecategoryReducer'; 
import agreementReducer from './reducers/agreementReducer'; 

import accounttypeReducer from './reducers/accounttypeReducer'; 
import paymentReducer from './reducers/paymentReducer';
import leadsourceReducer from './reducers/leadsourceReducer';
import kycReducer from './reducers/kycReducer';
import unitReducer from './reducers/unitReducer';
import countryReducer from './reducers/countryReducer';
import productReducer from './reducers/productReducer';
import stateReducer from './reducers/stateReducer';
import cityReducer from './reducers/cityReducer';
import pincodeReducer from './reducers/pincodeReducer';
import accountheadReducer from './reducers/accountheadReducer';
import ledgerReducer from './reducers/ledgerReducer';
import invoiceReducer from './reducers/invoiceReducer';
import groupBillingReducer from './reducers/groupBillingReducer';
import receiptReducer from './reducers/receiptReducer';
import creditnoteReducer from './reducers/creditnoteReducer';

import AreaReducer from './reducers/AreaReducer';
import RoomReducer from './reducers/RoomReducer';
import feedbackReducer from './reducers/feedbackReducer';

import externalcustomerReducer from './reducers/externalcustomerReducer';
import templateCategoryReducer from './reducers/templateCategoryReducer';
import templatemasterReducer from './reducers/templatemasterReducer';
import notificationReducer from './reducers/notificationReducer';

export default createStore(
    combineReducers({
		officespaceReducer,
		officetypeReducer,
		officecategoryReducer,
        packageReducer,
        serviceReducer,
        leadsReducer,
        customerReducer,
        menuReducer,
        rolesReducer,
        businessReducer,
        usersReducer,
        languageReducer,
        labelReducer,
        gstReducer,
        amenitiesReducer,
        serviceallocationReducer,
		servicecategoryReducer,
        centernameReducer,
        agreementReducer,

        accounttypeReducer,
        paymentReducer,
        leadsourceReducer,
        kycReducer,
        unitReducer,
        countryReducer,
        productReducer,
        stateReducer,
        cityReducer,
        pincodeReducer,
        accountheadReducer,
        ledgerReducer,
        invoiceReducer,
        groupBillingReducer,
        receiptReducer,
        creditnoteReducer,
        AreaReducer,
        RoomReducer,
        feedbackReducer,
        externalcustomerReducer,
        templateCategoryReducer,
        templatemasterReducer,
        notificationReducer
    }),
    applyMiddleware(
        logger(),
        promise()
    )
);
