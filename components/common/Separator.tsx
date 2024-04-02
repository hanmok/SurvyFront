import { View } from "react-native";
import { colors } from "../../utils/colors";
import React from "react";

const Separator = () => (
	<View
		style={{
			backgroundColor: colors.gray5,
			height: 1,
		}}
	/>
);

export default React.memo(Separator);
