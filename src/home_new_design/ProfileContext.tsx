import { createContext, ReactNode, useContext, useState } from 'react';

export type AddressLabel = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  label: AddressLabel;
  text: string;
  isDefault: boolean;
}

export interface NotificationPrefs {
  orderUpdates: boolean;
  offers: boolean;
}

export const MAX_ADDRESSES = 5;
export const MAX_FAMILY_SIZE = 15;

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0].charAt(0);
  const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + second).toUpperCase();
}

interface ProfileContextType {
  name: string;
  phone: string;
  isLoggedIn: boolean;
  addresses: Address[];
  notifications: NotificationPrefs;
  familySize: number;
  updateName: (name: string) => void;
  addAddress: (values: { label: AddressLabel; text: string }) => boolean;
  updateAddress: (id: string, values: { label: AddressLabel; text: string }) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setNotification: (key: keyof NotificationPrefs, value: boolean) => void;
  setFamilySize: (size: number) => void;
  login: () => void;
  logout: () => void;
  deleteAccount: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Demo data. Replace with the real user once login and your backend are wired up.
const DEMO_ADDRESSES: Address[] = [
  { id: 'addr-1', label: 'Home', text: 'House 12, Nissing Road, Karnal, Haryana', isDefault: true },
];

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState('Rohit Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>(DEMO_ADDRESSES);
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    orderUpdates: true,
    offers: false,
  });

  const [familySize, setFamilySizeState] = useState(4);

  // Always keep family size within a sensible range, whatever the UI sends
  function setFamilySize(size: number) {
    setFamilySizeState(Math.min(MAX_FAMILY_SIZE, Math.max(1, Math.round(size))));
  }

  function updateName(newName: string) {
    setName(newName.trim());
  }

  // Returns false if the address limit is reached, so the UI can tell the user
  function addAddress(values: { label: AddressLabel; text: string }): boolean {
    if (addresses.length >= MAX_ADDRESSES) return false;
    setAddresses((prev) => [
      ...prev,
      {
        id: `addr-${Date.now()}`,
        label: values.label,
        text: values.text.trim(),
        isDefault: prev.length === 0, // the first address is automatically the default
      },
    ]);
    return true;
  }

  function updateAddress(id: string, values: { label: AddressLabel; text: string }) {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, label: values.label, text: values.text.trim() } : a))
    );
  }

  function deleteAddress(id: string) {
    setAddresses((prev) => {
      const removed = prev.find((a) => a.id === id);
      const remaining = prev.filter((a) => a.id !== id);
      // If the default address was deleted, promote the first remaining one
      // so the user is never left with addresses but no default.
      if (removed?.isDefault && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return remaining;
    });
  }

  function setDefaultAddress(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }

  function setNotification(key: keyof NotificationPrefs, value: boolean) {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  }

  function login() {
    setIsLoggedIn(true);
  }

  function logout() {
    setIsLoggedIn(false);
  }

  function deleteAccount() {
    setName('');
    setPhone('');
    setAddresses([]);
    setNotifications({ orderUpdates: true, offers: false });
    setIsLoggedIn(false);
  }

  return (
    <ProfileContext.Provider
      value={{
        name,
        phone,
        isLoggedIn,
        addresses,
        notifications,
        familySize,
        setFamilySize,
        updateName,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        setNotification,
        login,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside a ProfileProvider');
  return ctx;
}