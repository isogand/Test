import React from 'react';
import {ActivityIndicator, ScrollView, TouchableOpacity} from "react-native";
import {IOrderData, Passenger, PassengerType} from "../../../Constants/interfaces";
import {Box, makeStyles, palette, Text} from '../../../Constants/Theme.tsx';
import Icon from 'react-native-remix-icon';
import {useSelector} from "react-redux";
import {convertToPersianDigits, formatCurrency} from "../../../utils/utils.ts";
import {convertGregorianToJalaali} from "../../../utils/DateUtils.ts";
import InitialState from "../../../Constants/interfaces/TicketInfo.ts";
import {SvgXml} from "react-native-svg";
import {user, userGreen, userWhite} from "../../../assets/images/icons/user.ts";
import {CheckAgeFunc} from "../../profile";
import {SearchBox} from "../../../components/reusable";
import {pencil, penWhite} from "../../../assets/images/icons/pencil.ts";
import {close, closeWhite} from "../../../assets/images/icons/Close.ts";

interface PassengerListProps {
    passengerInfo: Passenger;
    togglePassenger: (passenger: PassengerType) => void;
    editPassengerModal: (passenger: PassengerType) => void;
    onClose?: any;
    promptDeleteConfirmation: (id: number) => void;
    setTrash?: any
}


interface PassengerListsProps {
    passengerInfo: Passenger;
    isSelected: boolean; // To check if passenger is selected
    togglePassenger: () => void; // Function to toggle passenger selection
    variant?: "default" | "primary";
    selectedItem: IOrderData;
    checkAge: CheckAgeFunc;
}

interface PassengerListCheckoutProps {
    handlePassengerSelect: (passenger: any, index: number) => void;
    setIsModalPassVisible: (value: boolean) => void;
    passengerData: any[];
    loadPassengers: boolean;
    errorLoadingPassengers: boolean;
    selectedSwitchIndex: number | null;
}


