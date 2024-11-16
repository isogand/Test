import React, { useEffect, useRef } from 'react';
import {View, Switch as RNSSwitch, SwitchProps, Animated, I18nManager} from 'react-native';
import { palette } from "../../Constants/Theme.tsx";

interface CustomSwitchProps extends SwitchProps {
    isEnabled: boolean;
    onToggle: () => void;
    disabled?: boolean;
    trackColor?: { false: string; true: string };
    thumbColor?: string;
}

const Switch: React.FC<CustomSwitchProps> = ({
                                                 isEnabled,
                                                 onToggle,
                                                 disabled = false,
                                                 trackColor = { false: palette.primary500, true: palette.grey400 }, // default colors
                                                 thumbColor = '#f8f8f8',
                                             }) => {
    const animatedValue = useRef(new Animated.Value(isEnabled ? 0 : 1)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isEnabled ? 0 : 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isEnabled]);

    const interpolatedTrackColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [
            disabled ? palette.grey100 : trackColor.false || palette.primary500,
            disabled ? palette.grey100 : trackColor.true || palette.grey400,
        ],
    });

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' ,transform: [{ scale: 0.8 }]} as any}>
            <Animated.View
                style={{
                    backgroundColor: interpolatedTrackColor,
                    borderRadius: 16,
                }}
            >
                <RNSSwitch
                    trackColor={{ false: 'transparent', true: 'transparent' }}
                    thumbColor={isEnabled ? thumbColor : '#f4f3f4'}
                    onValueChange={disabled ? undefined : onToggle}
                    value={isEnabled}
                    disabled={disabled}
                />
            </Animated.View>
        </View>
    );
};

export { Switch };
