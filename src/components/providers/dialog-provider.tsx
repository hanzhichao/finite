"use client"

import { useEffect, useState } from "react";
import { SettingsModal } from "@/components/dialogs/settings-dialog";
import {CoverPicker} from "@/components/dialogs/cover-picker";

export const DialogProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
      <CoverPicker />
    </>
  );
};