export const PassengerLists: React.FC<PassengerListsProps> = ({
                                                                  passengerInfo,
                                                                  isSelected,
                                                                  togglePassenger,
                                                                  variant,
                                                                  selectedItem,
                                                                  checkAge
                                                              }) => {
    const [isExpanded, setIsExpanded] = React.useState(false); // Accordion state
    const toggleAccordion = () => setIsExpanded(!isExpanded);

    return (
        variant === 'default' ? (
            <Box mx='xl' py='m' px='l' mb='m' borderRadius='l' borderWidth={0.5} borderColor='Grey100'
                 flexDirection='row' justifyContent="space-between">
                <Box alignItems='center' flexDirection='row'>
                    <Box backgroundColor='Grey50' borderRadius='11xl' width={48} height={48} alignItems='center'
                         justifyContent='center'>
                        <SvgXml xml={userGreen} width={24} height={24}/>
                    </Box>

                    <Box marginLeft='m'>
                        <Text textAlign='left' variant='BodyTitle2Third' color="Grey800" lineHeight={21}>
                            {passengerInfo?.name} {passengerInfo?.family}
                        </Text>
                        <Text variant='BodyTitle2Third' color="Grey500" lineHeight={21} mt='s'>
                            {passengerInfo.nationalId || passengerInfo.passportId
                                ? passengerInfo.nationalId ? `کد ملی: ${passengerInfo.nationalId}` : `شماره گذرنامه: ${passengerInfo.passportId}`
                                : ' شماره گذرنامه: --- '
                            }
                        </Text>
                    </Box>
                </Box>

                {/* Icon for selecting the passenger */}
                <TouchableOpacity activeOpacity={0.2} onPress={togglePassenger} style={{justifyContent: 'center'}}>
                    <Icon
                        name={isSelected ? 'ri-checkbox-fill' : 'ri-checkbox-blank-line'}
                        size={24}
                        color={isSelected ? palette.primary500 : 'gray'}
                    />
                </TouchableOpacity>
            </Box>
        ) : (
            <Box mx='xl' py='m' px='l' mb='m' borderRadius='l' borderWidth={0.5} borderColor='Grey100'>
                <Box alignItems='center' flexDirection='row' justifyContent="space-between">
                    <Box flexDirection='row'>
                        <Box backgroundColor='Grey50' borderRadius='11xl' width={48} height={48} alignItems='center'
                             justifyContent='center'>
                            <SvgXml xml={userGreen} width={24} height={24}/>
                        </Box>

                        <Box marginLeft='m'>
                            <Text textAlign='left' variant='BodyTitle2Third' color="Grey800" lineHeight={21}>
                                {passengerInfo?.name_persian || passengerInfo?.name} {passengerInfo?.family_persian || passengerInfo?.family}
                            </Text>
                            <Text variant='BodyTitle2Third' color="Grey500" lineHeight={21}>
                                {passengerInfo?.nationalId || passengerInfo?.passportId
                                    ? passengerInfo?.nationalId ? `کد ملی: ${passengerInfo?.nationalId}` : `شماره گذرنامه: ${passengerInfo?.passportId}`
                                    : ' شماره گذرنامه: --- '
                                }
                            </Text>
                        </Box>
                    </Box>

                    <TouchableOpacity activeOpacity={0.2} onPress={toggleAccordion} style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                    } as any}>
                        <Text varient='BodyTitle2Fourth' color='Grey500'>جزئیات</Text>
                        <Icon
                            name={isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}
                            size={24}
                            color={palette.grey500}
                        />
                    </TouchableOpacity>
                </Box>

                {/* Accordion content */}
                {isExpanded && (
                    <>
                        <Box mx='m' my='xl' flexDirection='row' justifyContent='space-between'>
                            <Box flex={0.5}>
                                <Text textAlign='left' variant='BodyTitle2Fourth' color="Grey500" lineHeight={21}>
                                    نام
                                </Text>
                                <Text textAlign='left' variant='BodyTitle2Third' color="Grey800" lineHeight={21}>
                                    {passengerInfo?.name_persian || passengerInfo?.name}
                                </Text>
                            </Box>
                            <Box flex={0.5}>
                                <Text textAlign='left' variant='BodyTitle2Fourth' color="Grey500" lineHeight={21}>
                                    نام خانوادگی
                                </Text>
                                <Text textAlign='left' variant='BodyTitle2Third' color="Grey800" lineHeight={21}>
                                    {passengerInfo?.family_persian || passengerInfo?.family}
                                </Text>
                            </Box>

                            <Box flex={0.45}>
                                <Text textAlign='left' variant='BodyTitle2Fourth' color="Grey500" lineHeight={21}>
                                    تاریخ تولد
                                </Text>
                                <Text textAlign='left' variant='BodyTitle2Third' color="Grey800" lineHeight={21}>
                                    {convertToPersianDigits(convertGregorianToJalaali(passengerInfo?.birthDay))?.toString().replace(/\./g, '/')}
                                </Text>
                            </Box>
                        </Box>
                        <Box mx='m' my='xl' flexDirection='row' justifyContent='space-between'>
                            <Box flex={0.5}>
                                <Text textAlign='left' variant='BodyTitle2Fourth' color="Grey500" lineHeight={21}>
                                    جنسیت
                                </Text>
                                <Text textAlign='left' variant='BodyTitle2Third' color="Grey800" lineHeight={21}>
                                    {passengerInfo.gender !== "f" ? "مرد" : "زن"}
                                </Text>

                            </Box>
                            <Box flex={0.5}>
                                <Text textAlign='left' variant='BodyTitle2Fourth' color="Grey500" lineHeight={21}>
                                    رده سنی
                                </Text>
                                <Text textAlign='left' variant='BodyTitle2Third' color="Grey800" lineHeight={21}>
                                    {checkAge(passengerInfo?.birthDay, selectedItem?.ticketDetail?.departureDateTime)}
                                </Text>
                            </Box>

                            <Box flex={0.45}>
                                <Text textAlign='left' variant='BodyTitle2Fourth' color="Grey500" lineHeight={21}>
                                    شماره بلیط
                                </Text>
                                <Text textAlign='left' variant='BodyTitle2Third' color="Grey800" lineHeight={21}>
                                    {convertToPersianDigits(passengerInfo?.ticketNo ? passengerInfo?.ticketNo : '---')}
                                </Text>
                            </Box>
                        </Box>
                        <Box backgroundColor='Grey100' width='100%' height={0.5}/>

                        <Box mb='l' mt='xl'>
                            <Box flexDirection='row' justifyContent='space-between'>
                                <Text textAlign='left' variant='BodyTitle2Fourth' color="Grey700" lineHeight={21}>
                                    هزینه بلیط
                                </Text>
                                <Text textAlign='left' variant='BodyTitle1Fourth' color="Grey700" lineHeight={21}>
                                    {convertToPersianDigits(formatCurrency(passengerInfo?.price.toLocaleString('fa-ir')))}
                                    <Text
                                        color={'Grey500'}
                                        variant={'Body3Second'}> ریال
                                    </Text>
                                </Text>
                            </Box>
                            {/*Data mock*/}
                            <Box my='sm' flexDirection='row' justifyContent='space-between'>
                                <Text textAlign='left' variant='BodyTitle2Fourth' color="Grey700" lineHeight={21}>
                                    مبلغ جریمه
                                </Text>
                                <Text textAlign='left' variant='BodyTitle1Fourth' color="Grey700" lineHeight={21}>
                                    {convertToPersianDigits(formatCurrency(passengerInfo?.price.toLocaleString('fa-ir')))}
                                    <Text
                                        color={'Grey500'}
                                        variant={'Body3Second'}> ریال
                                    </Text>
                                </Text>
                            </Box>
                            {/*Data mock*/}
                            <Box flexDirection='row' justifyContent='space-between'>
                                <Text textAlign='left' variant='BodyTitle2Third' color="Black" lineHeight={21}>
                                    مبلغ قابل بازگشت
                                </Text>
                                <Text textAlign='left' variant='BodyTitle1Fourth' color="Black" lineHeight={21}>
                                    {convertToPersianDigits(formatCurrency(passengerInfo?.price.toLocaleString('fa-ir')))}
                                    <Text
                                        color='Grey500'
                                        variant='Body3Second'> ریال
                                    </Text>
                                </Text>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        )
    );
};

