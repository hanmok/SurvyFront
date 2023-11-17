export enum QuestionTypeKorean {
    SingleSelection = "단일 선택",
    MultiSelection = "다중 선택",
    // Short = "단답형",
    Essay = "서술형",
}

export type QuestionTypeIds = 100 | 200 | 300;

export enum QuestionTypeId {
    SingleSelection = 100,
    MultipleSelection = 200,
    Essay = 300,
}

export function getQuestionType(index: number): string {
    switch (index) {
        // case 100:
        case QuestionTypeId.SingleSelection:
            return QuestionTypeKorean.SingleSelection;
        // case 200:
        case QuestionTypeId.MultipleSelection:
            return QuestionTypeKorean.MultiSelection;
        // case 300:
        case QuestionTypeId.Essay:
            return QuestionTypeKorean.Essay;
        default:
            throw new Error("Invalid Input");
    }
}
