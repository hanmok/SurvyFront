import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface CustomAnswer {
    // questionId: number;
    selectableOptionId: number;
    sequence: number;
    userInput: string;
}

interface SelectorState {
    selectedIndexIds: number[][];
    textAnswers: CustomAnswer[];
    // textAnswers:
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
                // questionId: number;
                // selectableOptionId: number;
                // sequence: number;
                // userInput: string;
                customAnswer: CustomAnswer;
            }>
        ) => {
            // const { questionId, userInput } = action.payload;
            // const { selectableOptionId, sequence, userInput } = action.payload;
            const customAnswer = action.payload.customAnswer;
            // question Id 도 알아야 하는거 아닌가? 맞을걸 ??
            // state.textAnswers;
            // const item: CustomAnswer = {
            //     selectableOptionId,
            //     userInput,
            //     sequence,
            // };
            console.log(
                `dispatch called, customAnswer: ${customAnswer.userInput}, ${customAnswer.selectableOptionId}`
            );
            state.textAnswers.push(customAnswer);
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
