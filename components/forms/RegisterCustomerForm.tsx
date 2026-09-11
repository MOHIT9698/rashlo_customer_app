// import RegisterPasswordInput from "@/components/common-components/form/register/RegisterPasswordInput";
// import RegisterTextInput from "@/components/common-components/form/register/RegisterTextInput";
// import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
// import { RegisterTruckFormData } from "@/constants/formData";
// import { registerTruckSchema } from "@/constants/schema";
// import { createTruck, resendOtpVerification, VerifyRegistration } from "@/utils/executors/auth";
import { zodResolver } from "@hookform/resolvers/zod";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { useState } from "react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { RegisterCustomerFormData } from "../../constants/formData";
import { registerCustomerSchema } from "../../constants/schema";
import InputField from "../common_ui/InputField";
import PrimaryButton from "../common_ui/PrimaryButton";
// import { Platform, View } from "react-native";
// import Toast from "react-native-toast-message";
// import OtpVerification from "./OtpVerification";
// import { useTranslation } from "react-i18next";



const RegisterCustomerForm = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterCustomerFormData>({
        resolver: zodResolver(registerCustomerSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            mobile_number: "",
        },
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data: RegisterCustomerFormData) => {
        setLoading(true);

        console.log("my form data", data)
        router.push({
            pathname: "/auth/verify_otp",
            params: {
                mobile_number: data?.mobile_number
            }
        });

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
                <InputField control={control} error={errors.first_name} autoCapitalize="words" autoComplete="name" iconName="person-outline" label={"First Name"} name="first_name" placeholder={"Enter First name"} />
                <InputField control={control} error={errors.last_name} autoCapitalize="words" autoComplete="name" iconName="person-outline" label={"Last Name"} name="last_name" placeholder={"Enter Last name"} />
                <PrimaryButton text={"Get Started"} isLoading={loading} onPress={handleSubmit(onSubmit)} />
            </View>
            {/* <OtpVerification getOtp={verifyOtp} loading={otpLoading} resendOtp={resendOtp} setShowOtpModal={setShowOtpModal} showOtpModal={showOtpModal} /> */}

        </>
    )
};

export default RegisterCustomerForm;

