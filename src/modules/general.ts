import equal from "fast-deep-equal";
import {useEffect, useRef} from "react";

const REPLACE_DIGITS = ["۰۱۲۳۴۵۶۷۸۹", "٠١٢٣٤٥٦٧٨٩"];
export const convert2EnglishDigits = (string: string | any) => {
    let r = string;
    if (!r) {
        return r;
    } else if (typeof r === "string") {
        REPLACE_DIGITS.forEach((value) => {
            r = r.replace(
                new RegExp(`[${value[0]}-${value[value.length - 1]}]`, "g"),
                (d) => {
                    const number = value.indexOf(d);
                    return number === -1 ? d : (number as any);
                }
            );
        });
    }
    return r;
};


export const debounce = (func, wait, immediate = false) => {
    let timeout;
    return function (...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        // @ts-ignore
        const context = this;
        // eslint-disable-next-line prefer-rest-params
        // args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};

export const usePrevious = <T>(value: T): T => {
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const ObjectUtils = {
    mapSameKey: (object: object, callback: (key, value) => any) => {
        const obj = {};
        if (object) {
            Object.keys(object)?.forEach((key) => {
                obj[key] = callback(key, object[key]);
            });
        }
        return obj;
    },
    forEach<O extends object>(
        object: O,
        callback: (key, value: O[keyof O]) => void
    ) {
        if (object) {
            Object.keys(object)?.forEach((key) => {
                callback(key, object[key]);
            });
        }
    },
    filter<T extends object>(
        object: T,
        callback: (key, value) => any
    ): Partial<T> {
        const obj = {};
        if (object) {
            Object.keys(object)?.forEach((key) => {
                if (callback(key, object[key])) {
                    obj[key] = object[key];
                }
            });
        }
        return obj;
    },
    compare: (
        object1: object | null | undefined,
        object2: object | null | undefined
    ) => {
        return equal(object1, object2);
    },
    isEmpty: (object: object) => {
        return !object || Object.keys(object).length === 0;
    },
};

export const ArrayUtils = {
    removeDuplicates<T extends any[]>(arr: T): T {
        return arr.filter(function (item, pos) {
            return arr.indexOf(item) == pos;
        }) as any;
    },
}
