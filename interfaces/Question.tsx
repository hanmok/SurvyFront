import { QuestionType } from "../QuestionType";
import { SelectableOption } from "./SelectableOption";

export interface Question {
    id: number | undefined;
    position: number;
    text: string;
    expectedTimeInSec: number | undefined;
    required: number | undefined;
    questionType: QuestionType;
    selectableOptions: SelectableOption[];
}
