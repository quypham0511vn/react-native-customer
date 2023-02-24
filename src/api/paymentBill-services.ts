import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class PaymentBillService extends BaseService {
    getProviders = async (serviceCode: string) =>
        this.api().post(
            API_CONFIG.GET_SERVICE_PROVIDERS,
            this.buildFormData({
                sevice_code: serviceCode
            })
        );

    getInfoPayment = async (
        service_code: string,
        customer_code: string,
        publisher: string
    ) =>
        this.api().post(
            API_CONFIG.GET_PAYMENT_INFO,
            this.buildFormData({
                service_code,
                customer_code,
                publisher
            })
        );

    paymentBill = async (
        service_code: string,
        customer_code: string,
        publisher: string,
        code: string,
        amount_money: number

    ) =>
        this.api().post(
            API_CONFIG.CREATE_TRANSACTION,
            this.buildFormData({
                service_code,
                publisher,
                customer_code,
                amount_money,
                code
            })
        );
}
