export interface OrbitIcon {
  emoji: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  size?: number;
  floatDelay?: number; // staggers the floating animation so bubbles don't move in sync
}

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;      // soft backdrop circle color behind the illustration
  centerEmoji: string;
  orbitIcons: OrbitIcon[];
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'slide-1',
    title: 'Fresh groceries,\ndelivered fast',
    subtitle: 'Everyday rashan essentials — atta, oil, spices and more — right to your door.',
    bgColor: '#DFF3E0',
    centerEmoji: '🛒',
    orbitIcons: [
      { emoji: '🥬', top: 10, left: 20, size: 40, floatDelay: 0 },
      { emoji: '🍅', top: 30, right: 10, size: 36, floatDelay: 300 },
      { emoji: '🥖', bottom: 20, left: 10, size: 40, floatDelay: 600 },
      { emoji: '🧄', bottom: 0, right: 30, size: 34, floatDelay: 900 },
    ],
  },
  {
    id: 'slide-2',
    title: 'Pick your\ntrusted local shop',
    subtitle: 'Browse verified shops near you, on a map or a list — whichever is faster for you.',
    bgColor: '#FFF1DC',
    centerEmoji: '🏪',
    orbitIcons: [
      { emoji: '⭐', top: 5, right: 20, size: 38, floatDelay: 150 },
      { emoji: '📍', top: 35, left: 5, size: 36, floatDelay: 450 },
      { emoji: '✅', bottom: 15, right: 5, size: 38, floatDelay: 750 },
    ],
  },
  {
    id: 'slide-3',
    title: 'Fast, simple\nordering',
    subtitle: 'A few taps to build your list, confirm your order, and you\u2019re done.',
    bgColor: '#E3EEFB',
    centerEmoji: '📱',
    orbitIcons: [
      { emoji: '🧾', top: 10, left: 15, size: 38, floatDelay: 200 },
      { emoji: '🚀', top: 20, right: 15, size: 40, floatDelay: 500 },
      { emoji: '👍', bottom: 10, left: 30, size: 34, floatDelay: 800 },
    ],
  },
];