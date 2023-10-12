import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { numberOfQuestions } from "../../types/types";
import { CustomAnswer } from "../../interfaces/CustomAnswer";
// import { CustomAnswer } from "../interfaces/CustomAnswer";
import { logObject } from "../../utils/Log";

interface SelectorState {
    selectedOptionIds: number[][];
    textAnswers: CustomAnswer[];
}

const initialState: SelectorState = {
    selectedOptionIds: [],
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
            state.selectedOptionIds = outer;
            console.log("[selectorSlice], initialize called");
        },
        // singleSelection, multipleSelection 두 경우 모두 textInput Action 에도 해당하는 경우에는 ?

        selectSingleSelection: (
            state,
            action: PayloadAction<{
                questionIndex: number;
                selectedSOId: number;
            }>
        ) => {
            const { questionIndex, selectedSOId } = action.payload;
            console.log(
                `[selectorSlice], selectSingleSelection, questionIndex: ${questionIndex}, selectedSOId: ${selectedSOId}`
            );
            state.selectedOptionIds[questionIndex] = [selectedSOId];
        },

        selectMultipleSelection: (
            state,
            action: PayloadAction<{
                questionIndex: number;
                selectedSOId: number;
            }>
        ) => {
            const { questionIndex, selectedSOId } = action.payload;

            if (state.selectedOptionIds[questionIndex].includes(selectedSOId)) {
                // 이미 포함시 제거
                state.selectedOptionIds[questionIndex] =
                    state.selectedOptionIds[questionIndex].filter(
                        item => item !== selectedSOId
                    );
            } else {
                // 없을 경우 추가
                state.selectedOptionIds[questionIndex].push(selectedSOId);
            }
        },
        textInputAction: (
            state,
            action: PayloadAction<{
                customAnswer: CustomAnswer; // selectableOptionId, sequence, text
            }>
        ) => {
            // const customAnswer = action.payload.customAnswer;
            // // 없으면 push
            // if (
            //     state.textAnswers.findIndex(ans => ans === customAnswer) === -1
            // ) {
            //     logObject(
            //         "[selectorSlice] customAnswer has added",
            //         customAnswer
            //     );
            //     state.textAnswers.push(customAnswer);
            // }

            const customAnswer = action.payload.customAnswer;
            // customAnswer 객체를 복사하여 새로운 객체 생성
            const newCustomAnswer: CustomAnswer = {
                selectableOptionId: customAnswer.selectableOptionId,
                questionId: customAnswer.questionId,
                answerText: customAnswer.answerText,
            };

            // 이미 같은 customAnswer가 배열에 없으면 추가
            if (
                state.textAnswers.findIndex(
                    ans =>
                        // 여기서 ans와 newCustomAnswer를 비교하여 같은지 확인
                        ans.selectableOptionId ===
                            newCustomAnswer.selectableOptionId &&
                        ans.questionId === newCustomAnswer.questionId &&
                        ans.answerText === newCustomAnswer.answerText
                ) === -1
            ) {
                logObject(
                    "[selectorSlice] customAnswer has added",
                    newCustomAnswer
                );
                state.textAnswers.push(newCustomAnswer);
            } else {
            }
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
