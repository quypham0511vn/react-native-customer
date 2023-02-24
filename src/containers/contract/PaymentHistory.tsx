import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import KeyValueMore from '@/components/KeyValueMore';
import { useAppStore } from '@/hooks';
import { ContractModel } from '@/models/contract';
import { ContractPaymentModel } from '@/models/contract-payment';
import { Styles } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import Utils from '@/utils/Utils';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';
import { Configs } from '@/commons/Configs';
import MyLoading from '@/components/MyLoading';

const PaymentHistory = observer(({ route }: any) => {
    const { apiServices } = useAppStore();

    const [contract] = useState<ContractModel>(route.params);
    const [contractPayments, setContractPayments] = useState<ContractPaymentModel[]>();
    const [canLoadMore, setLoadMore] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        const res = await apiServices.contract.getContractTransaction(contract.id.$oid);
        setLoadMore(false);
        setContractPayments(res.data as ContractPaymentModel[]);

    }, [apiServices.contract, contract.id.$oid]);

    useEffect(() => {
        fetchData();
    }, []);

    const renderItem = useCallback(({ item }: { item: ContractPaymentModel }) => {
        const onPress = () => {
            Navigator.pushScreen(ScreenNames.paymentDetail, item);
        };
        
        return <KeyValueMore
            label={DateUtils.getLongFromDate(item.created_at)}
            value={Utils.formatMoney(item.total)}
            onPress={onPress}
        />;
    }, []);

    const keyExtractor = useCallback((item: ContractPaymentModel) => {
        return `${item.created_at} ${item._id?.$oid}`;
    }, []);

    const renderEmptyData = useMemo(() => {
        return (
            <Text style={styles.textEmpty}>{Languages.contractDetail.noHistory}</Text>
        );
    }, []);

    const renderEmpty = useMemo(() => {
        return (contractPayments?.length === 0 && !canLoadMore) ? renderEmptyData : null;
    }, [canLoadMore, contractPayments?.length, renderEmptyData]);

    const renderFooter = useMemo(() => {
        return <View>
            {canLoadMore && <MyLoading isOverview={false} />}
        </View>;
    }, [canLoadMore]);

    const renderList = useMemo(() => {
        return (
            <FlatList
                data={contractPayments}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                {...{ keyExtractor, renderItem }}
            />
        );
    }, [contractPayments, renderEmpty, renderFooter, keyExtractor, renderItem]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.contractDetail.history} />

            {(contractPayments?.length || 0) > 0 && <Text style={styles.section}>
                {Languages.contractDetail.recentPayment}
            </Text>}

            {renderList}
        </View>
    );
});

export default PaymentHistory;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    section: {
        ...Styles.typography.medium,
        textTransform: 'uppercase',
        marginLeft: 10,
        marginTop: 20
    },
    textEmpty: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        textAlign: 'center',
        marginVertical: 20
    }
});
