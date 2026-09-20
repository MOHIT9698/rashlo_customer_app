
import { Colors, typography } from '@/constants/theme';
import { Image, StyleSheet, Text, View } from 'react-native';

const TrustedShop = () => {
    return (
        <View style={styles.main}>
            <Image
                source={require("@/assets/images/shops.png")}
                style={{ height: 50, width: 50 }}
            />
            <View>
                <Text style={styles.greeting}>Your Trusted Shop</Text>
                <Text style={styles.store}>Sharma Gennral Store</Text>
            </View>

        </View>
    )
}

export default TrustedShop;


const styles = StyleSheet.create({
    main: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        padding: 12,
        backgroundColor: "white",
        borderRadius: 10,
        marginTop:12

    },
    greeting: {
        color: Colors.primary,
        fontFamily: typography.semibold
    },
    store: {
        color: Colors.textPrimary,
        fontSize: 20,
        fontFamily: typography.semibold
    },
    avatar: {
        backgroundColor: "white",
        height: 40,
        maxWidth: 40,
        borderRadius: "50%",
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    }
})