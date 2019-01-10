// Promise
// pending
// fulfilled
// rejected
const initalState = {
  billData: [],
  viewBill: [],
  loading: false,
  fetched: false,
  error: null,
};

// REDCUER
function billingReducer(state = initalState, action) {
  let billData;
  switch (action.type) {
    case 'FETCH_BILLING_PENDING':
      return { ...state, loading: true }; 

     case 'FETCH_BILLING_FULFILLED':
          billData = (action.payload.data.results)?action.payload.data.results.bills:[];
      return { ...state, loading: false,fetched: true, billData };

    case 'FETCH_BILLING_REJECTED':
      return { ...state, loading: false, error: `${action.payload.message}` }; 

    default:
      return state;
  }
}

export default billingReducer;
