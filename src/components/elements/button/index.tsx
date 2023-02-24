import React, { useCallback, useMemo } from 'react';
import { TextStyle, Text } from 'react-native';

import { Configs } from '@/commons/Configs';
import { COLORS } from '@/theme';
import { Touchable } from '../touchable';
import { BUTTON_STYLES } from './constants';
import { useStyleButton } from './styles';
import { ButtonProps } from './types';

export const Button = ({
    label,
    style,
    buttonStyle,
    fontSize = Configs.FontSize.size16,
    isLoading,
    onPress,
    disabled,
    textColor,
    isLowerCase,
    leftIcon,
    rightIcon,
    tag,
    radius
}: ButtonProps) => {
    const styles = useStyleButton();

    const getContainerStyle = useMemo(() => {
        if (disabled) {
            return [
                styles.container,
                styles.grayButton,
                style
            ];
        }
        let containerStyle = {};
        switch (buttonStyle) {
            case BUTTON_STYLES.GREEN:
                containerStyle = styles.greenButton;
                break;
            case BUTTON_STYLES.GREEN_1:
                containerStyle = styles.greenButton;
                break;
            case BUTTON_STYLES.BLUE:
                containerStyle = styles.blueButton;
                break;
            case BUTTON_STYLES.BLUE_1:
                containerStyle = styles.darkBlueBtn;
                break;

            case BUTTON_STYLES.GRAY:
            default:
                containerStyle = styles.grayButton;
                break;
        }

        return [
            styles.container,
            containerStyle,
            style
        ];
    }, [disabled, buttonStyle, styles.container, styles.grayButton, styles.greenButton, styles.blueButton, styles.darkBlueBtn, style]);

    const getTextColor = useMemo(() => {
        if (disabled) {
            return COLORS.LIGHT_GRAY;
        }

        let color;
        switch (buttonStyle) {
            case BUTTON_STYLES.GREEN:
                color = COLORS.WHITE;
                break;
            case BUTTON_STYLES.BLUE:
                color = COLORS.WHITE;
                break;
            case BUTTON_STYLES.WHITE:
                color = COLORS.LIGHT_GRAY;
                break;
            case BUTTON_STYLES.BLUE_1:
                color = COLORS.GREEN_1;
                break;
            case BUTTON_STYLES.GREEN_1:
                color = COLORS.WHITE;
                break;
            case BUTTON_STYLES.GRAY:
            default:
                color = COLORS.LIGHT_GRAY;
                break;
        }
        return textColor || color;
    }, [buttonStyle, disabled, textColor]);

    const getTextStyle = useMemo<TextStyle[]>(() => {
        const color = getTextColor;
        return [styles.text, { color, fontSize }];
    }, [fontSize, getTextColor, styles.text]);

    const _onPress = useCallback(() => {
        onPress?.(tag || label);
    }, [label, onPress, tag]);

    return (
        <Touchable
            disabled={isLoading || disabled}
            style={getContainerStyle}
            radius={radius || styles.container.borderRadius}
            onPress={_onPress}>
            {leftIcon}
            <Text style={getTextStyle}>
                {isLowerCase ? label : `${label}`.toUpperCase()}
            </Text>
            {rightIcon}
        </Touchable>
    );
};
