import { isIOS } from '@/commons/Configs';

// README: Should be using react native config

export enum LINKS {
    WEB = 'https://tienngay.vn/',
    VPS = 'https://openaccount.vps.com.vn/?MKTID=H787',
    ABOUT_US = 'https://tienngay.vn/gioi-thieu-app',
    POLICY = 'https://tienngay.vn/app-privacy-policy',
    FAQ = 'https://tienngay.vn/faqs-app',
    FB_FAN_PAGE = 'https://www.facebook.com/tienngay.vn',
    STORE_ANDROID = 'https://play.google.com/store/apps/details?id=vn.tienngay.customer',
    STORE_IOS = 'https://apps.apple.com/id/app/tienngay-customer/id1560920806',
    ONE_LINK = 'https://onelink.to/66ada6',
    LUCKY_LOTT_ANDROID = 'https://play.google.com/store/apps/details?id=com.luckylott.store',
    LUCKY_LOTT_IOS = 'https://apps.apple.com/vn/app/luckylott/id1518746631',
}

export enum CONTACT {
    PHONE = '19006907'
}

export const STORE_APP_LINK = isIOS ? LINKS.STORE_IOS : LINKS.STORE_ANDROID;
export const STORE_LUCKY_LOTT = isIOS ? LINKS.LUCKY_LOTT_IOS : LINKS.LUCKY_LOTT_ANDROID;

export enum API_CONFIG {
    BASE_URL = 'https://appkh.tienngay.vn/V2',
    //   BASE_URL_OLD = 'https://sandboxappkh.tienngay.vn',
    // BASE_URL = 'https://appkh.tienvui.vn/V2',
    DOMAIN_SHARE = 'https://',

    IMAGES_HOST = 'https://',

    GET_KEY_UPLOAD = '/api/KeyUpload',
    UPLOAD_IMAGE = '/UploadHandler.php',

    // common
    GET_VERSION = '/api/VersionApiStatic',
    GET_BANNERS = '/banner/get_all_home', // banner app
    GET_NEWS = '/banner/news', // tin tức truyền thông
    GET_INSURANCES = '/banner/handbook', // danh sách bảo hiểm
    ENCRYPT = '/api/Encrypt',
    CHECK_APP_REVIEW = '/app/review',

    // authentication
    LOGIN = '/auth/signin',
    TOKEN = '/token',
    REFRESH_TOKEN = '/token',
    USER_INFO = '/user/get_user_info', // thông tin tài khoản
    REGISTER = '/auth/app_register', // đăng kí tài khoản
    ACTIVE_AUTH = '/auth/auth_register', // kích hoạt tài khoản: OTP
    RESEND_OTP = '/auth/resend_token', // gửi lại otp
    CHANEL = '/configuration_formality/get_utm_source', // list danh sách kênh đăng kí
    UPDATE_USER_INFO = '/user/process_update_profile', // update user account
    CHANGE_NEW_PWD = '/user/change_password_user', // change mật khẩu mới
    LOGOUT = '/api/Logout', // logout
    LOGIN_THIRD_PARTY = 'auth/login', // login bên thứ 3  facebook, google, apple,
    CONFIRM_PHONE_NUMBER = 'auth/update_phone_number', // xác thực số điện thoại
    ACTIVE_ACCOUNT_SOCIAL = 'auth/auth_otp_active', // active tài khoản sau khi xác thực OTP
    OTP_RESET_PWD = '/auth/reset_password', // otp reset pwd
    UPDATE_PWD = 'auth/new_password',
    LINK_SOCIAL = '/user/link_social',
    OTP_DELETE_ACCOUNT = '/user/block_account',
    DELETE_ACCOUNT = '/user/confirm_block_account',

    // upload ảnh

    UPLOAD_HTTP_IMAGE = '/user/upload',
    UPLOAD_IDENTITY = '/user/auth',

    // history
    HISTORY = '/transaction/utility_payments',
    DETAILS_HISTORY = '/transaction/detail_transaction',

    // notification
    NOTIFICATION = '/user/get_notification_user',
    CREATE_FCM_TOKEN = 'user/save_device_token_user',
    GET_UNREAD_COUNT_NOTIFICATION = 'user/get_count_notification_user',

    // contracts
    CONTRACTS = 'contract/contract_tempo_by_user', // List danh sách hợp đồng
    CONTRACT_DETAIL = 'contract/tempo_detail', // Chi tiết hợp đồng
    CONTRACT_PAYMENT = 'transaction/getTransactionByUser', // Lịch sử thanh toán của hợp đồng
    DOCUMENT = 'contract/get_image_accurecy', // Danh sách chứng từ
    REQUEST_PAYMENT_MOMO = 'MoMoAppKH/initPayment', // Thanh toán qua MOMO
    REQUEST_PAYMENT_BANK = 'transaction/app_create_transaction',
    TRANSACTION_INFO = 'MoMoAppKH/transactionInfo',
    // service payment
    GET_SERVICE_PROVIDERS = 'service/find_where', // list danh sách nhà cung cấp
    GET_PAYMENT_INFO = 'billingVimo/query_bill', // tìm thông tin hoá đơn
    CREATE_TRANSACTION = 'billingVimo/app_create_transaction_NL', // thanh toán hoá đơn

    // property valuation
    GET_LIST_FORMALITY = 'configuration_formality/get_configuration_formality_app', // list hình thức vay
    GET_LIST_BRAND_NAME = 'property/get_property_parent', // list hãng xe
    GET_LIST_MODEL_NAME = 'property/get_property_model', // list dòng xe
    GET_LIST_PROPERTY_NAME = 'property/get_property_child', // list danh sách tên xe
    GET_LIST_DEPRECIATION_PROPERTY = 'property/get_property', // list danh sách khấu hao
    GET_PRICE_PROPERTY = 'property/getPriceProperty', // định giá tài sản
    GET_LIST_FORMALITY_OF_PAYMENT = 'configuration_formality/get_configuration_type_payment_app', // hình thức vay
    GET_LIST_TIME_LOAN = 'configuration_formality/get_configuration_time_loan_app', // list thời gian vay
    GET_LIST_MAIN_PROPERTY = 'property/get_property_main_new', // list loại tài sản
    GET_LIST_PRODUCT_LOAN = 'property/get_product_loan', // list sản phẩm vay
    CREATE_CONTRACT_LOAN = 'lead/register_loan', // tạo khoản vay

    // Get all store
    GET_ALL_STORE = '/store/get_all', // List danh sách phòng giao dịch
    GET_RATE = '/rating_app/rate_of_satisfaction' // đánh giá ứng dụng
}

export const PAYMENT_URL = {
    NL_SUCCESSFULLY: `${API_CONFIG.BASE_URL}/transaction/success`,
    NL_FAILED: `${API_CONFIG.BASE_URL}/transaction/cancelURL`,
    VIMO_FAILED: `${API_CONFIG.BASE_URL}/billingVimo/cancelUrl`,
    VIMO_SUCCESSFULLY: `${API_CONFIG.BASE_URL}/billingVimo/success`
};
