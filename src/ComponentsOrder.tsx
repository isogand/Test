import React from 'react';
import {Box, palette, Text} from '../../../Constants/Theme'
import {IOrderData, Passenger} from "../../../Constants/interfaces/IOrderData";

import {calculatAge, convertToPersianDigits, formatCurrency} from "../../../utils/utils";
import {CheckAgeFunc} from "../OrderHistory";
import {SvgXml} from "react-native-svg";
import {user, userGray} from "../../../assets/images/icons/user.ts";
import {convertGregorianToJalaali, transformDateToPersianMonth2} from "../../../utils/DateUtils.ts";
import {luggageDark} from "../../../assets/images/icons/luggage.ts";
import {refundGrey, refundRed} from "../../../assets/images/icons/refund.ts";
import {Button} from "../../../components/reusable";
import {getPriceBasedOnAge} from "../ComponentsProfile/LastTravels.tsx";
import PassengersPrice from "../../Ticket/CheckOut/PassengersPrice.tsx";
import InitialState from "../../../Constants/interfaces/TicketInfo.ts";
import {useSelector} from "react-redux";
import * as Yup from "yup";
import {Formik} from "formik";
import {TextInput} from "react-native";

interface ComponentsOrderProps {
    item: IOrderData;
    handleButtonPress: (passenger: Passenger) => Promise<void>;
    setSelectedPassenger: React.Dispatch<React.SetStateAction<Passenger | null>>;
    setSelectedOrder: React.Dispatch<React.SetStateAction<IOrderData | null>>;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    getPriceBasedOnAge: (birthDay: any, ticketDetail: any) => number; // Update types as needed
    checkAge: CheckAgeFunc;
    handleViewTicket: (ticketNo: string) => void;
}


export const OrderDetails: React.FC<{ item: IOrderData; }> = ({
                                                                  item,
                                                              }) => {
    return (
        <Box flexDirection={'row'} justifyContent={'space-between'}>
            <Box flexDirection={'row'} alignItems={'center'}>
                <Text style={{fontFamily: 'Vazirmatn-Regular'}} variant={'title8'} color={'Info'}
                      marginHorizontal={'s'}>
                    {' '}
                    شماره سفارش:
                </Text>
                <Text variant={'title10'}>
                    {convertToPersianDigits(item?.orderId ?? 'DefaultOrderId')}
                </Text>
            </Box>
            <Box flexDirection={'row'} alignItems={'center'}>
                <Text style={{fontFamily: 'Vazirmatn-Regular'}} variant={'title8'} color={'Info'}
                      marginHorizontal={'s'}>
                    قیمت کل:
                </Text>
                <Text variant={'title9'} color={'Primary'}>
                    {item?.totalPrice ? new Number(item?.totalPrice).toLocaleString('fa-ir') : '--'}
                    <Text color={'Info'} style={{fontFamily: 'Vazirmatn-Regular'}} variant={'title8'}>
                        ریال
                    </Text>
                </Text>
            </Box>
        </Box>
    );
};


interface PassengerInfoBlockProps {
    theme?: {
        SECONDARY_TEXT_COLOR: string;
    };
    p: {
        name_persian?: string;
        family_persian?: string;
        name?: string;
        family?: string;
        canceled?: number;
        ticketNo?: string;
        birthDay?: string;
        nationalId?: string | undefined;
        passportId?: string;
        gender?: string;
        nationality?: string;
    };
    item: {
        PNR?: string;
        ticketDetail?: {
            departureDateTime?: string;
        };
        departureDateTime?: string;
    };
    price?: number;
    checkAge: (birthDay: string | undefined, departureDateTime: string | undefined) => string;
    index: number; // Add index prop to keep track of the current passenger
    totalPassengers: number; // Add totalPassengers prop to keep track of total number of passengers
}

