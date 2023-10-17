export enum QuestionTypeEnum {
    SingleSelection = "SINGLE_SELECTION",
    MultipleSelection = "MULTIPLE_SELECTION",
    Essay = "ESSAY",
}

export enum QuestionTypeIdEnum {
    SingleSelection = 100,
    MultipleSelection = 200,
    Essay = 300,
}

export const convertIdToType = (id: number): QuestionTypeEnum => {
    console.log(`input: ${id}`);

    // switch (id) {
    //     case 100:
    //         return QuestionTypeEnum.SingleSelection;
    //     case 200:
    //         return QuestionTypeEnum.MultipleSelection;
    //     case 300:
    //         return QuestionTypeEnum.Essay;
    //     default:
    //         throw new Error(`invalid error, ${id}`);
    // }
    return QuestionTypeEnum.SingleSelection;
};
