import React from "react";
import { View } from "react-native";

const Spacer = ({ size }) => (
	<View
		style={{
			height: size,
			width: size,
		}}
	/>
);

export default React.memo(Spacer);

// export default Spacer;
