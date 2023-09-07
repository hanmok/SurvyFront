export const log = str => {
    console.log(str);
};

export const logObject = (message, object) => {
    log(`${message}: ${JSON.stringify(object)}`);
};
