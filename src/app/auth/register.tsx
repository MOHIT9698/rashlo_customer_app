import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import BackButton from "../../../components/common_ui/BackButton";
import RegisterCustomerForm from "../../../components/forms/RegisterCustomerForm";
import { Colors, typography } from "../../../constants/theme";

const RegisterCustomerScreen = () => {
    return (
        <View style={{ paddingInline: 14, height: "100%", backgroundColor: "white" }}>
            <BackButton/>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Enter your mobile number and name</Text>
            <Text style={styles.subtitle}>to get started</Text>


            {/* Form */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={60} // adjust based on your header height
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <RegisterCustomerForm />
                </ScrollView>

                <View style={styles.endBox}>
                    <Text style={styles.endtext}>
                        By continuing, you agree to our
                    </Text>
                    <Text style={styles.endtextLink}>
                        Terms & Conditions & Privacy Policy
                    </Text>
                </View>

            </KeyboardAvoidingView>
        </View>
    )
}

export default RegisterCustomerScreen;


const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontFamily: typography.bold,
        color: Colors.textPrimary,
        marginBottom: 8
    },
    subtitle: {
        fontSize: 20,
        fontFamily: typography.medium,
        color: Colors.textSecondary
    },
    endBox: {
        width: "100%",
        position: "absolute",
        bottom: 50,
    },
    endtext: {
        fontSize: 16,
        fontFamily: typography.medium,
        color: Colors.textSecondary,
        textAlign: "center"
    },
    endtextLink: {
        fontSize: 18,
        fontFamily: typography.semibold,
        color: Colors.textLink,
        textAlign: "center"
    },
})