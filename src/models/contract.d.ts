import { Id } from './id';

export interface ContractDetailModel {
    status: number;
    message: string;
    hop_dong: ContractModel;
    thanh_toan: Payment;
    lich_thanh_toan: PaymentScheduleModel[];
}
export interface Payment {
    tien_lai: number;
    tien_phi: number;
    du_no_con_lai_tt: number;
    phi_phat_cham_tra_tt: number;
    tien_du_ky_truoc: number;
    phi_phat_sinh_tt: number;
    tong_penalty_con_lai: number;
    tien_chua_tra_ky_thanh_toan: number;
    phi_tat_toan_truoc_han: number;
    du_no_con_lai: number;
    phi_phat_cham_tra: number;
    tong_tien_tat_toan: number;

    so_ki_da_thanh_toan: number;
    so_ki_chua_thanh_toan: number;
    khoan_vay: string;
    lan_thanh_toan_gan_nhat: number;
    color: string;
    chi_tiet: Detail;
}
export interface ContractModel {
    id: Id;
    code_contract: string;
    ma_hop_dong: string;
    khach_hang: string;
    so_dien_thoai: string;
    cmt: string;
    khoan_vay: string;
    san_pham_vay: string;
    ngay_giai_ngan: string;
    ngay_dao_han: string;
    trang_thai: string;
    thanh_toan: Payment;
    tong_tien_da_thanh_toan: number;
    tong_no_con_lai_chua_tra: number;
    color: string;
    so_ki_da_thanh_toan: number;
    so_ki_chua_thanh_toan: number;
    ki_tra_toi: string;
    tien_tra_ki_toi: number;
    ki_toi: number;
    lan_thanh_toan_gan_nhat: any;
    disable_button: boolean;
    ki_cuoi: boolean;
    qua_han: boolean;
    id_transaction_tat_toan: string;

    hinh_thuc_vay: string;
    so_tien_vay: string;
    ki_han_vay: string;
    hinh_thuc_tra_lai: string;
    trang_thai_hop_dong: string;
    disable_button_tat_toan: boolean;
    disable_button_thanh_toan: boolean;

    so_ngay_cham_tra: number;
    tinh_trang_no: string;
}

export interface Detail {
    tien_lai: number;
    tien_phi: number;
    du_no_con_lai_tt: number;
    phi_phat_cham_tra_tt: number;
    tien_du_ky_truoc: number;
    phi_phat_sinh_tt: number;
    tong_penalty_con_lai: number;
    tien_chua_tra_ky_thanh_toan: number;
    phi_tat_toan_truoc_han: number;
    du_no_con_lai: number;
    phi_phat_cham_tra: number;
    tong_tien_tat_toan: number;
    tong_tien_da_thanh_toan: number;
    con_lai_chua_tra: string;
    ki_tra_toi: string;
    tien_tra_ki_toi: number;
    ki_toi: number;
}

export interface CustomerInfor {
    presenter_name: string;
    customer_phone_introduce: string;
    presenter_bank: string;
    presenter_stk: string;
    presenter_cmt: string;
    status_customer: string;
    customer_name: string;
    customer_email: string;
    customer_phone_number: string;
    customer_identify: string;
    date_range: string;
    issued_by: string;
    customer_identify_old: string;
    customer_gender: string;
    customer_BOD: string;
    passport_number: string;
    passport_address: string;
    passport_date: string;
    customer_resources: string;
    list_ctv: string;
    is_blacklist: string;
    marriage: string;
    id_lead: string;
    img_id_front: string;
    img_id_back: string;
    img_portrait: string;
}

export interface PaymentScheduleModel {
    _id: Id;
    code_contract: string;
    code_contract_disbursement: string;
    customer_infor: CustomerInfor;
    investor_code: string;
    type: string;
    current_plan: number;
    ky_tra: number;
    so_ngay: number;
    ngay_ky_tra: number;
    tien_tra_1_ky: number;
    round_tien_tra_1_ky: number;
    tien_goc_1ky: number;
    tien_goc_con: number;
    da_thanh_toan: number;
    phi_tu_van: number;
    phi_tham_dinh: number;
    lai_ky: number;
    lai_luy_ke: number;
    status: number;
    created_at: number;
    tien_goc_1ky_phai_tra: number;
    tien_goc_1ky_da_tra: number;
    tien_goc_1ky_con_lai: number;
    tien_lai_1ky_phai_tra: number;
    tien_lai_1ky_da_tra: number;
    tien_lai_1ky_con_lai: number;
    tien_phi_1ky_phai_tra: number;
    tien_phi_1ky_da_tra: number;
    tien_phi_1ky_con_lai: number;
    tien_phi_cham_tra_1ky_da_tra: number;
    tien_phi_cham_tra_1ky_con_lai: number;
    fee_delay_pay: number;
    so_ngay_cham_tra: number;
    amount_money: string;
    so_ngay_cham_tra_now: number;
    so_ngay_trong_ky: number;
    penalty_now: number;
    tien_thanh_toan: number;
    phi_phat_da_thanh_toan: number;
    tien_da_tra: number;
    con_lai_chua_tra: number;
    tien_chua_tra_ky_thanh_toan: number;
    so_tien_can_thanh_toan_moi_ky: number;
    color: string;
    tong_phi_lai?: number;
}
export interface Document {
    id: Id;
    identify: Identify[];
    household: Household[];
    driver_license: DriverLicense[];
    vehicle: Vehicle[];
    agree: Agree[];
    expertise: Expertise[];
    extension: Extension[];
}
export interface Identify {
    file_type: string;
    file_name: string;
    path: string;
    key: string;
}

export interface Household {
    file_type: string;
    file_name: string;
    path: string;
    key: string;
}


export interface DriverLicense {
    file_type: string;
    file_name: string;
    path: string;
    key: string;
}

export interface Vehicle {
    file_type: string;
    file_name: string;
    path: string;
    key: string;
}

export interface Agree {
    file_type: string;
    file_name: string;
    path: string;
    key: string;
}
export interface Expertise {
    file_type: string;
    file_name: string;
    path: string;
    key: string;
}
export interface Extension {
    file_type: string;
    file_name: string;
    path: string;
    key: string;
}

export interface ImagesModel {
    url: any;
    type: string;
    name: any;
}
