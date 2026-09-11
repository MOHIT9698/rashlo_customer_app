import { Link } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import LoginCustomerForm from '../../../components/forms/LoginCustomerForm';
import { ShopingCartIcon } from '../../../constants/Icons';
import { Colors, typography } from '../../../constants/theme';


const LoginCustomerScreen = () => {







    return (
        <View style={{ paddingInline: 14, height: "100%", backgroundColor: "white", paddingTop: 100 }}>

            <View style={styles.iconShadow}>
                <ShopingCartIcon size={100} fill={Colors.primary} />
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Login to continue to your account</Text>

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

                    <LoginCustomerForm />

                    <View style={styles.endBox}>
                        <Text style={styles.endtext}>
                            New user?
                            <Link href={"/auth/register"}><Text style={styles.endtextLink} > Create Account</Text></Link>
                        </Text>

                    </View>


                </ScrollView>

            </KeyboardAvoidingView>
        </View>
    )
}

export default LoginCustomerScreen;


const styles = StyleSheet.create({
    iconShadow: {
        alignSelf: "center"
    },
    title: {
        fontSize: 30,
        fontFamily: typography.bold,
        color: Colors.textPrimary,
        marginBottom: 8,
        textAlign: "center",
        marginTop: 40
    },
    subtitle: {
        fontSize: 20,
        fontFamily: typography.medium,
        color: Colors.textSecondary,
        textAlign: "center"

    },
    subtitle2: {
        fontSize: 20,
        fontFamily: typography.bold,
        color: Colors.textPrimary,
        textAlign: "center"

    },
    endBox: {
        width: "100%",
        marginBlock: 0
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
        color: Colors.primary,
        textAlign: "center"
    },
})