
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { LoginCustomerFormData } from "../../constants/formData";
import { loginCustomerSchema } from "../../constants/schema";
import { Colors, typography } from "../../constants/theme";
import InputField from "../common_ui/InputField";
import PasswordInput from "../common_ui/PasswordInput";
import PrimaryButton from "../common_ui/PrimaryButton";



const LoginCustomerForm = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCustomerFormData>({
        resolver: zodResolver(loginCustomerSchema),
        defaultValues: {
            mobile_number: "",
        },
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data: LoginCustomerFormData) => {
        setLoading(true);

        console.log("my form data", data)
            router.replace("/");
        
        // router.push({
        //     pathname: "/auth/verify_otp",
        //     params: {
        //         mobile_number: data?.mobile_number
        //     }
        // });

        try {


        } catch (err: any) {

            // Toast.show({
            //     type: "error",
            //     text1: t("Failed"),
            //     text2: err.message ?? t("Something went wrong!"),

            // });
        }
        setLoading(false);

    };

    // const resendOtp = async () => {
    //     const data = {
    //         truck_id: truckId ?? ""
    //     };
    //     try {

    //         const response = await resendOtpVerification(data);

    //         if (response?.status) {

    //             Toast.show({
    //                 type: "success",
    //                 text1: response?.message ?? t("Otp resend successfully"),

    //             });

    //         }
    //     } catch (err: any) {
    //         Toast.show({
    //             type: "error",
    //             text1: t("Failed"),
    //             text2: err?.message ?? t("Something went wrong!"),

    //         });
    //     }
    // }



    // const verifyOtp = async (otp: string) => {
    //     setOtpLoading(true);
    //     const data = {
    //         otp: otp,
    //         truck_id: truckId ?? "",
    //     }
    //     try {

    //         const response = await VerifyRegistration(data);

    //         if (response?.status) {
    //             Toast.show({
    //                 type: t("success"),
    //                 text1: response?.message ?? t("Otp Verified"),
    //                 text2: t("Your truck has been registered successfully"),

    //             });
    //             setShowOtpModal(false);
    //             router.push("/auth/login")

    //         }
    //     } catch (err: any) {
    //         Toast.show({
    //             type: "error",
    //             text1: t("Failed"),
    //             text2: err?.message ?? t("Something went wrong!"),

    //         });
    //     }
    //     setOtpLoading(false);


    // }
    return (
        <>
            <View style={{ marginTop: 50 }}>
                <InputField control={control} error={errors.mobile_number} keyboardType="phone-pad" autoComplete="tel" iconName="call-outline" label={"Mobile Number"} name="mobile_number" placeholder={"Enter mobile number"} />
                <PasswordInput control={control} name="password" label={"Password"} placeholder={"Enter password"} error={errors.password} />
                <Link href={"/auth/forgot_password"}>
                    <Text style={styles.endtextLink}>Forgot Password?</Text>
                </Link>
                <PrimaryButton  text={"Login"} isLoading={loading} onPress={handleSubmit(onSubmit)} />
            </View>

        </>
    )
};

export default LoginCustomerForm;



const styles = StyleSheet.create({
    endtextLink: {
        fontSize: 18,
        fontFamily: typography.semibold,
        color: Colors.primary,
        textAlign: "right",
    },
})