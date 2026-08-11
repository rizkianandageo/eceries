import { InventoryItem } from '@/store/useInventoryStore';
import { calculateFreshness, FreshnessInfo } from '@/lib/freshness';
import { v4 as uuidv4 } from 'uuid';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  emoji: string;
  prepTime: string;
  ingredients: string[]; // Base ingredient names (should match ALL_SUGGESTIONS ideally)
  instructions: string[];
}

export interface MatchedRecipe extends Recipe {
  matchScore: number; // 0 to 100
  matchedIngredients: string[];
  missingIngredients: string[];
  expiringIngredientsUsed: string[];
}

// Database of common home recipes using our standard ingredient names
export const RECIPE_DB: Recipe[] = [
  {
    id: "r1",
    title: "Classic Fried Rice",
    description: "A quick and delicious way to use leftover rice and vegetables.",
    emoji: "🍛",
    prepTime: "15 min",
    ingredients: ["Rice", "Eggs", "Garlic", "Shallot", "Soy Sauce", "Chicken", "Salt", "Pepper"],
    instructions: [
      "Mince garlic and shallot.",
      "Scramble eggs in a heated wok, then set aside.",
      "Sauté garlic and shallot until fragrant. Add diced chicken and cook until brown.",
      "Mix in the scrambled eggs and serve hot."
    ]
  },
  {
    id: "r2",
    title: "Chicken Stir-fry",
    description: "Healthy and vibrant mixed vegetable stir-fry with chicken.",
    emoji: "🥘",
    prepTime: "25 min",
    ingredients: ["Chicken", "Broccoli", "Carrot", "Cauliflower", "Garlic", "Oyster Mushroom", "Mushroom Broth", "Salt", "Pepper"],
    instructions: [
      "Slice the chicken and chop all vegetables into bite-sized pieces.",
      "Sauté minced garlic in a bit of oil.",
      "Add chicken and cook until no longer pink.",
      "Add the hard vegetables (carrot, cauliflower) first, stir-fry for 2 minutes.",
      "Add broccoli and mushrooms. Season with mushroom broth, salt, and pepper.",
      "Cook until vegetables are tender-crisp. Serve with rice."
    ]
  },
  {
    id: "r3",
    title: "Simple Omelette",
    description: "The ultimate quick breakfast or emergency meal.",
    emoji: "🍳",
    prepTime: "5 min",
    ingredients: ["Eggs", "Onion", "Scallion", "Salt", "Pepper", "Cooking Oil"],
    instructions: [
      "Beat eggs in a bowl with salt and pepper.",
      "Finely chop the onion and scallion, then mix into the eggs.",
      "Heat a pan with a little cooking oil.",
      "Pour in the egg mixture and cook until the bottom is set.",
      "Fold or flip, cook for another minute, and serve."
    ]
  },
  {
    id: "r4",
    title: "Beef Black Pepper",
    description: "Restaurant-style savory and spicy beef stir-fry.",
    emoji: "🥩",
    prepTime: "30 min",
    ingredients: ["Beef", "Bell Pepper", "Onion", "Garlic", "Soy Sauce", "Pepper", "Salt", "Cooking Oil"],
    instructions: [
      "Thinly slice the beef against the grain.",
      "Marinate beef with soy sauce and plenty of black pepper for 15 minutes.",
      "Slice the bell pepper and onion into chunks.",
      "Sauté minced garlic, then add the marinated beef. Cook over high heat.",
      "Add bell pepper and onion. Stir-fry for 2-3 minutes until fragrant.",
      "Adjust seasoning with salt and serve hot."
    ]
  },
  {
    id: "r5",
    title: "Spicy Water Spinach",
    description: "A very popular and quick vegetable side dish.",
    emoji: "🥬",
    prepTime: "10 min",
    ingredients: ["Water Spinach", "Garlic", "Shallot", "Red Bird's Eye Chili", "Salt", "Sugar", "Cooking Oil"],
    instructions: [
      "Wash and cut the water spinach.",
      "Slice garlic, shallot, and chilies.",
      "Heat oil and sauté the aromatics until very fragrant.",
      "Turn heat to maximum and add the water spinach. Toss quickly.",
      "Add salt and a pinch of sugar. Cook for just 1-2 minutes until wilted.",
      "Serve immediately."
    ]
  },
  {
    id: "r6",
    title: "Fruit Salad",
    description: "Refreshing mix of fresh fruits, perfect for hot days.",
    emoji: "🥗",
    prepTime: "10 min",
    ingredients: ["Apple", "Mango", "Watermelon", "Grapes", "Yogurt", "Cheese"],
    instructions: [
      "Wash and dice the apple, mango, and watermelon into small cubes.",
      "Halve the grapes.",
      "Mix all fruits in a large bowl.",
      "Pour yogurt over the fruits and gently toss.",
      "Grate cheese generously over the top before serving."
    ]
  },
  {
    id: "r7",
    title: "Mushroom Soup",
    description: "Creamy and comforting soup for chilly evenings.",
    emoji: "🥣",
    prepTime: "20 min",
    ingredients: ["Button Mushroom", "Onion", "Garlic", "Fresh Milk", "Butter", "Salt", "Pepper"],
    instructions: [
      "Finely chop onion and garlic. Slice the button mushrooms.",
      "Melt butter in a pot, sauté onion and garlic until soft.",
      "Add mushrooms and cook until browned.",
      "Pour in fresh milk, bring to a gentle simmer.",
      "Season with salt and pepper. Blend slightly if you prefer a thicker texture."
    ]
  },
  {
    id: "r8",
    title: "Spicy Tomato Chicken",
    description: "Chicken braised in a rich, spicy tomato sauce.",
    emoji: "🍗",
    prepTime: "40 min",
    ingredients: ["Chicken", "Tomato", "Garlic", "Shallot", "Red Curly Chili", "Sugar", "Salt", "Cooking Oil"],
    instructions: [
      "Fry the chicken pieces until half-cooked and set aside.",
      "Blend or pound tomato, garlic, shallot, and chili into a paste.",
      "Sauté the paste in hot oil until the raw smell disappears and oil separates.",
      "Add the chicken, season with salt and sugar.",
      "Add a little water, cover, and simmer until chicken is fully cooked and sauce thickens."
    ]
  },
  {
    id: "r9",
    title: "Beef Stew",
    description: "Hearty and comforting slow-cooked beef with vegetables.",
    emoji: "🍲",
    prepTime: "90 min",
    ingredients: ["Beef", "Potato", "Carrot", "Onion", "Garlic", "Tomato", "Salt", "Pepper"],
    instructions: [
      "Cut beef, potato, and carrot into large cubes.",
      "Sauté diced onion and minced garlic in a large pot.",
      "Add the beef and brown on all sides.",
      "Add chopped tomatoes and enough water to cover.",
      "Simmer for 1 hour until beef is tender. Add potatoes and carrots.",
      "Cook for another 20 minutes until vegetables are soft. Season with salt and pepper."
    ]
  },
  {
    id: "r10",
    title: "Chicken Curry",
    description: "Rich and creamy coconut milk chicken curry.",
    emoji: "🍛",
    prepTime: "45 min",
    ingredients: ["Chicken", "Potato", "Coconut Milk", "Garlic", "Shallot", "Ginger", "Chili", "Salt", "Cooking Oil"],
    instructions: [
      "Blend garlic, shallot, ginger, and chili into a fine paste.",
      "Sauté the paste in oil until fragrant.",
      "Add chicken pieces and cook until the outside turns white.",
      "Pour in coconut milk and add cubed potatoes.",
      "Simmer on low heat until chicken is cooked through and sauce thickens.",
      "Season with salt."
    ]
  },
  {
    id: "r11",
    title: "Spinach Soup",
    description: "Light and healthy clear soup with spinach and sweet corn.",
    emoji: "🥣",
    prepTime: "15 min",
    ingredients: ["Spinach", "Sweet Corn", "Garlic", "Shallot", "Salt", "Sugar"],
    instructions: [
      "Slice the shallots and garlic thinly.",
      "Boil water in a pot, add the shallots, garlic, and sweet corn kernels.",
      "Cook until the corn is tender.",
      "Add the spinach leaves, salt, and a pinch of sugar.",
      "Cook for 1-2 minutes until spinach wilts. Serve hot."
    ]
  },
  {
    id: "r12",
    title: "Grilled Cheese Sandwich",
    description: "The ultimate quick comfort food.",
    emoji: "🥪",
    prepTime: "10 min",
    ingredients: ["Bread", "Cheese", "Butter"],
    instructions: [
      "Butter one side of each slice of bread.",
      "Place cheese between the unbuttered sides of the bread.",
      "Heat a pan over medium-low heat.",
      "Grill the sandwich until the bottom bread is golden brown.",
      "Flip and grill the other side until golden and cheese is melted."
    ]
  },
  {
    id: "r13",
    title: "Creamy Potato Salad",
    description: "Classic side dish for BBQs or picnics.",
    emoji: "🥗",
    prepTime: "25 min",
    ingredients: ["Potato", "Eggs", "Mayonnaise", "Onion", "Salt", "Pepper"],
    instructions: [
      "Boil potatoes and eggs until cooked. Let them cool.",
      "Peel and dice the potatoes and eggs.",
      "Finely chop the onion.",
      "Mix potatoes, eggs, and onion in a large bowl.",
      "Fold in mayonnaise, salt, and pepper until well coated. Chill before serving."
    ]
  },
  {
    id: "r14",
    title: "Pan-Seared Salmon",
    description: "Crispy skin salmon with a simple garlic butter sauce.",
    emoji: "🐟",
    prepTime: "15 min",
    ingredients: ["Salmon", "Butter", "Garlic", "Lemon", "Salt", "Pepper"],
    instructions: [
      "Pat the salmon dry and season with salt and pepper.",
      "Heat a pan over medium-high heat with a little oil.",
      "Place salmon skin-side down and press gently. Cook for 4-5 minutes until crispy.",
      "Flip the salmon. Add butter and minced garlic to the pan.",
      "Baste the salmon with the melting garlic butter. Cook for another 2-3 minutes.",
      "Squeeze lemon juice over the top before serving."
    ]
  },
  {
    id: "r15",
    title: "Banana Smoothie",
    description: "Quick, sweet, and filling breakfast drink.",
    emoji: "🥤",
    prepTime: "5 min",
    ingredients: ["Banana", "Fresh Milk", "Honey", "Yogurt"],
    instructions: [
      "Peel and slice the banana.",
      "Place banana, fresh milk, yogurt, and a drizzle of honey into a blender.",
      "Blend on high until smooth.",
      "Pour into a glass and serve immediately."
    ]
  },
  {
    id: "r16",
    title: "Mango Sticky Rice",
    description: "Sweet and creamy traditional Thai dessert.",
    emoji: "🥭",
    prepTime: "40 min",
    ingredients: ["Mango", "Rice", "Coconut Milk", "Sugar", "Salt"],
    instructions: [
      "Cook sticky rice (or regular rice if unavailable) until soft.",
      "In a saucepan, gently heat coconut milk, sugar, and a pinch of salt until sugar dissolves.",
      "Mix half of the sweet coconut sauce into the cooked rice and let it absorb for 15 minutes.",
      "Slice the mango.",
      "Serve the rice with mango slices and drizzle the remaining sauce on top."
    ]
  },
  {
    id: "r17",
    title: "Tomato Garlic Pasta",
    description: "Simple and fresh Italian-style pasta.",
    emoji: "🍝",
    prepTime: "20 min",
    ingredients: ["Pasta", "Tomato", "Garlic", "Olive Oil", "Cheese", "Salt", "Pepper"],
    instructions: [
      "Boil pasta in salted water until al dente.",
      "In a pan, heat olive oil and sauté minced garlic until fragrant.",
      "Add chopped tomatoes and cook until they break down into a sauce.",
      "Toss the cooked pasta into the sauce.",
      "Season with salt and pepper. Top with grated cheese before serving."
    ]
  },
  {
    id: "r18",
    title: "Avocado Toast",
    description: "Trendy, healthy, and incredibly fast to make.",
    emoji: "🥑",
    prepTime: "5 min",
    ingredients: ["Avocado", "Bread", "Eggs", "Salt", "Pepper"],
    instructions: [
      "Toast the bread to your liking.",
      "Mash the avocado with a fork, season with salt and pepper.",
      "Fry or poach an egg.",
      "Spread the mashed avocado on the toast and top with the cooked egg."
    ]
  },
  {
    id: "r19",
    title: "Lemon Garlic Shrimp",
    description: "Zesty and buttery shrimp ready in minutes.",
    emoji: "🍤",
    prepTime: "15 min",
    ingredients: ["Shrimp", "Garlic", "Butter", "Lemon", "Salt", "Pepper"],
    instructions: [
      "Peel and devein the shrimp.",
      "Melt butter in a skillet over medium heat.",
      "Add minced garlic and cook for 1 minute.",
      "Add shrimp, salt, and pepper. Cook for 2-3 minutes per side until pink.",
      "Squeeze fresh lemon juice over the shrimp and serve."
    ]
  },
  {
    id: "r20",
    title: "Vegetable Curry",
    description: "Healthy and warming mixed vegetable curry.",
    emoji: "🥕",
    prepTime: "30 min",
    ingredients: ["Carrot", "Potato", "Broccoli", "Coconut Milk", "Garlic", "Onion", "Salt", "Cooking Oil"],
    instructions: [
      "Chop all vegetables into bite-sized pieces.",
      "Sauté diced onion and minced garlic in a large pot until soft.",
      "Add potatoes and carrots, stir for a few minutes.",
      "Pour in coconut milk and simmer until hard vegetables are almost tender.",
      "Add broccoli and cook for another 5 minutes.",
      "Season with salt and serve hot."
    ]
  },
  {
    id: "r21",
    title: "Caprese Salad",
    description: "Simple Italian salad made of sliced fresh mozzarella, tomatoes, and sweet basil.",
    emoji: "🥗",
    prepTime: "5 min",
    ingredients: ["Tomato", "Cheese", "Olive Oil", "Salt", "Pepper"],
    instructions: [
      "Slice the tomatoes and fresh cheese (preferably mozzarella).",
      "Arrange them on a plate, alternating tomato and cheese.",
      "Drizzle with olive oil.",
      "Season with salt and pepper. Add fresh basil if available."
    ]
  },
  {
    id: "r22",
    title: "Spaghetti Aglio e Olio",
    description: "A traditional Italian pasta dish made with garlic and olive oil.",
    emoji: "🍝",
    prepTime: "15 min",
    ingredients: ["Pasta", "Garlic", "Olive Oil", "Chili", "Salt"],
    instructions: [
      "Boil pasta in salted water until al dente.",
      "Thinly slice the garlic and chop the chili.",
      "In a large pan, gently heat the olive oil. Add the garlic and chili.",
      "Cook until the garlic turns golden brown, but not burnt.",
      "Toss the cooked pasta into the pan with a splash of pasta water. Serve hot."
    ]
  },
  {
    id: "r23",
    title: "Chicken Noodle Soup",
    description: "Comforting soup perfect for cold days.",
    emoji: "🍜",
    prepTime: "35 min",
    ingredients: ["Chicken", "Carrot", "Onion", "Pasta", "Garlic", "Salt", "Pepper"],
    instructions: [
      "Dice the chicken, carrot, and onion.",
      "In a pot, sauté onion and minced garlic until soft.",
      "Add chicken and cook until no longer pink.",
      "Add carrots and plenty of water or chicken broth. Bring to a boil.",
      "Add the pasta (noodles) and simmer until tender. Season with salt and pepper."
    ]
  },
  {
    id: "r24",
    title: "Beef Tacos",
    description: "Quick and easy ground beef tacos.",
    emoji: "🌮",
    prepTime: "20 min",
    ingredients: ["Beef", "Tomato", "Cheese", "Onion", "Garlic", "Chili", "Salt"],
    instructions: [
      "Finely chop the onion and garlic. Dice the tomato.",
      "Sauté onion and garlic in a pan. Add minced or thinly sliced beef.",
      "Cook the beef thoroughly. Add chopped chili and salt.",
      "Serve the beef mixture in taco shells or tortillas (if you have them).",
      "Top with diced tomatoes and grated cheese."
    ]
  },
  {
    id: "r25",
    title: "Egg Fried Rice",
    description: "The simplest and fastest fried rice.",
    emoji: "🍚",
    prepTime: "10 min",
    ingredients: ["Rice", "Eggs", "Garlic", "Soy Sauce", "Salt", "Cooking Oil"],
    instructions: [
      "Mince the garlic.",
      "Heat a wok or large pan with oil. Scramble the eggs quickly, then push to one side.",
      "Add the garlic and sauté until fragrant.",
      "Add cold, leftover rice and stir-fry vigorously.",
      "Season with soy sauce and a pinch of salt. Serve immediately."
    ]
  },
  {
    id: "r26",
    title: "Garlic Butter Steak",
    description: "Juicy pan-seared steak bathed in garlic butter.",
    emoji: "🥩",
    prepTime: "15 min",
    ingredients: ["Beef", "Butter", "Garlic", "Salt", "Pepper"],
    instructions: [
      "Pat the beef steak dry. Season heavily with salt and pepper.",
      "Heat a pan over high heat until smoking hot.",
      "Sear the steak for 2-3 minutes per side for medium-rare.",
      "Reduce heat, add butter and crushed garlic.",
      "Baste the steak with the foaming butter for 1 minute. Let it rest before slicing."
    ]
  },
  {
    id: "r27",
    title: "Teriyaki Chicken",
    description: "Sweet and savory glazed chicken.",
    emoji: "🍗",
    prepTime: "25 min",
    ingredients: ["Chicken", "Soy Sauce", "Sugar", "Garlic", "Ginger", "Cooking Oil"],
    instructions: [
      "Cut chicken into bite-sized pieces.",
      "Mix soy sauce, sugar, minced garlic, and grated ginger to make the teriyaki sauce.",
      "Pan-fry the chicken in a little oil until golden brown on all sides.",
      "Pour the sauce over the chicken.",
      "Simmer until the sauce thickens and glazes the chicken completely."
    ]
  },
  {
    id: "r28",
    title: "Mushroom Risotto",
    description: "Creamy and rich Italian rice dish.",
    emoji: "🍲",
    prepTime: "40 min",
    ingredients: ["Rice", "Button Mushroom", "Onion", "Garlic", "Butter", "Cheese", "Salt"],
    instructions: [
      "Finely dice the onion and garlic. Slice the mushrooms.",
      "Sauté onion and garlic in butter until translucent. Add mushrooms and cook until browned.",
      "Add the rice (preferably Arborio) and toast for 1 minute.",
      "Gradually add warm water or broth, one ladle at a time, stirring constantly.",
      "Wait until the liquid is absorbed before adding more. Cook until rice is creamy and tender.",
      "Stir in grated cheese and season with salt."
    ]
  },
  {
    id: "r29",
    title: "Tofu Stir-Fry",
    description: "A quick, healthy, and protein-packed vegan meal.",
    emoji: "🥢",
    prepTime: "15 min",
    ingredients: ["Tofu", "Broccoli", "Carrot", "Garlic", "Soy Sauce", "Cooking Oil"],
    instructions: [
      "Cut tofu into cubes and pan-fry until golden. Set aside.",
      "Chop broccoli and slice carrots thinly.",
      "Sauté minced garlic in the pan.",
      "Add vegetables and a splash of water, cover to steam for 3 minutes.",
      "Return the tofu to the pan, add soy sauce, toss well and serve."
    ]
  },
  {
    id: "r30",
    title: "Shrimp Scampi",
    description: "Garlicky, lemony shrimp pasta.",
    emoji: "🍤",
    prepTime: "20 min",
    ingredients: ["Shrimp", "Pasta", "Garlic", "Butter", "Lemon", "Salt", "Pepper"],
    instructions: [
      "Boil pasta in salted water until cooked. Drain and set aside.",
      "Melt butter in a skillet over medium heat.",
      "Add minced garlic and cook for 1 minute until fragrant.",
      "Add shrimp, season with salt and pepper, cook until pink.",
      "Toss the cooked pasta into the skillet. Squeeze lemon juice over it and serve."
    ]
  },
  {
    id: "r31",
    title: "Apple Crisps",
    description: "A healthy and crunchy baked snack.",
    emoji: "🍎",
    prepTime: "45 min",
    ingredients: ["Apple", "Sugar"],
    instructions: [
      "Preheat oven to 200°F (90°C).",
      "Slice apples as thinly as possible (using a mandoline is best).",
      "Arrange slices in a single layer on a baking sheet lined with parchment paper.",
      "Lightly sprinkle with sugar if desired.",
      "Bake for 45-60 minutes, or until the apples are dry and crispy."
    ]
  },
  {
    id: "r32",
    title: "Strawberry Yogurt Parfait",
    description: "A beautiful layered breakfast or dessert.",
    emoji: "🍨",
    prepTime: "5 min",
    ingredients: ["Strawberry", "Yogurt", "Honey"],
    instructions: [
      "Wash and chop the strawberries.",
      "In a glass, add a layer of yogurt.",
      "Add a layer of chopped strawberries.",
      "Repeat the layers until the glass is full.",
      "Drizzle with honey on top."
    ]
  },
  {
    id: "r33",
    title: "Watermelon Mint Salad",
    description: "The most refreshing summer salad.",
    emoji: "🍉",
    prepTime: "5 min",
    ingredients: ["Watermelon", "Cheese"], // Mint usually considered an herb not always tracked, we'll use cheese
    instructions: [
      "Cut watermelon into bite-sized cubes.",
      "Crumble salty cheese (like feta) over the watermelon.",
      "Toss gently. If you have fresh mint, tear it over the top.",
      "Serve chilled."
    ]
  },
  {
    id: "r34",
    title: "Crispy Fried Tofu",
    description: "Crunchy on the outside, soft on the inside.",
    emoji: "🥢",
    prepTime: "15 min",
    ingredients: ["Tofu", "Garlic", "Salt", "Cooking Oil"],
    instructions: [
      "Press the tofu slightly to remove excess water, then cut into cubes.",
      "Toss the tofu in a little salt and garlic powder (or minced garlic).",
      "Heat a generous amount of oil in a pan.",
      "Fry the tofu cubes until golden brown and crispy on all sides.",
      "Drain on paper towels and serve with soy sauce or chili sauce."
    ]
  },
  {
    id: "r35",
    title: "French Toast",
    description: "A classic sweet breakfast treat.",
    emoji: "🍞",
    prepTime: "10 min",
    ingredients: ["Bread", "Eggs", "Fresh Milk", "Butter", "Sugar"],
    instructions: [
      "Whisk eggs, fresh milk, and a pinch of sugar in a shallow bowl.",
      "Melt butter in a pan over medium heat.",
      "Dip each slice of bread into the egg mixture, coating both sides.",
      "Fry the bread in the pan until golden brown on both sides.",
      "Serve with syrup, honey, or fresh fruits."
    ]
  },
  {
    id: "r36",
    title: "Macaroni and Cheese",
    description: "Homemade cheesy pasta goodness.",
    emoji: "🧀",
    prepTime: "25 min",
    ingredients: ["Pasta", "Cheese", "Fresh Milk", "Butter", "Salt"],
    instructions: [
      "Boil pasta (macaroni) until tender, then drain.",
      "In the same pot, melt butter, then whisk in a little flour (if available) or just add milk.",
      "Bring milk to a simmer, then stir in plenty of grated cheese until you have a smooth sauce.",
      "Add the cooked pasta back into the pot.",
      "Stir until pasta is completely coated in cheese sauce. Season with salt."
    ]
  },
  {
    id: "r37",
    title: "BBQ Chicken Wings",
    description: "Sticky and sweet oven-baked wings.",
    emoji: "🍗",
    prepTime: "45 min",
    ingredients: ["Chicken", "Soy Sauce", "Sugar", "Garlic", "Salt", "Pepper"],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "Season chicken wings (or chopped chicken) with salt and pepper.",
      "Mix soy sauce, sugar, and minced garlic to make a simple BBQ glaze.",
      "Toss the wings in half of the glaze.",
      "Bake for 35-40 minutes, turning halfway and brushing with the remaining glaze."
    ]
  },
  {
    id: "r38",
    title: "Caesar Salad",
    description: "Crisp and garlicky classic salad.",
    emoji: "🥬",
    prepTime: "10 min",
    ingredients: ["Lettuce", "Garlic", "Olive Oil", "Cheese", "Lemon"],
    instructions: [
      "Wash and chop the lettuce.",
      "Make the dressing by whisking olive oil, minced garlic, lemon juice, and a pinch of salt.",
      "Toss the lettuce with the dressing.",
      "Grate plenty of cheese over the top.",
      "Serve immediately (add croutons or grilled chicken if you like)."
    ]
  },
  {
    id: "r39",
    title: "Vegetable Frittata",
    description: "A thick Italian omelette loaded with veggies.",
    emoji: "🍳",
    prepTime: "20 min",
    ingredients: ["Eggs", "Spinach", "Tomato", "Onion", "Cheese", "Salt", "Cooking Oil"],
    instructions: [
      "Preheat your broiler or oven.",
      "Whisk eggs in a bowl with salt and grated cheese.",
      "In an oven-safe skillet, sauté chopped onion, spinach, and diced tomatoes until soft.",
      "Pour the egg mixture over the vegetables in the skillet.",
      "Cook on the stovetop until the edges start to set.",
      "Transfer the skillet to the oven/broiler for a few minutes until the top is fully cooked and slightly golden."
    ]
  },
  {
    id: "r40",
    title: "Baked Potatoes",
    description: "Simple, hearty, and highly customizable.",
    emoji: "🥔",
    prepTime: "60 min",
    ingredients: ["Potato", "Butter", "Cheese", "Salt", "Pepper"],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "Scrub the potatoes clean and pierce them several times with a fork.",
      "Rub with a little oil or butter and season with salt.",
      "Bake directly on the oven rack for 45-60 minutes until tender.",
      "Slice open, mash the insides slightly, and stuff with butter, cheese, salt, and pepper."
    ]
  }
];

