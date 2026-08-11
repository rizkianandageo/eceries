import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export type StorageLocation = 'Pantry' | 'Chiller' | 'Freezer';
export type ItemCategory = 'Vegetables' | 'Fruits' | 'Meat & Seafood' | 'Dairy' | 'Dry Goods' | 'Condiments' | 'Spices' | 'Others';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  location: StorageLocation;
  purchaseDate: string; // ISO String
  expiryDate: string; // ISO String
  notes?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  category?: ItemCategory;
}

interface InventoryState {
  items: InventoryItem[];
  shoppingList: ShoppingItem[];
  isLoading: boolean;
  isLoaded: boolean;
  fetchData: () => Promise<void>;
  addItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateItem: (id: string, updatedItem: Partial<InventoryItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearItems: () => Promise<void>;
  addShoppingItem: (name: string, category?: ItemCategory) => Promise<void>;
  toggleShoppingItem: (id: string) => Promise<void>;
  removeShoppingItem: (id: string) => Promise<void>;
  clearShoppingList: () => Promise<void>;
}

// Helper to map DB snake_case to TS camelCase
const mapInventoryItem = (dbItem: any): InventoryItem => ({
  id: dbItem.id,
  name: dbItem.name,
  category: dbItem.category,
  location: dbItem.location,
  purchaseDate: dbItem.purchase_date,
  expiryDate: dbItem.expiry_date,
  notes: dbItem.notes,
});

export const useInventoryStore = create<InventoryState>()((set, get) => ({
  items: [],
  shoppingList: [],
  isLoading: false,
  isLoaded: false,

  fetchData: async () => {
    set({ isLoading: true });
    
    // Fetch Inventory
    const { data: invData, error: invError } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: true });
      
    // Fetch Shopping List
    const { data: shopData, error: shopError } = await supabase
      .from('shopping_list')
      .select('*')
      .order('created_at', { ascending: true });

    if (!invError && invData) {
      set({ items: invData.map(mapInventoryItem) });
    }
    
    if (!shopError && shopData) {
      set({ shoppingList: shopData as ShoppingItem[] });
    }
    
    set({ isLoading: false, isLoaded: true });
  },

  addItem: async (item) => {
    const { data, error } = await supabase.from('inventory').insert({
      name: item.name,
      category: item.category,
      location: item.location,
      purchase_date: item.purchaseDate,
      expiry_date: item.expiryDate,
      notes: item.notes
    }).select().single();

    if (!error && data) {
      set((state) => ({ items: [...state.items, mapInventoryItem(data)] }));
    } else {
      console.error("Failed to add item:", error);
    }
  },

  updateItem: async (id, updatedItem) => {
    // Optimistic UI update
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    }));

    const updatePayload: any = {};
    if (updatedItem.name !== undefined) updatePayload.name = updatedItem.name;
    if (updatedItem.category !== undefined) updatePayload.category = updatedItem.category;
    if (updatedItem.location !== undefined) updatePayload.location = updatedItem.location;
    if (updatedItem.purchaseDate !== undefined) updatePayload.purchase_date = updatedItem.purchaseDate;
    if (updatedItem.expiryDate !== undefined) updatePayload.expiry_date = updatedItem.expiryDate;
    if (updatedItem.notes !== undefined) updatePayload.notes = updatedItem.notes;

    const { error } = await supabase.from('inventory').update(updatePayload).eq('id', id);
    if (error) {
      console.error("Failed to update item:", error);
      // Ideally rollback state here if failed
    }
  },

  removeItem: async (id) => {
    // Optimistic UI update
    set((state) => ({
      items: state.items.filter((item) => item.id !== id)
    }));
    await supabase.from('inventory').delete().eq('id', id);
  },

  clearItems: async () => {
    set({ items: [] });
    // DANGER: In a real app we might not want to delete everything like this without a user_id
    // But for the prototype, we delete all
    await supabase.from('inventory').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
  },

  addShoppingItem: async (name, category) => {
    const state = get();
    const existingItem = state.shoppingList.find(i => i.name.toLowerCase() === name.toLowerCase());
    
    if (existingItem) {
      if (existingItem.checked) {
        // Optimistic
        set((state) => ({
          shoppingList: state.shoppingList.map(i => i.id === existingItem.id ? { ...i, checked: false } : i)
        }));
        await supabase.from('shopping_list').update({ checked: false }).eq('id', existingItem.id);
      }
      return;
    }

    const { data, error } = await supabase.from('shopping_list').insert({
      name,
      category,
      checked: false
    }).select().single();

    if (!error && data) {
      set((state) => ({ shoppingList: [...state.shoppingList, data as ShoppingItem] }));
    }
  },

  toggleShoppingItem: async (id) => {
    const item = get().shoppingList.find(i => i.id === id);
    if (!item) return;

    // Optimistic
    set((state) => ({
      shoppingList: state.shoppingList.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    }));

    await supabase.from('shopping_list').update({ checked: !item.checked }).eq('id', id);
  },

  removeShoppingItem: async (id) => {
    // Optimistic
    set((state) => ({
      shoppingList: state.shoppingList.filter((item) => item.id !== id)
    }));
    await supabase.from('shopping_list').delete().eq('id', id);
  },

  clearShoppingList: async () => {
    const itemsToRemove = get().shoppingList.filter(i => i.checked);
    set((state) => ({
      shoppingList: state.shoppingList.filter((item) => !item.checked)
    }));
    
    // Delete all checked items
    for (const item of itemsToRemove) {
      await supabase.from('shopping_list').delete().eq('id', item.id);
    }
  },
}));
