import { ItemCategory } from "@/store/useInventoryStore";

export interface AIDetectionResult {
  name: string;
  category: ItemCategory;
}

export function translateAIPrediction(englishLabel: string): AIDetectionResult | null {
  const label = englishLabel.toLowerCase();

  // Fruits
  if (label.includes("banana")) return { name: "Banana", category: "Fruits" };
  if (label.includes("pineapple")) return { name: "Pineapple", category: "Fruits" };
  if (label.includes("apple") || label.includes("granny smith")) return { name: "Apple", category: "Fruits" };
  if (label.includes("orange") || label.includes("lemon") || label.includes("citrus")) return { name: "Orange", category: "Fruits" };
  if (label.includes("strawberry")) return { name: "Strawberry", category: "Fruits" };
  if (label.includes("mangosteen")) return { name: "Mangosteen", category: "Fruits" };
  if (label.includes("mango")) return { name: "Mango", category: "Fruits" };
  
  // Vegetables
  if (label.includes("broccoli")) return { name: "Broccoli", category: "Vegetables" };
  if (label.includes("cauliflower")) return { name: "Cauliflower", category: "Vegetables" };
  if (label.includes("cabbage")) return { name: "Cabbage", category: "Vegetables" };
  if (label.includes("cucumber") || label.includes("zucchini")) return { name: "Cucumber", category: "Vegetables" };
  if (label.includes("bell pepper") || label.includes("capsicum")) return { name: "Bell Pepper", category: "Vegetables" };
  if (label.includes("mushroom") || label.includes("agaric")) return { name: "Mushroom", category: "Vegetables" };
  if (label.includes("carrot")) return { name: "Carrot", category: "Vegetables" };
  if (label.includes("potato")) return { name: "Potato", category: "Vegetables" };
  if (label.includes("corn") || label.includes("ear")) return { name: "Corn", category: "Vegetables" };

  // Meat & Seafood
  if (label.includes("meat") || label.includes("beef") || label.includes("steak") || label.includes("pork")) return { name: "Beef", category: "Meat & Seafood" };
  if (label.includes("chicken") || label.includes("hen") || label.includes("cock")) return { name: "Chicken", category: "Meat & Seafood" };
  if (label.includes("fish") || label.includes("salmon")) return { name: "Fish", category: "Meat & Seafood" };

  // Others
  if (label.includes("egg")) return { name: "Eggs", category: "Others" };
  if (label.includes("bread") || label.includes("loaf") || label.includes("bakery")) return { name: "Bread", category: "Others" };
  if (label.includes("cheese")) return { name: "Cheese", category: "Dairy" };
  if (label.includes("milk") || label.includes("pitcher") || label.includes("jug")) return { name: "Fresh Milk", category: "Dairy" };

  // Spices
  if (label.includes("ginger") || label.includes("root")) return { name: "Ginger", category: "Spices" };
  if (label.includes("onion") || label.includes("garlic")) return { name: "Onion / Garlic", category: "Spices" };

  return null;
}
