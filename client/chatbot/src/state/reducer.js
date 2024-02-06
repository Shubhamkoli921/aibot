// reducers.js

const initialState = {
  token: localStorage.getItem('token') || '',
  adminId: localStorage.getItem('adminId') || ''
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_TOKEN':
        localStorage.setItem('token', action.payload);
        return {
          ...state,
          token: action.payload,
        };
      case 'UPDATE_ADMIN_ID':
        localStorage.setItem('adminId', action.payload);
        return {
          ...state,
          adminId: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  