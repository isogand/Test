import React from "react";
import {Dimensions, Platform, StatusBar, StyleSheet, TouchableOpacity, View} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {Box, palette, Text} from "../../Constants/Theme";
import Icon from "react-native-remix-icon";
import {useSelector} from "react-redux";
import colors from "../../Constants/Colors";
import Colors from "../../Constants/Colors";
import {Button} from "./Button.tsx";

interface HeaderProps {
    left?: {
        icon?: any;
        onPress: () => void;
        text?: string; // Optional text for left icon
        iconColor?: string;
        textColor?:string;
    };
    title?: string;
    right?: {
        icon?: any;
        onPress: () => void;
        text?: string; // Optional text for right icon
        iconColor?: string;
        textColor?:string;
    };
    dark: boolean;
    variant?: "default" | "primary" | "special" | "secondary" ;
}

const {height, width} = Dimensions.get('window');

const Header = ({left, title, right, dark, variant}: HeaderProps) => {
    const insets = useSafeAreaInsets();
    const {isDarkMode, theme} = useSelector((state: any) => state.themeReducer);

    const styles = StyleSheet.create({
        title: {
            color: theme.PRIMARY_TEXT_COLOR,
        },
    });

    const headerStyle = variant === "primary" ? {paddingTop: insets.top + 10} : {marginTop: insets.top};

    return (
        <>
            <StatusBar barStyle={"dark-content"}/>
            {variant === "special" ? (
                <Box flexDirection={'row'} justifyContent={'space-between'} m={'m'} >
                    {title && (
                        <Box flexDirection={'row'} alignItems={'center'}>
                            {right && (
                                <Box flexDirection="row" alignItems="center">
                                    <Icon
                                        name={right.icon}
                                        iconRatio={0.4}
                                        onPress={right.onPress}
                                        size={18}
                                        align="center"
                                        color={isDarkMode ? 'white' : colors.bag6Bg}
                                    />
                                    {right.text && (
                                        <Text style={{color: isDarkMode ? 'white' : colors.bag6Bg, marginLeft: 5}}>
                                            {right.text}
                                        </Text>
                                    )}
                                </Box>
                            )}
                            <Text
                                style={{
                                    color: isDarkMode ? 'white' : colors.bag6Bg,
                                    fontFamily: 'Vazirmatn-Medium',
                                }}
                                variant={'title6'}
                            >
                                {title.toUpperCase()}
                            </Text>
                        </Box>
                    )}
                    {left && (
                        <TouchableOpacity onPress={left.onPress}>
                            <Box p='sm' flexDirection="row" alignItems="center">
                                {left.icon && <Icon
                                    name={left.icon}
                                    iconRatio={0.4}
                                    size={30}
                                    align="center"
                                    color={isDarkMode ? 'white' : colors.bag6Bg}
                                />}
                                {left.text && (
                                    <Text style={{color: isDarkMode ? 'white' : colors.bag6Bg, marginLeft: 5}}>
                                        {left.text}
                                    </Text>
                                )}
                            </Box>
                        </TouchableOpacity>
                    )}
                </Box>
            ) : (
                <Box
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    padding="xl"
                    borderBottomWidth={0.5}
                    backgroundColor='White'
                    borderBottomColor='Grey200'
                    style={{...headerStyle}}
                    {...(Platform.OS === "android" && {paddingTop: 'm'})}
                >
                    {right ? (
                        <TouchableOpacity onPress={right.onPress}>
                            <Box flexDirection="row" alignItems="center">
                                {right.icon &&<Icon
                                    name={right.icon}
                                    iconRatio={0.4}
                                    size={24}
                                    align="center"
                                    color={right.iconColor? right.iconColor : palette.black}
                                />}
                                {right.text && (
                                    <Text variant={'BodyTitle1Second'} style={{color: right.textColor ? right.textColor : palette.black, marginLeft: 5}}>
                                        {right.text}
                                    </Text>
                                )}
                            </Box>
                        </TouchableOpacity>
                    ):(<Box/>)}
                    {title && (
                        <Text style={{color: palette.black,marginRight: 15}} variant='BodyTitle1Second'>
                            {title.toUpperCase()}
                        </Text>
                    )}
                    {left ? (
                        <TouchableOpacity onPress={left.onPress}>
                            <Box flexDirection="row" alignItems="center">
                                {left.icon &&<Icon
                                    name={left.icon}
                                    iconRatio={0.4}
                                    size={24}
                                    align="center"
                                    color={left.iconColor? left.iconColor : palette.black}
                                />}
                                {left.text && (
                                    <Text variant={'BodyTitle2Third'} style={{color: left.textColor ? left.textColor : palette.black, marginLeft: 5}}>
                                        {left.text}
                                    </Text>
                                )}
                            </Box>
                        </TouchableOpacity>
                    ):(
                        <Box/>
                    )}
                </Box>
            )}
        </>
    );
};

interface HeaderNavProps {
    onPress:() => void;
    title:string;
}
export const HeaderNav =({onPress,title}:HeaderNavProps)=> {
   return (
       <>
           <Box flexDirection='row' alignItems='center' justifyContent='space-between' py='xl' mx='xl'
                width='93%'>
               <Icon name={'ri-close-line'} size={24} color={'black'} onPress={onPress}/>
               <Text variant='BodyTitle1Second' color='Black'>
                   {title}
               </Text>
               <Button title="" onPress={()=>true}/>
           </Box>

           <Box marginHorizontal='sm' width='100%' height='0.10%' backgroundColor='Grey100'/>
       </>
   )
}
Header.defaultProps = {dark: false};

export {Header};
