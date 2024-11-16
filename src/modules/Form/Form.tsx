import {FormikErrors, useFormik} from "formik";
import React, {
    ComponentProps,
    ForwardedRef,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import {Keyboard, TextInputProps, useColorScheme, View, ViewProps} from "react-native";
import * as Yup from "yup";
import {NumberSchema, StringSchema} from "yup";
import KeyboardViewExpo from "../layout/KeyboardView";
import {MaskService} from "../mask";
import {ArrayUtils, convert2EnglishDigits, debounce, ObjectUtils, usePrevious} from "../general";
import type {Config, Mask} from "./index";

type DynamicConfigReturnType = Partial<{
    mask: Mask<any>;
    validation: any;
}>;
type DynamicConfig = (
    yup: typeof Yup,
    dynamicConfig?: DynamicConfigReturnType
) => DynamicConfigReturnType;
type DynamicConfigState = {
    [key: string]: ReturnType<DynamicConfig>;
};
interface FormInputProps {
    onChangeText: any;
    onBlur: any;
    touched: boolean;
    error: string;
    value: string;
    ref: (instance: any) => any;
    onSubmitEditing: any;
    label: string;
    setFieldValue: (value: any) => void;
    setOtherFieldValue: (name: string, value: any) => void;
    setDynamicConfig: (config: DynamicConfig) => void;
    name: string;
}

export type FormCustomInputProps = Omit<
    FormInputProps,
    "onBlur" | "onChangeText" | "onSubmitEditing" | "ref"
>;

export interface SGFormCustomInputProps
    extends Omit<FormCustomInputProps, "value">,
        TextInputProps {}

export enum NextInputFormConfig {
    disable,
    submit,
}

type OnChangeArguments = {
    values: {[key: string]: any};
    errors: {[key: string]: any};
    disableSubmitUI?: boolean;
};

export interface Props<
    T,
    A,
    R,
    AG,
    GQL_Q,
    GQL_M,
    GQL_S
> {
    keyboardAwareModal?: Omit<
        ComponentProps<typeof KeyboardViewExpo>,
        "children"
    > & {ref?: any};
    filterOnChange?: (name: string, value: string) => string;
    filterFormValuesBeforeSubmit?: (values) => {[obj: string]: string};
    config?: (yup: typeof Yup) => {[key: string]: Config};
    initialFocus?:
        | string
        | {
              name: string;
              delay: number;
          };
    configAllProps?: Config["textInputProps"];
    style?: ViewProps["style"];
    onChange?: (args: OnChangeArguments) => void;
    onSubmit?: (values: {[key: string]: any}) => void;
    children: (args: {
        /**
         * Wrapper Function to Use without creating a custom input
         *
         * @example
         * wrapIt('email',
         *      (({error,...}) => {
         *          ...
         *      }
         * );
         */
        wrapIt: (
            name: string,
            Input:
                | ((obj: FormInputProps) => Omit<Element, any>)
                | Omit<Element, any>
        ) => Omit<Element, any>;
        addExtraInfo: (
            name: string,
            info: {
                key: string;
                value: any;
            }
        ) => void;
        inputProps: (name: string) => any;
        submit: () => Promise<FormikErrors<object>>;
        values: {[key: string]: any};
        errors: {[key: string]: any};
        disableSubmitUI: boolean;
    }) => Omit<Element, any>;
}
export type SGFormRef<BODY = any, GQL_S = any> = {
    /**
     * submit the form
     */
    submit: () => Promise<FormikErrors<object>>;
    /**
     * set one field's value
     * @param key
     * @param value
     */
    set: (key, value) => void;
    /**
     * get all the field's values
     */
    get: (key) => any;
    /**
     * set one field's error
     * @param key
     * @param value
     */
    getAll: () => any;
    /**
     * get one file's value
     * @param key
     */
    setFieldError: (key, value) => void;
    /**
     * empty the errors
     */
    resetErrors: () => void;
    /**
     * Gets the info added for a field via addExtraInfo
     * @param name
     */
    getExtraInfo: (name: string) => any;
    /**
     * Let's you scroll to an input by its name
     * @param name
     */
    scrollToInput: (name: string) => any;
};

const Form = (<T, R, AG, GQL_Q, GQL_M, GQL_S, A>() => {
    return forwardRef(
        (
            props: Props<T, A, R, AG, GQL_Q, GQL_M, GQL_S>,
            ref: ForwardedRef<SGFormRef>
        ) => {
            const colorScheme = useColorScheme();
            const keyboardAwareModal = props.keyboardAwareModal;
            const KeyboardWrapper = keyboardAwareModal
                ? KeyboardViewExpo
                : View;
            const yup = Yup;
            const buildFormConfig = () => {
                return props?.config?.(yup);
            };
            const [formConfig, setFormConfig] = useState(
                buildFormConfig() || {}
            );
            const previousFormConfig =
                usePrevious(formConfig);

            const [fieldsDynamicConfig, setFieldsDynamicConfig] =
                useState<DynamicConfigState>();
            const previousFieldsDynamicConfig =
                usePrevious(fieldsDynamicConfig);

            const getValidation = (key) => {
                return (
                    fieldsDynamicConfig?.[key]?.validation ||
                    formConfig[key]?.validation
                );
            };

            const buildValidation = () => {
                const validationFromFormConfig = formConfig
                    ? ObjectUtils.mapSameKey(
                        formConfig,
                        (key, value) => {
                            return value?.validation || undefined;
                        }
                    )
                    : {};

                /**
                 * Override with dynamic ones
                 */
                const validationFromDynamicConfig = fieldsDynamicConfig
                    ? ObjectUtils.mapSameKey(
                        fieldsDynamicConfig,
                        (key, value) => {
                            return (
                                fieldsDynamicConfig?.[key]
                                    ?.validation || undefined
                            );
                        }
                    )
                    : {};

                const finalValidation = validationFromFormConfig;
                ObjectUtils.forEach(
                    validationFromDynamicConfig,
                    (key, value) => {
                        finalValidation[key] = value;
                    }
                );

                return finalValidation
                    ? ObjectUtils.filter(
                        finalValidation,
                        (key, value) => value !== undefined
                    )
                    : undefined;
            };
            const [validation, setValidation] = useState(
                buildValidation()
            );

            useEffect(() => {
                if (props?.config) {
                    // @ts-ignore
                    setFormConfig(buildFormConfig());
                }
            }, [props?.config]);

            useEffect(() => {
                setValidation(buildValidation());
            }, [formConfig, fieldsDynamicConfig]);

            //region mask handling
            const onMaskChange = (key, mask: Mask<any> | undefined) => {
                const rawValue = mask
                    ? MaskService.toRawValue(
                        mask.type,
                        values[key] as any,
                        mask.options
                    )
                    : undefined;
                /**
                 * If toRawValue didn't do anything special let's just use the initialValue to reset it.
                 */
                if (
                    (rawValue === undefined ||
                        rawValue === values[key]) &&
                    formConfig[key]?.initialValue
                ) {
                    setFieldValue(
                        key,
                        onChangeTextFilterHandle(
                            key,
                            formConfig[key]?.initialValue
                        )
                    );
                } else {
                    setFieldValue(
                        key,
                        onChangeTextFilterHandle(key, rawValue)
                    );
                }
            };
            const getMask = (name, dynamicFieldsMutated = null) => {
                return (
                    (dynamicFieldsMutated || fieldsDynamicConfig)?.[
                        name
                        ]?.mask || formConfig?.[name]?.mask
                );
            };
            useEffect(() => {
                if (!formConfig) return;
                Object.keys(formConfig).forEach((key) => {
                    if (
                        JSON.stringify(formConfig?.[key].mask) !==
                        JSON.stringify(previousFormConfig[key]?.mask)
                    ) {
                        //Mask has changed
                        onMaskChange(key, formConfig?.[key]?.mask);
                    }
                });
            }, [formConfig]);
            useEffect(() => {
                if (!fieldsDynamicConfig) {
                    return;
                }
                ObjectUtils.forEach(
                    fieldsDynamicConfig,
                    (key, value) => {
                        if (
                            !ObjectUtils.compare(
                                value?.mask,
                                previousFieldsDynamicConfig?.[key]?.mask
                            )
                        ) {
                            onMaskChange(
                                key,
                                previousFieldsDynamicConfig?.[key]?.mask
                            );
                        }
                    }
                );
            }, [fieldsDynamicConfig]);
            //endregion

            const onChangeTextFilterHandle = (
                name,
                text,
                dynamicFieldsMutated = null
            ) => {
                //Convert Other numbers to English digits before mask
                let t =
                    convert2EnglishDigits(
                        text
                    );
                const mask = getMask(name, dynamicFieldsMutated);
                if (mask && text) {
                    t = MaskService.toMask(mask.type, t, mask.options);
                }
                return t;
            };

            const {
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                errors,
                setFieldValue,
                setFieldError,
                setFieldTouched,
                touched,
                setErrors,
                validateForm,
            } = useFormik({
                validationSchema: validation
                    ? Yup.object()
                        .shape(validation as any)
                        .transform((s) => {
                            return ObjectUtils.mapSameKey(
                                s,
                                (key, value) => {
                                    if (value === undefined)
                                        return value;
                                    const mask = getMask(key);
                                    if (
                                        mask &&
                                        mask?.shouldUnmaskOnValidate !==
                                        false
                                    ) {
                                        const result =
                                            MaskService.toRawValue(
                                                mask.type,
                                                value as any,
                                                mask.options
                                            );
                                        if (
                                            getValidation(
                                                key
                                            ) instanceof NumberSchema
                                        ) {
                                            return parseFloat(result);
                                        } else if (
                                            getValidation(
                                                key
                                            ) instanceof StringSchema
                                        ) {
                                            return result.toString();
                                        }
                                    }
                                    return value;
                                }
                            );
                        })
                    : undefined,
                initialValues:
                    ObjectUtils.mapSameKey(
                        formConfig,
                        // @ts-ignore
                        (key, value) => {
                            if (value?.initialValue && typeof value.initialValue === 'string') {
                                return onChangeTextFilterHandle(
                                    key,
                                    value?.initialValue
                                );
                            }
                            return value.initialValue;
                        }
                    ) || {},
                onSubmit: (values) => {
                    let v = {...values} as any;
                    v = ObjectUtils.mapSameKey(
                        v,
                        (name, text) => {
                            const mask = getMask(name);
                            if (
                                text &&
                                mask &&
                                mask?.shouldUnmaskOnSubmit !== false
                            ) {
                                return MaskService.toRawValue(
                                    mask.type,
                                    text as any,
                                    mask.options
                                );
                            }
                            return text as any;
                        }
                    );
                    if (props.filterFormValuesBeforeSubmit) {
                        v = props.filterFormValuesBeforeSubmit(v);
                    }
                    if (!props.onSubmit) {
                        console.log(v);
                    } else {
                        props.onSubmit(v);
                    }
                },
            });

            const inputRefs = useRef({});
            const namesRefs = useRef<string[]>([]);
            const keyboardAvoidingViewRef = useRef<any>();

            const [focusThis, setFocusThis] = useState<
                Props<any, any, any, any, any, any, any>["initialFocus"]
            >(props.initialFocus);

            useEffect(() => {
                let timeout;
                if (focusThis) {
                    if (typeof focusThis === "string") {
                        inputRefs?.current[focusThis]?.focus();
                    } else {
                        if (focusThis?.delay > 0) {
                            timeout = setTimeout(() => {
                                inputRefs?.current[
                                    focusThis.name
                                    ]?.focus();
                                setFocusThis(undefined);
                            }, focusThis.delay);
                            return;
                        } else {
                            inputRefs?.current[focusThis.name]?.focus();
                        }
                    }
                    setFocusThis(undefined);
                }
                return () => {
                    if (timeout) {
                        clearTimeout(timeout);
                    }
                };
            }, [focusThis]);

            const getNextName = (name) => {
                if (!namesRefs.current.includes(name))
                    namesRefs.current.push(name);
                const nextIndex =
                    namesRefs.current.findIndex(
                        (value) => value === name
                    ) + 1;
                return namesRefs.current.length > nextIndex
                    ? namesRefs.current[nextIndex]
                    : undefined;
            };

            const tryToScrollIntoInput = (inputName) => {
                if (inputRefs?.current?.[inputName]) {
                    keyboardAvoidingViewRef?.current?.scrollIntoView?.(
                        inputRefs.current[inputName],
                        {
                            getScrollPosition: (
                                parentLayout,
                                childLayout,
                                contentOffset
                            ) => {
                                const offsetX =
                                    formConfig[inputName]?.scrollOffset
                                        ?.x || 0;
                                const offsetY =
                                    formConfig[inputName]?.scrollOffset
                                        ?.y || 0;
                                return {
                                    x: 0 + offsetX,
                                    y:
                                        Math.max(
                                            0,
                                            childLayout.y -
                                            parentLayout.y +
                                            contentOffset.y
                                        ) + offsetY,
                                    animated: true,
                                };
                            },
                        }
                    );
                }
            };

            const debounceScrollToError = useCallback(
                (scrollTo: string) => {
                    tryToScrollIntoInput(scrollTo);
                },
                []
            );

            const findFirstInputRefWithError = () => {
                const formConfigKeys = Object.keys(formConfig);
                const errorKeys = Object.keys(errors);
                const scrollTo = errorKeys
                    .sort((a, b) => {
                        return (
                            formConfigKeys.indexOf(a) -
                            formConfigKeys.indexOf(b)
                        );
                    })
                    .filter((item) => {
                        return !!touched[item];
                    })[0];
                if (scrollTo) {
                    debounce(
                        debounceScrollToError,
                        100
                    )(scrollTo);
                }
            };
            useEffect(() => {
                if (Object.keys(errors).length > 0) {
                    findFirstInputRefWithError();
                }
            }, [errors]);

            const getNextBasedOnConfigAndName = (name) => {
                let next;
                const formConfigKeys = Object.keys(formConfig);
                if (formConfig?.[name]?.next !== undefined) {
                    next = formConfig?.[name]?.next;
                } else if (
                    formConfigKeys.indexOf(name) ===
                    formConfigKeys.length - 1
                ) {
                    next = NextInputFormConfig.submit;
                }
                return next;
            };
            const [
                hasSetFieldErrorThroughRef,
                setHasSetFieldErrorThroughRef,
            ] = useState([]);
            const touchedAdvanced = useMemo(() => {
                const t = {...touched};
                hasSetFieldErrorThroughRef?.forEach((value, index) => {
                    // @ts-ignore
                    t[value] = true;
                });
                return t;
            }, [touched, hasSetFieldErrorThroughRef]);

            const buildProps = (name, nextName): FormInputProps => {
                let dynamicFieldsMutated = fieldsDynamicConfig;
                const next = getNextBasedOnConfigAndName(name);
                return {
                    onChangeText: (text) => {
                        const t = onChangeTextFilterHandle(
                            name,
                            text,
                            // @ts-ignore
                            dynamicFieldsMutated
                        );
                        if (text === undefined) {
                            setFieldValue(name, text);
                            return;
                        }
                        // @ts-ignore
                        handleChange(name)(
                            props.filterOnChange
                                ? props.filterOnChange(name, t)
                                : t
                        );
                    },
                    setOtherFieldValue: (name, value) => {
                        setFieldValue(name, value).then(() => {
                            handleChange({
                                target: {
                                    name: name,
                                    value: value,
                                    type: "text",
                                },
                            });
                            setFieldTouched(name, true, true);
                        });
                    },
                    setFieldValue: (value) => {
                        setFieldValue(name, value).then(() => {
                            handleChange({
                                target: {
                                    name: name,
                                    value: value,
                                    type: "text",
                                },
                            });
                            setFieldTouched(name, true, true);
                        });
                    },
                    setDynamicConfig: (config) => {
                        setFieldsDynamicConfig((prevState) => {
                            dynamicFieldsMutated = {
                                ...prevState,
                                [name]: config(yup, prevState?.[name]),
                            };
                            return dynamicFieldsMutated;
                        });
                    },
                    onBlur: handleBlur(name),
                    touched: touchedAdvanced[name] as boolean,
                    error: errors[name] as string,
                    value: values[name] as any,
                    label: name,
                    name,
                    ref: (instance) => {
                        inputRefs.current[name] = instance;
                    },
                    onSubmitEditing:
                        next === NextInputFormConfig.disable ||
                        (typeof next === "string" && next !== "next")
                            ? undefined
                            : () => {
                                if (
                                    next ===
                                    NextInputFormConfig.submit
                                ) {
                                    handleSubmit();
                                    Keyboard.dismiss();
                                    return;
                                }
                                if (nextName) {
                                    setTimeout(() => {
                                        setFocusThis(nextName);
                                    }, 500);
                                }
                            },
                };
            };

            const buildConfigProps = (
                name: string,
                nextName: boolean
            ) => {
                const next = getNextBasedOnConfigAndName(name);
                let obj = {
                    returnKeyType: nextName ? "next" : "default",
                };
                if (next !== undefined) {
                    if (next === NextInputFormConfig.disable) {
                        // @ts-ignore
                        obj = {...obj, returnKeyType: undefined};
                    } else if (next === NextInputFormConfig.submit) {
                        obj = {...obj, returnKeyType: "go"};
                    }
                }
                return obj;
            };

            const buildAllProps = (name, nextName) => {
                const theNextName =
                    nextName && inputRefs.current[nextName] && nextName;
                return {
                    ...props.configAllProps,
                    ...buildConfigProps(name, theNextName),
                    ...buildProps(name, theNextName),
                    ...formConfig?.[name]?.textInputProps,
                    ...(formConfig?.[name]?.keyboardType
                        ? {
                            keyboardType:
                            formConfig?.[name]?.keyboardType,
                        }
                        : {}),
                    keyboardAppearance: colorScheme === "dark"
                        ? "dark"
                        : "light",
                };
            };

            const disableSubmitUI = useMemo(() => {
                let valueCount = 0;
                ObjectUtils.forEach(values, (key, value) => {
                    if (value !== undefined) {
                        valueCount++;
                    }
                });
                return (
                    valueCount === 0 ||
                    !ObjectUtils.isEmpty(errors)
                );
            }, [errors, values, touchedAdvanced]);

            useEffect(() => {
                props?.onChange?.({
                    errors,
                    values,
                    disableSubmitUI,
                });
            }, [errors, values, disableSubmitUI]);

            const refExtraInfo = useRef({});

            const onSubmit = async () => {
                let e;
                if (!ObjectUtils.isEmpty(errors)) {
                    e = errors;
                } else {
                    e = await validateForm();
                }
                if (ObjectUtils.isEmpty(e)) {
                    handleSubmit();
                } else {
                    ObjectUtils.forEach(e, (key, value) => {
                        onSetFieldError(key, value);
                    });
                }
                return e;
            };

            const resetErrors = () => {
                setErrors({});
            };

            const onSetFieldError = (key, value) => {
                // @ts-ignore
                setHasSetFieldErrorThroughRef((prevState) => {
                    return [
                        ...prevState,
                        ...ArrayUtils.removeDuplicates([
                            ...hasSetFieldErrorThroughRef,
                            key,
                        ]),
                    ];
                });
                setFieldError(key, value);
            };

            useImperativeHandle(
                ref,
                () => ({
                    get: (key) => {
                        return values[key];
                    },
                    getAll: () => {
                        return values;
                    },
                    set: (name, value) => {
                        setFieldValue(name, value).then(() => {
                            handleChange({
                                target: {
                                    name: name,
                                    value: value,
                                    type: "text",
                                },
                            });
                            setFieldTouched(name, true, true);
                        });
                    },
                    setFieldError: onSetFieldError,
                    submit: onSubmit,
                    resetErrors,
                    getExtraInfo: (name) => {
                        return refExtraInfo?.current?.[name];
                    },
                    scrollToInput: (name) => {
                        tryToScrollIntoInput(name);
                    },
                }),
                [errors, values]
            );

            return (
                <KeyboardWrapper
                    centerVertical={false}
                    ref={(instance) => {
                        keyboardAvoidingViewRef.current = instance;
                        keyboardAwareModal?.ref?.(instance);
                    }}
                    {...(keyboardAwareModal || {
                        paddingBottom: 0,
                        paddingTop: 0,
                    })}
                    style={[
                        keyboardAwareModal?.style || {},
                    ]}
                >
                    <View style={props.style}>
                        {/*@ts-ignore*/}
                        {props.children({
                            wrapIt: (name, Input) => {
                                const nextName = getNextName(name);
                                const p = buildAllProps(name, nextName);
                                if (typeof Input === "function") {
                                    Input = Input(p);
                                }
                                return React.cloneElement(
                                    Input as any,
                                    {
                                        ...p,
                                        // @ts-ignore
                                        ...(Input.props as any),
                                    }
                                );
                            },
                            addExtraInfo: (
                                name: string,
                                info: {
                                    key: string;
                                    value: any;
                                }
                            ) => {
                                const old =
                                    {} || refExtraInfo?.current?.[name];
                                refExtraInfo.current[name] = {
                                    ...old,
                                    [info.key]: info.value,
                                };
                            },
                            inputProps: (name) => {
                                const nextName = getNextName(name);
                                return buildAllProps(name, nextName);
                            },
                            submit: onSubmit,
                            values,
                            errors,
                            disableSubmitUI,
                        }) || null}
                    </View>
                </KeyboardWrapper>
            );
        }
    )
})();

export default Form;
