import { View } from "react-native";

/** questionTitle, selectableOptions, answers */
export interface QuestionResponseContainerProps {
    questionTitle: string;
    selectableOptions: string[];
    answers: string[];
}
// selectableOptions

const QuestionResponseContainer: React.FC<QuestionResponseContainerProps> = ({
    questionTitle,
    selectableOptions,
    answers,
}) => {
    return <View>{questionTitle}</View>;
};

export default QuestionResponseContainer;
