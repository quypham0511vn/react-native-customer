import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

import { LINKS, STORE_APP_LINK } from '@/api/constants';
import FaceIdActive from '@/assets/images/ic_faceid_big.svg';
import EKyc from '@/assets/images/ic_green_shield.svg';
import UnEKyc from '@/assets/images/ic_red_shield.svg';
import Warning from '@/assets/images/ic_warning.svg';
import File from '@/assets/images/user/file.svg';
import Fingerprint from '@/assets/images/user/fingerprint.svg';
import Friends from '@/assets/images/user/friends.svg';
import Help from '@/assets/images/user/help.svg';
import Link from '@/assets/images/user/link.svg';
import LockUser from '@/assets/images/user/lock-user.svg';
import Logout from '@/assets/images/user/logout.svg';
import Question from '@/assets/images/user/question.svg';
import RightArrows from '@/assets/images/user/right-arrow.svg';
import User from '@/assets/images/user/user.svg';
import Woman from '@/assets/images/user/woman.svg';
import { BOTTOM_HEIGHT, Configs, isIOS } from '@/commons/Configs';
import { ENUM_BIOMETRIC_TYPE, STATE_AUTH_ACC } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button, HeaderBar } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { Touchable } from '@/components/elements/touchable/index';
import { MyImageView } from '@/components/image';
import PopupRate from '@/components/PopupRate';
import PopupVerifyRequest from '@/components/PopupVerifyRequest';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { PopupActionTypes } from '@/models/typesPopup';
import { UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import { COLORS, IconSize, Styles } from '@/theme';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';
import MyLoading from '@/components/MyLoading';

const Account = observer(() => {
    const { apiServices, userManager, fastAuthInfoManager } = useAppStore();

    const [userInfo, setUserInfo] = useState<UserInfoModel | undefined>(
        userManager.userInfo
    );
    const [rating, setRate] = useState<string>('0');
    const [contentRate, setContentRate] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const popupAlert = useRef<PopupActionTypes>(null);
    const popupRateRef = useRef<PopupActionTypes>(null);
    const popupDeleteAccountRef = useRef<PopupActionTypes>(null);

    const isFocused = useIsFocused();
    useEffect(() => {
        AnalyticsUtils.trackEvent(ScreenNames.history);
    }, []);

    const fetchUserInfo = useCallback(async () => {
        const res = await apiServices.auth.getUserInfo();
        if (res?.success) {
            userManager.updateUserInfo({ ...userManager.userInfo, rate: res.data?.rate || '0' } as UserInfoModel);
        }
    }, [apiServices.auth, userManager]);

    useEffect(() => {
        setUserInfo(userManager.userInfo);
        if (!userManager?.userInfo) {
            Navigator.navigateScreen(ScreenNames.auth);
        }
    }, [userManager?.userInfo, isFocused]);

    useEffect(() => {
        if (isFocused) {
            fetchUserInfo();
        }
    }, [isFocused]);

    const renderItem = useCallback(
        (_title: string, _image: any, _onPress: any) => {
            return (
                <Touchable onPress={_onPress} style={styles.itemList}>
                    {_image}
                    <Text style={styles.txtItem}>{_title}</Text>
                    <RightArrows />
                </Touchable>
            );
        }, []);

    const logOut = useCallback(() => {
        popupAlert.current?.show();
    }, []);

    const onLogOutSuccess = useCallback(() => {
        popupAlert.current?.hide?.();
        SessionManager.logout();
        userManager.updateUserInfo(null);
    }, [userManager]);

    const profileAuth = () => { Navigator.navigateScreen(ScreenNames.profile); };

    const identityAuth = () => { Navigator.navigateScreen(ScreenNames.identityAuthen); };

    const changePassword = () => { Navigator.navigateScreen(ScreenNames.changePassword); };

    const navigateToAuth = () => { Navigator.navigateScreen(ScreenNames.SettingQuickAuth); };

    const referFriend = () => { Navigator.navigateScreen(ScreenNames.referFriend); };

    const onShowRatingPopup = useCallback(() => {
        popupRateRef.current?.show();
    }, []);

    const renderInput = useCallback((_value: string, onChangeText: any) => {
        return (
            <MyTextInput
                value={_value}
                multiline={true}
                containerInput={styles.input}
                onChangeText={onChangeText}
            />
        );
    }, []);

    const onChangeText = useCallback((value: string) => {
        setContentRate(value);
    }, []);

    const renderStar = useCallback((defaultRating?: any) => {
        return (
            <View style={styles.wrapStar}>
                <AirbnbRating
                    count={5}
                    defaultRating={defaultRating || 0}
                    size={20}
                    showRating={false}
                    isDisabled={false}
                />
            </View>
        );
    }, []);

    const openLink = useCallback(() => {
        Utils.openURL(STORE_APP_LINK);
    }, []);

    const renderModal = useMemo(() => {
        const onSendRate = async () => {
            setLoading(true);
            const res = await apiServices.common.getRate(rating, contentRate);
            setLoading(false);
            if (res.success) {
                userManager.updateUserInfo({ ...userManager.userInfo, rate: rating } as UserInfoModel);
                setContentRate('');
                setTimeout(() => {
                    popupRateRef.current?.hide();
                }, 400);
                if (Number(rating || '0') >= 4) { openLink(); }
                else {
                    ToastUtils.showSuccessToast(Languages.feedback.sentSuccess);
                }
            }
        };

        const onBackdropPress = () => {
            setContentRate('');
            popupRateRef.current?.hide();
        };

        return (
            <PopupRate
                ref={popupRateRef}
                onBackdropPress={onBackdropPress}
                onSendRate={onSendRate}
                renderInput={renderInput(contentRate, onChangeText)}
                rate={rating}
                setRate={setRate}
                rightIcon={isLoading && <MyLoading isWhite />}
            />
        );
    }, [apiServices.common, contentRate, isLoading, onChangeText, openLink, rating, renderInput, userManager]);

    const navigateAboutUs = () => {
        Navigator.pushScreen(ScreenNames.myWebview, {
            title_vi: Languages.itemInForAccount.introduction,
            content_vi: LINKS.ABOUT_US,
            uri: true
        });
    };

    const navigatePolicy = () => {
        Navigator.pushScreen(ScreenNames.myWebview, {
            title_vi: Languages.itemInForAccount.termSandCondition,
            content_vi: LINKS.POLICY,
            uri: true
        });
    };

    const navigateFaqs = () => {
        Navigator.pushScreen(ScreenNames.myWebview, {
            title_vi: Languages.itemInForAccount.support,
            content_vi: LINKS.FAQ,
            uri: true
        });
    };
    const navigateToLinkAccount = () => { Navigator.pushScreen(ScreenNames.linkAccountSocial); };

    const popupVerifyRequest = useMemo(() => {
        return (
            <PopupVerifyRequest
                icon={<Warning width={50} height={50} />}
                content={Languages.errorMsg.logoutMessage}
                onConfirm={onLogOutSuccess}
                ref={popupAlert}
            />
        );
    }, [onLogOutSuccess]);

    const onShowOtpDeleteAccount = useCallback(() => {
        popupDeleteAccountRef.current?.hide();
        Navigator.pushScreen(ScreenNames.otpDeleteAccount);
    }, []);

    const popupDeleteAccount = useMemo(() => {
        return (
            <PopupVerifyRequest
                icon={<Warning width={50} height={50} />}
                content={Languages.maintain.deleteAccountConfirm}
                onConfirm={onShowOtpDeleteAccount}
                ref={popupDeleteAccountRef}
            />
        );
    }, [onShowOtpDeleteAccount]);

    const onOpenPopupDeleteAccount = useCallback(() => {
        popupDeleteAccountRef.current?.show();
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.tabs.account} exitApp />

            <View style={styles.inF}>
                <MyImageView style={styles.imageAvatar} imageUrl={userInfo?.avatar} />
                <View style={styles.textInfo}>
                    <Text style={styles.textName}>{userInfo?.full_name}</Text>
                    <Text style={styles.textPhone}>{userInfo?.phone_number}</Text>
                </View>
                <TouchableOpacity onPress={logOut}>
                    <Logout style={styles.logout} {...IconSize.size25_25} />
                </TouchableOpacity>
                {popupVerifyRequest}
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {renderItem(Languages.itemInForAccount.inFor, <User />, profileAuth)}
                {renderItem(
                    userManager.userInfo?.auth === STATE_AUTH_ACC.VERIFIED ? Languages.itemInForAccount.eKyc : Languages.itemInForAccount.unEKyc,
                    userManager.userInfo?.auth === STATE_AUTH_ACC.VERIFIED ? <EKyc /> : <UnEKyc />,
                    identityAuth)}
                {renderItem(Languages.itemInForAccount.changePwd, <LockUser />, changePassword)}
                {renderItem(Languages.itemInForAccount.authentication,
                    fastAuthInfoManager?.supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID ? <Fingerprint /> : <FaceIdActive width={20} height={20} />,
                    navigateToAuth
                )}
                {renderItem(Languages.itemInForAccount.reFerFriends, <Friends />, referFriend)}
                {renderItem(Languages.itemInForAccount.afFiLiateAccount, <Link />, navigateToLinkAccount)}
                <View style={styles.step2}>
                    {renderItem(Languages.itemInForAccount.introduction, <Question />, navigateAboutUs)}
                    {renderItem(Languages.itemInForAccount.termSandCondition, <File />, navigatePolicy)}
                    {renderItem(Languages.itemInForAccount.support, <Help />, navigateFaqs)}
                </View>
                <Touchable
                    style={styles.fedBack}
                    onPress={onShowRatingPopup}
                    disabled={Number(userManager.userInfo?.rate || '0') >= 4}
                >
                    <View style={styles.starLeft}>
                        <Text style={styles.textTitleFeed}>{Languages.feedback.title}</Text>
                        <Text style={styles.textTitleDescriptionFeed}>{Languages.feedback.description}</Text>
                        {renderStar(userManager.userInfo?.rate)}
                    </View>
                    <Woman />
                </Touchable>

                {isIOS &&
                    <Button label={`${Languages.maintain.deleteAccount}`}
                        style={styles.wrapBtn}
                        buttonStyle={BUTTON_STYLES.GRAY}
                        onPress={onOpenPopupDeleteAccount}
                        isLowerCase
                    />}
            </ScrollView>
            {renderModal}
            {popupDeleteAccount}
        </View>
    );
});

export default Account;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_10
    },
    scrollView: {
        paddingTop: 5,
        paddingBottom: BOTTOM_HEIGHT
    },
    inF: {
        padding: 15,
        backgroundColor: COLORS.WHITE,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    textInfo: {
        flex: 1,
        marginLeft: 15
    },
    logout: {
        flex: 1
    },
    textName: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16
    },
    textPhone: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        color: COLORS.BLACK
    },
    itemList: {
        backgroundColor: COLORS.WHITE,
        marginBottom: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 20
    },
    itemTitle: {
        flex: 1,
        marginLeft: 10
    },
    step2: {
        marginTop: 15
    },
    fedBack: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: COLORS.WHITE,
        padding: 20,
        margin: 20,
        marginTop: 10,
        borderRadius: 20
    },
    starLeft: {
        flex: 2
    },
    textTitleFeed: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        marginBottom: 5
    },
    textTitleDescriptionFeed: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.DARK_GRAY
    },
    txtItem: {
        ...Styles.typography.regular,
        flex: 1,
        marginLeft: 10
    },
    imageAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: COLORS.GRAY_5,
        borderWidth: 1
    },
    modalWrap: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        backgroundColor: COLORS.WHITE,
        borderRadius: 10
    },
    wrapStar: {
        flexDirection: 'row',
        marginTop: 3,
        marginHorizontal: 4
    },
    titleRate: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.DARK_GRAY
    },
    contentRateTitle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        color: COLORS.DARK_GRAY
    },
    wrapContentRate: {
        width: '100%',
        height: SCREEN_HEIGHT / 7,
        justifyContent: 'space-between',
        marginBottom: 40
    },
    input: {
        borderColor: COLORS.GRAY_10,
        fontSize: Configs.FontSize.size14,
        borderRadius: 10,
        height: SCREEN_HEIGHT / 7,
        marginVertical: 5
    },
    rate: {
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20
    },
    containerRate: {
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: SCREEN_WIDTH * 0.8,
        marginTop: 7
    },
    reviewTitle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.DARK_GRAY
    },
    wrapBtn: {
        marginVertical: 10,
        width: SCREEN_WIDTH - 30,
        marginHorizontal: 15
    }
});
