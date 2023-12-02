import _ from "lodash";

export const convertKeysToCamelCase = (obj: any) => {
    const newObj: any = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = key.replace(/_([a-z])/g, function (g) {
                return g[1].toUpperCase();
            });
            newObj[newKey] = obj[key];
        }
    }
    return newObj;
};

export function convertToSnakeCase(obj) {
    return _.mapKeys(obj, (value, key) => _.snakeCase(key));
}

export const convertKeysToCamelCaseRecursive = obj => {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => convertKeysToCamelCaseRecursive(item));
    }

    const newObj = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = key.replace(/_([a-z])/g, function (g) {
                return g[1].toUpperCase();
            });
            newObj[newKey] = convertKeysToCamelCaseRecursive(obj[key]);
        }
    }
    return newObj;
};

export function removeTypenameAndConvertToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(removeTypenameAndConvertToCamelCase);
    }
    if (obj !== null && typeof obj === "object") {
        const newObj: any = {};
        for (const key in obj) {
            if (key !== "__typename" && obj.hasOwnProperty(key)) {
                const newKey = key.replace(/_([a-z])/g, function (g) {
                    return g[1].toUpperCase();
                });
                newObj[newKey] = removeTypenameAndConvertToCamelCase(obj[key]);
            }
        }
        return newObj;
    }
    return obj;
}
