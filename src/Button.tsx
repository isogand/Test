import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, View, TextStyle, ViewStyle, ActivityIndicator} from 'react-native';
import Icon from 'react-native-remix-icon';
import {SvgXml} from 'react-native-svg';
import {Text} from '../../Constants/Theme.tsx';
import colors from '../../Constants/Colors';

interface CustomButtonProps {
    title?: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle | TextStyle[];
    width?: number | string;
    height?: number;
    backgroundColor?: string;
    borderRadius?: number;
    iconName?: string;
    iconSecondName?: string;
    iconSize?: number;
    iconColor?: string;
    textColor?:string;
    variant?: 'default' | 'primary';
    disabled?: boolean;
    svg?: boolean;
    svgname?: string;
    loading?: boolean;
    // New disabled state styles
    disabledIconColor?: string;
    disabledTextColor?: string;
    disabledBackgroundColor?: string;
    hoverBackgroundColor?: string; // New hover background color
    loadingColor?: string;
}

const Button: React.FC<CustomButtonProps> = ({
                                                 title,
                                                 onPress,
                                                 style,
                                                 textStyle,
                                                 width,
                                                 height,
                                                 backgroundColor,
                                                 borderRadius,
                                                 iconName,
                                                 iconSize,
                                                 iconColor,
                                                 iconSecondName,
                                                 variant,
                                                 disabled = false,
                                                 svg = false,
                                                 svgname,
                                                 loading = false,
                                                 // New disabled state styles
                                                 disabledIconColor,
                                                 disabledTextColor,
                                                 disabledBackgroundColor,
                                                 // New hover state styles
                                                 hoverBackgroundColor, // Default hover color
                                                 loadingColor,
                                                 textColor
                                             }) => {
    const [isHovered, setIsHovered] = useState(false); // State for hover

    const background = variant === 'primary' ? undefined : undefined;
    const color = variant === 'primary' ? colors.backgroundDark : colors.textPlaceholder;

    const appliedBackgroundColor = disabled
        ? disabledBackgroundColor
        : isHovered
            ? hoverBackgroundColor
            : backgroundColor || (variant ? background : undefined);

    const appliedIconColor = disabled ? disabledIconColor : iconColor || 'white';
    const appliedTextColor = disabled ? disabledTextColor : textColor || 'white';

    return (
        variant ? (
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.container, style,
                    {backgroundColor: appliedBackgroundColor, width,height,borderRadius}as any]}
                onPressIn={() => setIsHovered(true)}
                onPressOut={() => setIsHovered(false)}
                onPress={loading || disabled ? undefined : onPress}
            >
                {svg && svgname && (
                    <SvgXml xml={svgname} width={24} height={24}/>
                )}

                {(iconName && !loading) && (
                    <Icon name={iconName} size={iconSize || 16} color={appliedIconColor}/>
                )}
                <Text style={[styles.text, textStyle, { color: appliedTextColor }]}>{title}</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
                activeOpacity={1}
                style={[
                    styles.button,
                    style,
                    {
                        backgroundColor: appliedBackgroundColor,
                        width,
                        height,
                    } as any,
                ]}
                onPress={loading || disabled ? undefined : onPress}
                disabled={loading || disabled}
                onPressIn={() => setIsHovered(true)} // Set hovered state
                onPressOut={() => setIsHovered(false)} // Reset hovered state
            >
                <>
                    {svg && svgname && (
                        <SvgXml xml={svgname} width={22} height={22}/>
                    )}

                    {(iconName && !loading) && (
                        <Icon name={iconName} size={iconSize || 16} color={appliedIconColor}/>
                    )}
                    {loading && (
                        <View
                            style={{
                                marginHorizontal: width / 2, marginVertical: height / 2, justifyContent: 'center',
                                alignItems: 'center',
                            }as any}
                        >
                            <ActivityIndicator  size="small" color={loadingColor}/>
                        </View>
                    )}
                    {!loading && <Text style={[styles.text, textStyle , { color: appliedTextColor }]}>{title}</Text>}

                    {(iconSecondName && !loading) && (
                        <Icon name={iconSecondName} size={iconSize || 16} color={appliedIconColor}/>
                    )}
                </>
            </TouchableOpacity>
        )
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    text: {
        fontSize: 14,
        fontFamily: 'Peyda-Bold',
        paddingHorizontal: 4,
    },
    container: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 3,
        paddingVertical: 4,
        lineHeight: 18,
    },
});

export {Button};
