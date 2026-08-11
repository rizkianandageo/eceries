"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs"; 
import { Camera, RefreshCw, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translateAIPrediction, AIDetectionResult } from "@/lib/ai-translator";

interface SmartCameraProps {
  onDetect: (result: AIDetectionResult) => void;
  onCancel: () => void;
}

export function SmartCamera({ onDetect, onCancel }: SmartCameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [prediction, setPrediction] = useState<AIDetectionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Load Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsInitializing(true);
        const net = await mobilenet.load({ version: 2, alpha: 0.5 });
        setModel(net);
      } catch (err) {
        console.error("Failed to load model", err);
        setErrorMsg("Failed to load AI Engine.");
      } finally {
        setIsInitializing(false);
      }
    };
    loadModel();
  }, []);

  // Continuous Detection Loop
  useEffect(() => {
    if (!model || prediction) return; // Stop scanning if we already found something

    let interval: NodeJS.Timeout;

    const detectFrame = async () => {
      if (!webcamRef.current || !webcamRef.current.video) return;
      const video = webcamRef.current.video;
      
      if (video.readyState === 4) { // HAVE_ENOUGH_DATA
        try {
          const predictions = await model.classify(video, 3);
          
          for (const pred of predictions) {
            // We only auto-detect if the AI is reasonably confident (>40%)
            if (pred.probability > 0.4) {
              const match = translateAIPrediction(pred.className);
              if (match) {
                setPrediction(match);
                // Auto-fill after a short delay so user can read the result
                setTimeout(() => {
                  onDetect(match);
                }, 1500); 
                break;
              }
            }
          }
        } catch (err) {
          console.error("Detection interval error:", err);
        }
      }
    };

    // Run detection every 800ms
    interval = setInterval(detectFrame, 800);

    return () => clearInterval(interval);
  }, [model, prediction, onDetect]);


  return (
    <div className="flex flex-col gap-4 bg-slate-900 rounded-2xl p-4 overflow-hidden relative">
      <div className="flex justify-between items-center text-white">
        <h3 className="font-bold flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          AI Camera
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-full">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] flex items-center justify-center border-2 border-slate-700">
        {isInitializing ? (
          <div className="flex flex-col items-center gap-3 text-slate-300">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-sm font-medium">Warming up AI Engine...</p>
          </div>
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="object-cover w-full h-full"
            />
            {/* Scanner overlay line - only animate while scanning */}
            {!prediction && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-0.5 bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
              </div>
            )}
            
            {/* Viewfinder corners */}
            <div className={`absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg transition-colors ${prediction ? 'border-emerald-500' : 'border-white/50'}`} />
            <div className={`absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg transition-colors ${prediction ? 'border-emerald-500' : 'border-white/50'}`} />
            <div className={`absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg transition-colors ${prediction ? 'border-emerald-500' : 'border-white/50'}`} />
            <div className={`absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 rounded-br-lg transition-colors ${prediction ? 'border-emerald-500' : 'border-white/50'}`} />
          </>
        )}
      </div>

      {prediction ? (
        <div className="bg-emerald-900/80 border border-emerald-500/50 rounded-xl p-4 flex flex-col items-center text-center gap-1 animate-in fade-in zoom-in duration-300">
          <Check className="w-8 h-8 text-emerald-400 mb-1" />
          <p className="text-white text-xl font-bold">{prediction.name}</p>
          <p className="text-emerald-300 text-xs font-medium">Auto-filling form...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {errorMsg && (
            <p className="text-rose-400 text-xs text-center font-medium bg-rose-950/50 p-2 rounded-lg">{errorMsg}</p>
          )}
          <div className="w-full h-12 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-medium text-sm">
            {!isInitializing && (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin text-emerald-500" /> Scanning automatically...</>
            )}
          </div>
        </div>
      )}

      {/* Helper scan animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(1000%); }
          100% { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
