export const log = str => {
    console.log(str);
};

export const logObject = (message, object) => {
    log(`${message}: ${JSON.stringify(object)}`);
};

export const logArray = (message, object: any[]) => {
    log(`${message}`);
    object.forEach(obj => {
        log(JSON.stringify(obj));
    });
    log("\n");
};
