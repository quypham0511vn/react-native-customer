import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

import { PAYMENT_URL } from '@/api/constants';
import IcSuccess from '@/assets/images/ic_successful.svg';
import { PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import MyLoading from '@/components/MyLoading';
import MyWebViewProgress from '@/components/MyWebViewProgress';
import PopupPaymentStatus, { PopupPaymentStatusActions } from '@/components/PopupPaymentStatus';
import Navigator from '@/routers/Navigator';
import { TabNames } from '@/commons/ScreenNames';

const PaymentWebview = ({ route }: any) => {

    const webProgressRef = useRef<any>(null);
    const webViewRef = useRef<WebView>(null);

    const [url] = useState<string>(route.params.url);
    const popupRef = useRef<PopupPaymentStatusActions>(null);

    const onLoadProgress = useCallback((e: any) => {
        webProgressRef.current?.setProgress(e?.nativeEvent?.progress);
    }, []);

    const handleChange = (e: any) => {
        const baseUrl = e.url;

        if (baseUrl.indexOf(PAYMENT_URL.NL_SUCCESSFULLY) === 0 || baseUrl.indexOf(PAYMENT_URL.VIMO_SUCCESSFULLY) === 0) {
            popupRef.current?.show();
        } else if (baseUrl.indexOf(PAYMENT_URL.NL_FAILED) === 0 || baseUrl.indexOf(PAYMENT_URL.VIMO_FAILED) === 0) {
            Navigator.goBack();
        }
    };

    const renderLoading = () => {
        return <MyLoading isOverview />;
    };

    const onNavigateHistory = useCallback(() => {
        if(route?.params?.isPayingService){
            Navigator.resetScreen([TabNames.homeTab]);
        }else{
            Navigator.resetScreen([TabNames.contractsTab]);
        }
        
        setTimeout(() => {
            Navigator.navigateScreen(TabNames.historyTab);
        }, 500);
    }, [route?.params?.isPayingService]);

    const renderPopup = useMemo(() => {
        return <PopupPaymentStatus
            icon={<IcSuccess width={50} height={50} />}
            title={Languages.notify.title}
            content={Languages.contractPayment.payFinished}
            ref={popupRef}
            showBtn={false}
            onClose={onNavigateHistory}
        />;
    }, [onNavigateHistory]);

    return (
        <View style={styles.mainContainer}>
            <HeaderBar
                hasBack
                title={Languages.contractDetail.pay}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <MyWebViewProgress
                    ref={webProgressRef}
                />

                <WebView
                    ref={webViewRef}
                    source={{ uri: url }}
                    onLoadProgress={onLoadProgress}
                    onNavigationStateChange={handleChange}
                    startInLoadingState
                    scalesPageToFit
                    thirdPartyCookiesEnabled={false}
                    incognito
                    cacheEnabled={false}
                    javaScriptEnabled
                    domStorageEnabled
                    originWhitelist={['*']}
                    renderLoading={renderLoading}
                />
            </ScrollView>

            {renderPopup}
        </View>
    );
};

export default PaymentWebview;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    scrollContent: {
        flex: 1
    }
});
