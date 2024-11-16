import React, {forwardRef, useEffect, useRef, useState} from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewProps
} from "react-native";
import {SGFormCustomInputProps} from "./Form/Form";
import {useSelector} from "react-redux";
import {SvgXml} from "react-native-svg";
import {palette} from "../../../Constants/Theme.tsx";

type Props = {
    toUpperCase?: boolean;
    textInputProps: React.ComponentProps<typeof TextInput> & SGFormCustomInputProps;
    containerStyle?: ViewProps["style"];
    style?: ViewProps["style"];
    placeholder?: string;
    editable?: boolean;
    placeholderTextColor?: string;
    variant?: "default" | "primary" | "special" | "locked" | "secondary" | "fourth";  // New variant 'locked'
    keyboardType?: string;
    label?: string;
    secureTextEntry?: boolean;
    disabled?: boolean;
    onPress?: () => void; // Add onPress prop
    iconOnPress?: () => void;
    leftIcon?: string; // New prop for left icon
    rightIcon?: string; // New prop for right icon
    iconMode?: "both" | "left" | "right" | "none"; // New icon mode prop
    height?: number;
};

const CustomInput = forwardRef((props: Props, ref: any) => {
    const {
        value,
        error,
        touched,
        variant,
        disabled = props.disabled,
    } = props.textInputProps;

    const {theme, isDarkMode} = useSelector((state: any) => state.themeReducer);
    const [hack, setHack] = useState(0);
    const [hasContent, setHasContent] = useState(!!props.textInputProps.value);

    const borderColor = (touched && hasContent) ? (error ? palette.error : palette.grey100) : palette.grey100;
    const textAlign = props.variant === 'primary' || props.variant === 'special' || props.variant === 'secondary' || props.variant === 'fourth' ? 'right' : 'left';
    const textAlignTitle = props.variant === 'primary' || props.variant === 'locked' || props.variant === 'fourth' ? 'left' : 'right';
    const titleAnimation = useRef(new Animated.Value(0)).current; // Animation value for the title

    useEffect(() => {
        setTimeout(() => {
            setHack(1);
        }, 500);
    }, [value]);

    useEffect(() => {
        if (hasContent) {
            handleFocus();
        } else {
            handleBlur();
        }
    }, [hasContent]);
    const labelColor = titleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [palette.grey400, palette.grey700], // Change color from black to grey
        extrapolate: 'clamp',
    });
    const handleFocus = () => {
        if (!disabled && props.variant !== "locked") {
            Animated.timing(titleAnimation, {
                toValue: 1, // Animation on focus
                duration: 100,
                useNativeDriver: false, // Color cannot use native driver
                easing: Easing.out(Easing.ease),
            }).start();
        }
    };

    const handleBlur = () => {
        if (!hasContent) {
            Animated.timing(titleAnimation, {
                toValue: 0, // Reset animation on blur
                duration: 100,
                useNativeDriver: false,
                easing: Easing.out(Easing.ease),
            }).start();
        }
    };
    useEffect(() => {
        if(touched){
            handleFocus()
        }
    }, [touched]);

    return (
        <View style={styles.inputView}>
            {props.variant === 'special' ? (
                <Animated.View style={[styles.container, {borderColor: borderColor}]}>
                    <Animated.View
                        style={[styles.labelContainer, {
                            transform: [{
                                translateY: titleAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -20]
                                })
                            }]
                        }] as any}
                    >
                        <Animated.Text
                            style={[
                                styles.label,
                                {
                                    backgroundColor: palette.white,
                                    color: disabled ? palette.grey200 : labelColor, // Apply interpolated color
                                },
                            ]}
                        >
                            {props.label}
                        </Animated.Text>
                    </Animated.View>
                    {props.leftIcon && (
                        <SvgXml xml={props.leftIcon} width={24} height={24} strokeOpacity={disabled ? 0.3 : 1}/>
                    )}
                    <TextInput
                        {...props.textInputProps}
                        onFocus={(e) => {
                            props.textInputProps?.onFocus?.(e);
                            handleFocus();
                        }}
                        onBlur={(e) => {
                            props.textInputProps?.onBlur?.(e);
                            handleBlur();
                        }}
                        key={hack}
                        ref={ref}
                        multiLine={true}
                        onChangeText={(text) => {
                            setHasContent(!!text);
                            if (!disabled) {
                                if (props.toUpperCase) {
                                    props.textInputProps.setFieldValue(text.toUpperCase());
                                } else {
                                    props.textInputProps.setFieldValue(text);
                                }
                            }
                        }}
                        value={props.textInputProps.value}
                        editable={!disabled}
                        placeholder={props.variant !== "special" ? props.placeholder : ""}
                        placeholderTextColor={disabled ? palette.grey200 : palette.grey400}
                        style={[
                            styles.input,
                            props.style,
                            {
                                borderColor: borderColor,
                                textAlign: textAlign,
                            },
                        ] as any}

                        keyboardType={props.keyboardType as any}
                        secureTextEntry={props.secureTextEntry}
                    />
                    {props.rightIcon && (
                        <SvgXml xml={props.rightIcon} width={24} height={24}
                                strokeOpacity={disabled ? 0.3 : 1}/>
                    )}
                </Animated.View>
            ) : (
                <>
                    {props.variant === "secondary" ? null :
                        <Text
                            style={[styles.label, {
                                textAlign: textAlignTitle,
                                color: disabled ? palette.grey200 : palette.grey800,
                            }] as any}
                        >
                            {props.label}
                        </Text>
                    }

                    {props.variant === "locked" ? (
                        <TouchableWithoutFeedback onPress={props.onPress}>
                            <View
                                style={[
                                    styles.inputContainer,
                                    {
                                        borderColor,
                                    },
                                ]}
                            >
                                {props.leftIcon && (
                                    <SvgXml xml={props.leftIcon} width={24} height={24}
                                            strokeOpacity={disabled ? 0.3 : 1}/>
                                )}
                                <Text style={[styles.placeholder, {
                                    color: theme.SECONDARY_TEXT_COLOR,
                                    width: '87%',
                                    textAlign: 'left'
                                }] as any}>{props.placeholder}</Text>
                                {props.rightIcon && (
                                    <SvgXml xml={props.rightIcon} width={24} height={24}
                                            strokeOpacity={disabled ? 0.3 : 1}/>
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    ) : (
                        <View
                            style={[
                                styles.inputContainer,
                                {
                                    borderColor,
                                    height: props.height || 48,
                                    backgroundColor: disabled ? palette.grey50 : (variant === "primary" ? theme.CAROUSEL_ITEM_COLOR : palette.white),
                                },
                            ]}
                        >
                            {props.leftIcon && (
                                <SvgXml xml={props.leftIcon} width={24} height={24}
                                        strokeOpacity={disabled ? 0.3 : 1}/>
                            )}
                            <TextInput
                                key={hack}
                                ref={ref}
                                {...props.textInputProps}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChangeText={(text) => {
                                    if (!disabled) {
                                        if (props.toUpperCase) {
                                            props.textInputProps.setFieldValue(text.toUpperCase());
                                        } else {
                                            props.textInputProps.setFieldValue(text);
                                        }
                                    }
                                }}
                                value={value}
                                editable={!disabled}
                                placeholder={props.variant !== "special" ? props.placeholder : ""}
                                placeholderTextColor={disabled ? palette.grey200 : palette.grey400}
                                style={[
                                    styles.textInput,
                                    props.style,
                                    {
                                        backgroundColor: disabled ? palette.grey50 : undefined,
                                        borderColor: borderColor,
                                        textAlign: textAlign,
                                        color: disabled ? palette.grey200 : palette.grey800,
                                    },
                                ] as any}
                                keyboardType={props.keyboardType as any}
                                secureTextEntry={props.secureTextEntry}
                            />
                            {props.variant === 'secondary' || props.variant === 'fourth' ? (
                                props.rightIcon && (
                                        <TouchableOpacity onPress={props.iconOnPress}>
                                            <SvgXml xml={props.rightIcon} width={24} height={24}
                                                    strokeOpacity={disabled ? 0.3 : 1}/>
                                        </TouchableOpacity>
                                    )
                            ):(
                                props.rightIcon && (
                                        <SvgXml xml={props.rightIcon} width={24} height={24}
                                                strokeOpacity={disabled ? 0.3 : 1}/>
                                    )
                            )}
                        </View>
                    )}
                </>
            )}
            {touched && error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
});

