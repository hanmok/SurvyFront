export enum QuestionType {
    SingleSelection = "단일 선택",
    MultiSelection = "다중 선택",
    // Short = "단답형",
    Essay = "서술형",
}

export function getQuestionTypeIndex(questionType: string): number {
    switch (questionType) {
        case QuestionType.SingleSelection:
            return 0;
        case QuestionType.MultiSelection:
            return 1;
        case QuestionType.Essay:
            return 2;
    }
    return 0;
}

export function getQuestionType(index: number): string {
    switch (index) {
        case 0:
            return QuestionType.SingleSelection;
        case 1:
            return QuestionType.MultiSelection;
        // case 2:
        //     return QuestionType.Short;
        // case 3:
        case 2:
            return QuestionType.Essay;

        default:
            throw new Error("Invalid Input");
    }
}
