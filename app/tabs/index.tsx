import HomeSearch from '@/components/common_ui/HomeSearch';
import AdvertSection from '@/components/home/AdvertSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import GreetingUser from '@/components/home/GreetingUser';
import TrustedShop from '@/components/home/TrustedShop';
import { groceryCategories } from '@/constants/categoriesData';
import { Colors } from '@/constants/theme';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const handleCategoryPress = (category: any) => {
    console.log("Selected:", category.category);
  };


  return (
    <View style={styles.container}>
      <View style={styles.greenbackground}></View>
      <SafeAreaView style={styles.safeView} >
        <GreetingUser />
        <TrustedShop />
        <HomeSearch
          value={search}
          onChangeText={setSearch}
          placeholder="Search for Products..."
        />
        <AdvertSection />

        <CategoryGrid
          data={groceryCategories}
          onCategoryPress={handleCategoryPress}
        />

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  greenbackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "58%",
    backgroundColor: Colors.primary,

  },
  safeView: {
    padding: 10
  }
});