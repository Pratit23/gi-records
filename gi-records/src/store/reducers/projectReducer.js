const initState = {}

const projectReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_PROJECT_SUCCESS':
      console.log('create project success');
      return state;
    case 'CREATE_PROJECT_ERROR':
      console.log('create project error');
      return state;
    case 'SELL_PROPERTY_ERROR':
      console.log('sell error');
      return state;
    case 'SELL_PROPERTY_SUCCESS':
      console.log('sell success');
      return state;
    case 'SENT_QUOTE':
      console.log('quote sent');
      return state;
    case 'SENT_QUOTE_ERROR':
      console.log('quote not sent');
      return state;
    default:
      return state;
  }
};

export default projectReducer;