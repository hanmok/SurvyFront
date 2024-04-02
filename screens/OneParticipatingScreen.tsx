import { RouteProp } from "@react-navigation/native";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { StackNavigationProp } from "@react-navigation/stack";
import { useApollo } from "../ApolloProvider";
import { AnswerService } from "../API/Services/AnswerService";
import { ParticipatingService } from "../API/Services/ParticipatingService";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Question } from "../interfaces/Question";
import { Section } from "../interfaces/Section";
import { logObject } from "../utils/Log";
import { removeTypenameAndConvertToCamelCase } from "../utils/SnakeToCamel";
import { GQLQuestion, GQLSection, GQLSurvey } from "../interfaces/GQLInterface";
import { GQLSurveyResponse } from "../interfaces/SurveyResponse";
import { useQuery } from "@apollo/client";
import { getSurveyQuery } from "../API/gqlQuery";
import { screenWidth } from "../utils/ScreenSize";
import ParticipatingQuestionTextBox from "../components/participating/ParticipatingQuestionBox";
import SelectableOptionContainer from "../components/SelectableOptionContainer";
import { buttonColors, colors } from "../utils/colors";
import TextButton from "../components/common/TextButton";
import { borderSizes, fontSizes } from "../utils/sizes";
import { useCustomContext } from "../features/context/CustomContext";

// 눌러도, 스크롤 하지 않음. 정말? 기획부터 다시 필요한건 아니야 ? 글쎄다..
function OneParticipatingScreen({
	route,
	navigation,
}: {
	route: RouteProp<RootStackParamList, NavigationTitle.oneParticipate>;
	navigation: StackNavigationProp<
		RootStackParamList,
		NavigationTitle.oneParticipate
	>;
}) {
	const client = useApollo();
	const answerService = new AnswerService();
	const participatingService = new ParticipatingService();
	// const { sectionId, questionId } = route.params;

	const { surveyId } = route.params;
	const { updateLoadingStatus } = useCustomContext();

	const [currentSurvey, setCurrentSurvey] = useState<GQLSurvey | null>(null);

	const [section, setSection] = useState<GQLSection>(undefined);
	const [sectionIndex, setSectionIndex] = useState<number>(0);

	const [questions, setQuestions] = useState<GQLQuestion[]>(undefined);
	const [question, setQuestion] = useState<GQLQuestion>(undefined);
	const [questionIndex, setQuestionIndex] = useState<number>(0);

	const [satisfied, setSatisfied] = useState(false);
	const [nextTapped, setNextTapped] = useState(false);

	const { loading, error, data } = useQuery<GQLSurveyResponse>(
		getSurveyQuery,
		{
			client,
			variables: { surveyId: route.params.surveyId },
			fetchPolicy: "no-cache",
		}
	);

	useEffect(() => {
		console.log("passed survey id:", surveyId);
		logObject("currentSurvey", currentSurvey);

		if (data?.survey) {
			const updatedSurvey: GQLSurvey =
				removeTypenameAndConvertToCamelCase(data.survey);
			logObject("fetched survey", updatedSurvey);
			setCurrentSurvey(updatedSurvey);
			const currentSection = updatedSurvey.sections.find(
				(s) => s.sequence === sectionIndex
			);
			logObject("currentSection:", currentSection);
			setQuestions(currentSection.questions);
			// dispatch(initializeSelections(currentSection.questions.length));
		}
	}, [sectionIndex, data]);

	useEffect(() => {
		updateLoadingStatus(loading);
	}, [loading]);

	// Section 넘길 때와 Question 넘길 때 처리 방식은 ?

	useEffect(() => {
		const currentSection = currentSurvey.sections[sectionIndex];
		setSection(currentSection);
		setQuestions(currentSection.questions);
	}, [sectionIndex]);

	useEffect(() => {
		setQuestion(questions[questionIndex]);
	}, [questionIndex]);

	useEffect(() => {
		// dispatch

		if (!!currentSurvey) {
			const isLastSection =
				currentSurvey.sections.length === sectionIndex + 1;
			const isLastQuestion =
				section.questions.length === questionIndex + 1;

			if (isLastSection && isLastQuestion) {
				// update nextButton (automatically.. (maybe))
			} else if (!isLastSection && isLastQuestion) {
				setSectionIndex(sectionIndex + 1);
				setQuestionIndex(0);
			} else {
				// !isLastQuestion
				setQuestionIndex(questionIndex + 1);
			}
		}
		// dispatch.. API.. 전혀 안되어있는 상태.
		if (nextTapped) {
			setNextTapped(false);
		}
	}, [nextTapped]);

	const nextButton = () => {
		return (
			currentSurvey !== null && (
				<View>
					<TextButton
						title={
							sectionIndex ===
								currentSurvey.sections.length - 1 &&
							questionIndex === section.questions.length - 1
								? "제출"
								: "다음"
						}
						onPress={() => {
							setNextTapped(true);
						}}
						textStyle={[
							{ letterSpacing: 10, color: colors.white },
							satisfied
								? styles.activatedButtonText
								: styles.inactivatedButtonText,
						]}
						backgroundStyle={[
							satisfied
								? styles.activatedFinishButtonBackground
								: styles.inactivatedFinishButtonBackground,
						]}
						hasShadow={false}
						isEnabled={satisfied}
					/>
				</View>
			)
		);
	};

	return (
		<View style={{ flex: 1, width: screenWidth - 40 }}>
			<View style={styles.questionContainerBox}>
				<ParticipatingQuestionTextBox {...question} />
				{question.selectableOptions !== undefined &&
				question.selectableOptions.length > 0 ? (
					<SelectableOptionContainer
						selectableOptions={question.selectableOptions}
						questionType={question.questionType}
						questionIndex={question.position}
						questionId={question.id}
					/>
				) : (
					<Text>no selectable Options</Text>
				)}
			</View>
			{nextButton()}
		</View>
	);
}

const styles = StyleSheet.create({
	questionContainerBox: {
		backgroundColor: colors.white,
		borderColor: colors.gray4,
		borderWidth: 1,
		paddingVertical: 16,
		borderRadius: 12,
		overflow: "hidden",
		paddingBottom: 16,
		alignSelf: "stretch",
	},
	activatedButtonText: {
		textAlign: "center",
		fontSize: fontSizes.m20,
	},
	inactivatedButtonText: {
		textAlign: "center",
		fontSize: fontSizes.m20,
	},
	activatedFinishButtonBackground: {
		marginTop: 20,
		backgroundColor: buttonColors.enabledButtonBG,
		alignSelf: "stretch",
		padding: 10,
		borderRadius: borderSizes.m10,
		height: 40,
	},
	inactivatedFinishButtonBackground: {
		marginTop: 20,
		backgroundColor: buttonColors.disabledButtonBG,
		alignSelf: "stretch",
		padding: 10,
		borderRadius: borderSizes.m10,
		height: 40,
	},
});
