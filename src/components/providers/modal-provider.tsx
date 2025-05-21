"use client"
import { SettingsModal } from "@/components/dialogs/settings-dialog";
import { useEffect, useState } from "react";
import { CoverImageModal } from "../dialogs/cover-image-dialog";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true), [];
  });

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  );
};
