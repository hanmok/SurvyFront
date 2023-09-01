export function printObject(obj, flag: string) {
    console.log(`${flag} from ${JSON.stringify(obj, null, 2)}`);
}
