// import * as Permissions from "expo-permissions";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationTitle, RootStackParamList } from "../utils/NavHelper";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import {
	GQLAnswerResponse,
	GQLParticipatingResponse,
	GQLSurveyResponse,
} from "../interfaces/SurveyResponse";
import {
	getAnswersQuery,
	getSurveyQuery,
	getParticipatingQuery,
} from "../API/gqlQuery";
import { useApollo } from "../ApolloProvider";
import React, { useEffect, useState } from "react";
import {
	GQLAnswer,
	GQLParticipating,
	GQLSurvey,
} from "../interfaces/GQLInterface";
import { removeTypenameAndConvertToCamelCase } from "../utils/SnakeToCamel";
import { log, logObject } from "../utils/Log";
import OverallSelectionResponseContainer from "../components/response/OverallSelectionResponseContainer";
import { QuestionResponseContainerProps } from "../components/response/OverallSelectionResponseContainer";
import { ListRenderItem } from "react-native";
import { fontSizes } from "../utils/sizes";
import { colors } from "../utils/colors";
import { screenWidth } from "../utils/ScreenSize";
import OverallEssayResponseContainer from "../components/response/OverallEssayResponseContainer";
import CustomSegmentedControl from "../components/response/CustomSegmentedControl";
import IndivisualSelectionResponseContainer from "../components/response/IndivisualSelectionResponseContainer";
import IndivisualEssayResponseContainer from "../components/response/IndivisualEssayResponseContainer";
import { Entypo, Ionicons } from "@expo/vector-icons";
import TextButton from "../components/common/TextButton";
import { useCustomContext } from "../features/context/CustomContext";
import { QuestionTypeId } from "../QuestionType";
import { AnswerService, SheetData } from "../API/Services/AnswerService";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

class ResponseSection {
	responseProp: QuestionResponseContainerProps[] | undefined;
	constructor(public index: number) {}
}

class SectionDataBuilder {
	public sectionData: ResponseSection;
	constructor(index: number) {
		this.sectionData = new ResponseSection(index + 1);
	}
	setResponse(response: QuestionResponseContainerProps[]) {
		this.sectionData.responseProp = response;
		return this;
	}
	build() {
		return this.sectionData;
	}
}

