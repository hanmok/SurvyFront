import { selectorSlice } from "./features/selector/selectorSlice";
import { counterSlice } from "./features/counter/counterSlice";

type SelectorRootState = ReturnType<typeof selectorSlice.reducer>;
type CounterRootState = ReturnType<typeof counterSlice.reducer>;

export { SelectorRootState, CounterRootState };

// export default SelectorRootState;

// selectorSlice.reducer

// (property)
// Slice<{ selectedIndexes: any[][]; textAnswers: any[]; },
// {
// 	initialize: (state: WritableDraft<{ selectedIndexes: any[][]; textAnswers: any[]; }>, action: { payload: any; type: string; }) => void;
// 	selectSingleSelection: (state: WritableDraft<...>, action: { payload: any; type: string; }) => void;
// 	selectMultipleSelection: (state: WritableDraft<...>, action: { payload: any; type: string; }) => void;
// }, "selector">

// 	.reducer: Reducer<{
//     selectedIndexes: any[][];
//     textAnswers: any[];
// }>
