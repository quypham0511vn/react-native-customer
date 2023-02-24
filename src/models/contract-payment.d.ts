import { Id } from './id';

export interface Store {
    id: string;
    name: string;
    address: string;
    code_address: string;
}

export interface ConLaiSauThanhToan {
    goc_con_lai: number;
    lai_con_lai: number;
    phi_con_lai: number;
    cham_tra_con_lai: number;
}

export interface ContractPaymentModel {
    _id: Id;
    amount_total: number;
    valid_amount: number;
    reduced_fee: number;
    total_deductible: string;
    discounted_fee: string;
    other_fee: number;
    fee_reduction: number;
    penalty_pay: number;
    code_contract: string;
    code_contract_disbursement: string;
    customer_name: string;
    total: string;
    code: string;
    type: number;
    payment_method: string;
    store: Store;
    date_pay: number;
    status: number;
    customer_bill_phone: string;
    customer_bill_name: string;
    note: string;
    bank: string;
    code_transaction_bank: string;
    type_payment: number;
    created_by: string;
    created_at: number;
    chia_mien_giam: any[];
    con_lai_sau_thanh_toan: ConLaiSauThanhToan;
    date_pay_tt: number;
    fee_delay_pay: any;
    fee_finish_contract: number;
    goc_lai_phi_phai_tra: any[];
    ky_da_tt_gan_nhat: number;
    phai_tra_hop_dong: any[];
    phi_phat_sinh: number;
    so_ngay_phat_sinh: number;
    so_tien_goc_da_tra: number;
    so_tien_goc_phai_tra_tat_toan: number;
    so_tien_lai_da_tra: number;
    so_tien_lai_phai_tra_tat_toan: number;
    so_tien_phat_sinh: number;
    so_tien_phi_cham_tra_da_tra: number;
    so_tien_phi_cham_tra_phai_tra: number;
    so_tien_phi_cham_tra_phai_tra_tat_toan: number;
    so_tien_phi_da_tra: number;
    so_tien_phi_gia_han_da_tra: number;
    so_tien_phi_gia_han_phai_tra_tat_toan: number;
    so_tien_phi_phai_tra_tat_toan: number;
    so_tien_phi_phat_sinh_phai_tra_tat_toan: number;
    so_tien_thieu: number;
    so_tien_thieu_con_lai: number;
    so_tien_thieu_da_chuyen: number;
    tat_toan_phai_tra: any[];
    temporary_plan_contract_id: Id;
    tien_phi_phat_sinh_da_tra: number;
    tien_thua_tat_toan: number;
    tien_thua_thanh_toan: number;
    tien_thua_thanh_toan_con_lai: number;
    tien_thua_thanh_toan_da_tra: number;
    tong_tien_tat_toan: number;
    updated_at: number;
    updated_by: string;
    code_contract_parent_gh: string;
    progress: string;
}
