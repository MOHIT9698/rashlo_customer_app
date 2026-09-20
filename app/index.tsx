import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {


  useEffect(() => {
    // const checkWelcome = async () => {
    //   const seen = await hasSeenWelcome();

    //   if (seen) {
    //     router.replace("/");
    //   } else {
    //     router.replace("/welcome");
    //   }
    // };

    // checkWelcome();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
      <Link href={"/auth/register"}>
        <Text>Go To register</Text>
      </Link>
      <Link href={"/auth/login"}>
        <Text>Go To Login</Text>
      </Link>
      <Link href={"/welcome"}>
        <Text>Go To welcome</Text>
      </Link>
      <Link href={"/tabs"}>
        <Text>Go To tabs</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
