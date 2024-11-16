
// Any project using this library should have a global theme object which
// specifies a set of values for spacing, colors, breakpoints, and more
// website https://shopify.github.io/restyle/

import Colors from "./Colors";
import React, { ReactNode } from "react";
import { ViewStyle, TextStyle, ImageStyle} from "react-native";
import {
    createTheme,
    createText,
    createBox,
    useTheme as useReTheme,
    ThemeProvider as ReStyleThemeProvider,
} from "@shopify/restyle";
import colors from "./Colors";


export const palette = {
    white: '#FFFFFF',
    black: '#111111',

    // Primary Colors
    primary50: '#D5EBEE',
    primary100: '#A6D2D8',
    primary200: '#73B5BD',
    primary300: '#32858F',
    primary400: '#20656F',
    primary500: '#004953',
    primary600: '#00383F',
    primary700: '#00282D',
    primary800: '#002024',
    primary900: '#00181B',

    // Secondary Colors
    secondary50: '#FAF5E7',
    secondary100: '#F2EAD0',
    secondary200: '#EADEBA',
    secondary300: '#DBCB9C',
    secondary400: '#C8B377',
    secondary500: '#B49C56',
    secondary600: '#937F41',
    secondary700: '#6F5F31',
    secondary800: '#4A3F20',
    secondary900: '#252010',

    // Grey Colors
    grey50: '#F7F7F7',
    grey100: '#E1E1E1',
    grey200: '#CFCFCF',
    grey300: '#B1B1B1',
    grey400: '#9E9E9E',
    grey500: '#7E7E7E',
    grey600: '#626262',
    grey700: '#525152',
    grey800: '#3B3B3B',
    grey900: '#222222',

    input: '#d000ff',
    primary: '#ff0062',
    // Status Colors
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#1677FF',
};

