"use client";

import { useState, useEffect } from "react";

export function useIsMac() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // navigator.platform устарел, но для простой проверки Mac подходит
    const platform = navigator.platform || "";
    setIsMac(/Mac|iPod|iPhone|iPad/.test(platform));
  }, []);

  return isMac;
}