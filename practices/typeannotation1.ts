let apples: number = 5; // apples: number
let apple;
// apple : any

let speed: string = "fast";
let hasName: boolean = true;
let nothingMuch: null = null;
let nothing: undefined = undefined;

// built in objects
let now: Date = new Date();

// Array
let colors: string[] = ["red", "green", "blue"];

let myNumbers: number[] = [1, 2, 3];
let truths: boolean[] = [true, true, false];

// Classes
class Car {}

let car: Car = new Car();

// Object literal
let point: { x: number; y: number } = {
    x: 10,
    y: 20,
};

// Function
const logNumber: (i: number) => void = (i: number) => {
    console.log(i);
};
// annotation part: '(i: number) => void'
// input: i (number), return void type

const add = (a: number, b: number): number => {
    return a + b;
};