const theme = createTheme({
    colors: {
        White: palette.white,
        Black: palette.black,

        // Primary Colors
        Primary50: palette.primary50,
        Primary100: palette.primary100,
        Primary200: palette.primary200,
        Primary300: palette.primary300,
        Primary400: palette.primary400,
        Primary500: palette.primary500,
        Primary600: palette.primary600,
        Primary700: palette.primary700,
        Primary800: palette.primary800,
        Primary900: palette.primary900,

        // Secondary Colors
        Secondary50: palette.secondary50,
        Secondary100: palette.secondary100,
        Secondary200: palette.secondary200,
        Secondary300: palette.secondary300,
        Secondary400: palette.secondary400,
        Secondary500: palette.secondary500,
        Secondary600: palette.secondary600,
        Secondary700: palette.secondary700,
        Secondary800: palette.secondary800,
        Secondary900: palette.secondary900,

        // Grey Colors
        Grey50: palette.grey50,
        Grey100: palette.grey100,
        Grey200: palette.grey200,
        Grey300: palette.grey300,
        Grey400: palette.grey400,
        Grey500: palette.grey500,
        Grey600: palette.grey600,
        Grey700: palette.grey700,
        Grey800: palette.grey800,
        Grey900: palette.grey900,

        // Status Colors
        Success: palette.success,
        Warning: palette.warning,
        Error: palette.error,
        Info: palette.info,

        //Test
        Input: palette.input,
        Primary: palette.primary,
    },
    breakpoints: {
        phone: 0,
        longPhone: {
            width: 0,
            height: 812,
        },
        tablet: 768,
        largeTablet: 1024,
    },
    spacing: {
        s: 2,
        sm:4,
        m: 8,
        l: 12,
        xl: 16,
        xxl:20,
        '2xl':24 ,
        '3xl': 32,
        '4xl': 40,
        '5xl': 48,
        '6xl': 56,
        '7xl': 64,
        '8xl': 72,
        '9xl': 80,
        '10xl': 96,
        '11xl': 128,
    },
    borderRadii: {
        s: 2,
        sm:4,
        m: 8,
        l: 10,
        xl: 16,
        xxl:20,
        '2xl':24 ,
        '3xl': 32,
        '4xl': 40,
        '5xl': 48,
        '6xl': 56,
        '7xl': 64,
        '8xl': 72,
        '9xl': 80,
        '10xl': 96,
        '11xl': 128,
    },
    textVariants: {
        variant:{},
        defaults: {},
        hero: {
            fontSize: 11,
            fontFamily:'Vazirmatn-Bold',
            color:'White'
        },
        title1: {
            fontSize: 10,
            fontFamily:'Vazirmatn-Regular',
            color:'Info'
        },
        title2: {
            fontSize: 10,
            fontFamily:'Vazirmatn-Medium',
            color:'Info'
        },
        title3: {
            fontFamily:'Vazirmatn-Bold',
            fontSize: 12,
            color:'Info'
        },
        title4: {
            fontFamily:'Vazirmatn-SemiBold',
            fontSize: 12,
            color:'Info'
            // lineHeight: 30,
        },
        title5: {
            fontFamily:'Vazirmatn-Medium',
            fontSize: 12,
            color:'Info'
        },
        title6: {
            fontSize: 15,
            fontFamily:'Vazirmatn-Bold',
            color:'Info'
        },
        title7: {
            fontSize: 18,
            fontFamily:'Vazirmatn-Bold',
            color:'Input'
        },
        title8: {
            fontSize: 12,
            fontFamily:'Vazirmatn-Bold',
            color:'Error'
        },
        title9: {
            fontSize: 18,
            fontFamily:'Vazirmatn-Bold',
            color:'Info'
        },
        title10: {
            fontSize: 14,
            fontFamily:'Vazirmatn-Bold',
            color:'Error'
        },
        title11: {
            fontSize: 16,
            fontFamily:'Vazirmatn-Bold',
            color:'Success'
        },
        title12: {
            fontSize: 14,
            fontFamily:'Vazirmatn-Bold',
            color:'Info'
        },
        title13: {
            fontSize: 13,
            fontFamily:'Vazirmatn-Medium',
            color:'Info'
        },
        body: {
            fontFamily:'Vazirmatn-Thin',
            fontSize: 14,
            color:'Info'

        },
        button: {
            fontFamily:'Vazirmatn-Medium',
            fontSize: 18,
        },

        TitleH1: {
            fontFamily:'Peyda-Bold',
            fontSize: 28,
        },
        TitleH2: {
            fontFamily:'Peyda-Bold',
            fontSize: 24,
        },
        TitleH3: {
            fontFamily:'Peyda-Bold',
            fontSize: 20,
        },
        TitleH4: {
            fontFamily:'Peyda-Bold',
            fontSize: 18,
        },
        TitleH5: {
            fontFamily:'Peyda-SemiBold',
            fontSize: 18,
        },
        BodyTitle1First: {
            fontFamily:'Peyda-Bold',
            fontSize: 16,
        },
        BodyTitle1Second: {
            fontFamily:'Peyda-SemiBold',
            fontSize: 16,
        },
        BodyTitle1Third: {
            fontFamily:'Peyda-Medium',
            fontSize: 16,
        },
        BodyTitle1Fourth: {
            fontFamily:'Peyda-Regular',
            fontSize: 16,
        },
        BodyTitle2First: {
            fontFamily:'Peyda-Bold',
            fontSize: 14,
        },
        BodyTitle2Second: {
            fontFamily:'Peyda-SemiBold',
            fontSize: 14,
        },
        BodyTitle2Third: {
            fontFamily:'Peyda-Medium',
            fontSize: 14,
        },
        BodyTitle2Fourth: {
            fontFamily:'Peyda-Regular',
            fontSize: 14,
        },
        Body3First: {
            fontFamily:'Peyda-Medium',
            fontSize: 12,
        },
        Body3Second: {
            fontFamily:'Peyda-Regular',
            fontSize: 12,
            // tablet: {
            //     fontSize: 18, // Larger font size for tablet
            // },
        },
        CaptionFirst: {
            fontFamily:'Peyda-Medium',
            fontSize: 10,
        },
        CaptionSecond: {
            fontFamily:'Peyda-Regular',
            fontSize: 10,
        },
    },
});


