import PasscodeAuth from '@el173/react-native-passcode-auth';
import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { LINKS, STORE_LUCKY_LOTT } from '@/api/constants';
import BgHeaderHome from '@/assets/images/bg_header_home.svg';
import IcBell from '@/assets/images/ic_bell.svg';
import IcBill from '@/assets/images/ic_bill_on.svg';
import IcElectric from '@/assets/images/ic_electric_on.svg';
import IcFindingContract from '@/assets/images/ic_finding_contract.svg';
import IcMap from '@/assets/images/ic_map.svg';
import IcMoney from '@/assets/images/ic_money.svg';
import IcWater from '@/assets/images/ic_water_on.svg';
import Images from '@/assets/images/Images';
import ImgCar from '@/assets/images/img_car.svg';
import ImgMoto from '@/assets/images/img_moto.svg';
import IcLuckyLott from '@/assets/images/ic_flower.svg';
import {
    BOTTOM_HEIGHT,
    Configs
} from '@/commons/Configs';
import { ENUM_BIOMETRIC_TYPE, ENUM_PROVIDERS_SERVICE, PRODUCT } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNames, TabNamesArray } from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import Banner from '@/components/Banner';
import BaseContainer from '@/components/BaseContainer';
import { Button } from '@/components/elements/button';
import { MyImageView } from '@/components/image';
import { useAppStore } from '@/hooks';
// import AnalyticsUtils from '@/utils/AnalyticsUtils';
import SessionManager from '@/managers/SessionManager';
import { BannerModel } from '@/models/banner';
import { BaseModel } from '@/models/base-model';
import { NewsModel } from '@/models/news';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { IconSize } from '@/theme/iconsize';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import DateUtils from '@/utils/DateUtils';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import NotificationListener from './NotificationListener';

