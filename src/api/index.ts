import { AuthServices } from './auth-services';
import { CommonServices } from './common-services';
import { ContractServices } from './contract-services';
import { HistoryServices } from './history-services';
import { ImageServices } from './image-services';
import { NotificationServices } from './notification-services';
import { PaymentServices } from './payment-services';
import { PaymentBillService } from './paymentBill-services';
import { PropertyValuationServices } from './propertyValuation-service';

export class ApiServices {

    auth = new AuthServices();

    common = new CommonServices();

    contract = new ContractServices();

    history = new HistoryServices();

    property = new PropertyValuationServices();

    notification = new NotificationServices();

    paymentServices = new PaymentServices();

    paymentBillServices = new PaymentBillService();

    imageServices = new ImageServices();
}
