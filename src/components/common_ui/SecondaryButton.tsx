import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/theme";

interface ButtonProp {
    isLoading: boolean;
    disabled?: boolean;
    text: string;
    customStyle?: {};
    onPress: (data: any) => void;
}

const SecondaryButton = ({ isLoading, onPress, text = "Button", disabled = false, customStyle = {} }: ButtonProp) => {
    return (
        <TouchableOpacity
            style={[styles.createButton, (isLoading || disabled) && styles.createButtonDisabled, customStyle]}
            onPress={onPress}
            disabled={isLoading || disabled}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.createButtonText}>{text}</Text>
            )}
        </TouchableOpacity>
    )
};

export default SecondaryButton;



const styles = StyleSheet.create({

    createButton: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 32,
        shadowColor: 'Colors.primary',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonDisabled: {
        backgroundColor: '#9ca3af',
        shadowOpacity: 0,
        elevation: 0,
    },
    createButtonText: {
        color: Colors.primary,
        fontSize: 18,
        fontWeight: '600',
    },
});