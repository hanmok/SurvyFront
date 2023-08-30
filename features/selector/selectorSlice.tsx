import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface SelectorState {
    selectedIndexes: number[][];
    textAnswers: string[];
}

const initialState: SelectorState = {
    selectedIndexes: [],
    textAnswers: [],
};

export const selectorSlice = createSlice({
    name: "selector",
    initialState,
    reducers: {
        initialize: (state, action: PayloadAction<number>) => {
            const numberOfQuestions = action.payload;
            console.log(`number of questions: `, numberOfQuestions);
            let outer: number[][] = [];
            for (let i = 0; i < numberOfQuestions; i++) {
                outer.push([]);
            }

            state.selectedIndexes = outer;
            console.log(
                `selected Indexes set from reducer: `,
                state.selectedIndexes
            );
        },
        selectSingleSelection: (
            state,
            action: PayloadAction<{
                questionIndex: number;
                selectedIndex: number;
            }>
        ) => {
            // questionIndex, selectedIndex
            const { questionIndex, selectedIndex } = action.payload;
            console.log(`${questionIndex}`);
            state.selectedIndexes[questionIndex] = [selectedIndex];
        },
        selectMultipleSelection: (
            state,
            action: PayloadAction<{
                questionIndex: number;
                selectedIndex: number;
            }>
        ) => {
            // questionIndex, selectedIndex
            const { questionIndex, selectedIndex: selectedOptionIndex } =
                action.payload;

            if (
                state.selectedIndexes[questionIndex].includes(
                    selectedOptionIndex
                )
            ) {
                // 이미 포함시 제거
                state.selectedIndexes[questionIndex] = state.selectedIndexes[
                    questionIndex
                ].filter(item => item !== selectedOptionIndex);
            } else {
                // 없을 경우 추가
                state.selectedIndexes[questionIndex].push(selectedOptionIndex);
            }
        },
    },
});

export const { initialize, selectSingleSelection, selectMultipleSelection } =
    selectorSlice.actions;

export default selectorSlice.reducer;
