import showAdminToast from "./components/common/toast/showAdminToast";

export enum QuestionTypeKorean {
    SingleSelection = "단일 선택",
    MultiSelection = "다중 선택",
    Essay = "서술형",
}

export enum QuestionTypeId {
    SingleSelection = 100,
    MultipleSelection = 200,
    Essay = 300,
}

export enum QuestionTypeEnum {
    SingleSelection = "SINGLE_SELECTION",
    MultipleSelection = "MULTIPLE_SELECTION",
    Essay = "ESSAY",
}

export type QuestionTypeIdStrings = "100" | "200" | "300";

export function getQuestionType(index: number): string {
    switch (index) {
        case QuestionTypeId.SingleSelection: // 100
            return QuestionTypeKorean.SingleSelection;
        case QuestionTypeId.MultipleSelection: // case 200:
            return QuestionTypeKorean.MultiSelection;
        case QuestionTypeId.Essay: // case 300:
            return QuestionTypeKorean.Essay;
        default:
            console.error("INVALID Question Type");
            showAdminToast("error", "INVALID Question Type");
    }
}