const Home = observer(() => {
    const { apiServices, notificationManager, userManager, appManager, fastAuthInfoManager } =
        useAppStore();

    const [insurances, setInsurances] = useState<NewsModel[]>();
    const [news, setNews] = useState<NewsModel[]>();
    const [banners, setBanners] = useState<BannerModel[]>();

    const isFocused = useIsFocused();

    useEffect(() => {
        if (
            SessionManager?.tempDataForPropertyValuation?.fromScreen ===
            ScreenNames.propertyValuation
        ) {
            setTimeout(() => {
                Navigator.navigateScreen(ScreenNames.propertyValuation, {
                    ...SessionManager?.tempDataForPropertyValuation,
                    vehicle: PRODUCT.CAR
                });
            }, 700);
        }
    }, [isFocused]);

    const fetchData = useCallback(async () => {
        const resBanner = await apiServices.common.getBanners();

        if (resBanner.success) {
            if (appManager.isAppInReview) {
                setBanners(
                    (resBanner.data as BannerModel[]).filter((item) => item.image_mobile && !item.title_vi.toLowerCase().includes('vay'))
                );
            } else {
                setBanners(
                    (resBanner.data as BannerModel[]).filter((item) => item.image_mobile)
                );
            }
        }

        const resNews = await apiServices.common.getNews();
        if (resNews.success) {
            if (appManager.isAppInReview) {
                setNews((resNews.data as NewsModel[])
                    .filter(item => !item.title_vi.toLowerCase().includes('vay')
                        && !item.content_vi.toLowerCase().includes('vay')
                        && !item.content_vi.toLowerCase().includes('khai trương')
                        && !item.title_vi.toLowerCase().includes('vpbank')
                    )
                    .sort((a, b) => b.created_at - a.created_at));
            } else {
                setNews((resNews.data as NewsModel[]).sort((a, b) => b.created_at - a.created_at));
            }
        }

        const resInsurances = await apiServices.common.getInsurances();
        if (resInsurances.success) {
            setInsurances(resInsurances.data as NewsModel[]);
        }
    }, [apiServices.common, appManager.isAppInReview]);

    const navigateNotify = useCallback(() => {
        if (userManager?.userInfo) {
            setTimeout(() => {
                Navigator.navigateScreen(ScreenNames.notify);
            }, 200);
        } else {
            Navigator.navigateToDeepScreen([ScreenNames.auth], ScreenNames.login);
        }
    }, [userManager?.userInfo]);

    const onLoginSuccess = useCallback(() => {
        fastAuthInfoManager.setEnableFastAuthentication(false);
        setTimeout(() => {
            if (SessionManager.lastTabIndexBeforeOpenAuthTab) {
                Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab]);
            }
        }, 100);
    }, [fastAuthInfoManager]);

    useEffect(() => {
        AnalyticsUtils.trackEvent(ScreenNames.home);
        fetchData();
        if (fastAuthInfoManager.isEnableFastAuth && fastAuthInfoManager.supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
            PasscodeAuth.authenticate(Languages.quickAuThen.description)
                .then(() => {
                    onLoginSuccess();
                })
                .catch(() => { });
        }
    }, []);

    const onNavigateLoan = useCallback(() => {
        if (!userManager?.userInfo || fastAuthInfoManager?.isEnableFastAuth) {
            SessionManager.lastTabIndexBeforeOpenAuthTab = 2;
            Navigator.navigateScreen(ScreenNames.auth);
        } else {
            setTimeout(() => {
                Navigator.navigateScreen(TabNames.loanTab);
            }, 200);
        }
    }, [fastAuthInfoManager?.isEnableFastAuth, userManager?.userInfo]);

    const onNavigateContracts = useCallback(() => {
        if (!userManager.userInfo || fastAuthInfoManager.isEnableFastAuth) {
            SessionManager.lastTabIndexBeforeOpenAuthTab = TabNamesArray.length - 4;
            Navigator.navigateScreen(ScreenNames.auth);
        } else {
            Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNames.contractsTab);
        }
    }, [fastAuthInfoManager.isEnableFastAuth, userManager.userInfo]);

    const onNavigatePGD = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.agent);
    }, []);

    const onGotoAccount = useCallback(() => {
        if (!userManager.userInfo || fastAuthInfoManager.isEnableFastAuth) {
            SessionManager.lastTabIndexBeforeOpenAuthTab = TabNamesArray.length - 1;
            Navigator.navigateScreen(ScreenNames.auth);
        } else {
            Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNames.accountTab);
        }
    }, [fastAuthInfoManager.isEnableFastAuth, userManager.userInfo]);

    const onOpenVPS = useCallback(() => {
        Utils.openURL(LINKS.VPS);
    }, []);

    const renderProfile = useMemo(() => {
        return (
            <Touchable style={styles.wrapInfo} onPress={onGotoAccount}>
                {userManager.userInfo?.avatar ? (
                    <MyImageView
                        style={styles.imageAvatar}
                        imageUrl={userManager.userInfo?.avatar}
                    />
                ) : null}
                <View style={styles.wrapInfoText}>
                    {userManager.userInfo?.full_name ? (
                        <>
                            <Text style={styles.txtWelcome}>{Languages.home.hello}</Text>
                            <Text style={styles.txtName}>{userManager.userInfo?.full_name}</Text>
                        </>
                    ) : (
                        <Text style={styles.txtName}>{Languages.home.hello}</Text>
                    )}
                </View>
            </Touchable>
        );
    }, [onGotoAccount, userManager.userInfo]);

    const renderFeatureItem = useCallback((icon: any, title: string, navigate: any) => {
        return (
            <Touchable style={styles.cardFeature} onPress={navigate}>
                {icon}
                <Text style={styles.txtFeature}>{title}</Text>
            </Touchable>
        );
    }, []);

    const renderValuationItem = useCallback((icon: any, title: string, type: any) => {

        const navigate = () => {
            Navigator.pushScreen(ScreenNames.propertyValuation, {
                vehicle: type
            });
        };

        return (
            <Touchable style={styles.cardValuation} radius={10} onPress={navigate}>
                {icon}

                <Text style={styles.txtValuation}>{title}</Text>
            </Touchable>
        );
    }, []);

    const renderInsuranceItem = useCallback(({ item }: { item: NewsModel }) => {
        const navigate = () => {
            Navigator.pushScreen(ScreenNames.myWebview, {
                item,
                uri: false
            });
        };

        return (
            <Touchable style={styles.insuranceItem} onPress={navigate}>
                <MyImageView
                    imageUrl={item.image_mobile}
                    resizeMode={'cover'}
                    style={styles.insuranceImage}
                />
            </Touchable>
        );
    }, []);

    const renderNewsItem = useCallback(({ item }: { item: NewsModel }) => {
        const navigate = () => {
            Navigator.pushScreen(ScreenNames.myWebview, {
                item,
                uri: false
            });
        };
        const newsItemStyle = {
            width: appManager.isAppInReview ? SCREEN_WIDTH * 0.9 : SCREEN_WIDTH / 1.7
        };

        const newsAvatarStyle = {
            width: newsItemStyle.width,
            height: (newsItemStyle.width / 215) * 104
        };

        return (
            <Touchable style={[styles.newsItem, newsItemStyle]} onPress={navigate}>
                <MyImageView
                    imageUrl={item.image}
                    resizeMode={'cover'}
                    style={[styles.communicationImage, newsAvatarStyle]}
                />
                <Text style={styles.txtCommunityTitle} numberOfLines={2}>{item.title_vi} </Text>
                <Text style={styles.txtCommunityDes}> {DateUtils.getLongFromDate(item.created_at)}</Text>
            </Touchable>
        );
    }, [appManager.isAppInReview]);

    const keyExtractor = useCallback((item: BaseModel) => {
        return `${item.id} ${item._id?.$oid}`;
    }, []);

    const renderSection = useCallback((title: string) => {
        return <Text style={styles.txtSection}>{title.toUpperCase()}</Text>;
    }, []);

    const renderInsurances = useMemo(() => {
        return !appManager.isAppInReview && <>
            <View style={styles.marginHorizontal}>
                {renderSection(Languages.home.insurance)}
            </View>

            <FlatList
                data={insurances}
                contentContainerStyle={styles.insuranceContainer}
                renderItem={renderInsuranceItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                {...{ keyExtractor }}
            />
        </>;
    }, [appManager.isAppInReview, insurances, keyExtractor, renderInsuranceItem, renderSection]);

    const renderNews = useMemo(() => {
        const newsStyle = !appManager.isAppInReview ? {
            horizontal: true,
            showsHorizontalScrollIndicator: false
        } : {};

        return (
            <FlatList
                data={news}
                contentContainerStyle={styles.communicationContainer}
                renderItem={renderNewsItem}
                {...newsStyle}
                {...{ keyExtractor }}
            />
        );
    }, [appManager.isAppInReview, news, renderNewsItem, keyExtractor]);

    const renderServiceItem = useCallback((icon: any, title: string, type: any) => {
        const navigate = () => {
            if (type === ENUM_PROVIDERS_SERVICE.LOTTERY) {
                Utils.openURL(STORE_LUCKY_LOTT);
            } else if (!userManager?.userInfo || fastAuthInfoManager?.isEnableFastAuth) {
                SessionManager.lastTabIndexBeforeOpenAuthTab = 0;
                Navigator.navigateScreen(ScreenNames.auth);
            } else {
                setTimeout(() => {
                    Navigator.pushScreen(ScreenNames.paymentService, {
                        typeBill: type
                    });
                }, 200);
            }
        };

        return (
            <Touchable style={styles.cardService} radius={10} onPress={navigate}>
                {icon}
                <Text style={styles.txtService}>{title}</Text>
            </Touchable>
        );
    }, [fastAuthInfoManager?.isEnableFastAuth, userManager?.userInfo]);

    const renderBadgeCount = useMemo(() => {
        return (
            <Text style={styles.count}>{notificationManager.unReadNotifyCount}</Text>
        );
    }, [notificationManager.unReadNotifyCount]);

    const renderLoan = useMemo(() => {
        return (
            !appManager.isAppInReview && (
                <>
                    <View style={styles.marginHorizontal}>
                        <Button
                            label={Languages.home.loanNow}
                            buttonStyle={'GREEN'}
                            onPress={onNavigateLoan}
                            style={styles.btnLoan}
                            leftIcon={<IcMoney {...IconSize.size30_30} />}
                        />
                        {renderSection(Languages.valuation.title)}
                    </View>

                    <View style={styles.row}>
                        {renderValuationItem(<ImgCar {...IconSize.size50_30} />, Languages.valuation.car, PRODUCT.CAR)}
                        {renderValuationItem(<ImgMoto {...IconSize.size50_30} />, Languages.valuation.motor, PRODUCT.MOTOR)}
                    </View>
                </>
            )
        );
    }, [
        appManager.isAppInReview,
        onNavigateLoan,
        renderSection,
        renderValuationItem
    ]);

    const renderVPS = useMemo(() => {
        return !appManager.isAppInReview && <View style={styles.marginHorizontal}>
            {renderSection(Languages.home.vps)}
            <Touchable onPress={onOpenVPS}>
                <Image
                    source={Images.imgVPS}
                    resizeMode={'cover'}
                    style={{ ...IconSize.vps }}
                />
            </Touchable>
        </View>;
    }, [appManager.isAppInReview, onOpenVPS, renderSection]);

    const renderFeatures = useMemo(() => {
        return !appManager.isAppInReview && <View style={styles.row}>
            {renderFeatureItem(<IcFindingContract {...IconSize.size30_30} />, Languages.contracts.finding, onNavigateContracts)}
            {renderFeatureItem(<IcMap {...IconSize.size30_30} />, Languages.home.agent, onNavigatePGD)}
        </View>;
    }, [appManager.isAppInReview, onNavigateContracts, onNavigatePGD, renderFeatureItem]);

    const renderBanner = useMemo(() => {
        return !appManager.isAppInReview && <Banner banners={banners} />;
    }, [appManager.isAppInReview, banners]);

    return (
        <NotificationListener>
            <View style={styles.headerContainer}>
                <BgHeaderHome style={styles.header} {...IconSize.sizeHeader} />
            </View>
            <BaseContainer
                noStatusBar
                exitApp
                containerStyle={styles.container}>

                <View style={styles.headerPinContent}>
                    {renderProfile}

                    <Touchable onPress={navigateNotify} style={styles.notifyContainer}>
                        <IcBell {...IconSize.size25_25} />
                        <View style={styles.notifyBadge}>{renderBadgeCount}</View>
                    </Touchable>
                </View>

                {renderFeatures}

                <ScrollView
                    contentContainerStyle={appManager.isAppInReview ? styles.contentContainerRestrict : styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {renderLoan}
                    {renderBanner}

                    <View style={styles.marginHorizontal}>
                        {renderSection(Languages.service.utility)}
                    </View>
                    <View style={styles.row}>
                        {renderServiceItem(<IcLuckyLott {...IconSize.size40_40} />, Languages.service.luckyLott, ENUM_PROVIDERS_SERVICE.LOTTERY)}
                        {renderServiceItem(<IcWater {...IconSize.size40_40} />, Languages.service.water, ENUM_PROVIDERS_SERVICE.BILL_WATER)}
                        {renderServiceItem(<IcElectric {...IconSize.size40_40} />, Languages.service.electric, ENUM_PROVIDERS_SERVICE.BILL_ELECTRIC)}
                        {renderServiceItem(<IcBill {...IconSize.size40_40} />, Languages.service.bill, ENUM_PROVIDERS_SERVICE.BILL_FINANCE)}
                    </View>

                    {renderInsurances}
                    {renderVPS}

                    <View style={styles.marginHorizontal}>
                        {renderSection(Languages.home.communication)}
                    </View>
                    {renderNews}
                </ScrollView>
            </BaseContainer>
        </NotificationListener>
    );
});

