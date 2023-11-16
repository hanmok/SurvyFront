import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment, incrementByAmount } from "./counterSlice";
import { Button, View, Text } from "react-native";
// import styles from './Counter.module.css'
// import { CounterRootState } from "../../RootState";
import { RootState } from "../../store";

export function Counter() {
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch();

    return (
        <View>
            <Text>{count}</Text>
            <Button
                onPress={() => dispatch(increment())}
                title="Increment"
            ></Button>
            <Button
                onPress={() => dispatch(incrementByAmount(5))}
                title="Decrement"
            ></Button>
        </View>
    );
}
