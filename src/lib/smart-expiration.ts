import { ItemCategory, StorageLocation } from "@/store/useInventoryStore";

export interface SmartShelfLifeResult {
  days: number;
  warning?: string;
}

export function getSmartShelfLife(name: string, category: ItemCategory, location: StorageLocation): SmartShelfLifeResult {
  const normalizedName = name.toLowerCase();

  // 0. COOKED & PREPARED FOODS (Highest Priority - overrides raw ingredient rules)
  if (normalizedName.includes("cooked") || normalizedName.includes("roasted") || normalizedName.includes("panggang") || normalizedName.includes("matang")) {
    if (location === "Pantry") return { 
      days: 1, 
      warning: "Danger! Cooked food (like roasted potatoes or meats) spoils very rapidly at room temperature." 
    };
    if (location === "Chiller") return { days: 4 };
    if (location === "Freezer") return { days: 90 };
  }

  // 1. SPECIFIC INGREDIENT MATCHES (Based on USDA/FoodSafety)
  // Bananas
  if (normalizedName.includes("banana") && !normalizedName.includes("bread") && !normalizedName.includes("cake")) {
    if (location === "Pantry") return { days: 5 };
    if (location === "Chiller") return { 
      days: 7, 
      warning: "Bananas are not recommended in the chiller as the skin will blacken quickly and disrupt ripening." 
    };
    if (location === "Freezer") return { 
      days: 90, 
      warning: "Make sure bananas are peeled before freezing." 
    };
  }

  // Berries & Grapes
  if ((normalizedName.includes("berry") || normalizedName.includes("strawberry") || normalizedName.includes("blueberry") || (normalizedName.includes("grape") && !normalizedName.includes("grapefruit")))) {
    if (location === "Pantry") return { 
      days: 1,
      warning: "Berries mold very quickly at room temperature. Wash only right before eating."
    };
    if (location === "Chiller") return { days: 5 };
    if (location === "Freezer") return { days: 180 };
  }

  // Apples
  if (normalizedName.includes("apple") && !normalizedName.includes("pineapple")) {
    if (location === "Pantry") return { days: 7 };
    if (location === "Chiller") return { days: 28 }; // Apples last up to a month in the fridge
    if (location === "Freezer") return { days: 180 };
  }

  // Pear
  if (normalizedName.includes("pear") || normalizedName.includes("pir")) {
    if (location === "Pantry") return { days: 4 };
    if (location === "Chiller") return { days: 14 };
    if (location === "Freezer") return { 
      days: 0, 
      warning: "Fresh whole pears become extremely mushy and lose their texture if frozen." 
    };
  }

  // Avocado
  if (normalizedName.includes("avocado") || normalizedName.includes("alpukat")) {
    if (location === "Pantry") return { days: 4 };
    if (location === "Chiller") return { 
      days: 7,
      warning: "Only put avocados in the chiller AFTER they are fully ripe, otherwise they will never soften."
    };
    if (location === "Freezer") return { days: 90, warning: "Texture will become mushy; best used for smoothies after freezing." };
  }

  // Durian
  if (normalizedName.includes("durian")) {
    if (location === "Pantry") return { days: 3 };
    if (location === "Chiller") return { 
      days: 5,
      warning: "Must be stored in a completely airtight container to prevent its strong odor from contaminating other foods."
    };
    if (location === "Freezer") return { days: 180 }; // Freezes very well
  }

  // Citrus (Oranges, Lemons)
  if (normalizedName.includes("orange") || normalizedName.includes("lemon") || normalizedName.includes("lime")) {
    if (location === "Pantry") return { days: 10 };
    if (location === "Chiller") return { days: 28 };
    if (location === "Freezer") return { days: 180 }; // Can freeze the juice or zest
  }

  // Whole Eggs
  if (normalizedName.includes("egg") && !normalizedName.includes("eggplant")) {
    if (location === "Pantry") return { days: 14 };
    if (location === "Chiller") return { days: 30 }; // 3-5 weeks
    if (location === "Freezer") return { 
      days: 0, 
      warning: "Strictly prohibited! Whole eggs must not be frozen because the shell will crack due to water expansion." 
    };
  }

  // Potatoes
  if (normalizedName.includes("potato")) {
    if (location === "Pantry") return { days: 30 };
    if (location === "Chiller") return { 
      days: 30, 
      warning: "Not recommended. Cold turns potato starch into sugar (changing texture and flavor)." 
    };
    if (location === "Freezer") return { 
      days: 0, 
      warning: "Raw potatoes will be completely ruined if frozen." 
    };
  }

  // Onions & Garlic
  if ((normalizedName.includes("onion") && !normalizedName.includes("green onion") && !normalizedName.includes("spring onion")) || normalizedName.includes("garlic") || normalizedName.includes("bawang")) {
    if (location === "Pantry") return { days: 30 };
    if (location === "Chiller") return { 
      days: 30, 
      warning: "Not recommended. The humidity in the chiller makes onions and garlic turn mushy and moldy quickly." 
    };
    if (location === "Freezer") return { 
      days: 0, 
      warning: "Raw onions and garlic lose their crunch and become mushy if frozen." 
    };
  }

  // Tomatoes
  if (normalizedName.includes("tomato") && !normalizedName.includes("sauce") && !normalizedName.includes("ketchup") && !normalizedName.includes("paste")) {
    if (location === "Pantry") return { days: 7 };
    if (location === "Chiller") return { 
      days: 14, 
      warning: "Storing tomatoes in the chiller makes the flesh mushy and destroys the natural flavor. Pantry is preferred." 
    };
    if (location === "Freezer") return { 
      days: 0, 
      warning: "Fresh tomatoes are not suitable for freezing (unless for making sauces later)." 
    };
  }

  // Leafy Greens (Spinach, Lettuce, Cabbage, Bok Choy, Kale)
  if (normalizedName.includes("spinach") || normalizedName.includes("lettuce") || normalizedName.includes("cabbage") || normalizedName.includes("bok choy") || normalizedName.includes("kale") || normalizedName.includes("watercress") || normalizedName.includes("mustard greens")) {
    if (location === "Pantry") return { 
      days: 1, 
      warning: "Leafy greens will wilt and lose nutrients very rapidly at room temperature." 
    };
    if (location === "Chiller") return { days: 7 };
    if (location === "Freezer") return { 
      days: 0, 
      warning: "Do not freeze raw leafy greens. They will turn into a slimy mush when thawed (unless blanched first)." 
    };
  }

  // Edamame
  if (normalizedName.includes("edamame")) {
    if (location === "Pantry") return { 
      days: 1, 
      warning: "Fresh edamame loses moisture and spoils rapidly at room temperature. Keep refrigerated or frozen." 
    };
    if (location === "Chiller") return { days: 4 };
    if (location === "Freezer") return { days: 180 }; // Freezes exceptionally well
  }

  // Mushrooms
  if (normalizedName.includes("mushroom")) {
    if (location === "Pantry") return { days: 1 };
    if (location === "Chiller") return { 
      days: 7,
      warning: "Store mushrooms in a paper bag in the chiller, not plastic, to prevent them from becoming slimy."
    };
    if (location === "Freezer") return { 
      days: 0, 
      warning: "Raw mushrooms become completely mushy if frozen." 
    };
  }

  // Peppers & Chilies
  if (normalizedName.includes("chili") || normalizedName.includes("pepper")) {
    if (location === "Pantry") return { days: 5 };
    if (location === "Chiller") return { days: 14 }; // Peppers last about 2 weeks
    if (location === "Freezer") return { days: 180 }; // Can freeze well
  }

  // Carrots & Hard Roots
  if (normalizedName.includes("carrot")) {
    if (location === "Pantry") return { days: 3 };
    if (location === "Chiller") return { days: 28 }; // Carrots last up to 4 weeks in the fridge
    if (location === "Freezer") return { 
      days: 30,
      warning: "Must be blanched before freezing, otherwise they lose texture." 
    };
  }

  // Raw Meat (Beef/Lamb/Goat)
  if ((normalizedName.includes("beef") || normalizedName.includes("lamb") || normalizedName.includes("goat") || normalizedName.includes("meat")) && !normalizedName.includes("broth") && !normalizedName.includes("sauce") && !normalizedName.includes("powder") && !normalizedName.includes("meatball")) {
    if (location === "Pantry") return { 
      days: 0, 
      warning: "Danger! Raw meat must not be kept at room temperature for more than 2 hours according to food safety standards." 
    };
    if (location === "Chiller") return { days: 4 }; // 3-5 days
    if (location === "Freezer") return { days: 180 }; // 4-12 months
  }

  // Poultry (Chicken/Duck)
  if ((normalizedName.includes("chicken") || normalizedName.includes("duck") || normalizedName.includes("poultry")) && !normalizedName.includes("broth") && !normalizedName.includes("sauce") && !normalizedName.includes("powder") && !normalizedName.includes("nugget")) {
    if (location === "Pantry") return { 
      days: 0, 
      warning: "Danger! Raw poultry must not be kept at room temperature for more than 2 hours." 
    };
    if (location === "Chiller") return { days: 2 }; // 1-2 days
    if (location === "Freezer") return { days: 270 }; // up to 9-12 months
  }

  // Seafood (Fish/Shrimp/Squid)
  if ((normalizedName.includes("fish") || normalizedName.includes("shrimp") || normalizedName.includes("squid") || normalizedName.includes("seafood")) && !normalizedName.includes("sauce") && !normalizedName.includes("paste")) {
    if (location === "Pantry") return { 
      days: 0, 
      warning: "Danger! Seafood spoils rapidly and becomes toxic at room temperature." 
    };
    if (location === "Chiller") return { days: 2 };
    if (location === "Freezer") return { days: 180 };
  }

  // Fresh Milk
  if (normalizedName.includes("milk") || normalizedName.includes("susu segar")) {
    if (location === "Pantry") return { 
      days: 0, 
      warning: "Fresh milk will spoil very quickly if left at room temperature." 
    };
    if (location === "Chiller") return { days: 7 };
    if (location === "Freezer") return { 
      days: 30, 
      warning: "Can be frozen, but the texture might separate or become grainy when thawed." 
    };
  }

  // Cheese
  if (normalizedName.includes("cheese") || normalizedName.includes("keju")) {
    if (location === "Pantry") return { days: 2 };
    if (location === "Chiller") return { days: 30 };
    if (location === "Freezer") return { 
      days: 180, 
      warning: "Hard cheese can be frozen, but the texture may become crumbly." 
    };
  }

  // Bread
  if ((normalizedName.includes("bread") && !normalizedName.includes("breaded")) || normalizedName.includes("donut") || normalizedName.includes("cake") || normalizedName.includes("roti")) {
    if (location === "Pantry") return { days: 5 };
    if (location === "Chiller") return { 
      days: 14, 
      warning: "The chiller actually accelerates the process of bread going stale/hard." 
    };
    if (location === "Freezer") return { days: 90 };
  }

  // Tofu/Tempeh
  if (normalizedName.includes("tofu") || normalizedName.includes("tempeh") || normalizedName.includes("tahu") || normalizedName.includes("tempe")) {
    if (location === "Pantry") return { days: 1 };
    if (location === "Chiller") return { days: 7 };
    if (location === "Freezer") return { 
      days: 30, 
      warning: "Tofu can be frozen; the color will turn yellowish and the texture will become spongy." 
    };
  }

  // --- CONDIMENTS ---

  // Mayonnaise
  if (normalizedName.includes("mayo")) {
    if (location === "Pantry") return { 
      days: 0, 
      warning: "Once opened, mayonnaise must be refrigerated immediately or it will spoil." 
    };
    if (location === "Chiller") return { days: 60 }; // 2 months opened
    if (location === "Freezer") return { 
      days: 0, 
      warning: "Do not freeze mayonnaise. The emulsion will break and it will separate into oil and liquid." 
    };
  }

  // Ketchup & Sauces (Chili/Tomato sauce)
  if (normalizedName.includes("ketchup") || (normalizedName.includes("sauce") && !normalizedName.includes("sausage")) || (normalizedName.includes("saus") && !normalizedName.includes("sausage")) || normalizedName.includes("mustard")) {
    // Exception for Soy Sauce which lasts longer
    if (normalizedName.includes("soy") || normalizedName.includes("kecap")) {
      if (location === "Pantry") return { days: 365 };
      if (location === "Chiller") return { days: 730 };
      if (location === "Freezer") return { days: 0, warning: "Freezing soy sauce is unnecessary and not recommended." };
    }
    
    if (location === "Pantry") return { days: 30 }; // Opened ketchup in pantry
    if (location === "Chiller") return { days: 180 }; // Opened in fridge
    if (location === "Freezer") return { days: 0, warning: "Freezing sauces causes water separation." };
  }

  // Cooking Oils
  if (normalizedName.includes("oil") || normalizedName.includes("minyak")) {
    if (location === "Pantry") return { days: 180 };
    if (location === "Chiller") return { 
      days: 180, 
      warning: "Storing oil in the chiller may cause it to become cloudy and solidify, though it will return to normal at room temperature." 
    };
    if (location === "Freezer") return { days: 0, warning: "Do not freeze cooking oil." };
  }

  // --- DRY GOODS ---

  // Sugar & Salt
  if (normalizedName.includes("sugar") || normalizedName.includes("salt") || normalizedName.includes("gula") || normalizedName.includes("garam")) {
    if (location === "Pantry") return { days: 730 }; // Basically indefinite
    if (location === "Chiller") return { 
      days: 730, 
      warning: "Not recommended. Moisture in the fridge will cause sugar and salt to clump into hard blocks." 
    };
    if (location === "Freezer") return { days: 0, warning: "Do not freeze." };
  }

  // Flour
  if (normalizedName.includes("flour") || normalizedName.includes("tepung")) {
    if (location === "Pantry") return { days: 180 };
    if (location === "Chiller") return { days: 365, warning: "Must be in an airtight container to prevent absorbing odors." };
    if (location === "Freezer") return { days: 730 };
  }

  // Chocolate & Sprinkles (Meses)
  if (normalizedName.includes("chocolate") || normalizedName.includes("sprinkles") || normalizedName.includes("meses")) {
    if (location === "Pantry") return { days: 365 };
    if (location === "Chiller") return { 
      days: 365, 
      warning: "Refrigerating chocolate may cause 'sugar bloom' (white spots) due to moisture, though it is still safe to eat." 
    };
    if (location === "Freezer") return { days: 365 };
  }

  // Rice & Pasta
  if (normalizedName.includes("rice") || normalizedName.includes("pasta") || normalizedName.includes("beras")) {
    if (location === "Pantry") return { days: 730 };
    if (location === "Chiller") return { days: 730, warning: "Must be in an airtight container." };
    if (location === "Freezer") return { days: 730, warning: "Must be in a strictly airtight container." };
  }

  // 2. CATEGORY LEVEL MATCHES (Fallback)
  switch (category) {
    case "Vegetables":
      if (location === "Pantry") return { days: 2 };
      if (location === "Chiller") return { days: 7 };
      if (location === "Freezer") return { 
        days: 30, 
        warning: "Most raw vegetables will turn mushy if frozen. Blanching them briefly before freezing is highly recommended." 
      };
      break;
    
    case "Fruits":
      if (location === "Pantry") return { days: 3 };
      if (location === "Chiller") return { days: 14 };
      if (location === "Freezer") return { days: 180 };
      break;

    case "Meat & Seafood":
      if (location === "Pantry") return { 
        days: 0, 
        warning: "Highly unrecommended to store meat outside the refrigerator." 
      };
      if (location === "Chiller") return { days: 3 };
      if (location === "Freezer") return { days: 180 };
      break;

    case "Dairy":
      if (location === "Pantry") return { days: 1 };
      if (location === "Chiller") return { days: 14 };
      if (location === "Freezer") return { days: 60 };
      break;

    case "Dry Goods":
      if (location === "Pantry") return { days: 365 };
      if (location === "Chiller") return { days: 365 };
      if (location === "Freezer") return { days: 365 };
      break;

    case "Condiments":
      if (location === "Pantry") return { days: 180 };
      if (location === "Chiller") return { days: 365 };
      if (location === "Freezer") return { days: 365 };
      break;
      
    case "Spices":
      if (location === "Pantry") return { days: 14 }; 
      if (location === "Chiller") return { days: 30 };
      if (location === "Freezer") return { 
        days: 180, 
        warning: "Raw spices (ginger/turmeric) can be frozen, but their texture might become slightly mushy when thawed." 
      };
      break;

    case "Others":
    default:
      if (location === "Pantry") return { days: 7 };
      if (location === "Chiller") return { days: 14 };
      if (location === "Freezer") return { days: 30 };
      break;
  }

  return { days: 7 }; // Ultimate fallback
}