export const ThemeProvider = ({ children }: { children: ReactNode }) => (
    <ReStyleThemeProvider {...{ theme }}>{children}</ReStyleThemeProvider>
);
export type Theme = typeof theme;
export const Box = createBox<Theme>();
export const Text = createText<Theme>();
// export const Image = createImage<Theme>();
export const useTheme = () => useReTheme<Theme>();

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export const makeStyles = <T extends NamedStyles<T>>(
    styles: (theme: Theme) => T
) => () => {
    const currentTheme = useTheme();
    return styles(currentTheme);
};

export const darkTheme = {
    mode:'dark',
    PRIMARY_BACKGROUND_COLOR : Colors.backgroundDark,
    SECONDARY_BACKGROUND_COLOR : Colors.primaryDark,
    PRIMARY_TEXT_COLOR: Colors.textPrimaryDark,
    PRIMARY_TEXTINPUTITEM_COLOR: Colors.textPrimaryDark,
    SECONDARY_TEXT_COLOR: Colors.textSecondaryDark,
    PRIMARY_BUTTON_COLOR: Colors.secondaryDark,
    PRIMARY_BUTTON_TEXT_COLOR: Colors.textPrimaryDark,
    STATUS_BAR_STYLE: Colors.backgroundDark,
    BOTTOM_TAB_BACKGROUND: Colors.primaryDark,
    BOTTOM_TAB_ICON_COLOR: Colors.gray,
    BOTTOM_TAB_ICON_BACK: Colors.backgroundDark,
    BOTTOM_TAB_TEXT: Colors.white,
    LIST_ITEM_COLOR: Colors.primaryDark,
    CAROUSEL_ITEM_COLOR: Colors.primaryDark,
    INPUT_ITEM_COLOR : Colors.primaryDark,
    PRIMARY_BACKGROUNDPROFILE_COLOR : Colors.darkGray,
    PRIMARY_BACKGROUNDPROFILEFILD_COLOR : Colors.darkGray,
    TOGGLE_TITLE : Colors.white,
    TOGGLE_ACTIVE_TITLE : Colors.backgroundDark,
    BIO_DETAILS_ITEMS_BACKGROUND : Colors.dark,
    PRIMARY_DARK : Colors.textPlaceholder,
    TEXT_PRIMARY_DARK:Colors.textPrimaryLight
}

export const lightTheme = {
    mode:'light',
    PRIMARY_BACKGROUND_COLOR : Colors.backgroundLight,
    SECONDARY_BACKGROUND_COLOR : Colors.primaryLight,
    PRIMARY_TEXT_COLOR: Colors.textPrimaryLight,
    PRIMARY_TEXTINPUTITEM_COLOR: Colors.grey,
    SECONDARY_TEXT_COLOR: Colors.textSecondaryLight,
    PRIMARY_BUTTON_COLOR: Colors.secondaryLight,
    PRIMARY_BUTTON_TEXT_COLOR: Colors.textPrimaryDark,
    STATUS_BAR_STYLE: Colors.backgroundLight,
    BOTTOM_TAB_BACKGROUND: Colors.white,
    BOTTOM_TAB_ICON_COLOR: Colors.gray,
    BOTTOM_TAB_ICON_BACK: Colors.primaryLight,
    BOTTOM_TAB_TEXT: Colors.primaryLight,
    LIST_ITEM_COLOR: Colors.grey_light,
    CAROUSEL_ITEM_COLOR: Colors.background,
    INPUT_ITEM_COLOR : Colors.grey,
    PRIMARY_BACKGROUNDPROFILE_COLOR : Colors.backgroundLight,
    PRIMARY_BACKGROUNDPROFILEFILD_COLOR : Colors.textPrimaryLight,
    TOGGLE_TITLE : Colors.darkGray,
    TOGGLE_ACTIVE_TITLE : Colors.backgroundDark,
    BIO_DETAILS_ITEMS_BACKGROUND : Colors.grey,
    PRIMARY_DARK : Colors.textSecondaryDark,
    TEXT_PRIMARY_DARK : Colors.backgroundLight
}
