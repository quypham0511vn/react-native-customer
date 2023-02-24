import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import icArrowRight from '@/assets/images/ic_arrow_right.png';
import icOnboardingLogo from '@/assets/images/ic_onboarding_logo.png';
import Images from '@/assets/images/Images';
import ImgLogo from '@/assets/images/img_logo.png';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import BaseContainer from '@/components/BaseContainer';
import { ImageSwitcher } from '@/components/ImageSwitcher';
import SessionManager from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { COLORS, HtmlStyles, Styles } from '../theme';

const Onboarding = observer(() => {
    const [step, setStep] = useState<number>(0);
    const [source, setSource] = useState(Images.imgOnboarding1);

    useEffect(() => {
        switch (step) {
            case 0:
                setSource(Images.imgOnboarding1);
                break;
            case 1:
                setSource(Images.imgOnboarding2);
                break;
            case 2:
            default:
                setSource(Images.imgOnboarding3);
                break;
        }
    }, [step]);

    const nextStep = useCallback(() => {
        if (step === 2) {
            Navigator.replaceScreen(ScreenNames.tabs);
            SessionManager.setSkipOnboarding();
        } else {
            setStep(last => (last + 1) % 3);
        }
    }, [step]);

    const renderInActiveDot = useMemo(() => {
        return <View
            style={styles.inActive}
        />;
    }, []);

    const renderActiveDot = useMemo(() => {
        return <View
            style={styles.active}
        />;
    }, []);

    const renderActiveDotWhite = useMemo(() => {
        return <View
            style={styles.activeWhite}
        />;
    }, []);

    const renderIndicator = useMemo(() => {
        return <View style={styles.paginatorContainer}>
            {step === 0 ? renderActiveDot : renderInActiveDot}
            {step === 1 ? renderActiveDotWhite : renderInActiveDot}
            {step === 2 ? renderActiveDotWhite : renderInActiveDot}
        </View>;
    }, [renderActiveDot, renderActiveDotWhite, renderInActiveDot, step]);

    const renderLogo = useMemo(() => {
        return <Image source={ImgLogo}
            style={[styles.logo, step > 0 ? { tintColor: COLORS.WHITE } : {}]} />;
    }, [step]);

    const renderMainLogo = useMemo(() => {
        return <View style={styles.top}>
            <ImageSwitcher source={source}
                style={styles.image} />
        </View>;
    }, [source]);

    const containerStyle = useMemo(() => {
        let color;
        switch (step) {
            case 1:
                color = COLORS.GREEN;
                break;
            case 2:
                color = COLORS.RED_1;
                break;
            default:
                color = COLORS.GRAY_5;
                break;
        }
        return {
            ...styles.container,
            backgroundColor: color
        };
    }, [step]);

    const titleStyle = useMemo(() => {
        let color;
        switch (step) {
            case 0:
                color = COLORS.GREEN;
                break;
            default:
                color = COLORS.WHITE;
                break;
        }
        return {
            ...styles.title,
            color
        };
    }, [step]);

    const roundedImgStyle = useMemo(() => {
        let color;
        switch (step) {
            case 0:
                color = COLORS.GREEN;
                break;
            default:
                color = COLORS.WHITE;
                break;
        }
        return {
            ...styles.roundedImg,
            backgroundColor: color
        };
    }, [step]);

    const onboardingLogoStyle = useMemo(() => {
        let color;
        switch (step) {
            case 0:
                color = COLORS.RED_1;
                break;
            default:
                color = COLORS.WHITE;
                break;
        }
        return {
            ...styles.bigImg,
            tintColor: color
        };
    }, [step]);

    const nextStyle = useMemo(() => {
        let color;
        switch (step) {
            case 1:
                color = COLORS.GREEN;
                break;
            case 2:
                color = COLORS.RED_1;
                break;
            default:
                color = COLORS.WHITE;
                break;
        }
        return {
            ...styles.smallImg,
            tintColor: color
        };
    }, [step]);

    const renderContent = useMemo(() => {
        return <View style={styles.center}>
            <View style={styles.content}>
                <Text style={titleStyle}>
                    {Languages.onBoarding[step].title}
                </Text>
                <HTMLView
                    stylesheet={HtmlStyles}
                    value={Languages.onBoarding[step].des}
                />
            </View>
        </View>;
    }, [step, titleStyle]);

    const renderFooter = useMemo(() => {
        return <View style={styles.bottom}>
            {renderIndicator}

            <Touchable style={roundedImgStyle}
                radius={20}
                onPress={nextStep}>
                <Image
                    style={nextStyle}
                    source={icArrowRight}
                />
            </Touchable>
        </View>;
    }, [nextStep, nextStyle, renderIndicator, roundedImgStyle]);

    return (
        <BaseContainer
            noStatusBar
            noHeader
            containerStyle={containerStyle}
            title={Languages.notify.title}>

            <Image
                style={onboardingLogoStyle}
                source={icOnboardingLogo}
            />

            {renderLogo}
            {renderMainLogo}
            {renderContent}
            {renderFooter}
        </BaseContainer>
    );
});

export default Onboarding;
const INDICATOR_HEIGHT = 100;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    top: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    center: {
        flex: 1,
        alignItems: 'center'
    },
    bottom: {
        height: INDICATOR_HEIGHT,
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
        alignContent: 'space-between'
    },
    swiperStyle: {
    },
    image: {
        width: SCREEN_WIDTH / 1.2,
        height: SCREEN_WIDTH / 1.2 / 1029 * 750,
        alignItems: 'center'
    },
    logo: {
        marginTop: 80,
        width: SCREEN_WIDTH / 2,
        height: SCREEN_WIDTH / 2 / 800 * 254
    },
    smallImg: {
        width: 20,
        height: 20,
        alignItems: 'center'
    },
    bigImg: {
        position: 'absolute',
        top: -20,
        left: -20,
        width: 250,
        height: 250 / 690 * 817,
        alignItems: 'center'
    },
    roundedImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.GREEN
    },
    content: {
        alignItems: 'center',
        marginHorizontal: 20
    },
    title: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size18,
        color: COLORS.GREEN,
        marginBottom: 15
    },
    paginatorContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    active: {
        width: 32,
        height: 8,
        backgroundColor: COLORS.GREEN,
        marginHorizontal: 2,
        borderRadius: 4
    },
    activeWhite: {
        width: 32,
        height: 8,
        backgroundColor: COLORS.WHITE,
        marginHorizontal: 2,
        borderRadius: 4
    },
    inActive: {
        width: 12,
        height: 8,
        backgroundColor: COLORS.GRAY,
        marginHorizontal: 2,
        borderRadius: 4
    }
});
