const Languages = {
    tabs: {
        home: 'Trang chủ',
        notify: 'Thông báo',
        contracts: 'Danh sách hợp đồng',
        loan: 'Đăng ký khoản vay',
        history: 'Lịch sử giao dịch',
        account: 'Tài khoản'
    },
    common: {
        cancel: 'Hủy',
        OK: 'Chọn',
        back: 'Quay lại',
        yes: 'Có',
        no: 'Không',
        close: 'Đóng',
        search: 'Tìm kiếm',
        agree: 'Đồng ý',
        or: 'Hoặc',
        continue: 'Tiếp tục',
        telePhone: '1900 6907',
        currency: 'VND',
        done: 'Xong',
        skip: 'Bỏ qua',
        checkRule: 'Đồng ý với chính sách và điều khoản của chúng tôi'
    },
    errorMsg: {
        noInternet: 'Kết nối bị gián đoạn, vui lòng thử lại!',
        sessionExpired: 'Phiên làm việc quá hạn, vui lòng đăng nhập lại!',
        invalidAccount: 'Tài khoản không đúng, vui lòng đăng nhập lại!',
        errLoginSocial: 'Có lỗi khi đăng nhập, vui lòng thử lại!',
        userNameRequired: 'Họ và tên không được để trống',
        userNameLength: 'Họ và tên không được ít hơn 6 ký tự',
        userNameRegex: 'Họ và tên không được chứa ký tự đặc biệt hoặc số',
        emailNull: 'Email không được để trống',
        emailRegex: 'Email không đúng định dạng',
        cardNull: 'Số CMND/CCCD không được để trống',
        cardRegex: 'Số CMND/CCCD phải là số',
        cardCheck: 'Số CMND/CCCD không hợp lệ',
        pwdNull: 'Mật khẩu không được để trống',
        pwdCheck: 'Mật khẩu không được ít hơn 8 ký tự',
        conFirmPwd: 'Xác nhận mật khẩu không trùng khớp với mật khẩu mới',
        phoneIsEmpty: 'Số điện thoại không được để trống',
        phoneRegex: 'Số điện thoại không đúng định dạng',
        phoneCount: 'Số điện thoại chỉ được 10 số',
        keyReferRegex: 'Mã giới thiệu có định dạng tương tự số điện thoại',
        keyReferCount: 'Mã giới thiệu được chỉ định là 10 số',
        birthdayEmpty: 'Ngày sinh không được để trống',
        birthdayNotNumber: 'Ngày sinh không đúng định dạng ví dụ: 01/01/1970',
        birthdayAge18: 'Chưa đủ 18 tuổi',
        birthdayAge95: 'Vượt quá 95 tuổi',
        logoutMessage: 'Bạn có chắc chắc muốn đăng xuất không?',
        loanMoneyEmpty: 'Số tiền vay không được bỏ trống',
        loanMoneyNotValid: 'Số tiền vay không được lớn hơn số tiền tối đa',
        notEqualZero: 'Số tiền vay không thể bằng không',
        missingMomo: 'Vui lòng cài ứng dụng Momo để có thể thực hiện thanh toán',
        missingPaymentMethod: 'Vui lòng chọn phương thức thanh toán',
        customerCodeEmpty: 'Mã khách hàng không được bỏ trống',
        providerEmpty: 'Vui lòng chọn nhà cung cấp',
        msgChannel: 'Vui lòng chọn kênh',
        noBill: 'Bạn không có hoá đơn nợ cước nào',
        uploading: 'Đang tải ảnh lên',
        payOff: 'Bạn đã thanh toán tất cả các hoá đơn',
        errQuery: 'Truy vấn thất bại',
        failEkyc: 'Xác thực thất bại, vui lòng xác thực lại !',
        loadingEkyc: 'Chứng từ của bạn đang được xác thực',
        enoughEKyc: 'Người dùng phải chọn đầy đủ ảnh trước khi tải lên!',
        resendOTP: 'Vui lòng gửi lại OTP vì mã OTP của bạn đã quá hạn!'
    },
    noInternet: {
        offline: 'Kết nối bị gián đoạn',
        desNoInternet: 'Kết nối bị gián đoạn, vui lòng thử lại!'
    },
    update: {
        title: 'Cập nhật phiên bản mới',
        description:
            'Đã có phiên bản cập nhật mới cho ứng dụng. Bạn vui lòng cập nhật để có trải nghiệm tốt hơn.\n\nXin cám ơn.',
        update: 'Cập nhật'
    },
    location: {
        PermissionAlert: 'PermissionAlert',
        AccessLocationServices: 'AccessLocationServices',
        OpenSetting: 'Mở cài đặt',
        Cancel: 'Đóng'
    },
    image: {
        camera: 'Camera',
        library: 'Thư viện ảnh',
        permissionAlert: 'Yêu cầu truy cập',
        accessPhotoMsg: 'Tienngay cần truy cập vào thư viện ảnh của bạn',
        accessCameraMsg: 'Tienngay cần truy cập vào camera của bạn',
        accessAddPhotoMsg: 'Tienngay cần thêm ảnh vào thư viện ảnh của bạn',
        openSetting: 'Mở cài đặt',
        deny: 'Từ chối',
        uploading: 'Đang tải ảnh',
        singleUploading: 'Đang tải ảnh lên',
        selectedThumb: 'Đã chọn hình đại diện',
        selectAsThumb: 'Đặt làm hình đại diện',
        uploadFailed: 'Xảy ra lỗi trong quá trình tải ảnh lên'
    },
    onBoarding: [
        {
            title: 'Dịch vụ khác biệt - Ưu điểm vượt trội',
            des: '<a><g>TienNgay</g><r>.vn</r> là tên thương hiệu của hệ thống dịch vụ tài chính đa tiện ích thuộc Công ty Cổ phần Công nghệ Tài Chính Việt, được xây dựng với mục tiêu trở thành một địa chỉ tin cậy về các dịch vụ tài chính toàn diện hàng đầu Việt Nam.</a>'
        },
        {
            title: 'Giải ngân nhanh chóng',
            des: '<w>Mọi thủ tục đơn giản, nhanh chóng, hỗ trợ và phục vụ tận tâm 24/7 để giải đáp mọi thắc mắc của khách hàng.</w>'
        },
        {
            title: 'Uy tín, Tin cậy',
            des: '<w>Giấy phép kinh doanh minh bạch, rõ ràng. Tất cả thông tin về sản phẩm, dịch vụ được thể hiện minh bạch và đồng nhất trên toàn hệ thống các điểm giao dịch. Thông tin cá nhân của Khách hàng được bảo mật tuyệt đối.</w>'
        }
    ],
    home: {
        title: 'Trang chủ',
        agent: 'Phòng giao dịch',
        loanNow: 'Đăng ký vay ngay',
        insurance: 'Dịch vụ bảo hiểm',
        vps: 'Dịch vụ chứng khoán',
        communication: 'Tin tức truyền thông',
        hello: 'Xin chào,'
    },
    valuation: {
        title: 'Định giá tài sản',
        car: 'Ô tô',
        motor: 'Xe máy'
    },
    service: {
        title: 'Dịch vụ thanh toán',
        water: 'Hóa đơn nước',
        electric: 'Hóa đơn điện',
        bill: 'Hóa đơn tài chính',
        utility: 'Tiện ích',
        luckyLott: 'Luckylott'
    },
    contracts: {
        title: 'Danh sách hợp đồng',
        finding: 'Tra cứu hợp đồng',
        loaning: 'Đang vay',
        extended: 'Đã gia hạn',
        paid: 'Đã tất toán',
        search: 'Tìm kiếm hợp đồng',
        contractCode: 'Mã hợp đồng',
        amountLoan1: 'Số tiền vay',
        amountLoan2: 'Khoản vay',
        totalAmount: 'Số tiền cần thanh toán',
        disbursementDate: 'Ngày giải ngân',
        nextPayDate: 'Ngày thanh toán kỳ tới',
        status: 'Trạng thái',
        payNow: 'THANH TOÁN NGAY',
        viewDetail: 'Xem chi tiết hợp đồng',
        historyPayment: 'LỊCH THANH TOÁN',
        noContract: 'Chưa có hợp đồng nào'
    },
    contractDetail: {
        pay: 'Thanh toán',
        payAll: 'Tất toán',
        fields: [
            'Mã hợp đồng',
            'Tên khách hàng',
            'Hình thức vay',
            'Số tiền vay',
            'Ngày giải ngân',
            'Kỳ hạn vay',
            'Ngày đáo hạn',
            'Trạng thái hợp đồng',
            'Hình thức trả lãi',
            'Gốc cuối kỳ',
            'Số tiền thanh toán hàng kỳ*',
            'Tiền gốc thanh toán hàng kỳ',
            'Tiền lãi thanh toán hàng kỳ',
            'Tổng phí thanh toán hàng kỳ',
            'Tình trạng nợ',
            'Ngày chậm trả'
        ],
        paymentTime: 'Xem lịch thanh toán',
        history: 'Lịch sử thanh toán',
        document: 'Xem chứng từ',
        note: '<s><r>*</r>Số tiền thanh toán đã bao gồm phí phạt như: chậm trả, quá hạn, tất toán trước hạn ...</s>',
        allMoney: 'Tổng tiền',
        recentPayment: 'Thanh toán gần đây',
        noHistory: 'Bạn chưa có lịch sử thanh toán nào'
    },
    loan: {
        title: 'Đăng ký khoản vay',
        infoCustomer: 'THÔNG TIN KHÁCH HÀNG',
        fullName: 'Họ và tên',
        formality: 'hình thức vay',
        infoLoan: 'THÔNG TIN KHOẢN VAY',
        assetName: 'tên tài sản',
        propertyType: 'loại tài sản',
        formalityPayment: 'Hình thức trả lãi',
        loan: 'Số tiền vay',
        borrowedTime: 'Thời gian vay',
        formalOfPayment: 'Hình thức trả lãi',
        applyForLoan: 'Đăng kí vay ngay',
        enterFullName: 'Nhập họ và tên',
        enterPhoneNumber: 'Nhập số điện thoại',
        phoneNumber: 'Số điện thoại',
        maximumMoney: 'Số tiền có thể vay tối đa là',
        timeForLoan: 'Thời gian vay',
        productLoan: 'Sản phẩm vay',
        needToSelect: 'cần được chọn'
    },
    history: {
        title: 'Lịch sử giao dịch',
        pay: 'Thanh toán',
        noTransaction: 'Bạn chưa có giao dịch nào',
        month: 'Tháng',
        year: 'Năm',
        success: 'Thành công',
        waiting: 'Đang chờ',
        error: 'Thất bại'
    },
    detailsHistory: {
        title: 'Chi tiết thanh toán',
        pay: 'Thanh toán',
        services: 'Dịch vụ',
        keyConTract: 'Mã hợp đồng',
        username: 'Họ và tên',
        timePay: 'Thời gian thanh toán',
        totalPay: 'Tổng tiền thanh toán',
        details: [
            'Mã giao dịch',
            'Họ và tên',
            'Hình thức thanh toán',
            'Số tiền đã thanh toán',
            'Trạng thái'
        ]
    },
    account: {
        title: 'Tài khoản'
    },
    notify: {
        title: 'Thông báo',
        noNotify: 'Bạn chưa có thông báo nào',
        filters: ['Tất cả', 'Chưa đọc', 'Hợp đồng', 'Bảo hiểm', 'Thanh toán'],
        types: ['Hợp đồng', 'Bảo hiểm', 'Thanh toán']
    },
    itemInForAccount: {
        inFor: 'Thông tin cá nhân',
        changePwd: 'Thay đổi mật khẩu',
        authentication: 'Phương thức xác thực',
        reFerFriends: 'Giới thiệu bạn bè',
        afFiLiateAccount: 'Tài khoản liên kết',
        introduction: 'Giới thiệu và hỏi đáp',
        termSandCondition: 'Điều khoản và điều kiện',
        support: 'Hỗ trợ',
        eKyc: 'Xác thực chứng từ',
        unEKyc: 'Chưa xác thực chứng từ'
    },
    feedback: {
        title: 'Đánh giá của bạn',
        description:
            'Chúng tôi rất hi vọng nhận được đánh giá từ bạn nhằm nâng cao chất lượng phục vụ.',
        titleModal: 'ĐÁNH GIÁ CỦA BẠN',
        contentRate: 'Nội dung đánh giá',
        send: 'GỬI',
        sentSuccess: 'Cám ơn bạn đã đánh giá ứng dụng',
        sentFail: 'Gửi thất bại',
        ratingLevels: ['Quá tệ', 'Tệ', 'Tạm được', 'Tốt', 'Xuất sắc']
    },
    authentication: {
        title: 'Phương thức xác thực',
        auThen: 'Xác thực nhanh',
        touchId: 'Touch ID',
        faceId: 'Face ID',
        keyPin: 'Mã pin',
        password: 'Mật khẩu',
        description: 'Đăng nhập bằng vân tay của bạn',
        descriptionFaceId: 'Đăng nhập bằng Face ID của bạn',
        login: 'Đăng nhập',
        forgotPwd: 'Quên mật khẩu',
        otherLogin: 'Đăng nhập với tài khoản khác',
        hello: 'Xin chào',
        company: 'TienNgay.vn',
        switchboard: 'Tổng đài',
        help: 'Trợ giúp',
        confirm: 'XÁC NHẬN YÊU CẦU',
        facIdConFirm:
            'Quý khách có muốn sử dụng Face ID làm phương thức xác thực chính',
        touchidconfirm:
            'Quý khách có muốn sử dụng Touch ID làm phương thức xác thực chính',
        passCodeConfirm:
            'Quý khách có muốn sử dụng mã pin làm phương thức xác thực chính',
        sensorDescription: 'Chạm vào cảm biến vân tay',
        sensorErrorDescription: 'Thất bại', // Android
        cancelText: 'Đăng nhập bằng mật khẩu', // Android,
        alertLoginNormal: 'Chức năng này sẽ đóng nếu bạn nhập mật khẩu thường!'
    },
    errorBiometryType: {
        NOT_DEFINE: 'Vui lòng thêm ít nhất 1 vân tay vào thiết bị của bạn',
        // ios
        RCTTouchIDNotSupported: 'Không hỗ trợ xác thực vân tay trên thiết bị này',
        RCTTouchIDUnknownError:
            'Đăng nhập thất bại nhiều lần, vui lòng đăng nhập với mật khẩu',
        LAErrorTouchIDNotEnrolled:
            'Vui lòng thêm ít nhất 1 faceId vào thiết bị của bạn',
        LAErrorTouchIDNotAvailable:
            'Không có sẵn xác thực nhanh trên thiết bị của bạn',
        ErrorFaceId: 'Vui lòng thêm ít nhất 1 xác thực faceId vào thiết bị của bạn',
        // android
        NOT_SUPPORTED: 'Không hỗ trợ xác thực vân tay trên thiết bị này',
        NOT_AVAILABLE: 'Không hỗ trợ xác thực vân tay trên thiết bị này',
        NOT_ENROLLED: 'Vui lòng thêm ít nhất 1 vân tay vào thiết bị của bạn',
        FINGERPRINT_ERROR_LOCKOUT_PERMANENT:
            'Xác thực không thành công, thử lại sau',
        LAErrorTouchIDLockout:
            'Đã xảy ra lỗi do đăng nhập quá nhiều lần, vui lòng thử lại sau'
    },
    setPassCode: {
        titleEnter: 'Xác thực mã PIN',
        titleSetPasscode: 'Sử dụng mã PIN để xác thực nhanh',
        repeat: 'Nhập lại mã PIN',
        errorSet: 'Mã PIN trước và mã PIN sau không trùng khớp',
        errorEnter: 'Mã PIN không đúng',
        footerText: 'Tiếp tục'
    },
    enterPasscode: {
        title: 'Nhập mã pin',
        error: 'Nhập sai mã pin vui lòng nhập lại',
        footerText: 'Quay lại'
    },
    login: {
        phoneNumber: 'Số điện thoại',
        password: 'Mật khẩu',
        forgotPwd: 'Quên mật khẩu',
        saveInfo: 'Lưu thông tin đăng nhập',
        haveAccount: 'Chưa có tài khoản?',
        registerNow: 'Đăng kí ngay',
        loginFB: 'ĐĂNG NHẬP FACEBOOK',
        loginGoogle: 'ĐĂNG NHẬP GOOGLE'
    },
    changePwd: {
        title: 'Thay đổi mật khẩu',
        oldPass: 'Mật khẩu cũ',
        newPass: 'Mật khẩu mới',
        currentNewPass: 'Nhập lại mật khẩu mới',
        placeOldPass: 'Nhập mật khẩu cũ',
        placeNewPass: 'Nhập mật khẩu mới',
        toastSuccess: 'Đổi mật khẩu thành công',
        toastFail: 'Đổi mật khẩu thất bại',
        updatePass: 'Cập nhật mật khẩu'
    },
    profileAuth: {
        title: 'Thông tin cá nhân',
        nameLogin: 'Tên đăng nhập',
        username: 'Họ và tên',
        numberPhone: 'Số điện thoại',
        card: 'CMND/CCCD',
        birthDate: 'Ngày sinh',
        date: 'Ngày cấp',
        place: 'Nơi cấp',
        address: 'Địa chỉ',
        email: 'Email',
        pass: 'Mật khẩu',
        confirmPwd: 'Xác nhận lại mật khẩu',
        enterPwd: 'Nhập mật khẩu',
        currentPass: 'Nhập lại mật khẩu',
        about: 'Nơi bạn biết về chúng tôi',
        knowChannel: 'Bạn biết chúng tôi qua kênh nào',
        keyRefer: 'Mã giới thiệu',
        enterKeyRefer: 'Nhập mã giới thiệu',
        successSignUp: 'Đăng kí tài khoản thành công!'
    },
    refer: {
        title: 'Giới thiệu bạn bè',
        link: 'Link giới thiệu',
        key: 'Mã giới thiệu',
        qr: 'Mã QR',
        share: 'Chia sẻ',
        copPy: 'Copy'
    },
    editProFile: {
        title: 'CHỈNH SỬA THÔNG TIN',
        placename: 'Nhập họ và tên',
        placePhone: 'Nhập số điện thoại',
        placeAdd: 'Nhập địa chỉ',
        placeEmail: 'Nhập email',
        placeCard: 'Nhập cmt/cccd',
        placeBirthDate: 'Nhập ngày sinh'
    },
    signIn: {
        title: 'Tạo tài khoản'
    },
    button: {
        btnEditProfile: 'Lưu thông tin',
        btnChangePassword: 'Thay đổi mật khẩu',
        btnSignIn: 'Tạo tài khoản',
        btnConfirm: 'Xác nhận'
    },
    propertyValuation: {
        title: 'ĐỊNH GIÁ TÀI SẢN',
        motor: 'Xe Máy',
        car: 'Ô Tô',
        formality: 'hình thức',
        brandName: 'hãng xe',
        vehicleName: 'tên xe',
        depreciation: 'khấu hao sử dụng',
        valuation: 'Giá trị tài sản',
        money: 'Số tiền vay được',
        select: 'Chọn',
        borrow: 'VAY NGAY',
        currencyUnit: 'VNĐ',
        model: 'Dòng xe',
        name: 'Tên xe'
    },
    paymentService: {
        title: 'THANH TOÁN TIỆN ÍCH',
        waterBill: 'Hoá đơn nước',
        electricBill: 'Hoá đơn điện',
        financeBill: 'Hoá đơn tài chính',
        provider: 'Nhà cung cấp',
        customCodeEnter: 'Nhập mã khách hàng',
        selectProvider: '-Chọn nhà cung cấp-',
        enterCustomCode: 'Nhập nhà cung cấp',
        inforPayment: 'THÔNG TIN THANH TOÁN',
        customCode: 'Mã khách hàng',
        fullName: 'Họ và tên',
        address: 'Địa chỉ',
        paymentMoney: 'Số tiền thanh toán',
        paymentSource: 'Nguồn tiền thanh toán',
        guide: 'Nhấn "THANH TOÁN" đồng nghĩa bạn đồng ý với',
        license: 'Điều khoản sử dụng và chính sách',
        our: 'của chúng tôi',
        amount: 'TỔNG TIỀN',
        payment: 'THANH TOÁN',
        sourcePayment: 'NGÂN LƯỢNG',
        vimo: 'VIMO'
    },
    agent: {
        search: 'Nhập địa chỉ tìm kiếm',
        title: 'Phòng giao dịch',
        nameCompany: 'TienNgay.vn'
    },
    ranking: {
        first: 'first',
        second: 'second',
        third: 'third'
    },
    document: {
        title: 'CHỨNG TỪ LIÊN QUAN',
        legalRecords: 'Hồ sơ pháp lý',
        financialIncome: 'Hồ sơ chứng minh thu nhập tài chính',
        asset: 'Hồ sơ tài sản đảm bảo',
        purposeUsing: 'Hồ sơ chứng minh mục đích sử dụng vốn',
        contractOther: 'Hồ sơ khác',
        identify: 'Hồ sơ thân nhân',
        household: 'Hồ sơ chứng minh thu nhập',
        driverLicense: 'Hồ sơ tài sản',
        vehicle: 'Hồ sơ thẩm định thực địa',
        agree: 'Thỏa thuận',
        expertise: 'Hồ sơ giải ngân',
        extension: 'Hồ sơ gia hạn'
    },
    paymentSchedule: {
        totalPayed: 'Tổng tiền đã thanh toán',
        debtTotal: 'Tổng dư nợ còn lại',
        datePay: 'Ngày thanh toán',
        moneyPayed: 'Số tiền cần thanh toán',
        debt: 'Dư nợ còn lại',
        period: 'Kì',
        periodPayed: 'CÁC KỲ ĐÃ THANH TOÁN',
        pay: 'THANH TOÁN NGAY',
        detailSee: 'Xem chi tiết',
        totalFinalSett: 'TỔNG TIỀN TẤT TOÁN',
        finalSettlement: 'TẤT TOÁN'
    },
    paymentScheduleDetail: {
        totalPeriodPay: 'Tổng tiền trả hàng kỳ',
        principalMustPay: 'Tiền gốc phải trả',
        interestMustPay: 'Tiền lãi phải trả',
        feeMustPay: 'Tiền phí phải trả',
        lateFeePay: 'Phí phạt chậm trả',
        period: 'Kì',
        remainingBalance: 'Dư nợ còn lại',
        pay: 'THANH TOÁN ',
        debtStatus: 'Tình trạng nợ',
        status: 'Trạng thái',
        latePaymentDate: 'Ngày chậm trả',
        totalMoney: 'TỔNG TIỀN',
        paymentScheduleDetailTitle: 'CHI TIẾT TRẢ LÃI KỲ',
        date: 'ngày',
        state: 'Nợ xấu cấp',
        payed: 'Đã thanh toán',
        notPaid: 'Chưa thanh toán'
    },
    contractPayment: {
        contractCode: 'Mã hợp đồng',
        fullName: 'Họ và tên',
        originPayment: 'Dư nợ còn lại',
        feePaidSoon: 'Phí phạt tất toán trước hạn',
        interestPayable: 'Tiền lãi phải trả',
        lateFeePay: 'Tiền chậm trả',
        moneyInPeriod: 'Tiền kỳ',
        totalFeePayable: 'Tổng phí phải trả',
        remainingMoneyLastPeriod: 'Tiền thừa kỳ trước',
        missingMoneyLastPeriod: 'Tiền thiếu kỳ trước',
        totalPay: 'Tổng tiền thanh toán',
        payMethod: 'PHƯƠNG THỨC THANH TOÁN ',
        previousPeriodBalance: 'Tiền dư kỳ trước',
        change: 'Thay đổi',
        totalMoney: 'TỔNG TIỀN',
        pay: 'THANH TOÁN ',
        nganLuong: 'NGÂN LƯỢNG',
        vimo: 'VIMO',
        momo: 'MOMO',
        more: '<t>Nhấn <m>“%s”</m> đồng nghĩa bạn đồng ý với<g> Điều khoản sử dụng và chính sách </g>của chúng tôi.</t>',
        date: 'ngày',
        state: 'Nợ xấu cấp',
        payed: 'Đã thanh toán',
        paymentPending: 'PHIẾU THU ĐANG CHỜ',
        pending:
            'Phiếu thu của bạn đang trong trạng thái chờ duyệt, Bạn có thể thanh toán trở lại khi phiếu thu đã được duyệt.',
        payUnknown: 'Thông báo',
        payOneSuccess: 'Tất toán thành công',
        payAllSuccess: 'Thanh toán theo kỳ thành công',
        paySuccess:
            '<a>Hợp đồng <b>%s1</b> đã được %s2 với số tiền thanh toán <b>%s3</b>.<a>',
        payFinished:
            '<a>Giao dịch đã hoàn thành, bạn vui lòng xem chi tiết trong lịch sử thanh toán</a>'
    },
    otp: {
        keyOtp: 'Xác nhận mã OTP ',
        confirmOtp: 'Hãy nhập và xác nhận mã OTP',
        verificationCode: 'Mã xác thực đã được gửi đến số điện thoại ',
        codeExpiresLater: ' Mã hết hiệu lực sau ',
        resentCode: 'Gửi lại mã !',
        otp1: 'otp1',
        otp2: 'otp2',
        otp3: 'otp3',
        otp4: 'otp4',
        otp5: 'otp5',
        otp6: 'otp6',
        popupOtpErrorTitle: 'Thông báo OTP',
        popupOtpErrorDescription: 'OTP không chính xác',
        popupOtpSuccessDescription: 'Đăng ký thành công',
        popupOtpResendCode: 'Mã OTP đã hết hạn. Vui lòng gửi lại'
    },
    confirmPhone: {
        title: 'Nhập số điện thoại để nhập mã OTP',
        headerTitle: 'Xác thực số điện thoại'
    },
    quickAuThen: {
        title: 'Mật khẩu và đăng nhập',
        quickButton: 'Sử dụng xác thực nhanh',
        fingerAuThen: 'Bảo mật vân tay',
        faceid: 'Nhận diện khuôn mặt',
        pin: 'Mã Pin',
        changePwd: 'Chỉnh sửa mật khẩu',
        confirm: 'Xác thực của bạn',
        useFaceId: 'Đăng nhập nhanh bằng Face ID',
        useTouchId: 'Đăng nhập nhanh bằng vân tay',
        facIdConFirm:
            'Quý khách có muốn sử dụng Face ID làm phương thức xác thực chính',
        touchIdConfirm:
            'Quý khách có muốn sử dụng vân tay làm phương thức xác thực chính',
        passcodeConfirm:
            'Quý khách có muốn sử dụng mã pin làm phương thức xác thực chính',
        description: 'Đăng nhập bằng vân tay của bạn',
        useFaceID: 'Sử dụng Face ID để đăng nhập vào Univest',
        useTouchID: 'Sử dụng Touch ID để đăng nhập vào Univest',

        goToSetting: 'Cài đặt',
        desSetPasscode: 'Vui lòng thêm mã PIN để cài đặt xác thực nhanh',
        desSetTouchId: 'Vui lòng thêm vân tay để xác thực nhanh',
        desSetFaceId: 'Vui lòng thêm Face ID để xác thực nhanh',
        successAddTouchId: 'Đã thêm vân tay vào xác thực nhanh của bạn',
        successAddFaceId: 'Đã thêm Face ID vào xác thực của bạn'
    },
    forgotPwd: {
        enterPhone: 'Nhập số điện thoại ',
        descriptionEnterPhone:
            'Nhập Số điện thoại được liên kết với tài khoản của bạn.',
        btnOtp: 'Gửi mã OTP',
        enterPwdNew: 'Nhập mật khẩu mới',
        enterConfirmPwdNew: 'Nhập lại mật khẩu mới',
        enterInputPwdNew:
            'Nhập mật khẩu mới của bạn để giúp bạn đăng nhập cho lần tới ',
        haveAccount: 'Bạn đã có tài khoản?',
        loginNow: 'Đăng nhập ngay',
        changePwd: 'Đổi mật khẩu',
        phone: 'Số điện thoại',
        resentOtp: 'Gửi lại Otp',
        confirmOtp: 'Xác thực OTP',
        contentForgotOtp: 'Hãy xác nhận mã OTP chúng tôi đã gửi đến số &s1 để hoàn thành xác thực.',
        otpFalse: 'Người dùng nhập OTP không chính xác!'
    },
    biometry: {
        useFingerprint: 'Đăng nhập bằng vân tay của bạn',
        useFingerPrintError: 'Vân tay không khớp, vui lòng thử lại.',
        useFingerPrintManyTimesError:
            'Bạn đã nhập sai quá nhiều lần, vui lòng nhập mã pin.'
    },
    linkAccount: {
        header: 'Liên kết tài khoản',
        notLink: 'Chưa liên kết',
        linked: 'Đã liên kết',
        link: 'Liên kết',
        apple: 'Apple',
        fb: 'Facebook',
        gg: 'Google'
    },
    maintain: {
        title: 'Thông báo nâng cấp hệ thống',
        description: 'Hệ thống hiện đang trong quá trình nâng cấp, bạn vui lòng thử lại sau.',
        description1: 'Xin cảm ơn!',
        update: 'Đồng ý',
        deleteAccount: 'Xoá tài khoản',
        deleteAccountConfirm: 'Bạn có chắc chắn muốn xoá tài khoản không?\nSau khi xoá tài khoản, bạn không thể đăng nhập vào ứng dụng được nữa. Vui lòng liên hệ 1900 6907 để được hỗ trợ.',
        completionOtpDelete: 'Hãy xác nhận mã OTP chúng tôi đã gửi cho bạn để hoàn thành việc xoá tài khoản.'
    },
    eKyc: {
        frontKyc: 'Mặt trước CMND',
        behindKyc: 'Mặt sau CMND',
        avatarKyc: 'Chân dung khuôn mặt',
        avatarImageKyc: 'Ảnh chân dung chụp:',
        imageKyc: 'Ảnh giấy tờ tùy thân ',
        noteEKyc: '<gray7><red3>Chú ý:</red3> Hãy xác thực chính xác thông tin của bạn để bắt đầu đầu tư. Sau khi tài khoản bạn được xác thực thành công, bạn không thể thực hiện xác thực lại.</gray7>',
        confirmKyc: 'XÁC THỰC CHỨNG TỪ',
        confirmDocument: 'Xác thực giấy tờ',
        successUploadImage: 'Vui lòng chờ Tiện Ngay xác thực thông tin của bạn!'

    }

};
export default Languages;
