"use client";

import React, { createContext, useContext, useState } from "react";
import EditModeToggle from "./EditModeToggle";

interface EditModeContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModeContext = createContext<EditModeContextType>({
  isAdmin: false,
  isEditMode: false,
  setIsEditMode: () => {},
});

export function useEditMode() {
  return useContext(EditModeContext);
}

export function EditModeProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const [isEditMode, setIsEditMode] = useState(false);

  // If visitor is not an admin, render plain children with zero edit UI or listeners
  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <EditModeContext.Provider value={{ isAdmin, isEditMode, setIsEditMode }}>
      {children}
      <EditModeToggle />
    </EditModeContext.Provider>
  );
}
