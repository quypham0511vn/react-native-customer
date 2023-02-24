import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';

import { COLORS } from '@/theme';
import Languages from '@/commons/Languages';
import { Button } from './elements';
import MyWebViewProgress from './MyWebViewProgress';
import { PopupActions, PopupProps } from './popup/types';
import { LINKS } from '@/api/constants';

const PopupPolicy = forwardRef<PopupActions, PopupProps>(
    ({ onClose }: PopupProps, ref) => {

        const [visible, setVisible] = useState<boolean>(false);
        const webProgressRef = useRef<any>(null);
        const webViewRef = useRef<WebView>(null);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const onLoadProgress = useCallback((e: any) => {
            webProgressRef.current?.setProgress(e?.nativeEvent?.progress);
        }, []);

        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>
                    <View style={styles.header}>
                        <MyWebViewProgress
                            ref={webProgressRef}
                        />
                    </View>
                    <View style={styles.scrollContent}>
                        <WebView
                            ref={webViewRef}
                            source={{ uri: LINKS.POLICY }}
                            javaScriptEnabled={true}
                            onLoadProgress={onLoadProgress}
                        />
                    </View>

                    <Button
                        style={styles.btn}
                        label={Languages.common.agree}
                        buttonStyle={'GREEN'}
                        onPress={hide}
                    />
                </View>
            </Modal>
        );
    });

export default PopupPolicy;

const styles = StyleSheet.create({
    popup: {
        marginVertical: 50,
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    header: {
        width: '100%'
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 5,
        width: '100%'
    },
    btn: {
        marginTop: 10,
        marginHorizontal: 10
    }
});
