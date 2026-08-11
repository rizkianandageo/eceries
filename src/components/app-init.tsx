"use client";

import { useEffect } from "react";
import { useInventoryStore } from "@/store/useInventoryStore";

export function AppInit() {
  const fetchData = useInventoryStore(state => state.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return null;
}
