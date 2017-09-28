/* tslint:disable */
export const throttle = (func: Function, wait: number, ctx: object) => {
    let context, args, prevArgs: object, argsChanged, result: object;
    let previous = 0;
    return function () {
        let now: number = 0, remaining: number = 0;
        if (wait) {
            now = Date.now();
            remaining = wait - (now - previous);
        }
        context = ctx;
        args = arguments;
        argsChanged = JSON.stringify(args) != JSON.stringify(prevArgs);
        prevArgs = { ...args };
        if (argsChanged || wait && (remaining <= 0 || remaining > wait)) {
            if (wait) {
                previous = now;
            }
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
};