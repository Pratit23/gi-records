const initstate = {
    points: null
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
        default:
            return state
    }
};

export default coordReducer;