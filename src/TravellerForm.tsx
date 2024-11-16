import React, {useEffect, useRef, useState} from 'react';
import {Box, makeStyles, Text} from '../../Constants/Theme';
import {validateIranianNationalId} from "../../utils/utils.ts";
import {ScrollView} from "react-native";
import {
    passengerFieldsDropDown,
    TravellerFormFieldsCitizens,
    TravellerFormFieldsForeign
} from "../../Constants/data/Passenger.ts";
import CustomInput from "../../components/reusable/modules/CustomInput.tsx";
import {Datepicker, DropDownItem} from "../../components/reusable";
import CheckboxGroup from "../../components/reusable/CheckboxGroup.tsx";
import Form from "../../components/reusable/modules/Form/Form.tsx";
import {convertGregorianToJalaali} from "../../utils/DateUtils.ts";
import InitialState from "../../Constants/interfaces/TicketInfo.ts";
import {useSelector} from "react-redux";

type TravellerFormProps = {
    selectedTab: string;
    PassengerInfo: any;
    onChange: (values: object) => void;
};

const genders = [
    {value: "m", label: "مرد"},
    {value: "f", label: "زن"},
];

const TravellerForm = ({PassengerInfo, selectedTab,onChange}: TravellerFormProps) => {
    const styles = useStyles();
    const ticketInfo: InitialState = useSelector((state: any) => state.ticketInfoReducer);
    const ref = useRef<any>();

    const [gender, setGender] = useState<string>(PassengerInfo ? PassengerInfo.gender : "m");
    const [nationality, setNationality] = useState<string | null>(PassengerInfo?.nationality || null);

    const formatDate = (date: string | Date | null): string | null => {
        if (date instanceof Date) {
            return date.toISOString().split('T')[0]; // Convert Date to YYYY-MM-DD string format.
        }
        return date;
    };

    const [birthDay, setBirthDay] = useState<string | null>(
        PassengerInfo ? selectedTab === "اتباع خارجی"
                ? formatDate(PassengerInfo?.birthDay)
                : convertGregorianToJalaali(PassengerInfo?.birthDay)
            : null
    );

    const [passportExp, setPassportExp] = useState<string | null>(
        PassengerInfo ? selectedTab === "اتباع خارجی"
                ? formatDate(PassengerInfo?.passportExp)
                : convertGregorianToJalaali(PassengerInfo?.passportExp)
            : null
    );

    const passengerField = selectedTab === "اتباع خارجی"
        ? TravellerFormFieldsForeign
        : TravellerFormFieldsCitizens;

    useEffect(() => {
        if (!PassengerInfo?.name) {
            return;
        }
        ref.current?.set('name_persian', PassengerInfo?.name_persian || '');
        ref.current?.set('family_persian', PassengerInfo?.family_persian || '');
        ref.current?.set('name', PassengerInfo?.name || '');
        ref.current?.set('family', PassengerInfo?.family || '');
        ref.current?.set('nationalId', PassengerInfo?.nationalId || '');
        ref.current?.set('passportId', PassengerInfo?.passportId || '');

        setGender(PassengerInfo ? PassengerInfo.gender : "m");
        setNationality(PassengerInfo?.nationality || null);
        setBirthDay(
            PassengerInfo ? selectedTab === "اتباع خارجی"
                    ? formatDate(PassengerInfo?.birthDay)
                    : convertGregorianToJalaali(PassengerInfo?.birthDay)
                : null
        )
        setPassportExp(
            PassengerInfo ? selectedTab === "اتباع خارجی"
                    ? formatDate(PassengerInfo?.passportExp)
                    : convertGregorianToJalaali(PassengerInfo?.passportExp)
                : null
        )
    }, [PassengerInfo]);

    return (
        <>
            <Form
                ref={ref}
                onChange={({values})=>{
                    onChange(values);
                }}
                enableReinitialize={true}  // Ensures form updates with new PassengerInfo
                config={(yup) => ({
                    name_persian: {
                        initialValue: PassengerInfo?.name_persian || '',
                        validation: selectedTab !== "اتباع خارجی" && yup.string().required("فیلد را پر کنید")
                            .trim("نام نباید فقط از فاصله تشکیل شده باشد")
                            .matches(/^[\u0600-\u06FF\s]+$/, "نام فقط باید شامل حروف فارسی باشد")
                            .min(2, "تعداد کاراکتر های انتخابی کمتر از حد مجاز میباشد")
                            .max(25, "تعداد کاراکتر های انتخابی بیشتر از حد مجاز میباشد")
                            .label("name_persian"),
                    },
                    family_persian: {
                        initialValue: PassengerInfo?.family_persian || '',
                        validation: selectedTab !== "اتباع خارجی" && yup.string().required("فیلد را پر کنید")
                            .trim("نام خانوادگی نباید فقط از فاصله تشکیل شده باشد")
                            .matches(/^[\u0600-\u06FF\s]+$/, "نام خانوادگی فقط باید شامل حروف فارسی باشد")
                            .min(2, "تعداد کاراکتر های انتخابی کمتر از حد مجاز میباشد")
                            .max(25, "تعداد کاراکتر های انتخابی بیشتر از حد مجاز میباشد")
                            .label("family_persian"),
                    },
                    name: {
                        initialValue: PassengerInfo?.name || '',
                        validation: yup.string().required("فیلد را پر کنید")
                            .trim("نام نباید فقط از فاصله تشکیل شده باشد")
                            .matches(/^[a-zA-Z\s]+$/, "نام فقط باید شامل حروف انگلیسی باشد")
                            .min(2, "تعداد کاراکتر های انتخابی کمتر از حد مجاز میباشد")
                            .max(25, "تعداد کاراکتر های انتخابی بیشتر از حد مجاز میباشد")
                            .label("name"),
                    },
                    family: {
                        initialValue: PassengerInfo?.family || '',
                        validation: yup.string().required("فیلد را پر کنید")
                            .trim("نام خانوادگی نباید فقط از فاصله تشکیل شده باشد")
                            .matches(/^[a-zA-Z\s]+$/, "نام خانوادگی فقط باید شامل حروف انگلیسی باشد")
                            .min(2, "تعداد کاراکتر های انتخابی کمتر از حد مجاز میباشد")
                            .max(25, "تعداد کاراکتر های انتخابی بیشتر از حد مجاز میباشد")
                            .label("family"),
                    },
                    nationalId: {
                        initialValue: PassengerInfo?.nationalId || '',
                        validation: selectedTab !== "اتباع خارجی" && yup.string().nullable().required("فیلد را پر کنید")
                            .trim("کد ملی نباید فقط از فاصله تشکیل شده باشد")
                            .matches(/^[0-9]+$/, ' لطفا فقط عدد وارد کنید')
                            .matches(/^\d{10}$/, 'کد ملی باید دقیقاً 10 رقم باشد')
                            .test(
                                'iran-national-id',
                                'کد ملی معتبر نیست',
                                value => !value || validateIranianNationalId(value || '')
                            )
                            .label("nationalId"),
                    },
                    passportId: {
                        initialValue: PassengerInfo?.passportId || '',
                        validation: selectedTab === "اتباع خارجی" && yup.string()
                            .required("فیلد را پر کنید")
                            .trim("شماره گذرنامه نباید فقط از فاصله تشکیل شده باشد")
                            .min(6, "شماره گذرنامه باید حداقل 6 کاراکتر باشد")
                            .max(10, "شماره گذرنامه نباید بیشتر از 10 کاراکتر باشد")
                            .label("passportId")
                    },
                })}
            >
                {({wrapIt, disableSubmitUI, submit, inputProps, errors}) => {

                    return (
                        <>
                            <ScrollView>
                                <Box>
                                    {passengerField.map((field, index) => (
                                        <CustomInput
                                            key={index}
                                            textInputProps={{
                                                ...inputProps(field.name),
                                            }}
                                            containerStyle={{
                                                marginVertical: 10,
                                                width: "100%"
                                            }}
                                            label={field.title}
                                            editable={true}
                                            toUpperCase={false}
                                            variant="special"
                                        />
                                    ))}
                                    {selectedTab === "اتباع خارجی" &&
                                        <>
                                            <Datepicker
                                                placeholder={'تاریخ انقضا پاسپورت خود را وارد نمایید'}
                                                title={'تاریخ انقضاء پاسپورت'}
                                                onDateSelect={(date) => setPassportExp(date)}
                                                selectedDate={passportExp}
                                                type={selectedTab === "اتباع خارجی" ? "future" : "primary"}
                                                key={"passportExp"}
                                            />
                                            {disableSubmitUI && !passportExp && (
                                                <Text style={styles.error}>فیلد را پر کنید</Text>
                                            )}
                                        </>
                                    }
                                    {selectedTab === "اتباع خارجی" &&
                                        <>
                                            <DropDownItem
                                                items={passengerFieldsDropDown[0]?.options}
                                                title={passengerFieldsDropDown[0]?.title}
                                                initialValue={"QAT"}
                                                itemSet={(item) => setNationality(item.value)}
                                                nationality={nationality}
                                            />
                                            {disableSubmitUI && !nationality && (
                                                <Text style={styles.error}>فیلد را پر کنید</Text>
                                            )}
                                        </>
                                    }
                                    <Datepicker
                                        placeholder={'تاریخ تولد خود را وارد نمایید'}
                                        title={'تاریخ تولد'}
                                        onDateSelect={(date) => setBirthDay(date)}
                                        selectedDate={birthDay}
                                        type={selectedTab === "اتباع خارجی" ? "international" : "default"}
                                        key={"birthDay"}
                                    />
                                    {disableSubmitUI && birthDay === null && (
                                        <Text style={styles.error}>فیلد را پر کنید</Text>
                                    )}
                                    <CheckboxGroup
                                        options={genders}
                                        setGender={setGender}
                                        gender={gender}
                                    />
                                    {disableSubmitUI && gender === null && (
                                        <Text style={styles.error}>فیلد را پر کنید</Text>
                                    )}
                                </Box>
                            </ScrollView>
                        </>
                    );
                }}
            </Form>
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    error: {
        marginTop: -10,
        marginLeft: 5,
        fontSize: 12,
        color: "red",
        textAlign: "left",
        fontFamily: "Peyda-Regular",
    },
}));

export {TravellerForm};
