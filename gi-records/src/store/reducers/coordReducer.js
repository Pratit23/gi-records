const initstate = {
    points: null,
    hash: null
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
        default:
            return state
    }
};

export default coordReducer;