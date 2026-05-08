import React, { createContext, ReactNode } from 'react';

type ContentContextType = object;

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Add your context state here
  const value: ContentContextType = {
    // Initialize your context values
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

