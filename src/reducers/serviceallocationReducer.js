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
function serviceallocationReducer(state = initalState, action) {
  switch (action.type) {
    case 'FETCH_SERVICEALLOCATION_PENDING':
      return { ...state, loading: true }; 

     case 'FETCH_SERVICEALLOCATION_FULFILLED':
      return { ...state, loading: false,fetched: true,...action.payload.data.result };

    case 'FETCH_SERVICEALLOCATION_REJECTED':
      return { ...state, loading: false, error: `${action.payload.message}` }; 

    case 'UPDATE_FETCH_STATUS':
      return {fetched: false};

    default:
      return state;
  }
}

export default serviceallocationReducer;
