import { PostAnswerIngre } from "./../../screens/ParticipatingScreen";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { numberOfQuestions } from "../../types/types";
import { CustomAnswer, makeCustomAnswer } from "../../interfaces/CustomAnswer";
import { log, logObject } from "../../utils/Log";

interface SelectorState {
    selectedOptionIds: number[][];
    textAnswers: CustomAnswer[];
    answerIngredients: PostAnswerIngre[];
}

const initialState: SelectorState = {
    selectedOptionIds: [],
    textAnswers: [],
    answerIngredients: [],
};

export const selectorSlice = createSlice({
    name: "selector",
    initialState,
    reducers: {
        initializeSelections: (
            state,
            action: PayloadAction<numberOfQuestions>
        ) => {
            const numberOfQuestions = action.payload;

            let outer: number[][] = [];
            for (let i = 0; i < numberOfQuestions; i++) {
                outer.push([]);
            }
            state.selectedOptionIds = outer;
            state.textAnswers = [];
            console.log("[selectorSlice], initialize called");
        },

        initializeAnswer: state => {
            console.log("answerIngredients initialized");
            state.answerIngredients = [];
        },

        addToAnswerIngredients: (
            state,
            action: PayloadAction<{ ingre: PostAnswerIngre }>
        ) => {
            const { ingre } = action.payload;
            state.answerIngredients.push(ingre);
        },
        selectSingleSelection: (
            state,
            action: PayloadAction<{
                questionId: number;
                questionIndex: number;
                selectedSOId: number;
                answerText: string;
            }>
        ) => {
            const { questionIndex, selectedSOId, questionId, answerText } =
                action.payload;

            console.log(
                `[selectorSlice], selectSingleSelection, questionIndex: ${questionIndex}, selectedSOId: ${selectedSOId}`
            );

            // 선택된 selectableOption 의 Index 가 textAnswer 에 있으면 !== -1

            const prevTextInputIndex = state.textAnswers.findIndex(
                ans => ans.questionId === questionId
            );

            if (prevTextInputIndex !== -1) {
                log("textAnswer has been removed");
                state.textAnswers.splice(prevTextInputIndex, 1);
            }

            if (answerText !== "") {
                const customAnswer = makeCustomAnswer(
                    selectedSOId,
                    questionId,
                    answerText,
                    questionIndex
                );
                logObject("textAnswer has been added", customAnswer);
                state.textAnswers.push(customAnswer);
            }
            state.selectedOptionIds[questionIndex] = [selectedSOId];
        },

        selectMultipleSelection: (
            state,
            action: PayloadAction<{
                questionId: number;
                questionIndex: number;
                selectedSOId: number;
                answerText: string;
            }>
        ) => {
            const { questionId, questionIndex, selectedSOId, answerText } =
                action.payload;

            // 기타 옵션 아닌 경우

            if (state.selectedOptionIds[questionIndex].includes(selectedSOId)) {
                // 이미 포함시 제거
                state.selectedOptionIds[questionIndex] =
                    state.selectedOptionIds[questionIndex].filter(
                        item => item !== selectedSOId
                    );
                log("[selectorSlice] removed from multiple selection");
            } else {
                // 없을 경우 추가
                state.selectedOptionIds[questionIndex].push(selectedSOId);
                log("[selectorSlice] added from multiple selection");
            }

            // 기타 옵션인 경우
            if (answerText !== "") {
                // 이미 있는지 보기.
                const existingIndex = state.textAnswers.findIndex(
                    customAnswer =>
                        customAnswer.selectableOptionId === selectedSOId
                );
                // 존재하지 않는 경우 -> 추가
                if (existingIndex === -1) {
                    const customAnswer = makeCustomAnswer(
                        selectedSOId,
                        questionId,
                        answerText,
                        questionIndex
                    );
                    logObject("textAnswer has been added", customAnswer);
                    state.textAnswers.push(customAnswer);
                } else {
                    // 존재 하는 경우 -> 제거
                    log("textAnswer has been removed");
                    state.textAnswers.splice(existingIndex, 1);
                }
            }
        },
        textInputAction: (
            state,
            action: PayloadAction<{
                customAnswer: CustomAnswer; // selectableOptionId, sequence, text
            }>
        ) => {
            const customAnswer = action.payload.customAnswer;
            // customAnswer 객체를 복사하여 새로운 객체 생성
            const newCustomAnswer = makeCustomAnswer(
                customAnswer.selectableOptionId,
                customAnswer.questionId,
                customAnswer.answerText,
                customAnswer.questionIndex
            );

            state.selectedOptionIds[newCustomAnswer.questionIndex].push(
                newCustomAnswer.selectableOptionId
            );

            // 이미 같은 customAnswer가 배열에 없으면 추가
            // 만약, 음.. 수정된 값이 호출되면? 교체해야지. questionId 가 같으면 교체해야함.
            const textAnswerIndex = state.textAnswers.findIndex(
                ans =>
                    ans.selectableOptionId ===
                    newCustomAnswer.selectableOptionId
            );

            if (textAnswerIndex === -1) {
                logObject(
                    "[selectorSlice] customAnswer has added",
                    newCustomAnswer
                );
                //
                state.textAnswers.push(newCustomAnswer);
            } else {
                // selectableOptionId 가 같은 경우
                // 만약 Text가 다르면, 업데이트!
                if (
                    state.textAnswers.findIndex(
                        ans => ans.answerText === newCustomAnswer.answerText
                    ) === -1
                ) {
                    logObject(
                        "[selectorSlice] customAnswer has updated to ",
                        newCustomAnswer
                    );
                    state.textAnswers[textAnswerIndex] = newCustomAnswer;
                }
            }
        },
    },
});

export const {
    initializeSelections,
    selectSingleSelection,
    selectMultipleSelection,
    textInputAction,
    addToAnswerIngredients,
    initializeAnswer,
} = selectorSlice.actions;

export default selectorSlice.reducer;
