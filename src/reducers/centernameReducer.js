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
function centernameReducer(state = initalState, action) {
  let centerData;
  switch (action.type) {
    case 'FETCH_CENTER_PENDING':
      return { ...state, loading: true }; 

     case 'FETCH_CENTER_FULFILLED':
       return { ...state, loading: false,fetched: true,...action.payload.data.result };

    case 'FETCH_CENTER_REJECTED':
      return { ...state, loading: false, error: `${action.payload.message}` }; 

    case 'UPDATE_FETCH_STATUS':
      return {fetched: false};

    default:
      return state;
  }
}

export default centernameReducer;
