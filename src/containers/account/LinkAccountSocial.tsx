import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { COLORS, Styles } from '@/theme';
import FacebookIcon from '@/assets/images/ic_facebook.svg';
import GoogleIcon from '@/assets/images/ic_google.svg';
import AppleIcon from '@/assets/images/ic_apple.svg';
import NotLinkIcon from '@/assets/images/ic_not_link.svg';
import { ENUM_PROVIDER } from '@/commons/constants';
import { useAppStore } from '@/hooks';
import { loginWithApple, loginWithFacebook, loginWithGoogle } from '@/utils/SocialAuth';
import { UserInfoModel } from '@/models/user-model';
import LinkedIcon from '@/assets/images/ic_linked.svg';
import ToastUtils from '@/utils/ToastUtils';

const LinkAccountSocial = observer(() => {
    const { apiServices, userManager } = useAppStore();

    const fetchLinkSocial = useCallback(
        async (type: string, id: string) => {

            const res = await apiServices.auth.linkSocialAccount(type, id);
            if (res?.success) {
                ToastUtils.showSuccessToast(res?.message || '');
                const data = userManager?.userInfo as UserInfoModel;
                switch (type) {
                    case ENUM_PROVIDER.FACEBOOK:
                        userManager.updateUserInfo({
                            ...data,
                            id_fblogin: id
                        });
                        break;
                    case ENUM_PROVIDER.GOOGLE:
                        userManager.updateUserInfo({
                            ...data,
                            id_google: id
                        });
                        break;
                    case ENUM_PROVIDER.APPLE:
                        userManager.updateUserInfo({
                            ...data,
                            user_apple: id
                        });
                        break;
                    default:
                        break;
                }
            } else { ToastUtils.showErrorToast(res?.message || ''); }
        },
        [apiServices.auth, userManager]
    );

    const onLoginGoogle = useCallback(async () => {
        const userInfo = await loginWithGoogle();
        if (userInfo) fetchLinkSocial(ENUM_PROVIDER.GOOGLE, userInfo?.user?.id);
    }, [fetchLinkSocial]);

    const onLoginFacebook = useCallback(async () => {
        const data = await loginWithFacebook();
        if (data?.userID) fetchLinkSocial(ENUM_PROVIDER.FACEBOOK, data?.userID);
    }, [fetchLinkSocial]);

    const onLoginApple = useCallback(async () => {
        const data = await loginWithApple();
        if (data?.user) fetchLinkSocial(ENUM_PROVIDER.APPLE, data?.user);
    }, [fetchLinkSocial]);

    const renderTitleLink = useCallback((status?: boolean) => {
        return <>
            {status ? (
                <Text style={styles.statusGreen}>
                    {Languages.linkAccount.linked}
                </Text>
            ) : (
                <Text style={styles.statusRed}>
                    {Languages.linkAccount.notLink}
                </Text>
            )}
        </>;
    }, []);

    const renderIcon = useCallback((status?: boolean) => {
        return <>
            {status ? (
                <View style={styles.circleGreen}>
                    <LinkedIcon />
                </View>
            ) : (
                <View style={styles.circleRed}>
                    <NotLinkIcon />
                </View>
            )}
        </>;
    }, []);

    const renderItem = useCallback(
        (icon?: any, title?: string, status?: boolean) => {
            const _onPress = () => {
                switch (title) {
                    case Languages.linkAccount.fb:
                        onLoginFacebook();
                        break;
                    case Languages.linkAccount.gg:
                        onLoginGoogle();
                        break;
                    case Languages.linkAccount.apple:
                        onLoginApple();
                        break;
                    default:
                        break;
                }
            };
            return (
                <Touchable style={styles.wrapItem} onPress={_onPress} disabled={status} >
                    <View style={styles.row}>
                        {icon}
                        <View style={styles.wrapText}>
                            <Text style={styles.title}>
                                {Languages.linkAccount.link} {title}
                            </Text>
                            {renderTitleLink(status)}
                        </View>
                    </View>
                    {renderIcon(status)}
                </Touchable>
            );
        },
        [onLoginApple, onLoginFacebook, onLoginGoogle, renderIcon, renderTitleLink]
    );

    const renderAppleStore = useCallback(() => {
        if (Platform.OS === 'ios') {
            return renderItem(
                <AppleIcon width={16} height={26} />,
                Languages.linkAccount.apple,
                !!userManager.userInfo?.user_apple
            );
        }
        return null;
    }, [renderItem, userManager.userInfo?.user_apple]);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.linkAccount.header} />
            <View style={styles.wrapContent}>
                {renderItem(
                    <FacebookIcon width={16} height={20} />,
                    Languages.linkAccount.fb,
                    !!userManager.userInfo?.id_fblogin
                )}
                {renderItem(
                    <GoogleIcon width={16} height={26} />,
                    Languages.linkAccount.gg,
                    !!userManager.userInfo?.id_google
                )}
                {renderAppleStore()}
            </View>
        </View>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapContent: {
        marginTop: 20
    },
    wrapItem: {
        padding: 18,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapText: {
        marginLeft: 22
    },
    title: {
        ...Styles.typography.medium
    },
    statusRed: {
        ...Styles.typography.regular,
        color: COLORS.RED
    },
    statusGreen: {
        ...Styles.typography.regular,
        color: COLORS.GREEN
    },
    circleRed: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.RED,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circleGreen: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GREEN,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default LinkAccountSocial;
