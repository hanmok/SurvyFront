import { createSlice } from "@reduxjs/toolkit";

export const selectorSlice = createSlice({
    name: "selector",
    initialState: {
        // selectedIndexes: [[], []],
        selectedIndexes: [],
        textAnswers: [],
    },

    reducers: {
        // selectedIndexes 여러개 생성하기
        initialize: (state, action) => {
            // state.selectedIndexes = [[]]

            const numberOfQuestions = action.payload;
            console.log(`number of questions: `, numberOfQuestions);
            let outer = [];
            for (let i = 0; i < numberOfQuestions; i++) {
                outer.push([]);
            }

            state.selectedIndexes = outer;
            console.log(
                `selected Indexes set from reducer: `,
                state.selectedIndexes
            );
        },
        selectSingleSelection: (state, action) => {
            // questionIndex, selectedIndex
            const { questionIndex, selectedIndex } = action.payload;
            console.log(`${questionIndex}`);
            state.selectedIndexes[questionIndex] = [selectedIndex];
        },
        selectMultipleSelection: (state, action) => {
            // questionIndex, selectedIndex
            const { questionIndex, selectedIndex } = action.payload;
            if (state.selectedIndexes.includes(selectedIndex)) {
                // 이미 포함시 제거
                state.selectedIndexes[questionIndex] = state.selectedIndexes[
                    questionIndex
                ].filter(item => item !== selectedIndex);
            } else {
                // 없을 경우 추가
                state.selectedIndexes[questionIndex].push(selectedIndex);
            }
        },
    },
});

export const { initialize, selectSingleSelection, selectMultipleSelection } =
    selectorSlice.actions;

export default selectorSlice.reducer;
