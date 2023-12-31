// const handleFocus = () => {
//     const keyboardDidShowListener = Keyboard.addListener(
//         "keyboardDidShow",
//         event => {
//             const keyboardHeight = event.endCoordinates.height;
//             // const screenHeight = Dimensions.get('window').height;
//             if (textInputRef && textInputRef.current) {
//                 const inputPosition = textInputRef.current.measure(
//                     (fx, fy, width, height, px, py) => {
//                         console.log(
//                             `fx: ${fx}, fy: ${fy}, width: ${width}, height: ${height}, px: ${px}, py: ${py}, keyboardHeight: ${keyboardHeight}, screenHeight: ${screenHeight}`
//                         );

//                         if (py < screenHeight / 2) {
//                             // TextInput이 화면의 절반 이하에 위치한 경우에만 스크롤 조절
//                             scrollViewRef.current.scrollTo({
//                                 y: inputPosition - keyboardHeight,
//                                 animated: true,
//                             });
//                             console.log("scrolled");
//                         }
//                         console.log("not scrolle");

//                         return py;
//                     }
//                 );

//                 console.log(`inputPosition: ${inputPosition}`);

//                 // if (inputPosition < screenHeight / 2) {
//                 //     // TextInput이 화면의 절반 이하에 위치한 경우에만 스크롤 조절
//                 //     scrollViewRef.current.scrollTo({
//                 //         y: inputPosition - keyboardHeight,
//                 //         animated: true,
//                 //     });
//                 //     console.log("scrolled");
//                 // }
//                 // console.log("not scrolle");
//             }
//         }
//     );

//     const keyboardDidHideListener = Keyboard.addListener(
//         "keyboardDidHide",
//         () => {}
//     );

//     return () => {
//         keyboardDidShowListener.remove();
//         keyboardDidHideListener.remove();
//     };
// };

// CompleteAccessoryView.tsx
// 	import React from "react";
// import { InputAccessoryView, StyleSheet, View, Button } from "react-native";

// interface CompleteAccessoryViewProps {
//     id: string;
//     onPress: () => void;
// }

// const CompleteAccessoryView: React.FC<CompleteAccessoryViewProps> = ({
//     id,
//     onPress,
// }) => {
//     return (
//         <InputAccessoryView nativeID={id} style={styles.accessoryView}>
//             <View style={[styles.accessoryBorder, styles.accessoryContent]}>
//                 <Button
//                     title="완료"
//                     onPress={() => {
//                         onPress();
//                     }}
//                 />
//             </View>
//         </InputAccessoryView>
//     );
// };

// export default CompleteAccessoryView;

// const styles = StyleSheet.create({
//     accessoryView: {
//         position: "absolute",
//         bottom: 0, // Set the distance from the bottom of the screen
//         left: 0,
//         right: 0,
//         backgroundColor: "#F3F4F6",
//         borderTopColor: "#A8B7B6",
//         borderTopWidth: 1,
//     },
//     accessoryContent: {
//         flexDirection: "row",
//         justifyContent: "flex-end",
//         paddingRight: 20,
//         alignItems: "center",
//         height: "100%", // Ensure the content takes the full height
//     },
//     accessoryBorder: {
//         backgroundColor: "#F3F4F6",
//         paddingRight: 20,
//         borderTopColor: "#A8B7B6",
//         borderTopWidth: 1,
//     },
// });

// import { useEffect } from "react";
// import ParticipatedSurveyItems from "../components/mypage/ParticipatedSurveyItems";
// import { useCustomContext } from "../features/context/CustomContext";
// import { useApollo } from "../ApolloProvider";
// import { useQuery } from "@apollo/client";
// import { participatedSurveyQuery } from "../API/gqlQuery";
// import { convertKeysToCamelCase } from "../utils/SnakeToCamel";
// import { Text, View } from "react-native";

// export interface ParticipatedSurveyItem {
//     title: string;
//     reward: number;
//     id: number;
//     createdAt: number;
// }

// interface ParticipatedSurveyResponse {
//     user: {
//         participated_surveys: ParticipatedSurveyItem[];
//     };
// }

// // 참여한 설문