export const PassengerInfoBlock: React.FC<PassengerInfoBlockProps> = ({
                                                                          theme,
                                                                          p,
                                                                          item,
                                                                          price,
                                                                          checkAge,
                                                                          index,
                                                                          totalPassengers,
                                                                      }) => {

    return (
        <Box alignItems='center'>
            <Box my='xl'>
                <Box flexDirection='row' alignItems='flex-end' width='100%'>
                        <SvgXml
                            xml={p?.canceled === 1 ? userGray : user}
                            width={20}
                            height={20}
                        />
                        <Text fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey300" : "Black"}
                              variant='BodyTitle2Third'>
                            {(p?.name || p?.family)}
                        </Text>
                        {p?.canceled === 1 &&
                            <Text fontSize={{tablet: 18}} ml='sm' color={p?.canceled === 1 ? "Grey300" : "Black"}
                                  variant={'BodyTitle2Third'}>
                                (استرداد شده)
                            </Text>
                        }
                </Box>

                <Box my='l' flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
                    <Box width={'30%'}>
                        <Box  alignItems={'flex-start'}>
                            <Text lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey200" : 'Grey500'}
                                  variant={'BodyTitle2Fourth'}>جنسیت</Text>
                            <Text fontWeight='500' lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey300" : "Black"}
                                  variant={'BodyTitle2Fourth'}>{p.gender === 'm' ? 'مرد' : 'زن'}</Text>
                        </Box>
                        <Box alignItems='flex-start' mt='xl'>
                            <Text lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey200" : 'Grey500'}
                                  variant={'BodyTitle2Fourth'}>تاریخ
                                تولد</Text>
                            <Text fontWeight='500' lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey300" : "Black"}
                                  variant={'BodyTitle2Fourth'} >
                                {p?.birthDay ? convertToPersianDigits(convertGregorianToJalaali(p?.birthDay))?.toString().replace(/\./g, '/'):'---'}
                            </Text>
                        </Box>
                        <Box alignItems='flex-start' mt='xl'>
                            <Text lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey200" : 'Grey500'}
                                  variant={'BodyTitle2Fourth'}>شماره
                                بلیط</Text>
                            <Text fontWeight='500' lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey300" : "Black"}
                                  variant={'BodyTitle2Fourth'}>
                                {p?.ticketNo ? convertToPersianDigits(p?.ticketNo) : '---'}
                            </Text>
                        </Box>
                    </Box>
                    <Box width={'35%'}>
                        <Box  alignItems='flex-start'>
                            <Text lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey200" : 'Grey500'}
                                  variant={'BodyTitle2Fourth'}>رده
                                سنی</Text>
                            <Text fontWeight='500' lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey300" : "Black"}
                                  variant={'BodyTitle2Fourth'}>
                                {p?.birthDay || item?.ticketDetail?.departureDateTime ? checkAge(p?.birthDay, item?.ticketDetail?.departureDateTime || item?.departureDateTime) : '---'}
                            </Text>
                        </Box>
                        <Box alignItems='flex-start' mt='xl'>
                            <Text lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey200" : 'Grey500'}
                                  variant={'BodyTitle2Fourth'}>
                                {p?.nationalId || p?.passportId ? 'شماره گذرنامه' : 'شماره ملی'}
                            </Text>
                            <Text fontWeight='500' lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey300" : "Black"}
                                  variant={'BodyTitle2Fourth'}>
                                {p?.nationalId || p?.passportId
                                    ? p?.nationalId
                                        ? `${convertToPersianDigits(p?.nationalId || '')}`
                                        : `${convertToPersianDigits(p?.passportId || '')}`
                                    : '---'}
                            </Text>
                        </Box>
                        <Box alignItems='flex-start' mt='xl'>
                            <Text lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey200" : 'Grey500'}
                                  variant={'BodyTitle2Fourth'}>ملیت</Text>
                            <Text fontWeight='500' lineHeight={25} fontSize={{tablet: 18}} color={p?.canceled === 1 ? "Grey300" : "Black"}
                                  variant={'BodyTitle2Fourth'}>
                                {p?.nationality ? p?.nationality : '---'}
                            </Text>
                        </Box>
                    </Box>
                </Box>


            </Box>
            {index < totalPassengers - 1 && (
                <Box backgroundColor={'Grey100'} width={350} height={0.5} my='s'/>
            )}
        </Box>
    );
};

