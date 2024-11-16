import React, {useEffect, useState} from 'react';
import {ParamListBase, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Box, makeStyles, palette, Text} from '../../Constants/Theme'
import {Alert, FlatList, Modal, TouchableOpacity} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Button, Header, Switch, TicketPurchaseRoute} from "../../components/reusable";
import Icon from "react-native-remix-icon";
import useHttp from "../../components/hooks/use-http";
import {REACT_APP_API_URL} from "@env";
import {WalletDataItem} from "../../Constants/interfaces/IWallet";
import InitialState from "../../Constants/interfaces/TicketInfo";
import {addPassenger, removePassenger} from "../../store/TicketInfoSlice.ts";
import {TotalPrice} from "./CheckOut/PassengersPrice.tsx";
import {PassengerType} from "../../Constants/interfaces";
import {PassengerListCheckout} from "./Passengers/PassengerList.tsx";
import {ContactInformation} from "../profile/Order/ComponentsOrder.tsx";
import {TravellerForm} from "./TravellerForm.tsx";
import {StyledBox} from "../profile/Order/TripInfo.tsx";
import {TicketInfo} from "./CheckOut/components/TicketInfo.tsx";
import Form from "../../components/reusable/modules/Form/Form.tsx";
import {validateIranianNationalId} from "../../utils/utils.ts";

type Props = {
    route: RouteProp<ParamListBase, string>;
    navigation: NativeStackNavigationProp<ParamListBase, string>;
};

