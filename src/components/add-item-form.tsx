"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Apple, Box, MapPin, CalendarDays, CalendarClock, PenLine, Sparkles, Camera, Archive, Refrigerator, Snowflake } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useInventoryStore, ItemCategory, StorageLocation } from "@/store/useInventoryStore";
import { getSmartShelfLife } from "@/lib/smart-expiration";
import { SmartCamera } from "@/components/smart-camera";
import { AIDetectionResult } from "@/lib/ai-translator";
import { ITEM_SUGGESTIONS, ALL_SUGGESTIONS } from "@/lib/constants";

const formSchema = z.object({
  name: z.string().min(2, "Item name must be at least 2 characters"),
  category: z.enum(["Vegetables", "Fruits", "Meat & Seafood", "Dairy", "Dry Goods", "Condiments", "Spices", "Others"]),
  location: z.enum(["Pantry", "Chiller", "Freezer"]),
  purchaseDate: z.string(),
  expiryDate: z.string(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CATEGORIES: ItemCategory[] = ["Vegetables", "Fruits", "Meat & Seafood", "Dairy", "Dry Goods", "Condiments", "Spices", "Others"];
const LOCATIONS: StorageLocation[] = ["Pantry", "Chiller", "Freezer"];

export function AddItemForm({ onSuccess, prefillName }: { onSuccess?: () => void, prefillName?: string }) {
  const addItem = useInventoryStore((state) => state.addItem);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: prefillName || "",
      category: "Meat & Seafood",
      location: "Chiller",
      purchaseDate: format(new Date(), "yyyy-MM-dd"),
      expiryDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"), // Default 7 days
      notes: "",
    },
  });

  const categoryValue = watch("category") as ItemCategory;
  const locationValue = watch("location") as StorageLocation;
  const nameValue = watch("name");
  const purchaseDateValue = watch("purchaseDate");
  const expiryDateValue = watch("expiryDate");

  const [autoDays, setAutoDays] = useState<number>(7);
  const [smartWarning, setSmartWarning] = useState<string | null>(null);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  // Popover states for auto-closing
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isExpiryOpen, setIsExpiryOpen] = useState(false);

  // Reset manual override if user changes item details
  useEffect(() => {
    setIsManualOverride(false);
  }, [nameValue, categoryValue, locationValue]);

  useEffect(() => {
    if (!isManualOverride && (nameValue || categoryValue || locationValue)) {
      const result = getSmartShelfLife(nameValue || "", categoryValue, locationValue);
      setAutoDays(result.days);
      setSmartWarning(result.warning || null);
      const pDate = purchaseDateValue ? new Date(purchaseDateValue) : new Date();
      const newExpiry = new Date(pDate.getTime() + result.days * 24 * 60 * 60 * 1000);
      setValue("expiryDate", format(newExpiry, "yyyy-MM-dd"), { shouldValidate: true });
    } else if (isManualOverride && (nameValue || categoryValue || locationValue)) {
      const result = getSmartShelfLife(nameValue || "", categoryValue, locationValue);
      setSmartWarning(result.warning || null);
    }
  }, [nameValue, categoryValue, locationValue, purchaseDateValue, setValue, isManualOverride]);

  // Update name if prefillName changes and form hasn't been touched much
  useEffect(() => {
    if (prefillName && nameValue === "") {
      setValue("name", prefillName, { shouldValidate: true });
    }
  }, [prefillName, setValue, nameValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    addItem({
      name: data.name,
      category: data.category as ItemCategory,
      location: data.location as StorageLocation,
      purchaseDate: new Date(data.purchaseDate).toISOString(),
      expiryDate: new Date(data.expiryDate).toISOString(),
      notes: data.notes,
    });
    
    setIsSubmitting(false);
    toast.success(`${data.name} added successfully!`);
    if (onSuccess) onSuccess();
  };

  // Determine which suggestions to show
  const isTyping = nameValue && nameValue.trim().length > 0;
  const displaySuggestions = isTyping 
    ? ALL_SUGGESTIONS.filter(item => 
        item.toLowerCase().includes(nameValue.toLowerCase()) && 
        item.toLowerCase() !== nameValue.toLowerCase()
      ).slice(0, 8)
    : (categoryValue ? ITEM_SUGGESTIONS[categoryValue] || [] : []);

  // Helper to find category of a suggestion
  const getCategoryForSuggestion = (suggestionName: string): ItemCategory | null => {
    for (const [cat, items] of Object.entries(ITEM_SUGGESTIONS)) {
      if (items.includes(suggestionName)) return cat as ItemCategory;
    }
    return null;
  };

  if (isCameraOpen) {
    return (
      <div className="px-4 pb-8 sm:px-6">
        <SmartCamera 
          onCancel={() => setIsCameraOpen(false)}
          onDetect={(result: AIDetectionResult) => {
            setValue("category", result.category as any, { shouldValidate: true });
            setValue("name", result.name, { shouldValidate: true });
            setIsCameraOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 pb-8 sm:px-6">
      
      <Button 
        type="button"
        variant="outline"
        onClick={() => setIsCameraOpen(true)}
        className="w-full h-12 rounded-xl border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 shadow-sm transition-all"
      >
        <Camera className="w-5 h-5 mr-2" />
        Scan with AI Camera
      </Button>

      <div className="space-y-2">
        <Label htmlFor="category" className="flex items-center gap-2 text-slate-700 font-semibold">
          <Box className="w-4 h-4 text-emerald-500" />
          Category
        </Label>
        <Select onValueChange={(val) => setValue("category", val as any, { shouldValidate: true })} value={categoryValue}>
          <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 focus:ring-emerald-500">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2 text-slate-700 font-semibold">
          <Apple className="w-4 h-4 text-emerald-500" />
          Item Name
        </Label>
        <Input 
          id="name" 
          placeholder="e.g., Apple, Chicken, Milk..." 
          {...register("name")}
          className="h-12 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        
        {displaySuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
            <p className="w-full text-xs font-semibold text-emerald-600 mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Suggested Items:
            </p>
            {displaySuggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => {
                  setValue("name", sug, { shouldValidate: true });
                  const cat = getCategoryForSuggestion(sug);
                  if (cat) {
                    setValue("category", cat, { shouldValidate: true });
                  }
                }}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm"
              >
                {sug}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2 text-slate-700 font-semibold">
          <MapPin className="w-4 h-4 text-emerald-500" />
          Storage Location
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {LOCATIONS.map((loc) => {
            const isSelected = locationValue === loc;
            
            // Define icons based on location
            let Icon = MapPin;
            if (loc === "Pantry") Icon = Archive;
            if (loc === "Chiller") Icon = Refrigerator;
            if (loc === "Freezer") Icon = Snowflake;

            return (
              <button
                key={loc}
                type="button"
                onClick={() => setValue("location", loc as any, { shouldValidate: true })}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 shadow-sm outline-none",
                  isSelected 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500" 
                    : "bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-emerald-50/50"
                )}
              >
                <Icon className={cn("w-6 h-6", isSelected ? "text-emerald-500" : "text-slate-400")} />
                <span className="text-xs font-semibold">{loc}</span>
              </button>
            )
          })}
        </div>
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate" className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <CalendarDays className="w-4 h-4 text-emerald-500" />
            Purchase Date
          </Label>
          <Popover open={isPurchaseOpen} onOpenChange={setIsPurchaseOpen}>
            <PopoverTrigger render={
              <Button variant="outline" className="w-full h-12 rounded-xl border border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 font-sans flex items-center px-3 bg-white text-slate-700 outline-none hover:bg-slate-50 transition-colors overflow-hidden">
                <span className="flex-1 text-left truncate">
                  {purchaseDateValue ? format(new Date(purchaseDateValue), "PP") : "Select date"}
                </span>
              </Button>
            } />
            <PopoverContent className="w-auto p-0 z-50">
              <Calendar
                mode="single"
                selected={purchaseDateValue ? new Date(purchaseDateValue) : undefined}
                onSelect={(d) => {
                  if (d) {
                    setValue("purchaseDate", format(d, "yyyy-MM-dd"), { shouldValidate: true });
                    setIsPurchaseOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.purchaseDate && <p className="text-red-500 text-sm mt-1">{errors.purchaseDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate" className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <CalendarClock className="w-4 h-4 text-emerald-500" />
            Expiry Date
          </Label>
          <div className="relative">
            <Popover open={isExpiryOpen} onOpenChange={setIsExpiryOpen}>
              <PopoverTrigger render={
                <Button variant="outline" className={cn("w-full h-12 rounded-xl border border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 font-sans flex items-center px-3 bg-white text-slate-700 outline-none hover:bg-slate-50 transition-colors overflow-hidden", !isManualOverride && "text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/50")}>
                  <span className="flex-1 text-left truncate">
                    {expiryDateValue ? format(new Date(expiryDateValue), "PP") : "Select date"}
                  </span>
                  {!isManualOverride && (
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse ml-2" />
                  )}
                </Button>
              } />
              <PopoverContent className="w-auto p-0 z-50">
                <Calendar
                  mode="single"
                  selected={expiryDateValue ? new Date(expiryDateValue) : undefined}
                  onSelect={(d) => {
                    if (d) {
                      setValue("expiryDate", format(d, "yyyy-MM-dd"), { shouldValidate: true });
                      setIsManualOverride(true);
                      setIsExpiryOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>}
          {!isManualOverride && (
            <p className="text-xs text-emerald-600 font-medium">✨ Auto: {autoDays} Days</p>
          )}
        </div>
      </div>

      {smartWarning && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
          <span className="text-rose-500 text-lg leading-none">⚠️</span>
          <p className="text-sm text-rose-700 font-medium leading-tight">
            {smartWarning}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center gap-2 text-slate-700 font-semibold">
          <PenLine className="w-4 h-4 text-emerald-500" />
          Notes <span className="text-slate-400 font-normal">(Optional)</span>
        </Label>
        <Input 
          id="notes" 
          placeholder="e.g., Use for soup" 
          {...register("notes")}
          className="h-12 rounded-xl border-slate-200 focus-visible:ring-emerald-500"
        />
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Item"}
        </Button>
      </div>
    </form>
  );
}
