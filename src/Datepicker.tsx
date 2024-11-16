import React, {useState, useRef, useEffect} from "react";
import {Box, makeStyles, palette, Text} from "../../Constants/Theme";
import {Button} from "./Button";
import {Dimensions, Modal, TouchableOpacity, View, Animated} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import PersianDatePicker from "./PersianDatePicker";
import {useSelector} from "react-redux";
import Icon from "react-native-remix-icon";

interface DatepickerProps {
    title: string;
    placeholder: string;
    selectedDate: string | null;
    onDateSelect: (date: string) => void;
    type?: 'default' | 'primary' | 'international' | 'future';
}

const {height, width} = Dimensions.get('window');

const Datepicker: React.FC<DatepickerProps> = ({title, placeholder, selectedDate, onDateSelect, type}) => {
    const styles = useStyles();
    const {theme} = useSelector((state: any) => state.themeReducer);
    const [modalVisible, setModalVisible] = useState(false);
    const [format, setFormat] = useState<{ formattedDate?: string }>({});
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const titleAnimation = useRef(new Animated.Value(0)).current; // Animation value for the title

    const handleDateConfirm = (year: number, month: number, day: number) => {
        const formattedDate = `${year}.${month}.${day}`;
        setFormat({formattedDate});
        setModalVisible(false);
        onDateSelect(formattedDate);
    };

    useEffect(() => {
        Animated.timing(titleAnimation, {
            toValue: selectedDate ? 1 : 0, // 1 moves the title up, 0 moves it back down
            duration: 100,
            useNativeDriver: true,
        }).start();
    }, [selectedDate]);

    const handleButtonPress = () => {
        setModalVisible(true);
        setIsButtonPressed(true);
    };

    const labelColor = titleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [palette.grey400, palette.grey800], // Change color from black to grey
        extrapolate: 'clamp',
    });

    return (
        <GestureHandlerRootView>
            <Box my='l'>
                <Box flexDirection='row' style={[styles.inputContainer]}>
                    <TouchableOpacity style={{width: '95%'} as any} onPress={handleButtonPress}>
                        <Animated.View
                            style={{
                                position: 'absolute',
                                top: -4,
                                transform: [{ translateY: titleAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }]
                            } as any}
                        >
                            <Animated.Text style={[styles.inputTitle, {color: selectedDate ? palette.grey700 : labelColor}]}>
                                {title}
                            </Animated.Text>
                        </Animated.View>
                        <Text style={styles.textinfo}>
                            {selectedDate ? (selectedDate?.split("T")[0]) : null}
                        </Text>
                    </TouchableOpacity>
                    <Icon
                        name={'ri-arrow-down-s-line'}
                        type="ionicon"
                        color={palette.grey400}
                        size={20}
                    />
                </Box>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(!modalVisible)}
                >
                    <Box style={styles.centeredView}>
                        <Box position={'absolute'} bottom={0} backgroundColor={'White'} style={styles.modalView}>
                            <View style={styles.line}/>
                            <TouchableOpacity style={{width: '100%', paddingLeft: 40}}
                                              onPress={() => setModalVisible(!modalVisible)}>
                                <Icon name={'ri-close-line'} color={palette.darkgreen} size={20}/>
                            </TouchableOpacity>
                            <PersianDatePicker
                                startYear={1310}
                                onConfirm={handleDateConfirm}
                                type={type || "default"}
                                endYear={type === 'future' ? 2090 : undefined}
                            />
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </GestureHandlerRootView>
    );
};

const useStyles = makeStyles((theme) => ({
    textinfo: {
        fontFamily: 'Peyda-Medium',
        fontSize: 14,
        color: palette.black,
        textAlign: "left",

    },
    inputTitle: {
        fontFamily: 'Vazirmatn-Medium',
        width: '100%',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(96,96,96,0.45)',
    },
    modalView: {
        borderRadius: 20,
        alignItems: "center",
        // height: '35%',
        height:'80%'
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: 'grey',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 2,
    },
    inputView: {
        width: '100%',
        height: 'auto',
        flexDirection: 'column',
    },
    textInput: {
        fontFamily: 'Vazirmatn-Medium',
        justifyContent: 'space-between',
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        fontSize: 16,
        borderRadius: 12,
        paddingHorizontal: 20,
        height: 48,
        borderWidth: 1,
        borderColor: palette.grey100,
        backgroundColor: palette.white,
    },
}));

export {Datepicker};