// Main Checkout component
const Checkout = ({navigation, route}: Props) => {
    const {theme} = useSelector((state: any) => state.themeReducer);
    const styles = useStyles();
    const [showModal, setShowModal] = useState(false);// Track selected type for new passenger
    const [isPassengerModalVisible, setPassengerModalVisible] = useState(false);
    const [passengerData, setPassengerData] = useState<PassengerType[]>([]); // List of all passenger details
    const [selectedSwitchIndex, setSelectedSwitchIndex] = useState<number | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);// Error state to manage modal error message

    // Various state variables to manage UI behavior and display
    const {token, userId} = useSelector((state: any) => state.authReducer);
    const config = {headers: {Authorization: `Bearer ${token}`}};
    const data = useSelector((state: any) => state.authReducer);
    const dispatch = useDispatch();
    const ticketInfo: InitialState = useSelector(
        (state: any) => state.ticketInfoReducer
    );

    // GET PASSENGER
    function Passenger(mData: any) {
        setPassengerData(mData.data);
    }

    const {error: errPassenger, loading: LoadPassenger, sendRequest} = useHttp(Passenger);
    useEffect(() => {
        sendRequest({url: REACT_APP_API_URL + `passenger/${userId}`, method: 'GET', header: {config}});
    }, [isPassengerModalVisible]);

    // Extract passenger counts
    const adultCount = ticketInfo?.passengers?.adult || 0;
    const childCount = ticketInfo?.passengers?.child || 0;
    const newBornCount = ticketInfo?.passengers?.newBorn || 0;
    const availability = ticketInfo?.availability || 'A';

    // Create an array listing each passenger type in order
    const orderedPassengers = [
        ...Array(adultCount).fill('بزرگسال'),
        ...Array(childCount).fill('کودک'),
        ...Array(newBornCount).fill('نوزاد'),
    ];
    const totalSelectPassengers = [
        ...Array(adultCount).fill('بزرگسال'),
        ...Array(childCount).fill('کودک'),
    ];

    const [switchStates, setSwitchStates] = useState<any[]>(Array(orderedPassengers.length).fill(
        {
            switch: true,
            passenger: null
        }
    ));

    const handleToggle = (index) => {
        setSwitchStates(prevStates =>
            prevStates.map((state, idx) =>
                idx === index ? {...state, switch: !state.switch} : state
            )
        );
    };

    const handlePassengerSelect = (passenger, index) => {
        setSwitchStates((prevStates) =>
            prevStates.map((state, idx) =>
                idx === index ? {switch: passenger.nationality === "IRN", passenger: passenger} : state
            )
        );
    };

    // Show the modal to select passenger type
    const handleAddPassenger = () => {
        setShowModal(true);
    };

    // Handle the selection of passenger type with validation
    const handleSelectPassengerType = (type: 'بزرگسال' | 'کودک' | 'نوزاد') => {
        // Validation checks
        if (type === 'کودک' && childCount >= 2 * adultCount) {
            setModalError('تعداد کودک مجاز به ازای هر بزرگسال، 2 کودک می باشد.');
            return;
        }

        if (type === 'نوزاد' && newBornCount >= adultCount) {
            setModalError('تعداد نوزاد انتخابی بیشتر از تعداد بزرگسال است. به ازای هر بزرگسال حداکثر یک نوزاد.');
            return;
        }

        if (totalSelectPassengers.length >= 9) {
            setModalError('حداکثر نه مسافر مجاز به انتخاب است.');
            return;
        }

        // If no validation error, dispatch the passenger type and close the modal
        dispatch(addPassenger(type)); // Dispatch the selected type to Redux
        // Update orderedPassengers and switchStates with the new passenger
        const newSwitchStates = [...switchStates, {
            switch: type === 'بزرگسال' || type === 'کودک' || type === 'نوزاد',
            passenger: null
        }];
        setSwitchStates(newSwitchStates);

        setShowModal(false); // Close the modal after selection
        setModalError(null); // Clear any previous errors
    };

    const handleRemovePassenger = (index: number) => {
        const passengerType = orderedPassengers[index];
        let passengerIndex;

        if (passengerType === 'بزرگسال') passengerIndex = 0;
        else if (passengerType === 'کودک') passengerIndex = 1;
        else if (passengerType === 'نوزاد') passengerIndex = 2;
        else if (passengerType === 'رده سنی' || passengerType === 'نامشخص') passengerIndex = 3;

        dispatch(removePassenger(passengerIndex));
        // Update switchStates by removing the corresponding entry
        const newSwitchStates = switchStates.filter((_, idx) => idx !== index);
        setSwitchStates(newSwitchStates);
    };

    // If the flight has capacity, see the add button
    const canAddNewPassenger = availability === 'A' || (Number(availability) > orderedPassengers.length);

    const ContinueBooking = () => {
        navigation.navigate('ConfirmInformation', {passengerData: passengerData} as any);
    }

    return (
        <Box flex={1} backgroundColor='White'>
            <Header variant={'primary'} title={'مشخصات مسافران'}
                    right={{
                        icon: 'ri-arrow-right-s-line',
                        onPress: () => navigation.navigate('TicketInfo', {toggled: false} as any)
                    }}
            />
            {/*Ticket purchase route*/}
            <TicketPurchaseRoute route={route} navigation={navigation} activeRoute={'Checkout'}/>

            <FlatList
                data={[{key: 'dummy'}]}
                contentContainerStyle={{paddingBottom: 10}}
                renderItem={() => (
                    <Box mb='xl'>
                        <Form
                            // ref={ref}
                            onChange={({values}) => {
                                // onChange(values);
                            }}
                            enableReinitialize={true}
                            config={(yup) => ({
                                switchStates: {
                                    initialValue: switchStates || [],
                                    validation: yup.array()
                                        .of(
                                            yup.object().shape({
                                                name_persian:yup.string()
                                                    .when('switch', {
                                                        is: (value:string) => value !== 'اتباع خارجی', // Condition when switch is true
                                                        then: (yup) => yup
                                                            .required("فیلد را پر کنید")
                                                            .trim("نام نباید فقط از فاصله تشکیل شده باشد")
                                                            .matches(/^[\u0600-\u06FF\s]+$/, "نام فقط باید شامل حروف فارسی باشد")
                                                            .min(2, "تعداد کاراکتر های انتخابی کمتر از حد مجاز میباشد")
                                                            .max(25, "تعداد کاراکتر های انتخابی بیشتر از حد مجاز میباشد")
                                                            .label("name_persian"),
                                                    }),
                                                family_persian:yup.string()
                                                    .when('switch', {
                                                        is: (value:string) => value !== 'اتباع خارجی', // Condition when switch is true
                                                        then: (yup) => yup
                                                            .required("فیلد را پر کنید")
                                                            .trim("نام خانوادگی نباید فقط از فاصله تشکیل شده باشد")
                                                            .matches(/^[\u0600-\u06FF\s]+$/, "نام خانوادگی فقط باید شامل حروف فارسی باشد")
                                                            .min(2, "تعداد کاراکتر های انتخابی کمتر از حد مجاز میباشد")
                                                            .max(25, "تعداد کاراکتر های انتخابی بیشتر از حد مجاز میباشد")
                                                            .label("family_persian"),
                                                    }),
                                                name: yup.string().required("فیلد را پر کنید")
                                                    .trim("نام نباید فقط از فاصله تشکیل شده باشد")
                                                    .matches(/^[a-zA-Z\s]+$/, "نام فقط باید شامل حروف انگلیسی باشد")
                                                    .min(2, "تعداد کاراکتر های انتخابی کمتر از حد مجاز میباشد")
                                                    .max(25, "تعداد کاراکتر های انتخابی بیشتر از حد مجاز میباشد")
                                                    .label("name"),
                                                family: yup.string().required("فیلد را پر کنید")
                                                    .trim("نام خانوادگی نباید فقط از فاصله تشکیل شده باشد")
                                                    .matches(/^[a-zA-Z\s]+$/, "نام خانوادگی فقط باید شامل حروف انگلیسی باشد")
                                                    .min(2, "تعداد کاراکتر های انتخابی کمتر از حد مجاز میباشد")
                                                    .max(25, "تعداد کاراکتر های انتخابی بیشتر از حد مجاز میباشد")
                                                    .label("family"),
                                                nationalId:yup.string().nullable()
                                                    .when('switch', {
                                                        is: (value:string) => value !== 'اتباع خارجی', // Condition when switch is true
                                                        then: (yup) => yup
                                                            .required("فیلد را پر کنید")
                                                            .trim("کد ملی نباید فقط از فاصله تشکیل شده باشد")
                                                            .matches(/^[0-9]+$/, ' لطفا فقط عدد وارد کنید')
                                                            .matches(/^\d{10}$/, 'کد ملی باید دقیقاً 10 رقم باشد')
                                                            .test(
                                                                'iran-national-id',
                                                                'کد ملی معتبر نیست',
                                                                value => !value || validateIranianNationalId(value || '')
                                                            )
                                                            .label("nationalId"),
                                                    }),
                                                passportId:yup.string()
                                                    .when('switch', {
                                                        is: (value:string) => value !== 'اتباع خارجی', // Condition when switch is true
                                                        then: (yup) => yup
                                                            .required("فیلد را پر کنید")
                                                            .trim("شماره گذرنامه نباید فقط از فاصله تشکیل شده باشد")
                                                            .min(6, "شماره گذرنامه باید حداقل 6 کاراکتر باشد")
                                                            .max(10, "شماره گذرنامه نباید بیشتر از 10 کاراکتر باشد")
                                                            .label("passportId"),
                                                    }),
                                            })
                                        )
                                },
                            })}

                        >
                            {({wrapIt, disableSubmitUI, submit, inputProps, errors, values}) => {
                                return (
                                    <>
                                        {/*Ticket Info*/}
                                        <TicketInfo navigation={navigation} ticketInfo={ticketInfo}/>
                                        {/*Add Passenger*/}
                                        <StyledBox>
                                            <Box m='xxl'>
                                                <Text textAlign='left' color='Black' variant='BodyTitle2First'>اطلاعات
                                                    مسافران</Text>
                                                {orderedPassengers.map((type, index) => (
                                                    <React.Fragment key={index}>
                                                        <Box mt='xl' flexDirection='row' justifyContent='space-between'>
                                                            <Text color='Grey700' variant='BodyTitle2Third'>
                                                                مسافر {index + 1}
                                                            </Text>
                                                            <Text color='Grey700' variant='Body3First'>{type}</Text>
                                                        </Box>
                                                        <Box mt='m' key={index} flexDirection='row'
                                                             justifyContent='space-between'
                                                             alignItems='center'>
                                                            <Box alignItems='center' flexDirection='row'>
                                                                <Switch
                                                                    isEnabled={switchStates[index]?.switch}
                                                                    onToggle={() => handleToggle(index)}
                                                                    trackColor={{
                                                                        false: palette.grey400,
                                                                        true: palette.primary500
                                                                    }}
                                                                    thumbColor="#FFFFFF"
                                                                />
                                                                <Text color='Grey700' variant='Body3Second'>
                                                                    {switchStates[index]?.switch ? 'اتباع داخلی' : 'اتباع خارجی'}
                                                                </Text>
                                                            </Box>

                                                            <Box alignItems='center' flexDirection='row'>
                                                                <TouchableOpacity onPress={() => {
                                                                    setPassengerModalVisible(true);
                                                                    setSelectedSwitchIndex(index);
                                                                }} style={styles.btn}>
                                                                    <Icon name='ri-user-line' color={palette.primary500}
                                                                          size={18}/>
                                                                    <Text color='Primary500' variant='Body3Second'
                                                                          ml='sm'>انتخاب از
                                                                        لیست</Text>
                                                                </TouchableOpacity>
                                                                {/* Conditionally render the delete button for adult passengers */}
                                                                {type !== 'بزرگسال' || orderedPassengers.filter(p => p === 'بزرگسال').length > 1 ? (
                                                                    <>
                                                                        <Box mx='m' backgroundColor='Grey400'
                                                                             width={0.5}
                                                                             height={20}/>

                                                                        <TouchableOpacity
                                                                            onPress={() => handleRemovePassenger(index)}
                                                                            style={styles.btn}>
                                                                            <Icon name='ri-delete-bin-line'
                                                                                  color={palette.error}
                                                                                  size={18}/>
                                                                            <Text color='Error' variant='Body3First'
                                                                                  ml='sm'>حذف</Text>
                                                                        </TouchableOpacity>
                                                                    </>
                                                                ) : null}
                                                            </Box>
                                                        </Box>
                                                        <Box mt='m' mb='xl'>
                                                            {
                                                                wrapIt("switchStates", ({value, setFieldValue, touched}) => {
                                                                    // console.log("sss", values.switchStates, errors, touched)
                                                                    return (
                                                                        <TravellerForm
                                                                            passengerType={type}
                                                                            selectedTab={values[index]?.switch ? 'اتباع داخلی' : 'اتباع خارجی'}
                                                                            PassengerInfo={values[index]?.passenger}
                                                                            onChange={(values) => {
                                                                                value[index].passenger = values;
                                                                                setFieldValue(value)
                                                                            }}
                                                                        />
                                                                    ) as any;
                                                                })
                                                            }
                                                        </Box>
                                                    </React.Fragment>
                                                ))}
                                                {canAddNewPassenger && (
                                                    <>
                                                        <Box mt='l' backgroundColor='Primary500' width='100%'
                                                             height={0.5}/>
                                                        <TouchableOpacity onPress={handleAddPassenger}
                                                                          style={styles.btn}>
                                                            <Icon name='ri-user-add-line' color={palette.primary500}
                                                                  size={18}/>
                                                            <Text ml='sm' my='xl' color='Primary500'
                                                                  variant='BodyTitle2Second'>افزودن
                                                                مسافر
                                                                جدید</Text>
                                                        </TouchableOpacity>
                                                    </>
                                                )}
                                            </Box>
                                        </StyledBox>

                                        {/* Modal to select passenger type */}
                                        <Modal
                                            transparent={true}
                                            visible={showModal}
                                            animationType="slide"
                                            title="انتخاب نوع مسافر"
                                            onRequestClose={() => setShowModal(false)} // Close modal on Android back button
                                        >
                                            <Box style={styles.modalOverlay}>
                                                <Box style={styles.modalContainer}>
                                                    <Box my='m'>
                                                        <Box flexDirection='row' mb='l' justifyContent='space-between'
                                                             width='100%'>
                                                            <TouchableOpacity onPress={() => {
                                                                setShowModal(false);
                                                                setModalError(null);
                                                            }}>
                                                                <Icon
                                                                    name={"ri-close-fill"}
                                                                    type="ionicon"
                                                                    color={palette.grey800}
                                                                    size={20}
                                                                />
                                                            </TouchableOpacity>
                                                            <Text variant="title6" color='Grey800'>انتخاب نوع
                                                                مسافر</Text>
                                                            <Box/>
                                                        </Box>
                                                        {['بزرگسال', 'کودک', 'نوزاد'].map(type => (
                                                            <Box key={type} my='m'>
                                                                <Button textStyle={{padding: 7}} borderRadius={5}
                                                                        hoverBackgroundColor={palette.grey700}
                                                                        backgroundColor={palette.grey600} title={type}
                                                                        variant="primary"
                                                                        onPress={() => handleSelectPassengerType(type)}>
                                                                    {type}
                                                                </Button>
                                                            </Box>
                                                        ))}
                                                        {modalError && (
                                                            <Text color='Error' textAlign='left'
                                                                  variant='BodyTitle2Fourth'
                                                                  mt='m'>{modalError}</Text>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Modal>

                                        {/* Modal to see passenger info */}
                                        <Modal
                                            animationType='slide'
                                            transparent={true}
                                            visible={isPassengerModalVisible}
                                            onRequestClose={() => setPassengerModalVisible(false)}
                                            style={styles.modalContainer}
                                        >
                                            <Box style={styles.contentContainer}>
                                                <Box borderTopLeftRadius='l' borderTopRightRadius='l'
                                                     alignItems='center'
                                                     width='100%'
                                                     height='80%'
                                                     position='absolute' bottom={0}
                                                     style={{backgroundColor: palette.white}}
                                                     pb='11xl'>
                                                    <Box p='xl' flexDirection='row' alignItems='center'
                                                         justifyContent='space-between'
                                                         width='100%'>
                                                        <Icon name={'ri-close-line'} size={24} color={'black'}
                                                              onPress={() => setPassengerModalVisible(false)}/>
                                                        <Text variant='BodyTitle1Second'
                                                              color='Black'>
                                                            لیست مسافران
                                                        </Text>
                                                        <Button title=""
                                                                onPress={() => setPassengerModalVisible(false)}/>
                                                    </Box>
                                                    <Box marginHorizontal="sm" width="100%" height="0.15%"
                                                         backgroundColor="Grey100"/>
                                                    <PassengerListCheckout
                                                        handlePassengerSelect={handlePassengerSelect}
                                                        setIsModalPassVisible={setPassengerModalVisible}
                                                        passengerData={passengerData}
                                                        loadPassengers={LoadPassenger}
                                                        errorLoadingPassengers={errPassenger}
                                                        selectedSwitchIndex={selectedSwitchIndex}
                                                    />

                                                </Box>
                                            </Box>
                                        </Modal>

                                        {/*Contact information*/}
                                        <ContactInformation item={data} variant='editable'/>

                                        {/*Price and payment*/}
                                        <StyledBox>
                                            <Box flex={1} m='xl'>
                                                <Text textAlign='left' color='Black' variant='BodyTitle2First'>
                                                    جزئیات پرداخت
                                                </Text>

                                                <TotalPrice ticketInfo={ticketInfo}/>
                                                <Box alignItems='center' justifyContent='space-between'>
                                                    <Text mb='xl' textAlign='left' variant='Body3Second' color='Grey700'
                                                          lineHeight={21}>
                                                        با کلیک بر روی دکمه ادامه خرید، تایید می کنم که<Text
                                                        onPress={() => navigation.navigate('Rules' as any)}
                                                        variant='BodyTitle2Second'
                                                        color='Primary500'> قوانین و مقررات </Text>را مطالعه کرده و از
                                                        درستی اطلاعات
                                                        وارد شده اطمینان دارم.
                                                    </Text>

                                                    <Button
                                                        title={'ادامه خرید'}
                                                        style={{
                                                            alignItems: 'center',
                                                            justifyContent: "center",
                                                            borderRadius: 10
                                                        }}
                                                        height={44}
                                                        width={'100%'}
                                                        onPress={submit}
                                                        backgroundColor={palette.primary500}
                                                        hoverBackgroundColor={palette.primary600}
                                                    />
                                                </Box>
                                            </Box>
                                        </StyledBox>
                                    </>
                                )
                            }}
                        </Form>
                    </Box>
                )}
            />
        </Box>
    );
};
const useStyles = makeStyles((theme) => ({
    contentContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: palette.white,
        padding: 20,
        borderRadius: 10,
        width: '70%',
    },
    btn: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));
export {Checkout};
