import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import Animated, {
    interpolateColor,
    useDerivedValue
} from 'react-native-reanimated';
import TouchID from 'react-native-touch-id';

import { ICONS } from '@/assets/icons/constant';
import { IconTienngay } from '@/assets/icons/icon-tienngay';
import { Configs, isIOS } from '@/commons/Configs';
import { Events } from '@/commons/constants';
import {
    ENUM_BIOMETRIC_TYPE,
    ERROR_BIOMETRIC
} from '@/components/popupFingerprint/types';
import Account from '@/containers/account/Account';
import EditProfile from '@/containers/account/EditProfile';
import LinkAccountSocial from '@/containers/account/LinkAccountSocial';
import ProfileInfo from '@/containers/account/ProfileInfo';
import ReferFriends from '@/containers/account/ReferFriend';
import Agent from '@/containers/Agent';
import ChangePassword from '@/containers/auth/ChangePassword';
import ConfirmPhoneNumber from '@/containers/auth/ConfirmPhoneNumber';
import ForgotPwd from '@/containers/auth/ForgotPwd';
import Login from '@/containers/auth/Login';
import LoginWithBiometry from '@/containers/auth/LoginWithBiometry';
import OTPConfirmPhoneNumber from '@/containers/auth/OTPConfirmPhoneNumber';
import OTPForgotPwd from '@/containers/auth/OTPForgotPwd';
import OTPSignUp from '@/containers/auth/OTPSignUp';
import SettingQuickAuth from '@/containers/auth/SettingQuickAuthentication';
import SignUp from '@/containers/auth/SignUp';
import UpdateNewPwd from '@/containers/auth/UpdateNewPwd';
import ContractDetail from '@/containers/contract/ContractDetail';
import ContractPayment from '@/containers/contract/ContractPayment';
import Contracts from '@/containers/contract/Contracts';
import DetailsDocument from '@/containers/contract/DetailsDocument';
import Document from '@/containers/contract/Document';
import PaymentDetail from '@/containers/contract/PaymentDetail';
import PaymentHistory from '@/containers/contract/PaymentHistory';
import PaymentSchedule from '@/containers/contract/PaymentSchedule';
import PaymentScheduleDetail from '@/containers/contract/PaymentScheduleDetail';
import PaymentWebview from '@/containers/contract/PaymentWebview';
import PlayVideoScreen from '@/containers/contract/PlayVideoScreen';
import DetailsHistory from '@/containers/history/DetailsHistory';
import History from '@/containers/history/History';
import Home from '@/containers/home/Home';
import Loan from '@/containers/loan/Loan';
import PropertyValuation from '@/containers/loan/PropertyValuation';
import RegisterLoanNow from '@/containers/loan/RegisterLoanNow';
import MyWebview from '@/containers/MyWebview';
import Notify from '@/containers/Notify';
import Onboarding from '@/containers/Onboarding';
import PaymentService from '@/containers/PaymentService';
import Splash from '@/containers/Splash';
import { useAppStore } from '@/hooks';
import AnimatedTabBar, {
    TabsConfigsType
} from '@/libs/curved-bottom-navigation-bar/src';
import SessionManager, { DeviceInfos } from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import { EventEmitter } from '@/utils/EventEmitter';
import ScreenNames, { TabNames } from '../commons/ScreenNames';
import OTPDeleteAccount from '@/containers/auth/OTPDeleteAccount';
import IdentityAuthen from '@/containers/account/IdentityAuthen';

const screenOptions = { headerShown: false };
const AUTH_TAB_INDEXES = [1, 2, 3, 4];

const AnimatedIcon = Animated.createAnimatedComponent(IconTienngay);

const CustomIcon = ({
    progress,
    name,
    isCentered,
    size
}: {
    progress: Animated.SharedValue<number>;
    name: string;
    size: number;
    isCentered?: boolean;
}) => {
    const color = useDerivedValue(() =>
        interpolateColor(
            progress.value,
            [0, 1],
            [COLORS.GRAY, isCentered ? COLORS.RED : COLORS.GREEN]
        )
    );
    return <AnimatedIcon name={name} size={size} color={color.value} />;
};

const homeTab: TabsConfigsType = {
    HomeTab: {
        icon: (props) => (
            <CustomIcon name={ICONS.HOME} size={Configs.IconSize.size24} {...props} />
        )
    }
};

const commonTabs: TabsConfigsType = {
    HistoryTab: {
        icon: (props) => (
            <CustomIcon
                name={ICONS.CLOCK}
                size={Configs.IconSize.size26}
                {...props}
            />
        )
    },
    AccountTab: {
        icon: (props) => (
            <CustomIcon
                name={ICONS.PROFILE}
                size={Configs.IconSize.size24}
                {...props}
            />
        )
    }
};