export default Home;

const AVATAR_SIZE = 40;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        paddingBottom: BOTTOM_HEIGHT
    },
    contentContainerRestrict: {
        paddingBottom: BOTTOM_HEIGHT,
        backgroundColor: COLORS.WHITE
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'flex-start'
    },
    headerContainer: {
        ...IconSize.sizeHeader,
        position: 'absolute',
        top: -20,
        left: 0,
        right: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden'
    },
    header: {
        marginTop: 10
    },
    headerPinContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginHorizontal: 20
    },
    inputStyle: {
        flex: 1
    },
    notifyContainer: {
        marginLeft: 20,
        paddingRight: 5
    },
    notifyBadge: {
        position: 'absolute',
        right: -2,
        top: -8,
        width: 20,
        height: 20,
        borderRadius: 11,
        backgroundColor: COLORS.RED,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardFeature: {
        ...Styles.shadow,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginHorizontal: 5,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10
    },
    cardValuation: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 10,
        ...Styles.shadow
    },
    cardService: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    txtFeature: {
        ...Styles.typography.medium,
        marginTop: 10
    },
    txtValuation: {
        ...Styles.typography.medium,
        marginTop: 10
    },
    txtService: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        marginTop: 10,
        textAlign: 'center'
    },
    txtInsurance: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size13,
        marginTop: 10
    },
    txtCommunityTitle: {
        ...Styles.typography.medium,
        marginTop: 10,
        paddingHorizontal: 5
    },
    txtCommunityDes: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size11,
        color: COLORS.LIGHT_GRAY,
        marginVertical: 5,
        paddingHorizontal: 5
    },
    txtSection: {
        ...Styles.typography.medium,
        marginTop: 30,
        marginBottom: 10
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 70
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8
    },
    marginHorizontal: {
        marginHorizontal: 20
    },
    btnLoan: {
        marginTop: 25
    },
    insuranceContainer: {
        paddingLeft: 10
    },
    insuranceItem: {
        borderRadius: 10,
        marginHorizontal: 5,
        overflow: 'hidden'
    },
    communicationContainer: {
        paddingLeft: 15,
        paddingBottom: 10
    },
    newsItem: {
        ...Styles.shadow,
        borderRadius: 10,
        marginHorizontal: 5,
        paddingBottom: 5,
        marginBottom: 10
    },
    communicationImage: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    insuranceImage: {
        width: SCREEN_WIDTH / 1.7,
        height: (SCREEN_WIDTH / 1.7 / 215) * 104,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    count: {
        ...Styles.typography.medium,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size12
    },
    wrapInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageAvatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
        marginRight: 10
    },
    txtWelcome: {
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium
    },
    txtName: {
        width: SCREEN_WIDTH - 150,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size20,
        fontFamily: Configs.FontFamily.medium
    },
    wrapInfoText: {
        marginRight: 50
    }
});
