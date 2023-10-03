import React, { useState } from "react";
import { View, Text } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { fontSizes } from "../../utils/sizes";
import { colors } from "../../utils/colors";

const AgeSlider = () => {
    const [values, setValues] = useState([20, 30]);

    const handleSliderChange = values => {
        setValues(values);
    };

    return (
        // <View style={{ backgroundColor: "magenta" }}>
        <View>
            <Text
                style={{
                    // alignSelf: "center",
                    fontSize: fontSizes.m20,
                }}
            >
                나이
            </Text>

            <MultiSlider
                values={values}
                sliderLength={250}
                onValuesChange={handleSliderChange}
                min={16}
                max={100}
                step={1}
                allowOverlap
                snapped
                containerStyle={{ marginTop: 20 }}
                markerStyle={{
                    height: 20,
                    width: 20,
                    // backgroundColor: "black",
                }}
            />
            <Text style={{ alignSelf: "center" }}>
                {values[0]} ~ {values[1]}
            </Text>
        </View>
    );
};

export default AgeSlider;
