class Vehicle {
    // color: string = 'red';
    // color: string;

    // constructor(color: string) {
    // }

    constructor(public color: string) {}

    public drive(): void {
        console.log("chugga chugga");
    }

    protected honk(): void {
        console.log("beep");
    }
}

const vehicle = new Vehicle("orange");
vehicle.drive();
// vehicle.honk();
console.log(vehicle.color);

class Car extends Vehicle {
    constructor(public wheels: number, color: string) {
        super(color);
    }

    drive(): void {
        console.log("vroom");
    }

    startDrivingProcess(): void {
        this.drive();
        this.honk();
    }
}

const car = new Car(4, "orange");
car.drive();
car.startDrivingProcess();

export default {};
