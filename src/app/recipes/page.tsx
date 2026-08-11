"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryStore } from "@/store/useInventoryStore";
import { getRecommendedRecipes, scoreRecipes, MatchedRecipe, Recipe } from "@/lib/recipes";
import { calculateFreshness } from "@/lib/freshness";
import { ChefHat, Clock, AlertTriangle, CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, Frown, Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RecipesPage() {
  const { items } = useInventoryStore();
  const isLoaded = useInventoryStore((state) => state.isLoaded);
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiRecipes, setAiRecipes] = useState<MatchedRecipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const generateAIRecipe = async () => {
    if (items.length === 0) return;
    
    setIsGenerating(true);
    try {
      // Find expiring items
      const expiringItems = items.filter(item => {
        const fresh = calculateFreshness(item.expiryDate);
        return fresh.status === 'warning' || fresh.status === 'critical';
      });

      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, expiringItems })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Give each AI recipe a unique ID before scoring
      const rawRecipes: Recipe[] = data.recipes.map((r: any, idx: number) => ({
        ...r,
        id: `ai-${Date.now()}-${idx}`,
        emoji: r.emoji || "✨"
      }));

      // Score the AI recipes against the inventory exactly like default recipes
      const scoredAiRecipes = scoreRecipes(rawRecipes, items);

      setAiRecipes(scoredAiRecipes);
      if (scoredAiRecipes.length > 0) {
        setExpandedId(scoredAiRecipes[0].id);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  let displayRecipes = getRecommendedRecipes(items);
  if (aiRecipes.length > 0) {
    displayRecipes = [...aiRecipes, ...displayRecipes];
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayRecipes = displayRecipes.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.ingredients.some(ing => ing.toLowerCase().includes(q))
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200/50 mb-6">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-br from-emerald-600 to-teal-800 bg-clip-text text-transparent flex items-center gap-3">
            <ChefHat className="w-10 h-10 text-emerald-500" />
            Smart Recipes
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Cook with what you have. Reduce food waste!
          </p>
        </div>
        
        {items.length > 0 && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search recipes or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-12 rounded-xl border-2 border-slate-300 bg-white/50 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 w-full transition-all"
              />
            </div>
            <Button 
              onClick={generateAIRecipe} 
              disabled={isGenerating}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-200 transition-all font-semibold whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <Card className="bg-white/40 backdrop-blur-xl border-white/60 rounded-3xl overflow-hidden shadow-sm">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center">
            <Frown className="w-16 h-16 text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-600">Your fridge is empty</h2>
            <p className="text-slate-500 mt-2">Add some items to your inventory to get recipe recommendations.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {displayRecipes.map((recipe) => {
            const isAI = recipe.id.startsWith('ai-');
            return (
              <Card 
                key={recipe.id} 
                className={`backdrop-blur-xl transition-all duration-300 rounded-3xl overflow-hidden relative
                  ${isAI ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 shadow-emerald-100/50' : 
                    recipe.matchScore >= 80 ? 'bg-emerald-50/70 border-emerald-200/50 hover:shadow-emerald-200' : 'bg-white/70 border-white/50 hover:shadow-md'
                  }
                `}
              >
                {isAI && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-pulse"></div>
                )}
                <div 
                  className="p-6 cursor-pointer relative"
                  onClick={() => toggleExpand(recipe.id)}
                >
                  {/* Score Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border
                    ${isAI ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-md' :
                      recipe.matchScore === 100 ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' :
                      recipe.matchScore >= 50 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }
                  `}>
                    {isAI ? '✨ AI Generated' : recipe.matchScore === 100 ? '100% Match!' : `${recipe.matchScore}% Match`}
                  </div>

                  <div className="text-5xl mb-4">{recipe.emoji}</div>
                  <CardTitle className="text-xl text-slate-800 mb-2 pr-24 leading-tight">{recipe.title}</CardTitle>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{recipe.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-white/50 text-slate-600 border-slate-200 flex items-center gap-1 py-1">
                      <Clock className="w-3 h-3" /> {recipe.prepTime}
                    </Badge>
                    
                    {recipe.expiringIngredientsUsed.length > 0 && (
                      <Badge variant="outline" className="bg-amber-100/80 text-amber-700 border-amber-300 flex items-center gap-1 py-1">
                        <AlertTriangle className="w-3 h-3" /> Saves {recipe.expiringIngredientsUsed.length} expiring
                      </Badge>
                    )}
                    
                    {recipe.matchScore >= 80 && recipe.expiringIngredientsUsed.length > 0 && !isAI && (
                      <Badge variant="outline" className="bg-rose-100/80 text-rose-700 border-rose-300 flex items-center gap-1 py-1">
                        <Sparkles className="w-3 h-3" /> Top Pick
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/50 text-slate-400">
                    <span className="text-xs font-medium">
                      {recipe.matchedIngredients.length} / {recipe.ingredients.length} Ingredients
                    </span>
                    {expandedId === recipe.id ? (
                      <ChevronUp className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* EXPANDED CONTENT */}
                <div className={`overflow-hidden transition-all duration-300 bg-white/50
                  ${expandedId === recipe.id ? 'max-h-[1000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'}
                `}>
                  <div className="p-6 space-y-6">
                    {/* Ingredients Checklist */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Ingredients</h4>
                      <ul className="space-y-2">
                        {recipe.ingredients.map(ing => {
                          const hasIng = recipe.matchedIngredients.includes(ing);
                          const isExpiring = recipe.expiringIngredientsUsed.includes(ing);
                          
                          return (
                            <li key={ing} className="flex items-start gap-2 text-sm">
                              {hasIng ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                              )}
                              <span className={`${hasIng ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                                {ing}
                              </span>
                              {isExpiring && (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 rounded-sm uppercase tracking-wider ml-auto">
                                  Expiring
                                </span>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Instructions</h4>
                      <ol className="space-y-3">
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                            <span className="flex-none flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