const trustTabs: TabsConfigsType = {
    ContractsTab: {
        icon: (props) => (
            <CustomIcon name={ICONS.LIST} size={Configs.IconSize.size22} {...props} />
        )
    },
    LoanTab: {
        icon: (props) => (
            <CustomIcon
                name={ICONS.TIENNGAY}
                size={Configs.IconSize.size28}
                isCentered
                {...props}
            />
        )
    }
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//
const HistoryStack = () => {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name={ScreenNames.history} component={History} />
            <Stack.Screen
                name={ScreenNames.detailsHistory}
                component={DetailsHistory}
            />
        </Stack.Navigator>
    );
};

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name={ScreenNames.home} component={Home} />
            <Stack.Screen name={ScreenNames.notify} component={Notify} />
            <Stack.Screen
                name={ScreenNames.propertyValuation}
                component={PropertyValuation}
            />
            <Stack.Screen
                name={ScreenNames.registerLoanNow}
                component={RegisterLoanNow}
            />
            <Stack.Screen
                name={ScreenNames.paymentService}
                component={PaymentService}
            />
            <Stack.Screen
                name={ScreenNames.paymentWebview}
                component={PaymentWebview}
            />
            <Stack.Screen name={ScreenNames.agent} component={Agent} />
        </Stack.Navigator>
    );
};

const ContractStack = () => {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name={ScreenNames.contracts} component={Contracts} />
            <Stack.Screen
                name={ScreenNames.contractDetail}
                component={ContractDetail}
            />
            <Stack.Screen
                name={ScreenNames.paymentHistory}
                component={PaymentHistory}
            />
            <Stack.Screen
                name={ScreenNames.paymentDetail}
                component={PaymentDetail}
            />
            <Stack.Screen name={ScreenNames.document} component={Document} />
            <Stack.Screen
                name={ScreenNames.detailsDocument}
                component={DetailsDocument}
            />
            <Stack.Screen
                name={ScreenNames.playVideoScreen}
                component={PlayVideoScreen}
            />
            <Stack.Screen
                name={ScreenNames.paymentSchedule}
                component={PaymentSchedule}
            />
            <Stack.Screen
                name={ScreenNames.paymentScheduleDetail}
                component={PaymentScheduleDetail}
            />
            <Stack.Screen
                name={ScreenNames.contractPayment}
                component={ContractPayment}
            />
            <Stack.Screen
                name={ScreenNames.paymentWebview}
                component={PaymentWebview}
            />
        </Stack.Navigator>
    );
};

const TabAccount = () => {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name={ScreenNames.account} component={Account} />
            <Stack.Screen
                name={ScreenNames.SettingQuickAuth}
                component={SettingQuickAuth}
            />
            <Stack.Screen
                name={ScreenNames.changePassword}
                component={ChangePassword}
            />
            <Stack.Screen name={ScreenNames.linkAccountSocial} component={LinkAccountSocial} />
            <Stack.Screen name={ScreenNames.profile} component={ProfileInfo} />
            <Stack.Screen name={ScreenNames.editProFile} component={EditProfile} />
            <Stack.Screen name={ScreenNames.referFriend} component={ReferFriends} />
            <Stack.Screen name={ScreenNames.identityAuthen} component={IdentityAuthen} />
            <Stack.Screen
                name={ScreenNames.otpDeleteAccount}
                component={OTPDeleteAccount}
            />
        </Stack.Navigator>
    );
};

