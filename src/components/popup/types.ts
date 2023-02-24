export type PopupProps = {
    onClose?: () => any;
    onConfirm?: () => any;
    onBackdropPress?: () => any;
    content?: string;
    btnText?: string;
};

export type PopupActions = {
    show: (content?: string) => any;
    hide?: (content?: string) => any;
    setContent?: (message: string) => void;
    setErrorMsg?: (msg?: string) => void;
};


