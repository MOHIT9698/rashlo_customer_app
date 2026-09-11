import { Ionicons } from "@expo/vector-icons";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/theme";

interface InputProps {
  control: Control | any;
  name: string;       
  label?: string;       
  iconName?: string;       
  placeholder?: string;       
  autoCapitalize?: "words" |"characters" | "none";       
  keyboardType?: "phone-pad" | "email-address";       
  autoComplete?: "tel" | "email" | "name";       
  secureTextEntry?: boolean;       
  error?: { message: string } | any;      
};

const InputField = ({
  control,
  name,
  error,
  label = "Label",
  iconName = "",
  placeholder = "Enter",
  autoCapitalize ,
  keyboardType,
  autoComplete,
  secureTextEntry=false,
}: InputProps) => {

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.inputGroup}>
          {label && <Text style={styles.label}>{label}</Text>}
          <View style={styles.inputContainer}>
            {iconName &&
              <Ionicons
                name={iconName}
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />}
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
            />
          </View>
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
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
    marginRight: 12,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    // color: '#365e9d',
  },
  fullName: {
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
})
