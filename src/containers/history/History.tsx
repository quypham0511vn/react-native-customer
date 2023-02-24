import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    RefreshControl, SectionList, StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Cancel from '@/assets/images/cancel2.svg';
import Checked3 from '@/assets/images/checked3.svg';
import Contract from '@/assets/images/contract.svg';
import { BOTTOM_HEIGHT, Configs, PAGE_SIZE } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import { useAppStore } from '@/hooks';
import { HistoryModel } from '@/models/history';
import Navigator from '@/routers/Navigator';
import DateUtils from '@/utils/DateUtils';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import ScreenNames from '../../commons/ScreenNames';
import { COLORS, IconSize, Styles } from '../../theme';
import AnalyticsUtils from '@/utils/AnalyticsUtils';

interface HistorySticky {
    date: string;
    data: HistoryModel[];
}

const History = observer(() => {
    const { apiServices } = useAppStore();
    const pageSize = PAGE_SIZE * 20;
    const [isRefreshing, setIsRefreshing] = useState<boolean>(true);
    const [listHistory, setListHistory] = useState<HistorySticky[]>([]);
    const isFocused = useIsFocused();
    const fetchData = useCallback(async () => {
        const res = await apiServices.history.getHistory(
            0,
            pageSize
        );
        const histories = res.data as HistoryModel[];
        setIsRefreshing(false);

        let lastDateSection = '';
        const filter = [] as HistorySticky[];

        histories
            ?.map((item) => {
                const dateDetails = DateUtils.getDateDetails(item.created_at);
                return { ...item, year: dateDetails[0], month: dateDetails[1] + 1 };
            })
            .forEach((item: HistoryModel) => {
                const dateSection = `${Languages.history.month} ${item.month} - ${Languages.history.year} ${item.year}`;

                if (lastDateSection !== dateSection) {
                    lastDateSection = dateSection;

                    filter.push({ date: lastDateSection, data: [] });
                }

                filter.find((_item) => _item.date === lastDateSection)?.data.push(item);
            });

        setListHistory(filter);
    }, [apiServices.history, pageSize]);

    useEffect(() => {
        if(isFocused){
            fetchData();
            AnalyticsUtils.trackEvent(ScreenNames.history);
        }
    }, [isFocused]);

    useEffect(() => {
        AnalyticsUtils.trackEvent(ScreenNames.history);
    }, []);
    const renderListHistoryItem = useCallback(
        ({ item }: { item: HistoryModel }) => {
            const onItemClick = () => {
                Navigator.pushScreen(ScreenNames.detailsHistory, {
                    item
                });
            };

            const getStatusTransaction = (status: any) => {
                let valueStatus;
                switch (status) {
                    case Languages.history.success:
                        valueStatus = (
                            <Checked3 style={styles.icStatus} {...IconSize.size20_20} />
                        );
                        break;
                    case Languages.history.waiting:
                        valueStatus = (
                            <Cancel style={styles.icStatus} {...IconSize.size20_20} />
                        );
                        break;
                    case Languages.history.error:
                        break;
                    default:
                        valueStatus = (
                            <Cancel style={styles.icStatus} {...IconSize.size20_20} />
                        );
                        break;
                }
                return valueStatus;
            };

            const getColorStatusTransaction = (status: any) => {
                let color;
                switch (status) {
                    case Languages.history.success:
                        color = COLORS.GREEN;
                        break;
                    case Languages.history.waiting:
                        color = COLORS.RED_1;
                        break;
                    case Languages.history.error:
                        break;
                    default:
                        color = COLORS.RED_1;
                        break;
                }
                return color;
            };

            return (
                <>
                    <TouchableOpacity style={styles.itemContent} onPress={onItemClick}>
                        <View style={styles.icon}>
                            <Contract {...IconSize.size40_40} />
                            {getStatusTransaction(item?.status)}
                        </View>
                        <View style={styles.content}>
                            <View style={styles.flex_css}>
                                <Text style={styles.colorText}>{item?.type}</Text>
                            </View>
                            <Text style={styles.timeCreate}>{item?.created_at}</Text>
                            <View style={styles.contentBotTom}>
                                <Text
                                    style={[
                                        styles.status,
                                        { color: getColorStatusTransaction(item?.status) }
                                    ]}
                                >
                                    {item?.status}
                                </Text>
                                <Text style={styles.payPrice}>
                                    -{item?.money?.split(',').join('.')}đ
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </>
            );
        },
        []
    );

    const keyExtractor = useCallback((item: HistoryModel) => {
        return `${item.id?.$oid}`;
    }, []);

    const renderEmptyData = useMemo(() => {
        return <>
            {listHistory?.length === 0 && !isRefreshing && (
                <Text style={styles.textEmpty}>{Languages.history.noTransaction}</Text>
            )}
        </>;
    }, [isRefreshing, listHistory?.length]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchData();
        setIsRefreshing(false);
    }, [fetchData]);

    const renderSectionHeader = useCallback(({ section }: any) => {
        return (
            <View style={styles.month}>
                <Text style={styles.title_month}>{section.date}</Text>
            </View>
        );
    }, []);

    const renderHistory = useMemo(() => {
        return listHistory && <SectionList
            sections={listHistory}
            renderItem={renderListHistoryItem}
            refreshControl={<RefreshControl
                tintColor={COLORS.GREEN}
                colors={[COLORS.GREEN, COLORS.RED, COLORS.GRAY_1]}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
            />}
            ListEmptyComponent={renderEmptyData}
            contentContainerStyle={styles.contentContainer}
            {... { keyExtractor, renderSectionHeader }}
            stickySectionHeadersEnabled
        />;
    }, [isRefreshing, keyExtractor, listHistory, onRefresh, renderEmptyData, renderListHistoryItem, renderSectionHeader]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.history.title}
                exitApp />

            {renderHistory}
        </View>
    );
});

export default History;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        paddingTop: 10,
        paddingBottom: BOTTOM_HEIGHT
    },
    flex_css: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    month: {
        paddingVertical: 15,
        width: SCREEN_WIDTH,
        textAlign: 'left',
        backgroundColor: COLORS.WHITE
    },
    title_month: {
        ...Styles.typography.medium,
        color: COLORS.DARK_GRAY,
        paddingHorizontal: 20,
        textTransform: 'uppercase'
    },
    status: {
        flex: 1
    },
    timeCreate: {
        color: COLORS.LIGHT_GRAY
    },
    itemContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY_2,
        paddingTop: 5,
        paddingBottom: 15,
        paddingHorizontal: 20,
        marginBottom: 10,
        width: '100%'
    },
    content: {
        flex: 1
    },
    icon: {
        width: (SCREEN_WIDTH / 375) * 65,
        height: (SCREEN_WIDTH / 375) * 65,
        borderColor: COLORS.GRAY,
        borderWidth: 1,
        borderRadius: 50,
        textAlignVertical: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginRight: 10
    },
    iconAvatar: {
        width: '100%'
    },
    colorText: {
        ...Styles.typography.medium,
        color: COLORS.DARK_GRAY,
        marginBottom: 5
    },
    contentBotTom: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    payPrice: {
        ...Styles.typography.medium,
        color: COLORS.DARK_GRAY,
        fontSize: Configs.FontSize.size16
    },
    textEmpty: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        textAlign: 'center',
        marginVertical: 20
    },
    icStatus: {
        position: 'absolute',
        bottom: 0,
        right: 0
    }
});
