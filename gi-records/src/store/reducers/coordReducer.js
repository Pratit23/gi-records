const initstate = {
    points: null,
    hash: null,
    property: null,
    sellDetail: null,
}

const coordReducer = (state = initstate, action) => {
    switch (action.type) {
        case 'UPDATE':
            console.log('update');
            console.log(state, action);
            console.log(state, action.points);
            return {
                ...state,
                points: action.points
            }
        case 'UPDATE_NEW':
            console.log('updated from database');
            console.log(state, action);
            return {
                ...state,
                hash: action.hash
            }
        case 'SHOW':
            console.log("Show state from coordreducer: ", state, action)
            return {
                ...state,
                property: action.property
            }
        
        case 'SHOW_SELL_DETAIL':
            console.log("Sell detail: ", state, action)
            return {
                ...state,
                sellDetail: action.property
            }
        default:
            return state
    }
};

export default coordReducer;