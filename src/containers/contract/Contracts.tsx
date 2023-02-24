import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SceneMap, SceneRendererProps, TabView } from 'react-native-tab-view';

import { Configs } from '@/commons/Configs';
import { ContractTypes } from '@/commons/constants';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { MyTextInput } from '@/components/elements/textfield';
import { ContractTypeModel } from '@/models/contract-type';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import ContractSection from './ContractSection';
import { ICONS } from '@/assets/icons/constant';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import ScreenNames from '@/commons/ScreenNames';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';

const Contracts = observer(() => {
    const [index, setIndex] = useState<number>(0);
    const [routes] = useState(ContractTypes);
    const [keyword, setKeyword] = useState<string>('');
    useEffect(() => {
        AnalyticsUtils.trackEvent(ScreenNames.contracts);
    }, []);

    const renderScene = useMemo(
        () =>
            SceneMap({
                first: () => (
                    <ContractSection
                        contractType={ContractTypes[0].type}
                        keyword={keyword}
                    />
                ),
                second: () => (
                    <ContractSection
                        contractType={ContractTypes[1].type}
                        keyword={keyword}
                    />
                )
            }),
        [keyword]
    );

    const onEndEditing = useCallback((text: string) => {
        setKeyword(text);
    }, []);

    const renderSearchComponent = useMemo(() => {
        return (
            <View style={styles.searchContainer}>
                <MyTextInput
                    placeHolder={Languages.common.search}
                    containerInput={styles.inputStyle}
                    onEndEditing={onEndEditing}
                    rightIcon={ICONS.SEARCH}
                />
            </View>
        );
    }, [onEndEditing]);

    const renderContractTypes = useCallback(
        (props: SceneRendererProps) => {
            const onContractTypePress = (item: ContractTypeModel) => {
                props.jumpTo(item.key);
            };
            return (
                <View style={styles.sessionContainer}>
                    {ContractTypes.map((item) => {
                        return (
                            <Touchable
                                key={item.index}
                                radius={15}
                                style={[
                                    styles.session,
                                    {
                                        backgroundColor:
                                            index === item.index ? COLORS.GREEN : COLORS.GRAY_3
                                    }
                                ]}
                                onPress={() => onContractTypePress(item)}
                            >
                                <Text
                                    style={[
                                        styles.txtSession,
                                        {
                                            color:
                                                index === item.index ? COLORS.WHITE : COLORS.LIGHT_GRAY
                                        }
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </Touchable>
                        );
                    })}
                </View>
            );
        },
        [index]
    );

    return (
        <ScrollViewWithKeyboard>
            <View style={styles.container}>
                <HeaderBar title={Languages.contracts.title} exitApp />

                {renderSearchComponent}

                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    renderTabBar={renderContractTypes}
                    initialLayout={{ width: SCREEN_WIDTH }}
                    lazy
                />
            </View>
        </ScrollViewWithKeyboard>
    );
});

export default Contracts;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    sessionContainer: {
        flexDirection: 'row'
    },
    session: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        color: COLORS.WHITE,
        marginHorizontal: 5
    },
    txtSession: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size11
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },
    inputStyle: {
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 20
    }
});
