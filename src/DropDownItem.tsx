import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Box, makeStyles, palette, Text, Theme } from "../../Constants/Theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Header } from "./Header";
import Icon from "react-native-remix-icon";
import {SearchBox} from "./SearchBox.tsx";

const { width } = Dimensions.get('window');

interface DropDownProps {
    title: string | undefined;
    placeholder?: string | undefined;
    items: Array<{ label: string, value: string }>;
    initialValue: string;
    itemSet: (item: any) => void;
    nationality: any;
}

const DropDownItem: React.FC<DropDownProps> = ({
                                                   title,
                                                   placeholder,
                                                   items,
                                                   initialValue,
                                                   itemSet,
                                                   nationality,
                                               }) => {
    const styles = useStyles();
    const { isDarkMode, theme } = useSelector((state: any) => state.themeReducer);
    const [modalVisible, setModalVisible] = useState(false);
    const [filteredItems, setFilteredItems] = useState(items);
    const [selectedItem, setSelectedItem] = useState(placeholder);

    // Animation for moving title up/down
    const titleAnimation = useRef(new Animated.Value(nationality ? 1 : 0)).current;

    const insets = useSafeAreaInsets();

    const handleSearch = (searchText: string) => {
        if (!searchText) {
            setFilteredItems(items);
        } else {
            const filtered = items.filter((item) => item.label.includes(searchText));
            setFilteredItems(filtered);
        }
    };

    const handleItemPress = (item: any) => {
        setSelectedItem(item.value);
        setModalVisible(false);
        itemSet(item);
        // setFieldValue('nationality', item.value);
    };

    // useEffect(() => {
    //     // Initialize nationality in the form
    //     setFieldValue("nationality", initialValue || placeholder);
    // }, [setFieldValue, initialValue, placeholder]);

    useEffect(() => {
        // Trigger animation when nationality is set or cleared
        Animated.timing(titleAnimation, {
            toValue: nationality ? 1 : 0, // 1 moves the title up, 0 moves it back down
            duration: 150,
            useNativeDriver: true,
        }).start();
    }, [nationality]);

    const handleButtonPress = () => {
        setModalVisible(true);
    };
    const labelColor = titleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [palette.grey400, palette.grey700], // Change color from black to grey
        extrapolate: 'clamp',
    });

    return (
        <Box my="xl" style={[styles.inputContainer]}>
            <Box flexDirection="row">
                <TouchableOpacity style={{ width: '95%' } as any} onPress={handleButtonPress}>
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: -4,
                            transform: [{ translateY: titleAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }]
                        } as any}
                    >
                        {/* Static color instead of animated */}
                        <Animated.Text
                            style={[
                                styles.inputTitle,
                                {
                                    color: nationality? palette.grey700: labelColor, // Apply interpolated color
                                },
                            ]}
                        >
                            {title}
                        </Animated.Text>
                    </Animated.View>
                    <Text style={styles.textinfo}>
                        {nationality ? nationality : null}
                    </Text>
                </TouchableOpacity>
                <Icon
                    name={"ri-arrow-down-s-line"}
                    type="ionicon"
                    color={palette.grey400}
                    size={20}
                />
            </Box>

            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <Box flex={1} backgroundColor='White'>
                    <Header
                        title={'ملیت ها'}
                        right={{ icon: 'ri-close-line', onPress: () => setModalVisible(false) }}
                    />

                    <SearchBox placeholder={'ملیت...'} onSearch={handleSearch} />
                    <FlatList
                        data={filteredItems}
                        keyExtractor={(item) => item.value}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={{ width: width }} onPress={() => handleItemPress(item)}>
                                <Box borderColor='Grey200' borderWidth={0.5} borderLeftWidth={3} borderRadius='l' flexDirection='row' mx='l' mt='m' p='sm'>
                                    <Text m='m' style={styles.textinfo}>
                                        {item.label}
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        )}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    textinfo: {
        fontFamily: 'Peyda-Medium',
        fontSize: 14,
        color: palette.black,
        textAlign: 'left',
    },
    inputTitle: {
        left: 5,
        fontFamily: "Peyda-SemiBold",
        zIndex: 10,
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 4,
        color: palette.grey700, // Static color
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 16,
        borderRadius: 12,
        paddingHorizontal: 20,
        height: 48,
        borderWidth: 1,
        borderColor: palette.grey100,
        backgroundColor: palette.white,
    },
}));

export { DropDownItem };
