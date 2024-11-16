import {useSelector} from "react-redux";
import React from "react";
import {Box, Text} from "../../../Constants/Theme";
import {Accordion} from "../../../components/reusable";
import {convertToPersianDigits, formatCurrency} from "../../../utils/utils";
import {IOrderData, Passenger} from "../../../Constants/interfaces";
import {CheckAgeFunc} from "../../profile";

type PassengersPriceProps = {
    details: any;
    expanded?: any;
    handleChange?: any;
    selectedItem?: IOrderData;
};
const PassengersPrice = ({details, expanded, handleChange, selectedItem}: PassengersPriceProps) => {
    const {theme} = useSelector((state: any) => state.themeReducer);
    const {total, newborn, child, adult} = details

    return (
        <Box my={'xl'}>
            <Box my={'s'} flexDirection={'row'} justifyContent={'space-between'} py={'m'}>
                <Text color={'Grey700'} fontSize={{tablet: 18}} variant={'BodyTitle2Fourth'}>بزرگسال <Text
                    fontSize={{tablet: 18}} variant={'BodyTitle2Fourth'}>({convertToPersianDigits(adult?.count)})</Text>
                </Text>
                <Text fontSize={{tablet: 18}} color={'Grey400'} variant={'Body3Second'}> <Text fontSize={{tablet: 18}}
                                                                                               variant={'BodyTitle1Fourth'}
                                                                                               color={'Grey700'}> {convertToPersianDigits(formatCurrency(adult?.price))}</Text> ریال</Text>
            </Box>
            <Box my={'s'} flexDirection={'row'} justifyContent={'space-between'} py={'m'}>
                <Text color={'Grey700'} fontSize={{tablet: 18}} variant={'BodyTitle2Fourth'}>کودک <Text
                    fontSize={{tablet: 18}} variant={'BodyTitle2Fourth'}>({convertToPersianDigits(child?.count)})</Text>
                </Text>
                <Text fontSize={{tablet: 18}} color={'Grey400'} variant={'Body3Second'}> <Text fontSize={{tablet: 18}}
                                                                                               variant={'BodyTitle1Fourth'}
                                                                                               color={'Grey700'}> {convertToPersianDigits(formatCurrency(child?.price))}</Text> ریال</Text>
            </Box>
            <Box my={'s'} flexDirection={'row'} justifyContent={'space-between'} py={'m'}>
                <Text color={'Grey700'} fontSize={{tablet: 18}} variant={'BodyTitle2Fourth'}>نوزاد <Text
                    fontSize={{tablet: 18}}
                    variant={'BodyTitle2Fourth'}>({convertToPersianDigits(newborn?.count)})</Text> </Text>
                <Text fontSize={{tablet: 18}} color={'Grey400'} variant={'Body3Second'}> <Text fontSize={{tablet: 18}}
                                                                                               variant={'BodyTitle1Fourth'}
                                                                                               color={'Grey700'}> {convertToPersianDigits(formatCurrency(newborn?.price))}</Text> ریال</Text>
            </Box>
            {selectedItem && <Box my={'s'} flexDirection={'row'} justifyContent={'space-between'} py={'m'}>
                <Text color={'Grey700'} fontSize={{tablet: 18}} variant={'BodyTitle2Fourth'}>مجموع </Text>
                <Text fontSize={{tablet: 18}} color={'Grey400'} variant={'Body3Second'}> <Text fontSize={{tablet: 18}}
                                                                                               variant={'BodyTitle1Fourth'}
                                                                                               color={'Grey700'}>                         {selectedItem?.totalPrice ? new Number(selectedItem?.totalPrice).toLocaleString('fa-ir') : '--'}
                </Text> ریال</Text>
            </Box>}
        </Box>
    )
}

