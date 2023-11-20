export function setDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const difference = new Set<T>(setA);

    for (const element of setB) {
        difference.delete(element);
    }
    return difference;
}

export function areSetsEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
    if (setA.size !== setB.size) {
        return false;
    }

    for (const element of setA) {
        if (!setB.has(element)) {
            return false;
        }
    }

    return true;
}
