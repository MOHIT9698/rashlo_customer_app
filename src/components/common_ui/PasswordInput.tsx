import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller, FieldError } from "react-hook-form";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/theme";

interface PasswordInputProps {
    control: any;
    name: any;
    label: string;
    placeholder?: string;
    error?: FieldError;
};

const PasswordInput = ({
    control,
    name,
    label,
    placeholder,
    error,
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{label}</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="#9ca3af"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={[styles.input, error && styles.inputError]}
                            placeholder={placeholder}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword((prev) => !prev)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>
                    </View>
                    {error && <Text style={styles.errorText}>{error.message}</Text>}
                </View>
            )}
        />
    );
};

export default PasswordInput;

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 45,
        fontSize: 16,
    },
    inputError: {
        borderColor: "red",
    },
    eyeIcon: {
        paddingHorizontal: 6,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
});
