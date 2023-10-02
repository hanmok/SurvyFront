import { Question } from "./Question";
import { Section } from "./Section";
import { SelectableOption } from "./SelectableOption";
import { Survey } from "./Survey";

export interface PostingSurveyState {
    survey: Survey;
    sections: Section[];
    questions: Question[];
    selectableOptions: SelectableOption[];
}
