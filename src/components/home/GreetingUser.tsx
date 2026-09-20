
import { typography } from '@/constants/theme';
import { getGreeting } from '@/utils/helper';
import { Image, StyleSheet, Text, View } from 'react-native';

const GreetingUser = () => {
    return (
        <View style={styles.main}>
            <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>Mohit Sharma</Text>
            </View>
            <View style={styles.avatar}>
                <Image
                    source={require("@/assets/images/avatar.png")}
                    style={{ height: 30, width: 30 }}
                />
            </View>
        </View>
    )
}

export default GreetingUser;


const styles = StyleSheet.create({
    main: {
        display: "flex",
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingInline :6

    },
    greeting: {
        color: "white",
        fontFamily: typography.semibold
    },
    userName: {
        color: "white",
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