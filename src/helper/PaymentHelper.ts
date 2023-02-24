
import { ContractDetailModel } from '@/models/contract';
import Utils from '@/utils/Utils';

export const PAYMENT_TYPE = {
    PAYMENT_MOMO_TERM: 1, // payment term
    PAYMENT_MOMO_FINAL: 2, // final settlement
    PAYMENT_BANK_FINAL: 3, // final settlement
    PAYMENT_BANK_TERM: 4 // payment term
};

function isDisablePayOne(contract?: ContractDetailModel) {
    return contract?.hop_dong?.disable_button_thanh_toan ||
        Utils.isInvalidMoney(contract?.thanh_toan?.chi_tiet?.tien_tra_ki_toi);
}

function isHidePayOne(contract?: ContractDetailModel) {
    return contract?.hop_dong?.ki_cuoi || contract?.hop_dong?.qua_han;
}

function isDisablePayAll(contract?: ContractDetailModel) {
    return contract?.hop_dong.disable_button_tat_toan;
}

function getPaymentAmount(contract: ContractDetailModel, isPayAll: boolean) {
    const chi_tiet = contract?.thanh_toan.chi_tiet;

    return isPayAll ? (chi_tiet?.tong_tien_tat_toan ||
        contract.thanh_toan?.tong_tien_tat_toan) : chi_tiet?.tien_tra_ki_toi;
}

function getPaymentAmountAsString(contract: ContractDetailModel, isPayAll: boolean) {
    return Utils.formatMoney(getPaymentAmount(contract, isPayAll));
}

export default{
    isDisablePayOne,
    isHidePayOne,
    isDisablePayAll,
    getPaymentAmount,
    getPaymentAmountAsString
};
