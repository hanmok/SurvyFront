export enum QuestionTypeEnum {
    SingleSelection = "SINGLE_SELECTION",
    MultipleSelection = "MULTIPLE_SELECTION",
    Essay = "ESSAY",
}

export const convertIdToType = (id: number): QuestionTypeEnum => {
    console.log(`input: ${id}`);

    switch (id) {
        case 100:
            return QuestionTypeEnum.SingleSelection;
        case 200:
            return QuestionTypeEnum.MultipleSelection;
        case 300:
            return QuestionTypeEnum.Essay;
        default:
            throw new Error(`invalid error, ${id}`);
    }
};
