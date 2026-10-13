import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Category } from './rashancategries';

const { width } = Dimensions.get("window");

const HORIZONTAL_PADDING = 10;
const GAP = 10;
const ITEM_WIDTH =
  (width - HORIZONTAL_PADDING * 2 - GAP * 3) / 4;

export default function CategoryTile({ category }: { category: Category }) {
  const router = useRouter();
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(
    category.image ? 'loading' : 'error'
  );

  const hasItems = category.items.length > 0;

  function handlePress() {
    if (!hasItems) {
      // Real-world case: the category exists in the catalog but hasn't been
      // stocked with items yet. Don't send the user into an empty flow —
      // tell them plainly instead.
      Alert.alert(
        'Coming soon',
        `${category.name} isn't stocked yet, but it's on the way!`
      );
      return;
    }
    router.push(`/add-item/${category.id}`);
  }

  return (
    <TouchableOpacity
      style={styles.tile}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={[styles.imageWrap, { backgroundColor: category.color || '#F2F2F2' }]}>
        {category.image && imageState !== 'error' && (
          <Image
            source={{ uri: category.image }}
            style={styles.image}
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('error')}
          />
        )}

        {imageState === 'loading' && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#8A8A8A" />
          </View>
        )}

        {imageState === 'error' && (
          <Text style={styles.fallbackIcon}>{category.icon || '🛒'}</Text>
        )}

        {!hasItems && (
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Soon</Text>
          </View>
        )}
      </View>

      <Text style={styles.tileName} numberOfLines={1}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  imageWrap: {
    width: ITEM_WIDTH - 10,
    height: ITEM_WIDTH - 10,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 5,
      },
      android: { elevation: 1 },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackIcon: {
    fontSize: 30,
  },
  comingSoonBadge: {
    position: 'absolute',
    bottom: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  comingSoonText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tileName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 6,
    textAlign: 'center',
  },
});