const RootStack = observer(() => {
    const { fastAuthInfoManager, userManager, appManager } = useAppStore();

    const forceLogout = useCallback(() => {
        SessionManager.logout();
        userManager.updateUserInfo(null);
    }, [userManager]);

    useEffect(() => {
        EventEmitter.addListener(Events.LOGOUT, forceLogout);
        return () => EventEmitter.removeListener(Events.LOGOUT, forceLogout);
    }, [forceLogout]);

    useEffect(() => {
        initState();
    }, []);

    const tabBarConfig = useMemo(() => {
        if (!appManager.isAppInReview) {
            return { ...homeTab, ...trustTabs, ...commonTabs };
        }
        return { ...homeTab, ...commonTabs };
    }, []);

    const getTabBarVisibility = useCallback((route: any) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (
            routeName === undefined ||
            routeName === ScreenNames.home ||
            routeName === ScreenNames.contracts ||
            routeName === ScreenNames.history ||
            routeName === ScreenNames.loan ||
            routeName === ScreenNames.account ||
            routeName === ScreenNames.findContract
        ) {
            return true;
        }
        return false;
    }, []);

    const initState = useCallback(() => {
        if (SessionManager.isEnableFastAuthentication) {
            fastAuthInfoManager.setEnableFastAuthentication(true);
        }
        if (isIOS && DeviceInfos.HasNotch) {
            fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.FACE_ID);
        }
        if (isIOS && !DeviceInfos.HasNotch) {
            fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
        }
        if (!isIOS) {
            TouchID.isSupported()
                .then((biometricType) => {
                    if (biometricType) {
                        fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
                    }
                })
                .catch((error) => {
                    if (error?.code === ERROR_BIOMETRIC.NOT_SUPPORTED) {
                        fastAuthInfoManager.setSupportedBiometry('');
                    } else {
                        fastAuthInfoManager.setSupportedBiometry(ENUM_BIOMETRIC_TYPE.TOUCH_ID);
                    }
                });
        }
    }, [fastAuthInfoManager]);

    const onAuthTabPress = useCallback(
        (index: number) => {
            let upcomingTabName = TabNames.homeTab;

            Object.keys(TabNames).forEach((key, _index) => {
                if (index === _index) {
                    upcomingTabName = TabNames[key];
                }
            });

            SessionManager.lastTabIndexBeforeOpenAuthTab = index;
            if (!userManager?.userInfo) {
                Navigator.navigateScreen(ScreenNames.auth);
            } else if (fastAuthInfoManager.isEnableFastAuth) {
                Navigator.navigateToDeepScreen(
                    [ScreenNames.auth],
                    ScreenNames.loginWithBiometry
                );
            } else {
                Navigator.navigateScreen(upcomingTabName);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [fastAuthInfoManager.isEnableFastAuth, userManager?.phoneNumber]);

    const onTabPress = useCallback(
        (index: number, tabName: string) => {
            const isAuthTab = AUTH_TAB_INDEXES.includes(index);
            if (
                !isAuthTab ||
                userManager.userInfo ||
                !fastAuthInfoManager?.isEnableFastAuth
            ) {
                Navigator.navigateScreen(tabName);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [fastAuthInfoManager?.isEnableFastAuth]);

    const renderTabBar = useCallback(
        (props) => {
            const focusedOptions =
                props.descriptors[props.state.routes[props.state.index].key].options;

            if (!focusedOptions.tabBarVisible) {
                return null;
            }

            return (
                <AnimatedTabBar
                    tabs={tabBarConfig}
                    authTabIndexes={
                        userManager?.userInfo && !fastAuthInfoManager.isEnableFastAuth
                            ? []
                            : AUTH_TAB_INDEXES
                    }
                    onAuthTabPress={onAuthTabPress}
                    onTabPress={onTabPress}
                    focusedIndex={SessionManager.lastTabIndexBeforeOpenAuthTab}
                    {...props}
                />
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            fastAuthInfoManager.isEnableFastAuth,
            onAuthTabPress,
            onTabPress,
            userManager.phoneNumber
        ]
    );

    const getOption = useCallback(
        ({ route }: any) => {
            return {
                tabBarVisible: getTabBarVisibility(route)
            } as any;
        },
        [getTabBarVisibility]
    );

    const AuthStack = useCallback(() => {
        return (
            <Stack.Navigator initialRouteName={SessionManager?.isEnableFastAuthentication ? ScreenNames.loginWithBiometry : ScreenNames.login} screenOptions={screenOptions}>
                <Stack.Screen name={ScreenNames.login} component={Login} />
                <Stack.Screen name={ScreenNames.signUp} component={SignUp} />
                <Stack.Screen
                    name={ScreenNames.loginWithBiometry}
                    component={LoginWithBiometry}
                />
                <Stack.Screen
                    name={ScreenNames.otpSignUp}
                    component={OTPSignUp}
                />
                <Stack.Screen
                    name={ScreenNames.confirmPhoneNumber}
                    component={ConfirmPhoneNumber}
                />
                <Stack.Screen
                    name={ScreenNames.otpForgotPwd}
                    component={OTPForgotPwd}
                />
                <Stack.Screen
                    name={ScreenNames.otpConfirmPhone}
                    component={OTPConfirmPhoneNumber}
                />
                <Stack.Screen
                    name={ScreenNames.forgotPwd}
                    component={ForgotPwd}
                />
                <Stack.Screen
                    name={ScreenNames.updateNewPwd}
                    component={UpdateNewPwd}
                />
            </Stack.Navigator>
        );
    }, []);

    const Tabs = useCallback(
        () => (
            <Tab.Navigator screenOptions={screenOptions} tabBar={renderTabBar}>
                <Tab.Screen
                    name={TabNames.homeTab}
                    component={HomeStack}
                    options={getOption}
                />
                {!appManager.isAppInReview &&
                    <>
                        <Tab.Screen
                            name={TabNames.contractsTab}
                            component={ContractStack}
                            options={getOption}
                        />
                        <Tab.Screen
                            name={TabNames.loanTab}
                            component={Loan}
                            options={getOption}
                        />
                    </>}
                <Tab.Screen
                    name={TabNames.historyTab}
                    component={HistoryStack}
                    options={getOption}
                />
                <Tab.Screen
                    name={TabNames.accountTab}
                    component={TabAccount}
                    options={getOption}
                />
            </Tab.Navigator>
        ),
        [getOption, renderTabBar]
    );

    const AppStack = useCallback(() => {
        return (
            <Stack.Navigator screenOptions={screenOptions}>
                <Stack.Screen name={ScreenNames.splash} component={Splash} />
                <Stack.Screen name={ScreenNames.onboarding} component={Onboarding} />
                <Stack.Screen name={ScreenNames.tabs} component={Tabs} />
                <Stack.Screen name={ScreenNames.auth} component={AuthStack} />
                <Stack.Screen name={ScreenNames.myWebview} component={MyWebview} />
                <Stack.Screen name={ScreenNames.notify} component={Notify} />
            </Stack.Navigator>
        );
    }, [AuthStack, Tabs]);

    const renderRootStack = useMemo(() => {
        return <AppStack />;
    }, [AppStack]);
    return renderRootStack;
});

export default RootStack;
