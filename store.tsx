import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { selectorSlice } from "./features/selector/selectorSlice";
import { counterSlice } from "./features/counter/counterSlice";
import { userSlice } from "./features/user/userSlice";

const rootReducer = combineReducers({
    selector: selectorSlice.reducer,
    counter: counterSlice.reducer,
    user: userSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// export default configureStore({
//     reducer: {
//         counter: counterReducer,
//         selector: selectorReducer,
//     },
// });

const store = configureStore({
    reducer: rootReducer,
});

export default store;
