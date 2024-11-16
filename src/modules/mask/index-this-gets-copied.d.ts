/**
 * Type Definition.
 *
 * Using with Typescript development.
 *
 * Definitions by: Italo Izaac <https://github.com/iiandrade>
 */

import * as React from "react";
import {TextInput, TextInputProps} from "react-native";

// Type prop of TextInputMask.
export type TextInputMaskTypeProp =
    | "credit-card"
    | "cpf"
    | "cnpj"
    | "zip-code"
    | "only-numbers"
    | "money"
    | "money-intl"
    | "cel-phone"
    | "datetime"
    | "custom";

// Option prop of TextInputMask.
export interface TextInputMaskOptionProp {
    "money-intl"?: {
        currency: string;
        hideCurrencySymbol?: boolean;
    };
    money?: {
        precision?: number;
        separator?: string;
        delimiter?: string;
        unit?: string;
        suffixUnit?: string;
        zeroCents?: boolean;
    };
    "cel-phone"?: {
        withDDD?: boolean;
        dddMask?: string;
        maskType?: "BRL" | "INTERNATIONAL";
    };
    datetime: {
        format?: string;
    };
    "credit-card": {
        obfuscated?: boolean;
        issuer?: "visa-or-mastercard" | "diners" | "amex";
    };
    custom: {
        mask?: string;
        validator?: (value: string, settings: any) => boolean;
        getRawValue?: (value: string, settings: any) => any;
        translation?: {[s: string]: (val: string) => string | null | undefined};
    };
}

// TextInputMask Props
export interface TextInputMaskProps<T extends TextInputMaskTypeProp>
    extends Pick<
        TextInputProps,
        Exclude<keyof TextInputProps, "onChangeText">
    > {
    type: T;
    options?: TextInputMaskOptionProp[T];
    checkText?: (previous: string, next: string) => boolean;
    onChangeText?: (text: string, rawText?: string) => void;
    refInput?: (ref: any) => void;
    customTextInput?: any;
    customTextInputProps?: object;
    includeRawValueInChangeText?: boolean;
}

// TextInputMask Component
export class TextInputMask extends React.Component<TextInputMaskProps> {}

// TextMask
export class TextMask extends React.Component<TextInputMaskProps> {}

// MaskService
export namespace MaskService {
    function toMask<T extends TextInputMaskTypeProp>(
        type: T,
        value: string | number,
        options?: TextInputMaskOptionProp[T]
    ): string;
    function toRawValue<T extends TextInputMaskTypeProp>(
        type: T,
        maskedValue: string,
        options?: TextInputMaskOptionProp[T]
    ): string;
    function isValid<T extends TextInputMaskTypeProp>(
        type: T,
        value: string,
        options?: TextInputMaskOptionProp[T]
    ): boolean;
}

// TextInputMaskMethods
export class TextInputMaskMethods {
    getElement(): TextInput;
    getRawValue(): string;
    isValid(): boolean;
}

// TextInputMasked
export type TextInputMasked = TextInputMaskMethods | null;

// TextMaskMethods
export class TextMaskMethods {
    getElement(): TextInput;
}

// TextMaskInstance
export type TextMaskInstance = TextMaskMethods | null;
