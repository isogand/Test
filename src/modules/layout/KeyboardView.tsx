import React, {forwardRef} from "react";
import {Platform, ScrollView, View, ViewProps} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const KeyboardViewExpo = forwardRef(
    (
        {
            centerVertical,
            extraHeight,
            extraScrollHeight,
            paddingBottom,
            paddingTop,
            style,
            children,
            ...props
        }: {
            centerVertical?: boolean;
            extraHeight?: number;
            extraScrollHeight?: number;
            children?: any;
            style?: ViewProps["style"];
            paddingTop: number;
            paddingBottom: number;
        } & ScrollView["props"],
        ref
    ) => {
        const shouldBeCentered = centerVertical;
        const arg = shouldBeCentered ? {flex: 1, justifyContent: "center"} : {};
        const argIOS = shouldBeCentered
            ? {flexGrow: 1, justifyContent: "center"}
            : {};

        // if (Platform.OS === "android" && false) {
        //     return (
        //         // <ScrollView
        //         //     style={{width: "100%"}}
        //         //     contentContainerStyle={{
        //         //         width: "100%",
        //         //         flexGrow: 1,
        //         //         paddingTop: paddingTop,
        //         //         paddingBottom: paddingBottom,
        //         //     }}
        //         //     showsHorizontalScrollIndicator={false}
        //         //     showsVerticalScrollIndicator={false}
        //         //     {...props}
        //         //     ref={undefined}
        //         // >
        //         <KeyboardAwareScrollView
        //             innerRef={(r) => {
        //                 if (ref) {
        //                     // ref["current"] = r;
        //                 }
        //             }}
        //             // @ts-ignore
        //             ref={ref}
        //             {...props}
        //             showsHorizontalScrollIndicator={false}
        //             showsVerticalScrollIndicator={false}
        //             extraHeight={extraHeight}
        //             extraScrollHeight={75 + (extraScrollHeight || 0)}
        //             style={[
        //                 {width: "100%"},
        //                 // @ts-ignore
        //                 {backgroundColor: props?.style?.backgroundColor},
        //             ]}
        //             enableOnAndroid={true}
        //             enableResetScrollToCoords={true}
        //             contentContainerStyle={[
        //                 style as any,
        //                 argIOS,
        //                 {
        //                     paddingTop,
        //                     paddingBottom,
        //                 },
        //             ]}
        //         >
        //             {children}
        //         </KeyboardAwareScrollView>
        //         //                </ScrollView>
        //     );
        // } else if (Platform.OS === "ios") {
        return (
            <KeyboardAwareScrollView
                innerRef={(r) => {
                    if (ref) {
                        // ref["current"] = r;
                    }
                }}
                // @ts-ignore
                ref={ref}
                {...props}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                extraHeight={extraHeight}
                extraScrollHeight={75 + (extraScrollHeight || 0)}
                style={[
                    {width: "100%"},
                    // @ts-ignore
                    {backgroundColor: props?.style?.backgroundColor},
                    {marginBottom:200}
                ]}
                enableOnAndroid={true}
                enableResetScrollToCoords={true}
                contentContainerStyle={[
                    style as any,
                    argIOS,
                    // {
                    //     paddingTop,
                    //     paddingBottom,
                    // },
                ]}
            >
                <View
                    style={{
                        paddingTop,
                        paddingBottom,
                    }}
                >
                    {children}
                </View>
            </KeyboardAwareScrollView>
        );
        // }
        return <View />;
    }
);

export default KeyboardViewExpo;
