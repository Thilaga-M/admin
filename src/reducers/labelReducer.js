// Promise
// pending
// fulfilled
// rejected
const initalState = {
    data: [],
  loading: false,
  fetched: false,
  error: null,
  current_page: 1,
  per_page: 0,
  total: 0,
};

// REDCUER
function labelReducer(state = initalState, action) {
  let labelData;
  switch (action.type) {
    case 'FETCH_LABEL_PENDING':
      return { ...state, loading: true }; 

     case 'FETCH_LABEL_FULFILLED':
          return { ...state, loading: false,fetched: true,...action.payload.data.result };
          
    case 'FETCH_LABEL_REJECTED':
      return { ...state, loading: false, error: `${action.payload.message}` }; 

    case 'UPDATE_FETCH_STATUS':
      return {fetched: false};

    default:
      return state;
  }
}

export default labelReducer;
