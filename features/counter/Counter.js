import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "./counterSlice";
import { Button, View, Text } from "react-native";
// import styles from './Counter.module.css'

export function Counter() {
    const count = useSelector(state => state.counter.value);
    const dispatch = useDispatch();

    return (
        <View>
            <Text>{count}</Text>
            <Button
                onPress={() => dispatch(increment())}
                title="Increment"
            ></Button>
            <Button
                onPress={() => dispatch(decrement())}
                title="Decrement"
            ></Button>
        </View>
    );
}
