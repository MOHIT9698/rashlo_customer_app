import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SecondaryButton from '../src/components/common_ui/SecondaryButton';
import { ShopingCartIcon } from '../src/constants/Icons';
import { Colors, typography } from '../src/constants/theme';
import { markWelcomeAsSeen } from '../src/utils/helper';

const welcome = () => {

  const handleGetStarted = async () => {
    await markWelcomeAsSeen();

    router.replace("/auth/register");
  };
  return (
    <View style={styles.container} >
      <SafeAreaView style={styles.wrapper}>
        <View style={{ alignSelf: "center" }}>
          <ShopingCartIcon size={130} fill='white' />
        </View>
        <Text style={styles.title}>Rashan App</Text>
        <Text style={styles.tagline}>Your Trusted Shop,</Text>
        <Text style={styles.tagline}>Just a Click Away</Text>
        {/* <Image
          source={require('../../assets/images/groceryImg.png')}
          style={styles.image}
        /> */}

        <SecondaryButton text='Get Started' isLoading={false} onPress={handleGetStarted} />
      </SafeAreaView>
    </View>
  )
}

export default welcome;


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    height: "100%",
  },
  wrapper: {
    alignSelf: 'center',
    marginTop: 100,
  },
  title: {
    color: "white",
    fontSize: 36,
    fontFamily: typography.bold,

    marginBlock: 20
  },
  tagline: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontFamily: typography.semibold
  },
  image:{
    height:300,
    width:200
  }
})