const PassengerList: React.FC<PassengerListProps> = ({
                                                         passengerInfo,
                                                         togglePassenger,
                                                         editPassengerModal,
                                                         onClose,
                                                         promptDeleteConfirmation,
                                                         setTrash
                                                     }) => {
    const {theme} = useSelector((state: any) => state.themeReducer);
    const styles = useStyles();
    const ticketInfo: InitialState = useSelector(
        (state: any) => state.ticketInfoReducer
    );

    const DetailRow = ({label, value}) => (
        <Box mb="l">
            <Text textAlign="left" lineHeight={25} variant="BodyTitle2Fourth" color="Grey500">{label}</Text>
            <Text my="sm" textAlign="left" lineHeight={21} variant="BodyTitle2Third" color="Grey800">{value}</Text>
        </Box>
    );
    const PassengerDetails = ({item}) => (
        <>
            <Box flex={0.5}>
                <DetailRow label="نام" value={item?.name_persian || '-'}/>
                <DetailRow label="جنسیت" value={item.gender !== "f" ? "مرد" : "زن"}/>
                <DetailRow label="کد ملی" value={item.nationalId ? convertToPersianDigits(item.nationalId) : '-'}/>
                <DetailRow label="شماره پاسپورت" value={convertToPersianDigits(item.passportId || "-")}/>
            </Box>
            <Box flex={0.5}>
                <DetailRow label="نام خانوادگی" value={item?.family_persian || '-'}/>
                <DetailRow label="تاریخ تولد"
                           value={item.nationalId ? convertToPersianDigits(convertGregorianToJalaali(item?.birthDay || "-")) : item?.birthDay?.split("T")[0]}/>
                <DetailRow label="ملیت" value={item?.nationality || '-'}/>
                <DetailRow label="تاریخ انقضا گذرنامه"
                           value={convertToPersianDigits(convertGregorianToJalaali(item?.passportExp || ""))}/>
            </Box>
        </>
    );
    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                {!onClose && <SearchBox placeholder={'جستجوی مسافر'}
                                        onSearch={(text) => console.log(text)}/>}
                {passengerInfo && passengerInfo?.map((item) => (
                    !onClose ? (
                        <Box key={item.id} mx="xl" mb='l' borderRadius="l" borderWidth={0.5} borderColor="Grey100">
                            <TouchableOpacity activeOpacity={0.2} onPress={() => togglePassenger(item)} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 12,
                                paddingVertical: 8
                            } as any}>
                                <Box backgroundColor='Grey50' borderRadius='11xl' width={48} height={48}
                                     alignItems='center'
                                     justifyContent='center'>
                                    <SvgXml xml={userGreen} width={24} height={24}/>
                                </Box>
                                <Box alignItems='left' ml='m'>
                                    <Text color='Grey800' ml='sm' variant="BodyTitle2Third" lineHeight={21}>
                                        {item?.name} {item?.family}
                                    </Text>
                                    <Text color='Grey400' ml='sm' variant="BodyTitle2Third" lineHeight={21}>
                                        {convertToPersianDigits(item.nationalId)} - {item.nationalId ? convertToPersianDigits(convertGregorianToJalaali(item?.birthDay || "-")) : item?.birthDay?.split("T")[0]}
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    ) : (
                        <Box key={item.id} mx="xl" mb='l' borderRadius="l" borderWidth={0.5}
                             borderColor="Grey100"
                             style={{
                                 elevation: 2,
                                 shadowColor: 'rgba(222,222,222,0.75)',
                                 shadowRadius: 15,
                                 shadowOpacity: 1,
                             }}
                        >
                            <Box flexDirection="row" justifyContent="space-between" backgroundColor='Primary500'
                                 px='xl'
                                 py='m' borderTopLeftRadius='l' borderTopRightRadius='l'>

                                <Box flexDirection="row" alignItems="center">
                                    <SvgXml xml={userWhite} width={24} height={24}/>
                                    <Text color='White' ml='sm' variant="BodyTitle2Second" lineHeight={21}>
                                        {item?.name} {item?.family}
                                    </Text>
                                </Box>
                                <Box alignItems="center" flexDirection="row" justifyContent="center">
                                    <TouchableOpacity activeOpacity={0.2} onPress={() => editPassengerModal(item)}
                                                      style={[styles.icon]}>
                                        <SvgXml xml={penWhite} width={24} height={24}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.2}
                                        onPress={() => {
                                            promptDeleteConfirmation(item.id)
                                            setTrash(item.id)
                                        }}
                                        style={styles.icon}
                                    >
                                        <SvgXml xml={closeWhite} width={24} height={24}/>
                                    </TouchableOpacity>
                                </Box>
                            </Box>
                            <Box flexDirection="row" px="xl" py="xl">
                                <PassengerDetails item={item}/>
                            </Box>
                        </Box>
                    )

                ))}
            </ScrollView>
        </>
    );
};


