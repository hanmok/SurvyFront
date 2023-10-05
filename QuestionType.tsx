export enum QuestionType {
    SingleSelection = "단일 선택",
    MultiSelection = "다중 선택",
    // Short = "단답형",
    Essay = "서술형",
}

export function getQuestionTypeIndex(questionType: string): number {
    switch (questionType) {
        case QuestionType.SingleSelection:
            // return 0;
            return 100;
        case QuestionType.MultiSelection:
            // return 1;
            return 200;
        case QuestionType.Essay:
            // return 2;
            return 300;
    }
    return 0;
}

export function getQuestionType(index: number): string {
    switch (index) {
        // case 0:
        case 100:
            return QuestionType.SingleSelection;
        // case 1:
        case 200:
            return QuestionType.MultiSelection;
        // case 2:
        //     return QuestionType.Short;
        // case 3:
        // case 2:
        case 300:
            return QuestionType.Essay;

        default:
            throw new Error("Invalid Input");
    }
}
