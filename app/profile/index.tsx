import AnimatedScreen from '@/components/animated_screen/AnimatedScreen';
import { orders } from '@/constants/ordersData';
import { getShopById } from '@/constants/shops';
import { useCart } from '@/context/CartContext';
import { Address, AddressLabel, getInitials, MAX_ADDRESSES, useProfile } from '@/context/ProfileContext';
import { useShop } from '@/context/ShopContext';
import AddressFormModal, { AddressFormValues } from '@/sections/profile_section/AddressFormModal';
import ProfileEditModal from '@/sections/profile_section/ProfileEditModal';
import { ProfileSection, SettingRow } from '@/sections/profile_section/ProfileSection';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: replace these placeholders with your real support details and policy pages
const SUPPORT_WHATSAPP_NUMBER = '919876543210'; // country code + number, no "+" or spaces
const TERMS_URL = 'https://example.com/terms';
const PRIVACY_URL = 'https://example.com/privacy';

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Pick a category on Home, choose the item, brand and quantity, add it to your cart, then place the order to your trusted shop.',
  },
  {
    q: "Why don't I see prices?",
    a: 'Your trusted shop confirms prices when they accept your order, so you only pay what they confirm.',
  },
  {
    q: "Can I order something that isn't listed?",
    a: 'Yes. Open your Cart and tap "Add a custom item" to type any item, brand and quantity.',
  },
  {
    q: 'How do I change my trusted shop?',
    a: 'Open the Shops tab, pick a shop and tap "Set as Trusted Shop".',
  },
];

const ADDRESS_ICONS: Record<AddressLabel, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Work: 'briefcase-outline',
  Other: 'location-outline',
};

async function openLink(url: string, failMessage: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to open', failMessage);
  }
}

