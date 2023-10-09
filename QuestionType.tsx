export enum QuestionType {
    SingleSelection = "단일 선택",
    MultiSelection = "다중 선택",
    // Short = "단답형",
    Essay = "서술형",
}

export enum QuestionTypeId {
    SingleSelection = 100,
    MultipleSelection = 200,
    Essay = 300,
}

export function getQuestionType(index: number): string {
    switch (index) {
        case 100:
            return QuestionType.SingleSelection;
        case 200:
            return QuestionType.MultiSelection;
        case 300:
            return QuestionType.Essay;
        default:
            throw new Error("Invalid Input");
    }
}