export const TotalPrice = ({ticketInfo}: Record<string, any>) => {

    const [totalPriceBeforeDiscount, setTotalPriceBeforeDiscount] = React.useState(0);
    const [totalPriceAfterDiscount, setTotalPriceAfterDiscount] = React.useState(0);
    const [priceBreakdown, setPriceBreakdown] = React.useState({
        adult: 0,
        child: 0,
        newBorn: 0,
    });
    const [priceDifference, setPriceDifference] = React.useState({
        adult: 0,
        child: 0,
        newBorn: 0,
    });
    const [totalDiscount, setTotalDiscount] = React.useState(0);

    const computeTotalPrice = () => {
        const adultPrice = ticketInfo.adultPrice;
        const childPrice = ticketInfo.childPrice;
        const infantPrice = ticketInfo.infantPrice;

        const discountedAdultPrice = ticketInfo?.discounted && ticketInfo.discountedAdultPrice
            ? ticketInfo.discountedAdultPrice
            : adultPrice;
        const discountedChildPrice = ticketInfo?.discounted && ticketInfo.discountedChildPrice
            ? ticketInfo.discountedChildPrice
            : childPrice;
        const discountedInfantPrice = ticketInfo?.discounted && ticketInfo.discountedInfantPrice
            ? ticketInfo.discountedInfantPrice
            : infantPrice;


        const totalAdultPriceBeforeDiscount = adultPrice * ticketInfo.passengers.adult;
        const totalChildPriceBeforeDiscount = childPrice * ticketInfo.passengers.child;
        const totalInfantPriceBeforeDiscount = infantPrice * ticketInfo.passengers.newBorn;

        const totalAdultPriceAfterDiscount = discountedAdultPrice * ticketInfo.passengers.adult;
        const totalChildPriceAfterDiscount = discountedChildPrice * ticketInfo.passengers.child;
        const totalInfantPriceAfterDiscount = discountedInfantPrice * ticketInfo.passengers.newBorn;


        setPriceBreakdown({
            adult: totalAdultPriceAfterDiscount,
            child: totalChildPriceAfterDiscount,
            newBorn: totalInfantPriceAfterDiscount,
        });
        const discountAdult = totalAdultPriceBeforeDiscount - totalAdultPriceAfterDiscount;
        const discountChild = totalChildPriceBeforeDiscount - totalChildPriceAfterDiscount;
        const discountInfant = totalInfantPriceBeforeDiscount - totalInfantPriceAfterDiscount;

        setPriceDifference({
            adult: discountAdult,
            child: discountChild,
            newBorn: discountInfant,
        });

        const totalBeforeDiscount = totalAdultPriceBeforeDiscount + totalChildPriceBeforeDiscount + totalInfantPriceBeforeDiscount;
        const totalAfterDiscount = totalAdultPriceAfterDiscount + totalChildPriceAfterDiscount + totalInfantPriceAfterDiscount;
        const totalDiscount = discountAdult + discountChild + discountInfant;

        setTotalPriceBeforeDiscount(totalBeforeDiscount);
        setTotalPriceAfterDiscount(totalAfterDiscount);
        setTotalDiscount(totalDiscount);
    };

    React.useEffect(() => {
        computeTotalPrice();
    }, [ticketInfo.passengers]); // Recalculate when passenger counts change

    return (
        <Box my='xl'>
            {['adult', 'child', 'newBorn'].map((type, index) => (
                <Box key={index} my='s'>
                    <Box flexDirection='row' justifyContent='space-between' py='m'>
                        <Text color='Grey700' fontSize={{tablet: 18}} variant='BodyTitle2Fourth'>
                            {type === 'adult' ? 'بزرگسال' : type === 'child' ? 'کودک' : 'نوزاد'}
                            <Text fontSize={{tablet: 18}} variant='BodyTitle2Fourth'>
                                ({convertToPersianDigits(ticketInfo.passengers[type])})
                            </Text>
                        </Text>
                        <Text fontSize={{tablet: 18}} color='Grey500' variant='Body3Second'>
                            <Text fontSize={{tablet: 18}} variant='BodyTitle1Fourth' color='Grey700'>
                                {convertToPersianDigits(formatCurrency(priceBreakdown[type]))}
                            </Text> ریال
                        </Text>
                    </Box>
                    {ticketInfo?.discounted && (
                        <Box flexDirection='row' justifyContent='space-between' pb='l'>
                            <Text color='Error' fontSize={{tablet: 16}} variant='BodyTitle2Fourth'>
                                تخفیف {type === 'adult' ? 'بزرگسال' : type === 'child' ? 'کودک' : 'نوزاد'}
                            </Text>
                            <Text color='Error' fontSize={{tablet: 16}} variant='Body3Second'>
                                <Text color='Error' variant='BodyTitle1Fourth'>
                                    {convertToPersianDigits(formatCurrency(priceDifference[type]))}
                                </Text> ریال
                            </Text>
                        </Box>
                    )}
                </Box>
            ))}
            <Box my='s' flexDirection='row' justifyContent='space-between' py='m'>
                <Text color='Grey700' fontSize={{tablet: 18}} variant='BodyTitle2Fourth'>مجموع </Text>
                <Text fontSize={{tablet: 18}} color='Grey500' variant='Body3Second'>
                    <Text fontSize={{tablet: 18}} variant='BodyTitle1Fourth' color='Grey700'>
                        {convertToPersianDigits(formatCurrency(totalPriceBeforeDiscount))}
                    </Text> ریال
                </Text>
            </Box>

            {ticketInfo?.discounted && totalDiscount > 0 && (
                <Box my='s' flexDirection='row' justifyContent='space-between' pb='l' pt='s'>
                    <Text color='Error' fontSize={{tablet: 18}} variant='BodyTitle2Fourth'>مجموع تخفیف</Text>
                    <Text fontSize={{tablet: 18}} color='Error' variant='Body3Second'>
                        <Text fontSize={{tablet: 18}} variant='BodyTitle1Fourth' color='Error'>
                            {convertToPersianDigits(formatCurrency(totalDiscount))}
                        </Text> ریال
                    </Text>
                </Box>
            )}

            <Box backgroundColor='Grey200' width={'100%'} height={0.5} my='m'/>
            {/* Show Total Price After Discount */}
            <Box my='s' flexDirection='row' justifyContent='space-between' py='m'>
                <Text color='Primary500' fontSize={{tablet: 18}} variant='BodyTitle2First'>مجموع قابل پرداخت</Text>
                <Text fontSize={{tablet: 18}} color='Grey500' variant='Body3Second'>
                    <Text fontSize={{tablet: 18}} variant='BodyTitle1First' color='Error'>
                        {ticketInfo?.discounted && totalDiscount > 0 ? (
                            convertToPersianDigits(formatCurrency(totalPriceAfterDiscount))
                        ) : (
                            convertToPersianDigits(formatCurrency(totalPriceBeforeDiscount))
                        )}
                    </Text> ریال
                </Text>
            </Box>
        </Box>
    );
};


export default PassengersPrice;
