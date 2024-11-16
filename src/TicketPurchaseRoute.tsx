import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {Box, palette, Text} from '../../Constants/Theme';
import Icon from "react-native-remix-icon";
import {ParamListBase, RouteProp, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Checkout} from "../../screens/Ticket";
import {SvgXml} from "react-native-svg";
import {
    InfoBlack,
    InfoGreen, InfoGrey,
    PaymentGreen,
    PaymentGrey,
    TicketGreen,
    TicketGrey,
    UserBlack,
    UserGrren
} from "../../assets/images/icons/PurchaseRoute.ts";

interface Props {
    activeRoute: string;
    route: RouteProp<ParamListBase, string>;
    navigation: NativeStackNavigationProp<ParamListBase, string>;
}

export const pages = [
    {order: 1, name: 'مسافران', icon: UserBlack,seconderIcon:UserGrren, route: 'Checkout'},
    {order: 2, name: 'تایید اطلاعات', icon: InfoGrey,seconderIcon: InfoGreen, route: 'ConfirmInformation'},
    {order: 3, name: 'پرداخت', icon: PaymentGrey,seconderIcon: PaymentGreen, route: 'CancelOrder'},
    {order: 4, name: 'دریافت بلیط', icon: TicketGrey,seconderIcon: TicketGreen, route: 'GetTicket' },
];

const TicketPurchaseRoute = ({activeRoute}: Props) => {
    const navigator = useNavigation();
    const currentOrder = pages.find(page => page.route === activeRoute)?.order || 0;

    return (
        <Box  flexDirection='row' alignItems='center' justifyContent='center' backgroundColor='White' p='xl'  borderBottomWidth={1} borderBottomColor='Grey100'>
            {pages.map((page) => (
                // Conditional Rendering for TouchableOpacity based on page order
                page.order === currentOrder || page.order === currentOrder - 1 ? (
                    <TouchableOpacity key={page.name} style={{flexDirection:'row',alignItems:'center'}} onPress={() => navigator.navigate(page.route as never)}>
                        <Box px='xl' flexDirection='row' alignItems='center' justifyContent='center'>
                            <Box alignItems='center'>
                                <SvgXml xml={page.route === activeRoute ?page.seconderIcon : page.icon} width={20} height={20} />
                                <Text
                                    color={page.route === activeRoute ? "Primary500" : "Grey700"}
                                    mt={'sm'}
                                    variant={'BodyTitle2Third'}>
                                    {page.name}
                                </Text>
                            </Box>
                        </Box>
                        {page.name === 'دریافت بلیط' ? null :
                            <Icon  name={'ri-arrow-left-s-line'} size={18} color={palette.grey700}/>
                        }
                    </TouchableOpacity>
                ) : (
                    // Non-clickable box for items you can't navigate to
                    <Box key={page.name} style={{flexDirection:'row',alignItems:'center'}}>
                        <Box px='xl' flexDirection='row' alignItems='center' justifyContent='center'>
                            <Box  alignItems='center'>
                                <SvgXml xml={page.icon} width={20} height={20} />
                                <Text
                                    style={{color: palette.grey700}}
                                    mt={'sm'}
                                    variant={'BodyTitle2Third'}>
                                    {page.name}
                                </Text>
                            </Box>
                        </Box>
                        {page.name === 'دریافت بلیط' ? null :
                            <Icon  name={'ri-arrow-left-s-line'} size={18} color={palette.grey700}/>
                        }
                    </Box>
                )
            ))}
        </Box>
    );
};


const styles = StyleSheet.create({});

export {TicketPurchaseRoute};
