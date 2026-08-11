import { ItemCategory } from "@/store/useInventoryStore";

export const ITEM_SUGGESTIONS: Record<ItemCategory, string[]> = {
  "Vegetables": [
    "Spinach", "Water Spinach", "Broccoli", "Tomato", "Carrot", "Potato", 
    "Cabbage", "Napa Cabbage", "Bok Choy", "Mustard Greens", "Cauliflower", "Eggplant", 
    "Green Beans", "Long Beans", "Corn", "Edamame",
    "Button Mushroom", "Enoki Mushroom", "Wood Ear Mushroom", "Oyster Mushroom", "Shiitake Mushroom",
    "Lettuce", "Watercress"
  ],
  "Fruits": ["Apple", "Banana", "Orange", "Mango", "Papaya", "Watermelon", "Grapes", "Strawberry", "Pineapple", "Durian", "Mangosteen", "Dragon Fruit", "Melon", "Lychee", "Avocado", "Pear"],
  "Meat & Seafood": ["Chicken", "Beef", "Goat", "Lamb", "Duck", "Fish", "Shrimp", "Squid", "Sausage", "Meatballs", "Chicken Nugget"],
  "Dairy": ["Fresh Milk", "UHT Milk", "Cheese", "Yogurt", "Butter", "Cream"],
  "Dry Goods": ["Rice", "Pasta", "Noodles", "Flour", "Oatmeal", "Biscuits", "Coffee", "Tea", "Chocolate Sprinkles"],
  "Condiments": ["Soy Sauce", "Chili Sauce", "Tomato Sauce", "Ketchup", "Mayonnaise", "Mustard", "Cooking Oil", "Vinegar"],
  "Spices": [
    "Salt", "Sugar", "Pepper", "Mushroom Broth", 
    "Onion", "Shallot", "Garlic", "Scallion", 
    "Red Curly Chili", "Green Curly Chili", "Red Bird's Eye Chili", "Green Bird's Eye Chili", "Bell Pepper",
    "Ginger", "Turmeric", "Galangal", "Lemongrass", "Bay Leaf", "Coriander", "Nutmeg"
  ],
  "Others": ["Eggs", "Tofu", "Tempeh", "Bread", "Jam", "Roasted Sweet Potato"]
};

// A flat array of all suggestions for global search (like shopping list)
export const ALL_SUGGESTIONS = Object.values(ITEM_SUGGESTIONS).flat();