export default function ResponseScreen({
	navigation,
	route,
}: {
	navigation: StackNavigationProp<
		RootStackParamList,
		NavigationTitle.response
	>;
	route: RouteProp<RootStackParamList, NavigationTitle.response>;
}) {
	const answerService = new AnswerService();
	const { accessToken, updateLoadingStatus } = useCustomContext();
	const { surveyId } = route.params;

	const client = useApollo();
	const options = ["전체", "개별"];

	const [generateTapped, setGenerateTapped] = useState(false);

	const [currentSequence, setCurrentSequence] = useState<number>(1);
	const [currentUserId, setCurrentUserId] = useState<number>(undefined);

	const [isShowingOverall, setIsShowingOverall] = useState<boolean>(true);

	const [sectionData, setSectionData] = useState<ResponseSection[]>([]);

	const [survey, setSurvey] = useState<GQLSurvey>(null);
	const [answers, setAnswers] = useState<GQLAnswer[]>(null);
	const [participatings, setParticipatings] =
		useState<GQLParticipating[]>(null);

	const countUp = () => {
		const updatedSequence = currentSequence + 1;
		if (participatings && participatings.length >= updatedSequence) {
			setCurrentSequence(updatedSequence);
		}
	};

	const countDown = () => {
		const updatedSequence = currentSequence - 1;

		if (updatedSequence > 0) {
			setCurrentSequence(updatedSequence);
		}
	};

	const {
		loading: answersLoading,
		error: answersError,
		data: answersData,
	} = useQuery<GQLAnswerResponse>(getAnswersQuery, {
		client,
		variables: { surveyId: route.params.surveyId },
		fetchPolicy: "no-cache",
	});

	const {
		loading: participatingLoading,
		error: participatingError,
		data: participatingData,
	} = useQuery<GQLParticipatingResponse>(getParticipatingQuery, {
		client,
		variables: { surveyId: route.params.surveyId },
		fetchPolicy: "no-cache",
	});

	const {
		loading: surveyLoading,
		error: surveyError,
		data: surveyData,
	} = useQuery<GQLSurveyResponse>(getSurveyQuery, {
		client,
		variables: { surveyId: route.params.surveyId },
		fetchPolicy: "no-cache",
	});

	const generateExcel = (sheetData: SheetData, title: string) => {
		const firstRow = sheetData.questionInOrder.map((q) => q.text);
		firstRow.unshift("");

		const sum: string[][] = [firstRow];
		const otherRows: string[][] = [];
		sheetData.userResponses.forEach((str) => {
			otherRows.push(str);
			sum.push(str);
		});

		let wb = XLSX.utils.book_new();
		let ws = XLSX.utils.aoa_to_sheet(sum);

		XLSX.utils.book_append_sheet(wb, ws, title, true);

		const base64 = XLSX.write(wb, { type: "base64" });
		const filename = FileSystem.documentDirectory + `survey_responses.xlsx`;
		FileSystem.writeAsStringAsync(filename, base64, {
			encoding: FileSystem.EncodingType.Base64,
		}).then(() => {
			Sharing.shareAsync(filename);
		});
	};

	useEffect(() => {
		updateLoadingStatus(
			surveyLoading || answersLoading || participatingLoading
		);
	}, [surveyLoading, answersLoading, participatingLoading]);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<View style={{ marginRight: 10 }}>
					<View>
						<Ionicons
							// name="ios-share-outline"
							size={30}
							color={colors.black}
							onPress={() => {
								console.log("hi");
								setGenerateTapped(true);
							}}
						/>
					</View>
				</View>
			),
		});
	}, [navigation]);

	useEffect(() => {
		const getExcelSheet = async () => {
			answerService
				.getResultSheet(surveyId, accessToken)
				.then((response) => {
					logObject("sheet data:", response);
					if (response) {
						const sheetResponse = response;
						generateExcel(sheetResponse.data, survey.title);
					}
				});
		};
		if (generateTapped && survey) {
			getExcelSheet();
			setGenerateTapped(false);
		}
	}, [surveyId, generateTapped, survey]);

	useEffect(() => {
		if (participatings && participatings.length !== 0) {
			logObject(
				"[ResponseScreen] currentSequence changed, participatings ",
				participatings
			);

			// candidate 1
			log("currentSequence: " + currentSequence);

			const correspondingUserId = participatings.find(
				(participating) => participating.sequence === currentSequence
			).user.id;

			logObject(
				"[ResponseScreen] currentUserId set to",
				correspondingUserId
			);
			setCurrentUserId(correspondingUserId);
		}
	}, [currentSequence, participatings]);

	useEffect(() => {
		console.log("passed survey id:", surveyId);

		if (answersData?.answers) {
			const updatedAnswers: GQLAnswer[] =
				removeTypenameAndConvertToCamelCase(answersData.answers);
			logObject("fetched answers", updatedAnswers);
			setAnswers(updatedAnswers);
		} else {
			log("still fetching answers..");
		}
	}, [answersData]);

	useEffect(() => {
		if (surveyData?.survey) {
			const updatedSurvey: GQLSurvey =
				removeTypenameAndConvertToCamelCase(surveyData.survey);
			logObject("fetched survey", updatedSurvey);
			setSurvey(updatedSurvey);
		}
	}, [surveyData]);

	useEffect(() => {
		if (participatingData?.participatings) {
			const updatedParticipatings: GQLParticipating[] =
				removeTypenameAndConvertToCamelCase(
					participatingData.participatings
				);
			logObject("fetched participatings", updatedParticipatings);
			setParticipatings(updatedParticipatings);
		}
	}, [participatingData]);

	useEffect(() => {
		if (answers && answers.length !== 0 && survey !== null) {
			let tempQuestionResponseContainerProps: QuestionResponseContainerProps[] =
				[];
			console.log("sth called");
			logObject("survey:", survey);
			logObject("answers:", answers);

			const tempResponseSections: ResponseSection[] = [];
			survey.sections.sort((sec1, sec2) => sec1.sequence - sec2.sequence);

			survey.sections.forEach((section) => {
				const newSection = new SectionDataBuilder(section.sequence);

				const newProps: QuestionResponseContainerProps[] = [];

				section.questions.sort();
				section.questions.forEach((question, index) => {
					const selectableOptions = question.selectableOptions;
					// question.section.sequence
					// q id 가 같은 질문들
					logObject("all answers: ", answers); // ccc, ddd
					logObject("question: ", question);
					const correspondingAnswers = answers.filter(
						(ans) => ans.question.id === question.id
					);
					// candidate 2
					const userId = correspondingAnswers[0].user.id;
					// section 에 대한 정보 없음.
					const questionTitle = ` ${question.position + 1}. ${
						question.text
					}`;
					const props: QuestionResponseContainerProps = {
						sectionSequence: section.sequence,
						questionTitle: questionTitle,
						selectableOptions: selectableOptions,
						answers: correspondingAnswers,
						questionTypeId: String(question.questionType.id),
						selectedUserId: userId,
					};
					logObject("QuestionResponseContainer: ", props);
					tempQuestionResponseContainerProps.push(props);
					newProps.push(props);
				});
				newSection.setResponse(newProps);
				const some = newSection.build();
				tempResponseSections.push(some);
			});

			setSectionData(tempResponseSections);
		}
	}, [answers, survey]);

	const overallQuestionResponseBoxItem: ListRenderItem<
		QuestionResponseContainerProps
	> = ({ item }) => {
		return item.questionTypeId === `${QuestionTypeId.Essay}` ? (
			<View style={{ marginHorizontal: 12 }}>
				<OverallEssayResponseContainer
					sectionSequence={item.sectionSequence}
					questionTitle={item.questionTitle}
					selectableOptions={[]} // 필요 없음.
					answers={item.answers}
					questionTypeId={item.questionTypeId}
					selectedUserId={undefined}
				/>
			</View>
		) : (
			<View style={{ marginHorizontal: 12 }}>
				<OverallSelectionResponseContainer
					sectionSequence={item.sectionSequence}
					questionTitle={item.questionTitle}
					selectableOptions={item.selectableOptions}
					answers={item.answers}
					questionTypeId={item.questionTypeId}
					selectedUserId={undefined}
				/>
			</View>
		);
	};

	const indivisualQuestionResponseBoxItem: ListRenderItem<
		QuestionResponseContainerProps
	> = ({ item }) => {
		return item.questionTypeId === `${QuestionTypeId.Essay}` ? (
			<View style={{ marginHorizontal: 12 }}>
				<IndivisualEssayResponseContainer
					sectionSequence={item.sectionSequence}
					questionTitle={item.questionTitle}
					selectableOptions={[]} // 필요 없음.
					answers={item.answers}
					questionTypeId={item.questionTypeId}
					selectedUserId={currentUserId}
				/>
			</View>
		) : (
			<View style={{ marginHorizontal: 12 }}>
				<IndivisualSelectionResponseContainer
					sectionSequence={item.sectionSequence}
					questionTitle={item.questionTitle}
					selectableOptions={item.selectableOptions}
					answers={item.answers}
					questionTypeId={item.questionTypeId}
					selectedUserId={currentUserId}
				/>
			</View>
		);
	};

	const listHeader = () => {
		return (
			<View style={{ marginTop: 20 }}>
				<Text style={styles.listHeader}>{survey?.title}</Text>
			</View>
		);
	};

	const listFooter = () => {
		return (
			<View
				style={{
					marginTop: 20,
					height: 1,
					marginBottom: 20,
				}}
			></View>
		);
	};

	if (surveyError) {
		return <Text>survey Error</Text>;
	}

	if (answersError) {
		return <Text>Answer Error</Text>;
	}

	if (participatingError) {
		return <Text>Participating Error</Text>;
	}

	return (
		<View style={styles.container}>
			{participatings && participatings.length === 0 ? (
				<View
					style={{
						alignItems: "center",
						marginTop: 100,
					}}
				>
					<Text style={{ fontSize: 20 }}>참여 인원이 없습니다</Text>
				</View>
			) : (
				<View
					style={{
						height: 30,
						flex: 1,
						justifyContent: "space-between",
					}}
				>
					<>
						<SectionList
							sections={sectionData.map(
								(response: ResponseSection) => ({
									title: `Section ${response.index}`,
									data: response.responseProp,
								})
							)}
							renderItem={
								isShowingOverall
									? overallQuestionResponseBoxItem
									: indivisualQuestionResponseBoxItem
							}
							keyExtractor={(item) => `${item.questionTitle}`}
							ItemSeparatorComponent={() => {
								return <View style={{ height: 10 }} />;
							}}
							ListHeaderComponent={listHeader} // Survey Title
							ListFooterComponent={listFooter}
							stickySectionHeadersEnabled={false}
							renderSectionHeader={({ section }) => (
								<View style={styles.sectionHeaderBG}>
									<Text style={{ fontSize: 28 }}>
										{section.title}
									</Text>
								</View>
							)}
						/>
					</>

					<View style={styles.bottomLayout}>
						{isShowingOverall ? (
							<Text style={styles.bottom}>
								총 설문 인원 {participatings?.length ?? 0}
							</Text>
						) : (
							// Separate
							<View style={styles.userIndexContainer}>
								<Entypo
									name="chevron-left"
									onPress={countDown}
									size={24}
								/>
								<TextButton
									title={`${currentSequence}`}
									textStyle={{ textAlign: "center" }}
									backgroundStyle={
										styles.currentUserIndexContainerBG
									}
									onPress={() => {}}
									isEnabled={false}
								/>
								<Entypo
									name="chevron-right"
									onPress={countUp}
									size={24}
								/>
							</View>
						)}
						<View style={styles.bottomSegment}>
							<CustomSegmentedControl
								options={options}
								handlePress={(idx) => {
									setIsShowingOverall(idx === 0);
								}}
							/>
						</View>
					</View>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listHeader: {
		fontWeight: "bold",
		fontSize: 30,
		textAlign: "center",
	},
	bottom: {
		alignSelf: "flex-end",
		marginRight: 30,
		fontSize: fontSizes.s16,
		marginTop: 10,
		marginBottom: 10,
	},
	userIndexContainer: {
		alignSelf: "flex-end",
		marginRight: 30,
		marginTop: 10,
		marginBottom: 10,
		flexDirection: "row",
	},
	currentUserIndexContainerBG: {
		marginHorizontal: 6,
		width: 40,
		borderRadius: 6,
		backgroundColor: colors.blurredGray,
		overflow: "hidden",
	},
	bottomLayout: {
		width: screenWidth - 24,
		marginHorizontal: 12,
		marginBottom: 30,
	},
	bottomSegment: {
		flexDirection: "row",
		justifyContent: "center",
		alignSelf: "flex-start",
		alignContent: "center",
		marginHorizontal: 12,
	},
	sectionHeaderBG: {
		marginTop: 60,
		marginBottom: 10,
		paddingLeft: 20,
	},
});
