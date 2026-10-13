import { StyleSheet, Text, View } from 'react-native';
import CategoryTile from './categoryTile';
import { Category } from './rashancategries';

interface CategorySectionProps {
  title: string;
  categoriesList: Category[];

}



export default function CategorySection({ title, categoriesList }: CategorySectionProps) {
  if (categoriesList.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {categoriesList.map((category) => (
          <CategoryTile key={category.id} category={category} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 22,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 20,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 10,
  },
});