interface ContactInformationProps {
    item:  { mobile: string; email: string  };
    variant?: 'default' | 'primary';
}

export const ContactInformation: React.FC<ContactInformationProps> = ({item,variant}) => {
    const initialValues = {
        mobile: item?.mobile || '',
        email: item?.email || '',
    };

    const validationSchema = Yup.object().shape({
        mobile: Yup.string().required('شماره موبایل لازم است').min(10, 'شماره موبایل باید حداقل ۱۰ رقم باشد'),
        email: Yup.string().email('ایمیل معتبر نیست').required('ایمیل لازم است'),
    });

    return (
        <Box
            mt='xxl'
            mx='xl'
            backgroundColor='White'
            borderRadius='l'
            style={{
                elevation: 2,
                shadowColor: 'rgba(196,196,196,0.56)',
                shadowRadius: 15,
                shadowOpacity: 1,
            }}
        >
            <Box my='xxl' mx='xl' alignItems='flex-start'>
                <Text fontSize={{ tablet: 18 }} variant='BodyTitle1Second' color='Black' lineHeight={24}>
                    اطلاعات تماس
                </Text>
                <Text fontSize={{ tablet: 18 }} mt='l' variant='BodyTitle2Fourth' color='Grey700' lineHeight={25}>
                    بلیط صادر شده به صورت پیام و ایمیل برای شما ارسال می شود
                </Text>

                {variant === 'editable' ? (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            // Handle form submission
                            console.log(values);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <Box mt='l' width='100%'>
                                <TextInput
                                    placeholder='شماره موبایل*'
                                    onChangeText={handleChange('mobile')}
                                    onBlur={handleBlur('mobile')}
                                    value={values.mobile}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: 16,
                                        borderRadius: 12,
                                        paddingHorizontal: 20,
                                        height: 48,
                                        borderWidth: 1,
                                        borderColor: palette.grey100,
                                        backgroundColor: palette.white,
                                        textAlign:'right'
                                    }as any}
                                />
                                {touched.mobile && errors.mobile && (
                                    <Text textAlign='left' variant='Body3Second' color='Error'>{errors.mobile}</Text>
                                )}

                               <Box mt='l'>
                                   <TextInput
                                       placeholder='ایمیل (اختیاری)'
                                       onChangeText={handleChange('email')}
                                       onBlur={handleBlur('email')}
                                       value={values.email}
                                       style={{
                                           flexDirection: "row",
                                           alignItems: "center",
                                           justifyContent: "space-between",
                                           fontSize: 16,
                                           borderRadius: 12,
                                           paddingHorizontal: 20,
                                           height: 48,
                                           borderWidth: 1,
                                           borderColor: palette.grey100,
                                           backgroundColor: palette.white,
                                           textAlign:'right'
                                       }as any}
                                   />
                               </Box>
                                {touched.email && errors.email && (
                                    <Text textAlign='left' variant='Body3Second' color='Error'>{errors.email}</Text>
                                )}

                                {/*<Button title="ذخیره" onPress={handleSubmit as any} />*/}
                            </Box>
                        )}
                    </Formik>
                ) : (
                    <>
                        <Box flexDirection='row' alignItems='center' justifyContent='space-between' width='55%'>
                            <Text fontSize={{ tablet: 18 }} mt='l' variant='BodyTitle2Fourth' color='Grey700' lineHeight={25}>
                                شماره موبایل
                            </Text>
                            <Text fontSize={{ tablet: 18 }} mt='l' variant='BodyTitle2Second' color='Grey800' lineHeight={25}>
                                ۰{convertToPersianDigits((item?.user?.mobile || item?.mobile))}
                            </Text>
                        </Box>

                        <Box flexDirection='row' alignItems='center' justifyContent='space-between' width='55%'>
                            <Text fontSize={{ tablet: 18 }} mt='l' variant='BodyTitle2Fourth' color='Grey700' lineHeight={25}>
                                ایمیل
                            </Text>
                            <Text fontSize={{ tablet: 18 }} mt='l' variant='BodyTitle2Second' color='Grey800' lineHeight={25}>
                                {item?.user?.email ? item?.user?.email || item?.email : '---'}
                            </Text>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}

