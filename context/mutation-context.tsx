import React, { createContext, useContext, useRef, useCallback } from 'react';

type MutationContextType = {
  incrementPending: () => void;
  decrementPending: () => void;
  getPendingCount: () => number;
};

const MutationContext = createContext<MutationContextType | undefined>(
  undefined
);

export const MutationProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children
}) => {
  const pendingMutations = useRef(0);

  const incrementPending = useCallback(() => {
    pendingMutations.current += 1;
    console.log('Incremented: pendingMutations', pendingMutations.current);
  }, []);

  const decrementPending = useCallback(() => {
    pendingMutations.current -= 1;
    console.log('Decremented: pendingMutations', pendingMutations.current);
  }, []);

  const getPendingCount = useCallback(() => pendingMutations.current, []);

  return (
    <MutationContext.Provider
      value={{ incrementPending, decrementPending, getPendingCount }}
    >
      {children}
    </MutationContext.Provider>
  );
};

export const useMutationContext = () => {
  const context = useContext(MutationContext);
  if (context === undefined) {
    throw new Error(
      'useMutationContext must be used within a MutationProvider'
    );
  }
  return context;
};
