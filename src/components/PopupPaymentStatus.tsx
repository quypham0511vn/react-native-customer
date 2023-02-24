import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import HTMLView from 'react-native-htmlview';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '.';
import { PopupActions } from './popup/types';
import { PopupPropsTypes } from '@/models/typesPopup';

export interface PopupPaymentStatusProps extends PopupPropsTypes {
    icon?: any;
    showBtn?: boolean;
}

export interface PopupPaymentStatusActions extends PopupActions {
    showWithContent: (title: string, content?: string) => any;
}

const PopupPaymentStatus = forwardRef<PopupPaymentStatusActions, PopupPaymentStatusProps>(
    ({ onClose, icon, content, onConfirm, title, showBtn = true }: PopupPaymentStatusProps, ref) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [popupTitle, setPopupTitle] = useState<string | undefined>(title);
        const [popupContent, setPopupContent] = useState<string | undefined>(content);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const showWithContent = useCallback((_title: string, _content?: string) => {
            setPopupTitle(_title);
            setPopupContent(_content);
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            onClose?.();
        }, [onClose]);

        useImperativeHandle(ref, () => ({
            showWithContent,
            show,
            hide
        }));

        const _onClose = useCallback(() => {
            hide();
            onClose?.();
        }, [hide, onClose]);

        const _onConfirm = useCallback(() => {
            onConfirm?.();
        }, [onConfirm]);
        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>
                    {icon}
                    <Text style={styles.txtTitle}>
                        {popupTitle}
                    </Text>
                    <HTMLView
                        stylesheet={HtmlStyles || undefined}
                        value={popupContent}
                    />
                    {showBtn && <View style={styles.wrapButton}>
                        <Touchable onPress={_onClose} style={styles.cancelButton}>
                            <Text style={styles.txtCancel}>{Languages.common.cancel}</Text>
                        </Touchable>
                        <Touchable onPress={_onConfirm} style={styles.confirmButton}>
                            <Text style={styles.txtVerify}>{Languages.common.agree}</Text>
                        </Touchable>
                    </View>}
                </View>
            </Modal>
        );
    }
);

export default PopupPaymentStatus;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 25,
        paddingHorizontal: 20
    },
    ic: {
        marginTop: 10,
        marginBottom: -10,
        width: Configs.IconSize.size39,
        height: Configs.IconSize.size39
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        marginVertical: 20,
        marginHorizontal: 10,
        textAlign: 'center'
    },
    btn: {
        width: '50%',
        marginTop: 10
    },
    txtContent: {
        ...Styles.typography.regular,
        textAlign: 'center'
    },
    wrapButton: {
        flexDirection: 'row',
        width: SCREEN_WIDTH - 90,
        marginTop: 30
        // backgroundColor:COLORS.RED
    },
    cancelButton: {
        width: (SCREEN_WIDTH - 90) / 2,
        backgroundColor: COLORS.GRAY,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    confirmButton: {
        width: (SCREEN_WIDTH - 110) / 2,
        backgroundColor: COLORS.GREEN,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginLeft: 15
    },
    txtVerify: {
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14
    },
    txtCancel: {
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size14
    }
});