export default CustomInput;

const styles = StyleSheet.create({
    label: {
        // left: 5,
        fontFamily: "Peyda-SemiBold",
        zIndex: 10,
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 4,
        padding: 4
    },
    placeholder: {
        left: 5,
        fontFamily: "Peyda-Medium",
        zIndex: 10,
        fontSize: 14,
        lineHeight: 21,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 16,
        borderRadius: 12,
        paddingHorizontal: 20,
        marginBottom: 0,
        height: 48,
        borderWidth: 1,
        borderColor: palette.grey100,
        backgroundColor: palette.white,
    },
    textInput: {
        fontFamily: "Peyda-Regular",
        width: "85%",
        height: "100%",
        fontSize: 14,
        color: palette.grey700,
        backgroundColor: palette.white,
    },
    error: {
        marginTop: 5,
        marginLeft: 5,
        fontSize: 12,
        color: "red",
        textAlign: "left",
        fontFamily: "Peyda-Regular",
    },
    inputView: {
        width: "100%",
        height: "auto",
        flexDirection: "column",
        marginVertical: 8,
    },
    container: {
        backgroundColor: palette.white,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 16,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        // borderColor: palette.grey100,
    },
    input: {
        fontFamily: "Vazirmatn-Medium",
        width: "85%",
        height: "100%",
        fontSize: 14,
        color: palette.grey700,

    },
    labelContainer: {
        paddingHorizontal: 20,
        position: 'absolute',
        // alignItems:'flex-start'
    }
});
