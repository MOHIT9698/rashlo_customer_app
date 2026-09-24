import { categories, Category } from "@/constants/RashanCategories";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";





const { width } = Dimensions.get("window");

const HORIZONTAL_PADDING = 10;
const GAP = 10;
const ITEM_WIDTH =
  (width - HORIZONTAL_PADDING * 2 - GAP * 3) / 4;

const CategoryGrid = () => {


  const router = useRouter();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, c) => sum + c.count, 0);

  const renderItem = ({ item }: { item: Category }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.categoryItem,
          pressed && styles.pressed,
        ]}
        onPress={() => router.push(`/add-item/${item.id}`)}      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <Text
          style={styles.categoryName}
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      // keyExtractor={(item) => item.id}
      numColumns={4}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
    />
  );
};

export default CategoryGrid;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBlock: 15,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 14,
    paddingBottom: 350
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  categoryItem: {
    width: ITEM_WIDTH,
    alignItems: "center",
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },

  imageContainer: {
    width: ITEM_WIDTH - 10,
    height: ITEM_WIDTH - 10,
    borderRadius: 20,
    backgroundColor: "#F0FDFB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0F2F1",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  categoryName: {
    marginTop: 8,
    fontFamily: "NunitoSans_600SemiBold",
    fontSize: 13,
    color: "#172033",
    textAlign: "center",
    lineHeight: 17,
  },
});