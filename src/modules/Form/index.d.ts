import {TextInputProps} from "react-native";
import {
    TextInputMaskOptionProp,
    TextInputMaskTypeProp,
} from "../mask/index-this-gets-copied";
import {NextInputFormConfig} from "./Form";

export interface Mask<T extends TextInputMaskTypeProp> {
    type: T;
    options?: TextInputMaskOptionProp[T];
    /**
     * default : true
     */
    shouldUnmaskOnSubmit?: boolean;
    /**
     * default : true
     */
    shouldUnmaskOnValidate?: boolean;
}

interface MyTextInputProps extends Omit<TextInputProps, "keyboardType"> {
    [key: string]: any;
}
export interface Config {
    initialValue?: any;
    keyboardType?:
        | "default"
        | "number-pad"
        | "decimal-pad"
        | "numeric"
        | "email-address"
        | "phone-pad";
    /**
     *
     * ### YUP validation
     * - [] yup.date() is a little hard to use, maybe make it easier in the future
     * - [] yup.date() does not support Jalali yet
     */
    validation?: any;
    /**
     * All textInput Props + any custom props is supported
     */
    textInputProps?: MyTextInputProps;
    /**
     * Enter keyboard button
     *
     * default : next
     */
    next?: NextInputFormConfig;
    /**
     * You can change the mask at runtime and it will reset to {@link initialValue} value
     *
     * Masking is used for showing the
     */
    mask?: Mask;
    /**
     * Offset that is used when scrolling to an input
     */
    scrollOffset?: {x?: number; y?: number};
}
