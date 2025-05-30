"use client"

import { useEffect, useState } from "react";
import { SettingsDialog } from "@/components/dialogs/settings-dialog";
import {CoverPickerDialog} from "@/components/dialogs/cover-picker-dialog";
import {ImportDialog} from "@/components/dialogs/import-dialog";
import {gradients} from "@/lib/consts"

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
      <SettingsDialog />
      <CoverPickerDialog gradients={gradients} />
      <ImportDialog />
    </>
  );
};
