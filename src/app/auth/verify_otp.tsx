import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import PrimaryButton from '../../../components/common_ui/PrimaryButton';
import { MobileOtp } from '../../../constants/Icons';
import { Colors, typography } from '../../../constants/theme';


const verify_otp = () => {
    const { mobile_number } = useLocalSearchParams<{
        mobile_number: string;
    }>();

    const [otp, setOtp] = useState("");
    const [count, setCount] = useState(30);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (!isRunning) return;

        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev <= 0) {
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning]);


    const restartCounter = () => {
        setCount(30);
        setIsRunning(true);
    };

    const onSubmit = () => {
        console.log("otp", otp);
    }


    return (
        <View style={{ paddingInline: 14, height: "100%", backgroundColor: "white", paddingTop: 100 }}>

            <View style={styles.iconShadow}>
                <MobileOtp size={100} fill={Colors.primary} />
            </View>
            <Text style={styles.title}>Verify Mobile Number</Text>
            <Text style={styles.subtitle}>We have sent a 6 digit code to</Text>
            <Text style={styles.subtitle2}>+91 {mobile_number}</Text>

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
                    <OTPTextInput
                        inputCount={6}
                        handleTextChange={(val) => setOtp(val)}
                        containerStyle={{ marginTop: 40 }}
                        tintColor={Colors.primary}
                        offTintColor="#ccc"
                        textInputStyle={{
                            width: 45,
                            height: 50,
                            borderRadius: 8,
                            borderWidth: 1,
                            // fontSize: 20,
                        }}
                    />


                    <View style={styles.endBox}>
                        <Text style={styles.endtext}>
                            Didn't receive the code?
                        </Text>
                        {isRunning ?
                            <Text style={styles.endtextLink}>
                                Resend OTP in 00:{count.toString().padStart(2, "0")}
                            </Text>
                            :
                            <TouchableOpacity onPress={restartCounter}>
                                <Text style={styles.endtextLink}>
                                    Resend OTP
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>

                    <PrimaryButton disabled={otp.length !== 6} text={"Verify"} isLoading={false} onPress={onSubmit} />

                </ScrollView>

            </KeyboardAvoidingView>
        </View>
    )
}

export default verify_otp;


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
        marginBlock: 60
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