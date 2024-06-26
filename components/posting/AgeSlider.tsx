import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { fontSizes } from "../../utils/sizes";
import { colors } from "../../utils/colors";

interface AgeSliderProps {
    setAgeRange: (ages: number[]) => void;
}

const AgeSlider: React.FC<AgeSliderProps> = ({ setAgeRange }) => {
    const [ages, setAges] = useState([20, 30]);

    const handleSliderChange = values => {
        setAges(values);
        setAgeRange(values);
    };

    return (
        <View>
            <Text
                style={{
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
                selectedStyle={{ backgroundColor: colors.sliderBlue }}
                containerStyle={{ marginBottom: 20 }}
                enableLabel={true}
                isMarkersSeparated={true}
                customLabel={labelProps => {
                    return <Text></Text>;
                }}
                markerStyle={styles.marker}
            />
        </View>
    );
};

export default AgeSlider;

const styles = StyleSheet.create({
    marker: {
        height: 16,
        width: 16,
        backgroundColor: colors.sliderBlue,
        overflow: "hidden",
        borderColor: colors.transparent,
    },
});
