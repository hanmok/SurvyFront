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
            <Text style={{ alignSelf: "center" }}>
                {ages[0]} ~ {ages[1]}
            </Text>
            <MultiSlider
                values={ages}
                sliderLength={250}
                onValuesChange={handleSliderChange}
                min={16}
                max={70}
                step={1}
                allowOverlap
                snapped
                // trackStyle={{ backgroundColor: colors.sliderBlue }}
                selectedStyle={{ backgroundColor: colors.sliderBlue }}
                containerStyle={{
                    // marginTop: 20,
                    // backgroundColor: colors.sliderBlue,
                    marginBottom: 20,
                }}
                enableLabel={true}
                isMarkersSeparated={true}
                customLabel={labelProps => {
                    return <Text></Text>;
                }}
                // customLabel={<Text>asdnj</Text>}
                markerStyle={{
                    height: 16,
                    width: 16,
                    backgroundColor: colors.sliderBlue,
                    overflow: "hidden",
                    borderColor: colors.transparent,
                    // backgroundColor: "black",
                }}
            />
        </View>
    );
};

export default AgeSlider;