export default function ProfileScreen() {
  const router = useRouter();
  const {
    name,
    phone,
    isLoggedIn,
    addresses,
    notifications,
    updateName,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    setNotification,
    logout,
    deleteAccount,
  } = useProfile();
  const { trustedShopId, setTrustedShopId } = useShop();
  const { addToCart, clearCart } = useCart();

  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [addressModal, setAddressModal] = useState<
    { mode: 'add' } | { mode: 'edit'; address: Address } | null
  >(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const trustedShop = trustedShopId ? getShopById(trustedShopId) : undefined;
  const lastDelivered = orders.find((o) => o.status === 'Delivered');
  const addressLimitReached = addresses.length >= MAX_ADDRESSES;

  // ---------- Guest state ----------
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.guestWrap}>
          <Text style={styles.guestIcon}>👤</Text>
          <Text style={styles.guestTitle}>You're not logged in</Text>
          <Text style={styles.guestSubtitle}>
            Log in to see your orders, addresses and trusted shop.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ---------- Handlers ----------

  function handleSaveProfile(newName: string) {
    updateName(newName);
    setEditProfileVisible(false);
  }

  function handleSaveAddress(values: AddressFormValues) {
    if (!addressModal) return;
    if (addressModal.mode === 'add') {
      const added = addAddress(values);
      if (!added) {
        Alert.alert('Address limit reached', `You can save up to ${MAX_ADDRESSES} addresses.`);
        return;
      }
    } else {
      updateAddress(addressModal.address.id, values);
    }
    setAddressModal(null);
  }

  function handleDeleteAddress(address: Address) {
    const othersExist = addresses.length > 1;
    const extra =
      address.isDefault && othersExist
        ? '\n\nYour next saved address will become the default.'
        : address.isDefault
        ? '\n\nThis is your only address, so shop suggestions will need a new one.'
        : '';

    Alert.alert('Delete address?', `Remove your ${address.label} address?${extra}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(address.id) },
    ]);
  }

  function handleReorder() {
    if (!lastDelivered) return;
    const itemCount = lastDelivered.items.reduce((sum, i) => sum + i.qty, 0);
    const shopMismatch =
      trustedShop && trustedShop.name !== lastDelivered.shopName
        ? `\n\nNote: this order was from ${lastDelivered.shopName}, but your trusted shop is ${trustedShop.name}.`
        : '';

    Alert.alert(
      'Reorder this?',
      `Add ${itemCount} ${itemCount === 1 ? 'item' : 'items'} from your ${lastDelivered.date.split(',')[0]} order to your cart? You can edit everything in the cart.${shopMismatch}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to cart',
          onPress: () => {
            lastDelivered.items.forEach((item) => {
              for (let i = 0; i < item.qty; i++) {
                addToCart({
                  itemId: `reorder-${item.name}`,
                  itemName: item.name,
                  categoryId: 'custom',
                  quantity: 'Same as before',
                  isCustom: true,
                });
              }
            });
            router.push('/tabs/cart');
          },
        },
      ]
    );
  }

  function handleCallShop() {
    if (!trustedShop) {
      Alert.alert('No trusted shop yet', 'Choose a trusted shop first, then you can call them from here.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Choose shop', onPress: () => router.push('/tabs/shops') },
      ]);
      return;
    }
    if (!trustedShop.phone) {
      Alert.alert('No phone number', `${trustedShop.name} hasn't shared a phone number yet.`);
      return;
    }
    openLink(
      `tel:${trustedShop.phone.replace(/\s+/g, '')}`,
      'Your device could not start a call. You can dial the number manually.'
    );
  }

  function handleWhatsApp() {
    openLink(
      `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I need help with my order.')}`,
      'Could not open WhatsApp. Please check that it is installed.'
    );
  }

  function handleLogout() {
    Alert.alert('Log out?', 'Your cart will stay saved on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete account?',
      'This permanently deletes your profile, addresses and saved shop. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: () =>
            Alert.alert('Are you absolutely sure?', 'Everything will be removed right away.', [
              { text: 'Keep my account', style: 'cancel' },
              {
                text: 'Delete forever',
                style: 'destructive',
                onPress: () => {
                  deleteAccount();
                  clearCart();
                  setTrustedShopId(null);
                  router.replace('/');
                },
              },
            ]),
        },
      ]
    );
  }

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.screenTitle}>Profile</Text>

          {/* Header */}
          <View style={styles.headerCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {name || 'Add your name'}
              </Text>
              <Text style={styles.phone}>{phone}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.8}
              onPress={() => setEditProfileVisible(true)}
            >
              <Ionicons name="pencil" size={14} color="#3E9142" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Trusted shop */}
          <ProfileSection title="My trusted shop">
            {trustedShop ? (
              <View style={styles.shopBlock}>
                <View style={styles.shopIconWrap}>
                  <Text style={{ fontSize: 20 }}>🏬</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.shopNameRow}>
                    <Text style={styles.shopName} numberOfLines={1}>
                      {trustedShop.name}
                    </Text>
                    {trustedShop.verified && (
                      <Ionicons name="checkmark-circle" size={15} color="#3E9142" />
                    )}
                  </View>
                  <Text style={styles.shopAddress} numberOfLines={1}>
                    {trustedShop.address}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/tabs/shops')}>
                  <Text style={styles.changeLink}>Change</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <SettingRow
                icon="storefront-outline"
                label="Choose your trusted shop"
                subtitle="You need one to place orders"
                onPress={() => router.push('/tabs/shops')}
              />
            )}
          </ProfileSection>

          {/* Orders and reorder */}
          <ProfileSection title="Orders">
            <SettingRow
              icon="receipt-outline"
              label="My orders"
              subtitle={
                orders.length > 0
                  ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} so far`
                  : 'No orders yet'
              }
              onPress={() => router.push('/tabs/orders')}
            />
            <SettingRow
              icon="repeat-outline"
              label="Reorder last order"
              subtitle={
                lastDelivered
                  ? `${lastDelivered.shopName} · ${lastDelivered.date.split(',')[0]}`
                  : 'Available after your first delivered order'
              }
              onPress={lastDelivered ? handleReorder : undefined}
              disabled={!lastDelivered}
            />
          </ProfileSection>

          {/* Addresses */}
          <ProfileSection title="Saved addresses">
            {addresses.length === 0 ? (
              <View style={styles.emptyAddress}>
                <Text style={styles.emptyAddressTitle}>No address saved yet</Text>
                <Text style={styles.emptyAddressText}>
                  Add one so we can find shops that deliver to you.
                </Text>
              </View>
            ) : (
              addresses.map((address) => (
                <View key={address.id} style={styles.addressBlock}>
                  <View style={styles.addressTop}>
                    <Ionicons name={ADDRESS_ICONS[address.label]} size={16} color="#3E9142" />
                    <Text style={styles.addressLabel}>{address.label}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressText}>{address.text}</Text>
                  <View style={styles.addressActions}>
                    {!address.isDefault && (
                      <TouchableOpacity onPress={() => setDefaultAddress(address.id)}>
                        <Text style={styles.actionLink}>Set as default</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => setAddressModal({ mode: 'edit', address })}>
                      <Text style={styles.actionLink}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteAddress(address)}>
                      <Text style={[styles.actionLink, { color: '#E03C31' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <SettingRow
              icon="add-circle-outline"
              label="Add new address"
              subtitle={addressLimitReached ? `Limit of ${MAX_ADDRESSES} addresses reached` : undefined}
              onPress={() => setAddressModal({ mode: 'add' })}
              disabled={addressLimitReached}
            />
          </ProfileSection>

          {/* Notifications */}
          <ProfileSection title="Notifications">
            <SettingRow
              icon="notifications-outline"
              label="Order updates"
              subtitle="Accepted, on the way, delivered"
              right={
                <Switch
                  value={notifications.orderUpdates}
                  onValueChange={(v) => setNotification('orderUpdates', v)}
                  trackColor={{ false: '#D9D9D9', true: '#9ED39F' }}
                  thumbColor={notifications.orderUpdates ? '#3E9142' : '#FFFFFF'}
                />
              }
            />
            <SettingRow
              icon="pricetag-outline"
              label="Offers and news"
              subtitle="Deals from your trusted shop"
              right={
                <Switch
                  value={notifications.offers}
                  onValueChange={(v) => setNotification('offers', v)}
                  trackColor={{ false: '#D9D9D9', true: '#9ED39F' }}
                  thumbColor={notifications.offers ? '#3E9142' : '#FFFFFF'}
                />
              }
            />
          </ProfileSection>

          {/* Help and support */}
          <ProfileSection title="Help & support">
            <SettingRow
              icon="call-outline"
              label="Call my shop"
              subtitle={
                trustedShop
                  ? trustedShop.phone ?? 'No phone number shared'
                  : 'Choose a trusted shop first'
              }
              onPress={handleCallShop}
            />
            <SettingRow
              icon="logo-whatsapp"
              label="Chat with support"
              subtitle="We reply on WhatsApp"
              onPress={handleWhatsApp}
            />
            {FAQS.map((faq, index) => (
              <TouchableOpacity
                key={faq.q}
                activeOpacity={0.7}
                onPress={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <View style={styles.faqRow}>
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                    <Ionicons
                      name={openFaq === index ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#8A8A8A"
                    />
                  </View>
                  {openFaq === index && <Text style={styles.faqAnswer}>{faq.a}</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </ProfileSection>

          {/* About */}
          <ProfileSection title="About">
            <SettingRow
              icon="document-text-outline"
              label="Terms of service"
              onPress={() => openLink(TERMS_URL, 'Could not open the page. Please try again later.')}
            />
            <SettingRow
              icon="shield-checkmark-outline"
              label="Privacy policy"
              onPress={() => openLink(PRIVACY_URL, 'Could not open the page. Please try again later.')}
            />
            <SettingRow icon="information-circle-outline" label="App version" subtitle={appVersion} />
          </ProfileSection>

          {/* Account actions, kept at the bottom so they're hard to tap by accident */}
          <View style={styles.dangerZone}>
            <TouchableOpacity style={styles.logoutButton} activeOpacity={0.85} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#E03C31" />
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteLinkWrap}>
              <Text style={styles.deleteLink}>Delete account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <ProfileEditModal
          visible={editProfileVisible}
          initialName={name}
          phone={phone}
          onClose={() => setEditProfileVisible(false)}
          onSave={handleSaveProfile}
        />

        <AddressFormModal
          visible={!!addressModal}
          mode={addressModal?.mode ?? 'add'}
          initialValues={
            addressModal?.mode === 'edit'
              ? { label: addressModal.address.label, text: addressModal.address.text }
              : undefined
          }
          onClose={() => setAddressModal(null)}
          onSave={handleSaveAddress}
        />
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F7F9' },
  scrollContent: { paddingBottom: 40 },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#3E9142',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  name: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  phone: { fontSize: 13, color: '#8A8A8A', marginTop: 2 },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E7F5E6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  editButtonText: { fontSize: 12, fontWeight: '700', color: '#3E9142' },

  shopBlock: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  shopIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E7F5E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopNameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  shopName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', flexShrink: 1 },
  shopAddress: { fontSize: 11, color: '#8A8A8A', marginTop: 2 },
  changeLink: { fontSize: 12, fontWeight: '700', color: '#3E9142' },

  addressBlock: { padding: 14 },
  addressTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addressLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  defaultBadge: {
    backgroundColor: '#E7F5E6',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  defaultBadgeText: { fontSize: 10, fontWeight: '700', color: '#3E9142' },
  addressText: { fontSize: 13, color: '#6B6B6B', marginTop: 6, lineHeight: 18 },
  addressActions: { flexDirection: 'row', gap: 18, marginTop: 10 },
  actionLink: { fontSize: 12, fontWeight: '700', color: '#3E9142' },
  emptyAddress: { padding: 16 },
  emptyAddressTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  emptyAddressText: { fontSize: 12, color: '#8A8A8A', marginTop: 3 },

  faqRow: { paddingHorizontal: 14, paddingVertical: 13 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  faqQuestion: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  faqAnswer: { fontSize: 12, color: '#6B6B6B', lineHeight: 18, marginTop: 8 },

  dangerZone: { paddingHorizontal: 20, marginTop: 28 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F5CFCB',
  },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#E03C31' },
  deleteLinkWrap: { alignItems: 'center', paddingVertical: 16 },
  deleteLink: { fontSize: 12, color: '#8A8A8A', textDecorationLine: 'underline' },

  guestWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  guestIcon: { fontSize: 52, marginBottom: 12 },
  guestTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  guestSubtitle: { fontSize: 13, color: '#8A8A8A', textAlign: 'center', marginBottom: 22 },
  primaryButton: {
    backgroundColor: '#3E9142',
    borderRadius: 14,
    paddingHorizontal: 40,
    paddingVertical: 13,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});