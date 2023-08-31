import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface customAnswer {
    questionId: number;
    userInput: string;
}

interface SelectorState {
    selectedIndexIds: number[][];
    textAnswers: customAnswer[];
}

const initialState: SelectorState = {
    selectedIndexIds: [],
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
            // selectedIndexes 초기화
            state.selectedIndexIds = outer;

            console.log(
                `selected Indexes set from reducer: `,
                state.selectedIndexIds
            );
        },
        selectSingleSelection: (
            state,
            action: PayloadAction<{
                questionIndex: number;
                selectedIndexId: number;
            }>
        ) => {
            // questionIndex, selectedIndex
            const { questionIndex, selectedIndexId } = action.payload;
            console.log(`${questionIndex}`);
            state.selectedIndexIds[questionIndex] = [selectedIndexId];
        },
        selectMultipleSelection: (
            state,
            action: PayloadAction<{
                questionIndex: number;
                selectedIndexId: number;
            }>
        ) => {
            // questionIndex, selectedIndex
            const { questionIndex, selectedIndexId } = action.payload;

            if (
                state.selectedIndexIds[questionIndex].includes(selectedIndexId)
            ) {
                // 이미 포함시 제거
                state.selectedIndexIds[questionIndex] = state.selectedIndexIds[
                    questionIndex
                ].filter(item => item !== selectedIndexId);
            } else {
                // 없을 경우 추가
                state.selectedIndexIds[questionIndex].push(selectedIndexId);
            }
        },
        textInputAction: (
            state,
            action: PayloadAction<{
                questionId: number;
                userInput: string;
            }>
        ) => {
            const { questionId, userInput } = action.payload;
            // question Id 도 알아야 하는거 아닌가? 맞을걸 ??
            // state.textAnswers;
            const item: customAnswer = { questionId, userInput };
            state.textAnswers.push(item);
        },
    },
});

export const {
    initialize,
    selectSingleSelection,
    selectMultipleSelection,
    textInputAction,
} = selectorSlice.actions;

export default selectorSlice.reducer;
