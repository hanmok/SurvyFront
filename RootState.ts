import { selectorSlice } from "./features/selector/selectorSlice";
import { counterSlice } from "./features/counter/counterSlice";
import { userSlice } from "./features/user/userSlice";

type SelectorRootState = ReturnType<typeof selectorSlice.reducer>;
type CounterRootState = ReturnType<typeof counterSlice.reducer>;
type UserRootState = ReturnType<typeof userSlice.reducer>;

export { SelectorRootState, CounterRootState, UserRootState };
