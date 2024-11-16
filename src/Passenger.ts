import {TravellerForm} from "../../screens/Ticket/TravellerForm.tsx";

export const passengerFields = [
    {
        name: 'name_persian',
        placeholder: 'نام خود را وارد نمایید',
        autoCompleteType: 'name_persian',
        title: 'نام فارسی',
    },
    {
        name: 'family_persian',
        placeholder: 'نام خانوادگی خود را وارد نمایید',
        autoCompleteType: 'family_persian',
        title: 'نام خانوادگی فارسی',
    },
    {
        name: 'name',
        placeholder: 'نام خود را به انگلیسی وارد نمایید',
        autoCompleteType: 'name',
        title: 'نام انگلیسی*',
    },
    {
        name: 'family',
        placeholder: 'نام خانوادگی خود را به انگلیسی وارد نمایید',
        autoCompleteType: 'family',
        title: 'نام خانوادگی انگلیسی*',
    },
    // {
    //     name: 'phone',
    //     placeholder: 'شماره تماس خود را وارد نمایید',
    //     autoCompleteType: 'phone',
    //     title: 'شماره تماس',
    // },
    {
        name: 'nationalId',
        placeholder: 'کد ملی 10 رقمی خود را وارد نمایید',
        autoCompleteType: 'nationalId',
        title: 'کد ملی',
    },
    {
        name: 'passportId',
        placeholder: 'شماره گذرنامه خود را وارد نمایید',
        autoCompleteType: 'passportId',
        title: 'شماره پاسپورت',
    },
];

export const TravellerFormFieldsForeign = [
    {
        name: 'name',
        placeholder: 'نام خود را به انگلیسی وارد نمایید',
        autoCompleteType: 'name',
        title: 'نام لاتین',
    },
    {
        name: 'family',
        placeholder: 'نام خانوادگی خود را به انگلیسی وارد نمایید',
        autoCompleteType: 'family',
        title: 'نام خانولدگی لاتین',
    },
    {
        name: 'passportId',
        placeholder: 'شماره گذرنامه خود را وارد نمایید',
        autoCompleteType: 'passportId',
        title: 'شماره گذرنامه',
    },
]
export const TravellerFormFieldsCitizens = [
    {
        name: 'name_persian',
        placeholder: 'نام خود را وارد نمایید',
        autoCompleteType: 'name_persian',
        title: 'نام',
    },
    {
        name: 'family_persian',
        placeholder: 'نام خانوادگی خود را وارد نمایید',
        autoCompleteType: 'family_persian',
        title: 'نام خانوادگی ',
    },
    {
        name: 'name',
        placeholder: 'نام خود را به انگلیسی وارد نمایید',
        autoCompleteType: 'name',
        title: 'نام لاتین',
    },
    {
        name: 'family',
        placeholder: 'نام خانوادگی خود را به انگلیسی وارد نمایید',
        autoCompleteType: 'family',
        title: 'نام خانولدگی لاتین',
    },
    {
        name: 'nationalId',
        placeholder: 'کد ملی 10 رقمی خود را وارد نمایید',
        autoCompleteType: 'nationalId',
        title: 'کد ملی',
    },
]
export const passengerFieldsDropDown = [
    {
        title: 'ملیت*',
        placeholder: ' ملیت خود را انتخاب نمایید',
        options: [
            {
                "value": "IRN",
                "label": "ایرانی"
            },
            {
                "value": "AFG",
                "label": "افغانستان"
            },
            {
                "value": "ARM",
                "label": "ارمنستان"
            },
            {
                "value": "AZE",
                "label": "آذربایجان"
            },
            {
                "value": "BHR",
                "label": "بحرین"
            },
            {
                "value": "IRQ",
                "label": "عراق"
            },
            {
                "value": "KWT",
                "label": "کویت"
            },
            {
                "value": "OMN",
                "label": "عمان"
            },
            {
                "value": "PAK",
                "label": "پاکستان"
            },
            {
                "value": "QAT",
                "label": "قطر"
            },
            {
                "value": "TUR",
                "label": "ترکیه"
            },
            {
                "value": "TKM",
                "label": "ترکمنستان"
            },
            {
                "value": "IND",
                "label": "هند"
            },
            {
                "value": "RUS",
                "label": "روسیه"
            },
            {
                "value": "ARE",
                "label": "امارات متحده عربی"
            },
            {
                "value": "LBN",
                "label": "لبنان"
            },
            {
                "value": "ENG",
                "label": "انگلیس"
            },
            {
                "value": "SAU",
                "label":"عربستان سعودی"
            }

        ]
    },
    {
        title: 'جنسیت',
        options: [
            {
                label: "زن",
                value: "f"
            },
            {
                label: "مرد",
                value: "m"
            }
        ]
    },
];

export const countries = [
]
