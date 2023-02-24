import { isIOS } from '@/commons/Configs';
import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class PaymentServices extends BaseService {

    payMomo = async (id: string, totalAmount: number, payment_option: number) => this.api().post(API_CONFIG.REQUEST_PAYMENT_MOMO, this.buildFormData({
        id,
        totalAmount,
        payment_option,
        client_code: isIOS ? 1 : 2 // 1 ios, 2 android, 3: web
    }));

    payBank = async (code_contract: string, code_contract_disbursement: string, amount: number, ky_tra: number, 
        customer_name: string, customer_phone: string, type_pt: number) => this.api().post(API_CONFIG.REQUEST_PAYMENT_BANK, this.buildFormData({
        code_contract,
        code_contract_disbursement,
        amount,
        ky_tra,
        customer_name,
        customer_phone,
        type_pt
    }));

    checkTransactionInfo = async (transactionId: string) => this.api().post(API_CONFIG.TRANSACTION_INFO, this.buildFormData({
        transactionId
    }));
}

