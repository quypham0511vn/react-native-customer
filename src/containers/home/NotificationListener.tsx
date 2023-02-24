import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import Utils from '@/utils/Utils';
import { isIOS } from '@/commons/Configs';
import Navigator from '@/routers/Navigator';
import { useAppStore } from '@/hooks';
import ScreenNames from '@/commons/ScreenNames';
import SessionManager from '@/managers/SessionManager';
import { NotificationTotalModel } from '@/models/notification';

const NotificationListener = observer(({ children }: any) => {
    const { apiServices, notificationManager, userManager } =
        useAppStore();
    const onLocalNotificationIOS = (notification: any) => {
        const isClicked = notification.getData().userInteraction === 1;
        if (isClicked) {
            navigateNotify();
        }
    };
    const navigateNotify = useCallback(() => {
        if (userManager?.userInfo) {
            setTimeout(() => {
                Navigator.navigateScreen(ScreenNames.notify);
            }, 200);
        } else {
            Navigator.navigateToDeepScreen([ScreenNames.auth], ScreenNames.login);
        }
    }, [userManager?.userInfo]);

    const createToken = useCallback(async () => {
        const fcmToken = await Utils.getFcmToken();
        if (fcmToken && SessionManager.accessToken) {
            apiServices?.notification?.createFcmToken(fcmToken);
        }
    }, [apiServices?.notification]);

    const getUnreadNotify = useCallback(async () => {
        if (userManager.userInfo) {
            const res = await apiServices.notification?.getUnreadNotify();
            if (res.success) {
                const data = res.data as NotificationTotalModel;
                notificationManager.setUnReadNotifyCount(data?.total_unRead);
                PushNotificationIOS.setApplicationIconBadgeNumber(data?.total_unRead);
            }
        }
    }, [apiServices.notification, notificationManager, userManager.userInfo]);
    const pushNotificationLocal = useCallback(
        async (remoteMessage: any) => {
            await getUnreadNotify();
            if (isIOS) {
                PushNotificationIOS.addNotificationRequest({
                    id: 'notificationWithSound',
                    title: remoteMessage?.notification?.title,
                    // subtitle: 'Sample Subtitle',
                    body: remoteMessage?.notification?.body,
                    sound: 'customSound.wav'
                });
            } else {
                PushNotification.localNotification({
                    autoCancel: true,
                    data: 'test',
                    channelId: 'noti',
                    showWhen: true,
                    message: remoteMessage?.notification?.body,
                    vibrate: true,
                    vibration: 300,
                    playSound: true,
                    soundName: 'default',
                    badge: 10
                });
            }
        },
        [getUnreadNotify]
    );
    useEffect(() => {
        createToken();
        Utils.configNotification(navigateNotify);
        PushNotificationIOS.addEventListener(
            'localNotification',
            onLocalNotificationIOS
        );
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            pushNotificationLocal(remoteMessage);
        });
        messaging().setBackgroundMessageHandler(async (remoteMessage) => { });
        messaging().onNotificationOpenedApp((remoteMessage) => {
            if (remoteMessage) {
                navigateNotify();
            }
        });
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    navigateNotify();
                }
            });
        return unsubscribe;
    }, []);
    return <>{children}</>;
});

export default NotificationListener;
