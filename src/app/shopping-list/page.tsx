"use client";

import { useState, useEffect } from "react";
import { useInventoryStore } from "@/store/useInventoryStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, CheckCircle2, Circle, Trash2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { ALL_SUGGESTIONS } from "@/lib/constants";

export default function ShoppingListPage() {
  const { shoppingList, addShoppingItem, toggleShoppingItem, removeShoppingItem, clearShoppingList } = useInventoryStore();
  const [newItemName, setNewItemName] = useState("");
  const isLoaded = useInventoryStore((state) => state.isLoaded);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const toBuyList = shoppingList.filter((item) => !item.checked);
  const boughtList = shoppingList.filter((item) => item.checked);

  const filteredSuggestions = newItemName.length > 0 
    ? ALL_SUGGESTIONS.filter(item => 
        item.toLowerCase().includes(newItemName.toLowerCase()) && 
        item.toLowerCase() !== newItemName.toLowerCase()
      ).slice(0, 5)
    : [];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addShoppingItem(newItemName.trim());
      setNewItemName("");
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-6 text-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-emerald-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-emerald-500" />
            Shopping List
          </h1>
          <p className="text-slate-600 font-medium mt-1">
            Keep track of what you need to restock.
          </p>
        </div>
        
        {boughtList.length > 0 && (
          <Button 
            onClick={() => clearShoppingList()} 
            variant="outline" 
            className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Bought Items
          </Button>
        )}
      </div>

      <Card className="bg-white/60 backdrop-blur-md border-white/60 shadow-md">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleAddItem} className="flex gap-2">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="E.g., Milk, Eggs, Apple..."
              className="h-12 rounded-xl border-slate-200 focus-visible:ring-emerald-500 font-sans text-lg bg-white/80 backdrop-blur-sm"
            />
            <Button type="submit" className="h-12 rounded-xl px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">
              <Plus className="w-5 h-5 mr-1" />
              Add
            </Button>
          </form>

          {filteredSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 p-3 bg-white/40 rounded-xl border border-white/60">
              <p className="w-full text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Suggestions:
              </p>
              {filteredSuggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => {
                    addShoppingItem(sug);
                    setNewItemName("");
                  }}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/80 border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 h-[calc(100vh-220px)] min-h-[500px]">
        {/* TO BUY COLUMN */}
        <div className="flex flex-col h-full bg-slate-100/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-sm overflow-hidden">
          <div className="flex-none p-5 bg-white/40 border-b border-white/50 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-xl font-extrabold flex items-center gap-2 text-emerald-900">
              <span className="text-2xl">📝</span> To Buy
            </h2>
            <div className="px-3 py-1 bg-emerald-100/80 text-emerald-800 font-bold text-sm rounded-full shadow-inner border border-emerald-200/50">
              {toBuyList.length} {toBuyList.length === 1 ? 'Item' : 'Items'}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {toBuyList.length === 0 ? (
              <Card className="bg-white/40 backdrop-blur-md border-white/60 rounded-3xl">
                <CardContent className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
                  <div className="text-5xl mb-4 opacity-50">📝</div>
                  <p>Your list is empty.</p>
                  <p className="text-sm mt-2">Add items to buy above.</p>
                </CardContent>
              </Card>
            ) : (
              toBuyList.map((item) => (
                <Card key={item.id} className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 group rounded-xl overflow-hidden relative hover:scale-[1.01]">
                  <CardContent className="py-1.5 px-3 flex items-center justify-between">
                    <button 
                      onClick={() => toggleShoppingItem(item.id)}
                      className="flex items-center gap-2.5 flex-1 text-left"
                    >
                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-colors shrink-0" />
                      <span className="font-semibold text-lg text-slate-700">{item.name}</span>
                    </button>
                    
                    <button 
                      onClick={() => removeShoppingItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 transition-colors ml-2 shrink-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* BOUGHT COLUMN */}
        <div className="flex flex-col h-full bg-slate-100/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-sm overflow-hidden">
          <div className="flex-none p-5 bg-white/40 border-b border-white/50 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-700">
              <span className="text-2xl">✅</span> Bought
            </h2>
            <div className="px-3 py-1 bg-slate-200/80 text-slate-600 font-bold text-sm rounded-full shadow-inner border border-slate-300/50">
              {boughtList.length} {boughtList.length === 1 ? 'Item' : 'Items'}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {boughtList.length === 0 ? (
              <Card className="bg-white/40 backdrop-blur-md border-white/60 rounded-3xl">
                <CardContent className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
                  <div className="text-5xl mb-4 opacity-50">✅</div>
                  <p>No items bought yet.</p>
                </CardContent>
              </Card>
            ) : (
              boughtList.map((item) => (
                <Card key={item.id} className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 group rounded-xl overflow-hidden relative hover:scale-[1.01]">
                  <CardContent className="py-1.5 px-3 flex items-center justify-between">
                    <button 
                      onClick={() => toggleShoppingItem(item.id)}
                      className="flex items-center gap-2.5 flex-1 text-left"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="font-medium text-lg text-slate-400 line-through decoration-slate-300">{item.name}</span>
                    </button>
                    
                    <div className="flex items-center gap-1">
                      <Link 
                        href={`/?prefillName=${encodeURIComponent(item.name)}`}
                        className="text-slate-400 hover:text-emerald-600 p-1.5 rounded-full hover:bg-emerald-50 transition-colors shrink-0"
                        title="Move to Inventory"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => removeShoppingItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
