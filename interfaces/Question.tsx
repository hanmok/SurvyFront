import { QuestionType } from "../QuestionType";
import { SelectableOption } from "./SelectableOption";

export interface Question {
    id: number | undefined;
    position: number;
    text: string;
    expectedTimeInSec: number;
    required: number;
    questionType: QuestionType;
    selectableOptions: SelectableOption[];
}