export function scoreRecipes(recipes: Recipe[], inventory: InventoryItem[]): MatchedRecipe[] {
  // 1. Process inventory to find available item names and their freshness
  const availableItems = new Map<string, FreshnessInfo>();
  
  inventory.forEach(item => {
    const freshness = calculateFreshness(item.expiryDate);
    const itemNameLower = item.name.toLowerCase();
    
    if (availableItems.has(itemNameLower)) {
      const existingStatus = availableItems.get(itemNameLower);
      if (freshness.daysLeft < (existingStatus?.daysLeft || 999)) {
        availableItems.set(itemNameLower, freshness);
      }
    } else {
      availableItems.set(itemNameLower, freshness);
    }
  });

  // 2. Score each recipe
  const scoredRecipes: MatchedRecipe[] = recipes.map(recipe => {
    const matchedIngredients: string[] = [];
    const missingIngredients: string[] = [];
    const expiringIngredientsUsed: string[] = [];

    recipe.ingredients.forEach(ing => {
      const ingLower = ing.toLowerCase();
      let found = false;
      const ingRegex = new RegExp(`\\b${ingLower}\\b`, 'i');
      
      for (const [invName, freshness] of availableItems.entries()) {
        const invRegex = new RegExp(`\\b${invName}\\b`, 'i');
        if (ingRegex.test(invName) || invRegex.test(ingLower)) {
          matchedIngredients.push(ing);
          found = true;
          
          if (freshness.status === 'warning' || freshness.status === 'critical' || freshness.status === 'expired') {
            expiringIngredientsUsed.push(ing);
          }
          break;
        }
      }
      
      if (!found) {
        missingIngredients.push(ing);
      }
    });

    const matchRatio = recipe.ingredients.length > 0 ? matchedIngredients.length / recipe.ingredients.length : 0;
    let matchScore = Math.round(matchRatio * 100);

    if (expiringIngredientsUsed.length > 0) {
      matchScore += (expiringIngredientsUsed.length * 15);
      matchScore = Math.min(100, matchScore);
    }

    return {
      ...recipe,
      matchScore,
      matchedIngredients,
      missingIngredients,
      expiringIngredientsUsed
    };
  });

  // 3. Sort recipes
  return scoredRecipes.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return b.expiringIngredientsUsed.length - a.expiringIngredientsUsed.length;
  });
}

export function getRecommendedRecipes(inventory: InventoryItem[]): MatchedRecipe[] {
  return scoreRecipes(RECIPE_DB, inventory);
}
