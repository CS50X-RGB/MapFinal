const authMiddleware = (store) => (next) => (action) => {
    const { type } = action;

    if (type === 'TOKEN_INVALID') {
        const { auth } = store.getState(); 

        if (!auth.isLoggingOut) {
            store.dispatch({ type: 'LOGOUT_INITIATED' });
        }
        return; 
    }
    return next(action);
};

export default authMiddleware;
