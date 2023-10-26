export function printObject(obj, flag: string) {
    console.log(`${flag} ${JSON.stringify(obj, null, 2)}`);
}
