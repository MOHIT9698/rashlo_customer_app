import AnimatedScreen from '@/components/animated_screen/AnimatedScreen';
import ShopCard from '@/components/shops/ShopCard';
import ShopDetailModal from '@/components/shops/ShopDetailModal';
import { calculateDistanceKm } from '@/constants/distance';
import { MOCK_USER_LOCATION, Shop, shops } from '@/constants/shops';
import { useShop } from '@/context/ShopContext';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { shops, Shop, MOCK_USER_LOCATION } from '../../data/shops';
// import { calculateDistanceKm } from '../../lib/distance';
// import { useShop } from '../../contexts/ShopContext';
// import ShopDetailModal from '../../components/ShopDetailModal';
// import ShopCard from '../../components/ShopCard';
// import AnimatedScreen from '../../components/AnimatedScreen';

type ViewMode = 'map' | 'list';
type LocationStatus = 'loading' | 'granted' | 'denied';

export default function ShopsScreen() {
  const { trustedShopId, setTrustedShopId } = useShop();
  const mapRef = useRef<MapView>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('loading');
  const [userLocation, setUserLocation] = useState(MOCK_USER_LOCATION);

  // Real-world scenario: ask for location permission, but never block the
  // screen on it — fall back to the user's saved profile address so the
  // shop list still works if they say no.
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationStatus('denied');
          return;
        }
        const position = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('granted');
      } catch {
        setLocationStatus('denied');
      }
    })();
  }, []);

  const shopsWithDistance = useMemo(() => {
    return shops
      .map((shop) => ({
        shop,
        distanceKm: calculateDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          shop.latitude,
          shop.longitude
        ),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userLocation]);

  const filteredShops = useMemo(() => {
    if (!searchQuery.trim()) return shopsWithDistance;
    const q = searchQuery.trim().toLowerCase();
    return shopsWithDistance.filter(
      ({ shop }) =>
        shop.name.toLowerCase().includes(q) || shop.address.toLowerCase().includes(q)
    );
  }, [shopsWithDistance, searchQuery]);

  function getDistanceFor(shopId: string): number {
    return shopsWithDistance.find((s) => s.shop.id === shopId)?.distanceKm ?? 0;
  }

  function handleSelectFromSearch(shop: Shop) {
    setSearchQuery('');
    setSelectedShop(shop);
    if (viewMode === 'map') {
      mapRef.current?.animateToRegion(
        {
          latitude: shop.latitude,
          longitude: shop.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        500
      );
    }
  }

  function handleRecenter() {
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      500
    );
  }

  function handleSetTrusted() {
    if (!selectedShop) return;
    setTrustedShopId(selectedShop.id);
    setSelectedShop(null);
  }

  function handleRemoveTrusted() {
    setTrustedShopId(null);
    setSelectedShop(null);
  }

  const initialRegion: Region = {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
  };

  return (
    <AnimatedScreen>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header + view toggle */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shops</Text>
          <View style={styles.toggleWrap}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons
                name="map-outline"
                size={16}
                color={viewMode === 'map' ? '#FFFFFF' : '#3B7FB0'}
              />
              <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
                Map
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons
                name="list-outline"
                size={16}
                color={viewMode === 'list' ? '#FFFFFF' : '#3B7FB0'}
              />
              <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
                List
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar shared by both views */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color="#8A8A8A" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search shop name or area"
            placeholderTextColor="#B0B0B0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#B0B0B0" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search suggestions dropdown (works in both view modes) */}
        {searchQuery.length > 0 && (
          <View style={styles.suggestionsWrap}>
            {filteredShops.length === 0 ? (
              <Text style={styles.noResultsText}>No shops match "{searchQuery}"</Text>
            ) : (
              filteredShops.slice(0, 4).map(({ shop, distanceKm }) => (
                <TouchableOpacity
                  key={shop.id}
                  style={styles.suggestionRow}
                  onPress={() => handleSelectFromSearch(shop)}
                >
                  <Ionicons name="storefront-outline" size={16} color="#3B7FB0" />
                  <Text style={styles.suggestionText} numberOfLines={1}>
                    {shop.name}
                  </Text>
                  <Text style={styles.suggestionAddress} numberOfLines={1}>
                    {shop.address}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {locationStatus === 'denied' && (
          <View style={styles.locationBanner}>
            <Ionicons name="information-circle-outline" size={16} color="#E8A33D" />
            <Text style={styles.locationBannerText}>
              Location access is off — showing shops near your default area instead.
            </Text>
          </View>
        )}

        {/* Map view */}
        {viewMode === 'map' && (
          <View style={styles.mapWrap}>
            {locationStatus === 'loading' ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color="#3B7FB0" />
              </View>
            ) : (
              <>
                <MapView
                  ref={mapRef}
                  style={StyleSheet.absoluteFill}
                  initialRegion={initialRegion}
                  showsUserLocation={locationStatus === 'granted'}
                  showsMyLocationButton={false}
                >
                  {shopsWithDistance.map(({ shop }) => {
                    const isTrusted = shop.id === trustedShopId;
                    const isSelected = shop.id === selectedShop?.id;
                    return (
                      <Marker
                        key={shop.id}
                        coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
                        onPress={() => setSelectedShop(shop)}
                        tracksViewChanges={isSelected || isTrusted}
                      >
                        <TouchableOpacity
                          style={styles.markerWrap}
                          activeOpacity={0.7}
                          onPress={() => setSelectedShop(shop)}
                        >
                          <View
                            style={[
                              styles.markerPin,
                              isTrusted && styles.markerPinTrusted,
                              isSelected && styles.markerPinSelected,
                            ]}
                          >
                            <Text style={styles.markerIcon}>🏬</Text>
                            {isTrusted && (
                              <View style={styles.markerStar}>
                                <Ionicons name="star" size={9} color="#FFFFFF" />
                              </View>
                            )}
                          </View>
                          <View style={styles.markerLabel}>
                            <Text style={styles.markerLabelText} numberOfLines={1}>
                              {shop.name}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </Marker>
                    );
                  })}
                </MapView>

                <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
                  <Ionicons name="locate" size={20} color="#3B7FB0" />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* List view */}
        {viewMode === 'list' && (
          <FlatList
            data={filteredShops}
            keyExtractor={({ shop }) => shop.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.noResultsText}>No shops match your search.</Text>
            }
            renderItem={({ item }) => (
              <ShopCard
                shop={item.shop}
                distanceKm={item.distanceKm}
                isTrusted={item.shop.id === trustedShopId}
                onPress={() => setSelectedShop(item.shop)}
              />
            )}
          />
        )}

        <ShopDetailModal
          visible={!!selectedShop}
          shop={selectedShop}
          distanceKm={selectedShop ? getDistanceFor(selectedShop.id) : 0}
          isTrusted={selectedShop?.id === trustedShopId}
          onClose={() => setSelectedShop(null)}
          onSetTrusted={handleSetTrusted}
          onRemoveTrusted={handleRemoveTrusted}
        />
      </SafeAreaView>
      </TouchableWithoutFeedback>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F7F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#E8F1FC',
    borderRadius: 12,
    padding: 3,
    gap: 3,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9,
  },
  toggleButtonActive: { backgroundColor: '#3B7FB0' },
  toggleText: { fontSize: 12, fontWeight: '700', color: '#3B7FB0' },
  toggleTextActive: { color: '#FFFFFF' },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },

  suggestionsWrap: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  suggestionText: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  suggestionAddress: { flex: 1, fontSize: 11, color: '#8A8A8A', textAlign: 'right' },
  noResultsText: {
    fontSize: 13,
    color: '#8A8A8A',
    textAlign: 'center',
    paddingVertical: 16,
  },

  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF3E0',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  locationBannerText: { flex: 1, fontSize: 11, color: '#8A6A2E' },

  mapWrap: { flex: 1, marginTop: 10 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  markerWrap: { alignItems: 'center' },
  markerPin: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#3B7FB0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerPinTrusted: { backgroundColor: '#E8A33D' },
  markerPinSelected: { borderColor: '#1E9E4C', borderWidth: 3 },
  markerIcon: { fontSize: 16 },
  markerStar: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1E9E4C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  markerLabel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    maxWidth: 110,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
    }),
  },
  markerLabelText: { fontSize: 10, fontWeight: '700', color: '#1A1A1A' },

  recenterButton: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },

  listContent: { padding: 16, paddingBottom: 24 },
});