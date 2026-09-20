import { Image, StyleSheet, Text, View } from 'react-native';
import SecondaryButton from '../common_ui/SecondaryButton';

const AdvertSection = () => {
    return (
        <View style={styles.main}>
            <View>
                <Text style={styles.title} >Fresh Groceries</Text>
                <Text style={styles.text} >Delivered to Your Door</Text>
                <SecondaryButton customStyle={{ width: 150, paddingInline: 20, }} onPress={() => { }} text='Shop Now' isLoading={false} />
            </View>
            <Image
                source={require("@/assets/images/groceryhand.png")}
                style={{ height: 140, width: 150, marginRight:-15 }}
            />
        </View>
    )
}

export default AdvertSection;


const styles = StyleSheet.create({
    main: {
        backgroundColor: "#2AA146",
        borderRadius: 15,
        marginTop: 15,
        padding: 12,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row"

    },
    title: {
        fontSize: 26,
        color: "white"
    },
    text: {
        color: "white",
        fontSize: 18
    }
})