interface PaymentDetailsProps {
    item: IOrderData;
    selectedItem: IOrderData
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({item, selectedItem}) => {
    const ticketInfo: InitialState = useSelector((state: any) => state.ticketInfoReducer);

    function PassengerPriceHandler() {
        // Extract the flight date from the ticket info
        const flightDate = selectedItem?.ticketDetail?.departureDateTime;

        // Ensure flightDate is valid
        if (!flightDate) {
            return {
                total: {count: 0, price: 0},
                newborn: {count: 0, price: 0},
                child: {count: 0, price: 0},
                adult: {count: 0, price: 0}
            };
        }

        // Handle the case where selectedPassengers is undefined
        if (!ticketInfo?.selectedPassengers) {
            return {
                total: {count: 0, price: 0},
                newborn: {count: 0, price: 0},
                child: {count: 0, price: 0},
                adult: {count: 0, price: 0}
            };
        }

        const prices = ticketInfo?.selectedPassengers.map((passenger) => {
            const age = calculatAge(new Date(passenger.birthDay), flightDate);


            if (age >= 0 && age < 2) {
                return parseInt(selectedItem.ticketDetail?.infantPrice || '0', 10);
            } else if (age >= 2 && age < 12) {
                return parseInt(selectedItem.ticketDetail?.childPrice || '0', 10);
            } else {
                return parseInt(selectedItem.ticketDetail?.adultPrice || '0', 10);
            }
        });

        const total = prices?.reduce((acc, curr) => acc + curr, 0);

        // Count newborns, children, and adults
        const newBornCount = selectedItem?.passenger.filter((item) => {
            const age = calculatAge(new Date(item.birthDay), flightDate);
            return age < 2;
        }).length || 0;

        const childCount = selectedItem?.passenger.filter((item) => {
            const age = calculatAge(new Date(item.birthDay), flightDate);
            return age >= 2 && age < 12;
        }).length || 0;

        const adultCount = selectedItem?.passenger.filter((item) => {
            const age = calculatAge(new Date(item.birthDay), flightDate);
            return age >= 12;
        }).length || 0;


        return {
            total: {count: adultCount + childCount + newBornCount, price: total || 0},
            newborn: {
                count: newBornCount,
                price: parseInt(selectedItem.ticketDetail?.infantPrice || '0', 10) * newBornCount
            },
            child: {count: childCount, price: parseInt(selectedItem.ticketDetail?.childPrice || '0', 10) * childCount},
            adult: {count: adultCount, price: parseInt(selectedItem.ticketDetail?.adultPrice || '0', 10) * adultCount}
        };
    }

    return (
        <Box mt='xxl' mx='xl'>
            <Text textAlign={'left'} variant={'BodyTitle1Second'} color='Black' lineHeight={24}>جزئیات پرداخت</Text>

            <PassengersPrice details={PassengerPriceHandler()} selectedItem={selectedItem}/>

            <Box alignItems={'center'}>
                <Box backgroundColor={'Grey300'} width={'100%'} height={0.5}/>
                <Box my='xl' flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}
                     width={'100%'}>

                    <Text fontSize={{tablet: 18}} variant={'BodyTitle1First'} color={'Primary500'}
                          marginHorizontal={'s'}>مبلغ پرداختی</Text>

                    <Text fontSize={{tablet: 18}} variant='TitleH4' color={'Error'} >
                        {selectedItem?.totalPrice ? new Number(selectedItem?.totalPrice).toLocaleString('fa-ir') : '--'}
                        <Text fontSize={{tablet: 18}} color={'Grey500'} marginHorizontal={'s'}
                              variant={'Body3Second'}> ریال</Text>
                    </Text>
                </Box>
            </Box>
        </Box>
    )
}
