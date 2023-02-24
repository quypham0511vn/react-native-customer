import Clipboard from '@react-native-clipboard/clipboard';
import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Lightbox from 'react-native-lightbox';
import QRCode from 'react-native-qrcode-svg';

import { LINKS } from '@/api/constants';
import Facebook from '@/assets/images/facebook.svg';
import IcTienngay from '@/assets/images/ic_tienngay.jpg';
import ImgReferral from '@/assets/images/img_referral.jpg';
import Share from '@/assets/images/share.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Button } from '@/components/elements/button/index';
import { Touchable } from '@/components/elements/touchable/index';
import { useAppStore } from '@/hooks';
import { UserInfoModel } from '@/models/user-model';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import { COLORS, IconSize, Styles } from '../../theme';

const ReferFriends = observer(() => {
    const { userManager } = useAppStore();
    const [userInfo] = useState<UserInfoModel | undefined>(userManager.userInfo);
    const [phone] = useState<string>(userInfo?.phone_number || '');

    const _onClipboard = useCallback(() => {
        Clipboard.setString(LINKS.ONE_LINK);

    }, []);

    const _onClipboardPhone = useCallback(() => {
        Clipboard.setString(phone);
    }, [phone]);

    const _onShareFb = useCallback(() => {
        Utils.openURL(LINKS.FB_FAN_PAGE);
    }, []);

    const _onShareSocial = useCallback(() => {
        Utils.share(LINKS.ONE_LINK);
    }, []);

    const renderContent = useCallback(() => {
        return <QRCode
            value={LINKS.ONE_LINK}
            logo={IcTienngay}
            size={SCREEN_WIDTH}
        />;
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.refer.title} />
            <ScrollView>
                <View style={styles.bannerContainer}>
                    <Image
                        style={styles.bannerImage}
                        source={ImgReferral}
                        resizeMode={'contain'}
                    />
                </View>
                <View style={styles.referBox}>
                    <Text style={styles.title}>{Languages.refer.link}</Text>
                    <View style={styles.boxContainer}>
                        <Text numberOfLines={1} style={styles.textCp}>
                            {LINKS.ONE_LINK}
                        </Text>
                        <Button radius={5}
                            onPress={_onClipboard}
                            buttonStyle={BUTTON_STYLES.GREEN}
                            style={styles.button}
                            fontSize={Configs.FontSize.size13}
                            label={Languages.refer.copPy} />
                    </View>
                    <View style={styles.col}>
                        <View style={styles.boxLeft}>
                            <Text style={styles.title}>{Languages.refer.key}</Text>
                            <View style={styles.boxContainer}>
                                <Text onPress={_onClipboardPhone} numberOfLines={1} style={styles.textCp}>
                                    {phone}
                                </Text>
                            </View>
                            <View style={styles.shareBox}>
                                <Text style={styles.title}>{Languages.refer.share}</Text>
                                <View style={styles.share}>
                                    <Touchable onPress={_onShareFb} style={styles.facebook} radius={20}>
                                        <Facebook {...IconSize.size40_40} />
                                    </Touchable>
                                    <Touchable onPress={_onShareSocial} radius={20}>
                                        <Share  {...IconSize.size40_40} />
                                    </Touchable>
                                </View>
                            </View>
                        </View>
                        <View style={styles.boxRight}>
                            <Text style={styles.title}>{Languages.refer.qr}</Text>
                            <Lightbox
                                renderContent={renderContent}>
                                <QRCode
                                    value={LINKS.ONE_LINK}
                                    logo={IcTienngay}
                                />
                            </Lightbox>

                        </View>
                    </View>
                    <View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
});

export default ReferFriends;

const IMAGE_WIDTH = SCREEN_WIDTH - 20;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    referBox: {
        paddingTop: 20,
        paddingRight: 15,
        paddingLeft: 15
    },
    title: {
        ...Styles.typography.medium,
        marginBottom: 5
    },
    boxContainer: {
        backgroundColor: COLORS.GRAY_10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textCp: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size13,
        color: COLORS.LIGHT_GRAY,
        alignItems: 'center',
        padding: 10,
        flex: 1
    },
    button: {
        width: 70
    },
    col: {
        flexDirection: 'row',
        marginTop: 25
    },
    boxLeft: {
        flex: 1,
        marginRight: 30
    },
    boxRight: {
        position: 'relative',
        right: 0
    },
    share: {
        flexDirection: 'row',
        marginTop: 5
    },
    shareBox: {
        marginTop: 10
    },
    facebook: {
        marginRight: 15
    },
    bannerContainer: {
        alignItems: 'center',
        marginTop: 10
    },
    bannerImage: {
        width: '100%',
        height: IMAGE_WIDTH / 1305 * 560
    }
});

