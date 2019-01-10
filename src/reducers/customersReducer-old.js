// Promise
// pending
// fulfilled
// rejected
const initalState = {
  customers: [],
  customer: [],
  loading: false,
  fetched: false,
  error: null,
};

// REDCUER
function customerReducer(state = initalState, action) {
  let customers;
  switch (action.type) {
    case 'FETCH_CUSTOMER_PENDING':
      return { ...state, loading: true };

    case 'CREATE_CUSTOMER_FULFILLED': 
         customers = action.payload.data.results.customers;
        return { ...state, loading: false, customers };

     case 'FETCH_CUSTOMER_FULFILLED':
          customers = action.payload.data.results.customers;
      return { ...state, loading: false,fetched:true, customers };

    case 'FETCH_CUSTOMER_REJECTED':
      return { ...state, loading: false, error: `${action.payload.message}` };

    case 'VIEW_CUSTOMER_FULFILLED':
         let customer= action.payload.data.results.customer;
      return { ...state, loading: false, customer };
    default:
      return state;
  }
}

export default customerReducer;
