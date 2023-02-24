import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import codePush from 'react-native-code-push';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { COLORS } from '@/theme';
import { AppStoreProvider } from '../providers/app-provider';
import { NetworkProvider } from '../providers/network-provider';
import { PopupsProvider } from '../providers/popups-provider';
import { navigationRef } from './Navigator';
import RootStack from './RootStack';

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.WHITE
    }
};

const App = () => {
    return (
        <AppStoreProvider>
            <NetworkProvider>
                <PopupsProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <BottomSheetModalProvider>
                            <NavigationContainer ref={navigationRef}
                                theme={MyTheme}>
                                <RootStack />
                            </NavigationContainer>
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </PopupsProvider>
            </NetworkProvider>
        </AppStoreProvider>
    );
};

const codePushOptions = {
    installMode: codePush.InstallMode.IMMEDIATE,
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};

export default codePush(codePushOptions)(App);
