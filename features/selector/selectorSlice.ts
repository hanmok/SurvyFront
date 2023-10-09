import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { numberOfQuestions } from "../../types/types";

export interface CustomAnswer {
    selectableOptionId: number;
    sequence: number;
    answerText: string;
}

interface SelectorState {
    selectedIndexIds: number[][];
    textAnswers: CustomAnswer[];
}

const initialState: SelectorState = {
    selectedIndexIds: [],
    textAnswers: [],
};

export const selectorSlice = createSlice({
    name: "selector",
    initialState,
    reducers: {
        initialize: (state, action: PayloadAction<numberOfQuestions>) => {
            const numberOfQuestions = action.payload;

            let outer: number[][] = [];
            for (let i = 0; i < numberOfQuestions; i++) {
                outer.push([]);
            }
            state.selectedIndexIds = outer;
        },
        selectSingleSelection: (
            state,
            action: PayloadAction<{
                questionIndex: number;
                selectedIndexId: number;
            }>
        ) => {
            const { questionIndex, selectedIndexId } = action.payload;

            state.selectedIndexIds[questionIndex] = [selectedIndexId];
        },
        selectMultipleSelection: (
            state,
            action: PayloadAction<{
                questionIndex: number;
                selectedIndexId: number;
            }>
        ) => {
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
                customAnswer: CustomAnswer;
            }>
        ) => {
            const customAnswer = action.payload.customAnswer;
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
