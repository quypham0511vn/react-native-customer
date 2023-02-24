import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Dash from 'react-native-dash';

import { HeaderBar } from '@/components';
import { COLORS, Styles } from '../../theme';
import Languages from '@/commons/Languages';
import Checked3 from '@/assets/images/checked3.svg';
import Cancel from '@/assets/images/cancel2.svg';
import { Configs } from '@/commons/Configs';
import { DetailsHistoryModel } from '@/models/history';
import { useAppStore } from '@/hooks';
import MyLoading from '@/components/MyLoading';

const DetailsHistory = observer(({ route }: { route: any }) => {

    const { apiServices } = useAppStore();
    const [listDetailsHistory, setListDetailsHistory] = useState<DetailsHistoryModel>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { id } = route.params.item;

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const res = await apiServices.history.getDetailsHistory(id?.$oid);
        const getHistory = res.data as DetailsHistoryModel || undefined;
        if (res.success) {
            setListDetailsHistory(getHistory);
        }
        setIsLoading(false);

    }, [apiServices.history, id?.$oid]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderLoad = useMemo(() => {
        return isLoading && <MyLoading isOverview={false} />;
    }, [isLoading]);

    const renderItem = useCallback((titleLeft: string, titleRight: any, textColor: string, fontsize: number, noIndicator?: boolean) => {
        return <View style={styles.row_horizontal}><View style={styles.items}>
            <Text style={styles.head} >{titleLeft}</Text>
            <Text style={[styles.textRight, { fontSize: fontsize, color: textColor }]}>{titleRight}</Text>
        </View>
        {!noIndicator &&
                <Dash
                    dashThickness={1}
                    dashGap={2}
                    dashLength={8}
                    dashColor={COLORS.GRAY_2} />
        }
        </View>;
    }, []);

    const getStatusTransaction = (status: any) => {
        let valueStatus;
        switch (status) {
            case 'success':
                valueStatus = <Checked3 />;
                break;
            case 'warning':
                valueStatus = <Cancel />;
                break;
            case 'error':
                break;
            default:
                valueStatus = <Cancel />;
                break;
        }
        return valueStatus;
    };
    console.log(JSON.stringify(listDetailsHistory));


    return (

        <View style={styles.container}>
            <HeaderBar
                title={Languages.detailsHistory.title} />
            <View>
                <View style={styles.row}>
                    {!isLoading ? <View style={styles.Box}>
                        <View style={styles.box_icon}>
                            {getStatusTransaction(listDetailsHistory?.status_eng)}

                            <Text style={styles.title}>{listDetailsHistory?.status}</Text>
                        </View>
                        <View style={styles.box_content}>
                            {renderItem(Languages.detailsHistory.services, listDetailsHistory?.type || '', COLORS.GRAY_1, 14)}
                            {renderItem(Languages.detailsHistory.keyConTract, listDetailsHistory?.code || '', COLORS.GRAY_1, 14)}
                            {renderItem(Languages.detailsHistory.username, listDetailsHistory?.customer_name || '', COLORS.GRAY_1, 14)}
                            {renderItem(Languages.detailsHistory.timePay, listDetailsHistory?.created_at || '', COLORS.GRAY_1, 14)}
                            {renderItem(Languages.detailsHistory.totalPay, `${listDetailsHistory?.money?.split(',').join('.')} đ`, COLORS.GREEN, 25, true)}
                        </View>
                    </View> : renderLoad
                    }
                </View>
            </View>
        </View>
    );
});

export default DetailsHistory;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    row: {
    },
    textRight: {
        ...Styles.typography.medium,
        flex: 1.2,
        textAlign: 'right'
    },
    head: {
        flex: 1,
        color: COLORS.DARK_GRAY
    },
    title: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: Configs.FontSize.size20,
        color: COLORS.GRAY_1,
        textTransform: 'uppercase'
    },
    Box: {
        marginTop: 50
    },
    box_icon: {
        alignItems: 'center'
    },
    box_content: {
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginHorizontal: 15
    },
    row_horizontal: {
    },
    items: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 11
    }
});

