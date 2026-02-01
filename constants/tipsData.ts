import {
  Bicycle,
  Car,
  Drop,
  ForkKnife,
  Lightbulb,
  Lightning,
  ShoppingCart,
  Thermometer,
  Train,
} from "phosphor-react-native";

export type TipCategory = "Transport" | "Energy" | "Food" | "Spending";

export interface TipType {
  id: string;
  title: string;
  description: string;
  category: TipCategory;
  impactLabel?: string;
  points: number;
  icon: any;
}

export const tipsData: TipType[] = [
  {
    id: "1",
    title: "Switch to LEDs",
    description: "Replace old bulbs with LEDs to use 75% less energy.",
    category: "Energy",
    impactLabel: "Saves Energy",
    points: 50,
    icon: Lightbulb,
  },
  {
    id: "2",
    title: "Meat-Free Monday",
    description:
      "Skipping meat one day a week reduces your carbon footprint significantly.",
    category: "Food",
    impactLabel: "Reduces CO₂",
    points: 100,
    icon: ForkKnife,
  },
  {
    id: "3",
    title: "Public Transport",
    description: "Take the bus or train instead of driving to cut emissions.",
    category: "Transport",
    impactLabel: "Eco-Friendly",
    points: 80,
    icon: Train,
  },
  {
    id: "4",
    title: "Unplug Electronics",
    description: "Devices drain power even when off. Unplug them!",
    category: "Energy",
    impactLabel: "Saves Money",
    points: 30,
    icon: Lightning,
  },
  {
    id: "5",
    title: "Buy Local",
    description: "Support local farmers and reduce food miles.",
    category: "Spending",
    impactLabel: "Support Local",
    points: 60,
    icon: ShoppingCart,
  },
  {
    id: "6",
    title: "Cold Wash",
    description: "Washing clothes at 30°C saves energy and protects fabric.",
    category: "Energy",
    impactLabel: "Saves Energy",
    points: 40,
    icon: Thermometer,
  },
  {
    id: "7",
    title: "Shorten Showers",
    description: "Cutting shower time by 2 mins saves gallons of water.",
    category: "Energy",
    impactLabel: "Saves Water",
    points: 50,
    icon: Drop,
  },
  {
    id: "8",
    title: "Cycle to Work",
    description: "Great exercise and zero emissions.",
    category: "Transport",
    impactLabel: "Health & Planet",
    points: 120,
    icon: Bicycle,
  },
  {
    id: "9",
    title: "Carpooling",
    description: "Share a ride to split fuel costs and emissions.",
    category: "Transport",
    impactLabel: "Reduces Traffic",
    points: 90,
    icon: Car,
  },
];
