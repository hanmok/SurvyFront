import React, { useState } from "react";
import { View, Text } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { fontSizes } from "../../utils/sizes";
import { colors } from "../../utils/colors";

interface AgeSliderProps {
    // ageRange: number[];
    setAgeRange: (ages: number[]) => void;
}

// const AgeSlider = (ages: number[]) => {
const AgeSlider: React.FC<AgeSliderProps> = ({
    // ageRange,
    // setAgeRange
    setAgeRange,
}) => {
    const [ages, setAges] = useState([20, 30]);

    const handleSliderChange = values => {
        setAges(values);
        setAgeRange(values);
        // setAgeRange(values);
    };

    return (
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
                values={ages}
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
                {ages[0]} ~ {ages[1]}
            </Text>
        </View>
    );
};

export default AgeSlider;
