import { selectorSlice } from "../features/selector/selectorSlice";
import { counterSlice } from "../features/counter/counterSlice";

type SelectorRootState = ReturnType<typeof selectorSlice.reducer>;
type CounterRootState = ReturnType<typeof counterSlice.reducer>;

export { SelectorRootState, CounterRootState };
