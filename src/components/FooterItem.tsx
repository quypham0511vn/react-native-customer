import React, { useCallback } from 'react';
import {View, Text, StyleSheet } from 'react-native';

import { COLORS } from '@/theme';
import Utils from '@/utils/Utils';
import { CONTACT, LINKS } from '@/api/constants';
import { Touchable } from './elements/touchable';
import { Configs } from '@/commons/Configs';
import LocationIcon from '@/assets/images/ic_location_active.svg';
import PhoneIcon from '@/assets/images/ic_phone.svg';
import HelpIcon from '@/assets/images/ic_help.svg';
import Languages from '@/commons/Languages';

const FooterItem = () => {
    const onCallVfc = useCallback(() =>{
        Utils.callNumber(CONTACT.PHONE);
    },[]);

    const onRedirectWebsite = useCallback(() =>{
        Utils.openURL(LINKS.WEB);
    },[]);

    const renderFooterItem = useCallback((icon?: any, title?:string, style?: any, onPress?: any) => {

        return (
            <Touchable style={style} onPress={onPress}>
                <View style={styles.icon}>{icon}</View>
                <Text style={styles.txtFooter}>{title}</Text>
            </Touchable>
        );
    }, []);

    return <View style={styles.wrapFooter}>
        {renderFooterItem(
            <LocationIcon width={15} height={15} />,
            Languages.authentication.company,
            styles.footerItem,
            onRedirectWebsite
        )}
        {/* {renderFooterItem(
            <HelpIcon width={15} height={15} />,
            Languages.authentication.help,
            styles.footerItem
        )} */}
        {renderFooterItem(
            <PhoneIcon width={15} height={15} />,
            Languages.authentication.switchboard,
            styles.footerItem,
            onCallVfc
        )}
    </View>;
   
};

export default FooterItem;
const styles = StyleSheet.create({
    footerItem: {
        flexDirection: 'row',
        justifyContent:'center'
    },
    wrapFooter: {
        flexDirection: 'row',
        width: '100%',
        justifyContent:'space-around',
        paddingBottom:30
    },
    txtFooter: {
        color: COLORS.GRAY,
        fontSize: Configs.FontSize.size14,
        marginLeft: 5,
        fontFamily: Configs.FontFamily.regular
    },
    icon: {
        justifyContent: 'center'
    }
});
