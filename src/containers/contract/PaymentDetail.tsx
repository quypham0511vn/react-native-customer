import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import KeyValue from '@/components/KeyValue';
import { ContractPaymentModel } from '@/models/contract-payment';
import { COLORS } from '@/theme';
import Utils from '@/utils/Utils';

const PaymentDetail = observer(({ route }: any) => {
    const [contractPayment] = useState<ContractPaymentModel>(route.params);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.detailsHistory.title} />

            <ScrollView>
                <View style={styles.content}>
                    <KeyValue
                        label={Languages.detailsHistory.keyConTract}
                        value={contractPayment.code_contract_disbursement}
                    />
                    <KeyValue
                        label={Languages.contractPayment.originPayment}
                        value={Utils.formatMoney(contractPayment.so_tien_goc_da_tra)}
                    />
                    <KeyValue
                        label={Languages.contractPayment.interestPayable}
                        value={Utils.formatMoney(contractPayment.so_tien_lai_da_tra)}
                    />
                    <KeyValue
                        label={Languages.contractPayment.totalFeePayable}
                        value={Utils.formatMoney(contractPayment.so_tien_phi_da_tra)}
                    />
                    <KeyValue
                        label={Languages.contractPayment.lateFeePay}
                        value={Utils.formatMoney(contractPayment.so_tien_phi_cham_tra_da_tra)}
                    />
                    <KeyValue
                        label={Languages.contractPayment.previousPeriodBalance}
                        value={Utils.formatMoney(contractPayment.tien_thua_thanh_toan_con_lai)}
                    />
                    <KeyValue
                        label={Languages.detailsHistory.details[3]}
                        value={Utils.formatMoney(contractPayment.total)}
                    />
                    <KeyValue
                        label={Languages.detailsHistory.details[0]}
                        value={contractPayment.code}
                    />
                    <KeyValue
                        label={Languages.detailsHistory.details[1]}
                        value={contractPayment.customer_bill_name}
                    />
                    <KeyValue
                        label={Languages.detailsHistory.details[2]}
                        value={contractPayment.payment_method}
                    />
                    <KeyValue
                        label={Languages.detailsHistory.details[4]}
                        value={contractPayment.progress}
                        noIndicator
                    />
                </View>
            </ScrollView>
        </View>
    );
});

export default PaymentDetail;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        margin: 15
    }
});
