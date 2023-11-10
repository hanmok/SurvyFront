export interface SetDictionary<T> {
    [key: number]: Set<T>;
}

const some: SetDictionary<string> = {};

export interface ArrayDictionary<T> {
    [key: number]: Array<T>;
}

export interface StringDictionary {
    [key: number]: string;
}

export interface Temp {
    qId: number;
    soId: number;
    // ans: number | string; // selectableOptionId | string
    ansText?: string;
    key: number;
}

export interface QuestionOrder {
    sectionSequence: number;
    questionSequence: number;
    questionId: number;
    questionTitle: string;
}
