import { createContext, useContext, useState, ReactNode } from "react";
import { JSX } from "react";

interface SousPage {
  name: string;
  link: string | (() => void);
  icon: JSX.Element;
}

interface BreadcrumbContextType {
  sousPages: SousPage[];
  setSousPages: (pages: SousPage[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [sousPages, setSousPages] = useState<SousPage[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ sousPages, setSousPages }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  return context;
};
