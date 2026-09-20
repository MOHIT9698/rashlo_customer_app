import AsyncStorage from "@react-native-async-storage/async-storage";

const WELCOME_SEEN_KEY = "welcome_seen";

export const hasSeenWelcome = async () => {
  const value = await AsyncStorage.getItem(WELCOME_SEEN_KEY);
  return value === "true";
};

export const markWelcomeAsSeen = async () => {
  await AsyncStorage.setItem(WELCOME_SEEN_KEY, "true");
};


export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning,";
  }

  if (hour >= 12 && hour < 17) {
    return "Good Afternoon,";
  }

  if (hour >= 17 && hour < 21) {
    return "Good Evening,";
  }

  return "Good Night,";
};