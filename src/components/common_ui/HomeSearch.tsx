import { StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const HomeSearch = ({
  value,
  onChangeText,
  placeholder = "Search for Products...",
}: SearchInputProps) => {
  return (
    <View style={styles.container}>
      <Searchbar
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        icon="magnify"
        style={styles.searchBar}
        inputStyle={styles.input}
        placeholderTextColor="#9CA3AF"
        iconColor="#687280"
        elevation={0}
      />
    </View>
  );
};

export default HomeSearch;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop:14
  },

  searchBar: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  input: {
    fontFamily: "NunitoSans_400Regular",
    fontSize: 18,
  },
});