import React, {useState} from "react";
import {Box, palette, Text, useTheme} from "../../Constants/Theme";
import {Button} from './Button';
import Icon from "react-native-remix-icon";
import {Modal, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {PassengerType} from "../../Constants/interfaces/IPassengerInfo";
import {useSelector} from "react-redux";
import Colors from "../../Constants/Colors";

interface CheckboxGroupProps {
    options: { value: string; label: string }[];
    setGender: React.Dispatch<React.SetStateAction<string>>;
    gender: string;
}

const CheckboxGroup = ({options, setGender, gender}: CheckboxGroupProps) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const selectedGender = options.find(option => option.value === gender)?.label;

    return (
        <Box mb='l'>
            {/* Display box like TextInput */}
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.inputContainer}>
                <Text style={[styles.label,{color: selectedGender?palette.grey800 : palette.grey400}]}>
                    {selectedGender ? selectedGender : 'جنسیت*'}
                </Text>
                <Icon
                    name={'ri-arrow-down-s-line'}
                    type="ionicon"
                    color={palette.grey400}
                    size={20}
                />
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                style={styles.modalContainer}
            >
                <Box
                    style={styles.contentContainer}
                >
                    <Box
                        width="90%"
                        backgroundColor="White"
                        padding="xl"
                        borderRadius='l'
                        shadowOpacity={0.25}
                        shadowRadius={4}
                        shadowColor="Grey200"
                        shadowOffset={{width: 0, height: 2}}
                    >
                        {options.map(({value, label}, index) => (
                            <TouchableOpacity
                                key={value}
                                onPress={() => {
                                    setGender(value);
                                    setModalVisible(false);
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 10,
                                    justifyContent: 'space-between',
                                    borderBottomWidth: index === options.length - 1 ? 0 : 1, // No border for last item
                                    borderBottomColor: palette.grey100,
                                } as any}
                            >
                                <Text variant='BodyTitle2Third'>{label}</Text>
                                <Icon
                                    name={gender === value ? 'ri-radio-button-line' : 'ri-checkbox-blank-circle-line'}
                                    type="ionicon"
                                    color={gender === value ? Colors.primary : palette.grey400}
                                    size={20}
                                    style={{marginRight: 10}}
                                />

                            </TouchableOpacity>
                        ))}
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)', // Add the backdrop-filter property
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
        marginTop:16
    },
    label:{
        left: 5,
        fontFamily: "Peyda-SemiBold",
        zIndex: 10,
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 4,
    }
})
export default CheckboxGroup;