export const PassengerListCheckout: React.FC<PassengerListCheckoutProps> = ({handlePassengerSelect,setIsModalPassVisible,passengerData,LoadPassenger,errPassenger,selectedSwitchIndex}) => {

    return (
        <Box width="100%">
            <ScrollView showsVerticalScrollIndicator={false}>
                <SearchBox placeholder="جستجوی مسافر" onSearch={(text) => console.log(text)}/>
                {LoadPassenger && <ActivityIndicator size="small" color={palette.primary500}/>}
                {errPassenger && <Text color="Grey800" ml="sm" variant="BodyTitle2Third" textAlign='center' mt='11xl'>مشکلی پیش امده دوباره تلاش کنید </Text>}
                {passengerData ? passengerData?.map((item) => (
                    <Box key={item.id} mx="xl" mb="l" borderRadius="l" borderWidth={0.5} borderColor="Grey100">
                        <TouchableOpacity
                            activeOpacity={0.2}
                            onPress={() => {
                                handlePassengerSelect(item,selectedSwitchIndex);
                                setIsModalPassVisible(false)
                            }}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                            } as any}
                        >
                            <Box backgroundColor="Grey50" borderRadius="11xl" width={48} height={48} alignItems="center"
                                 justifyContent="center">
                                <SvgXml xml={userGreen} width={24} height={24}/>
                            </Box>
                            <Box alignItems="left" ml="m">
                                <Text color="Grey800" ml="sm" variant="BodyTitle2Third" lineHeight={21}>
                                    {item?.name} {item?.family}
                                </Text>
                                <Text color="Grey400" ml="sm" variant="BodyTitle2Third" lineHeight={21}>
                                    {convertToPersianDigits(item.nationalId)} - {item.nationalId ? convertToPersianDigits(convertGregorianToJalaali(item?.birthDay || "-")) : item?.birthDay?.split("T")[0]}
                                </Text>
                            </Box>
                        </TouchableOpacity>
                    </Box>
                )):(
                    <Text color="Grey800" ml="sm" variant="BodyTitle2Third" lineHeight={21}>
                        مسافری وجود ندارد
                    </Text>
                )}
            </ScrollView>
        </Box>
    );
};

const useStyles = makeStyles((theme) => ({
    icon: {
        paddingLeft: 12,
    },
}));
export default PassengerList;
