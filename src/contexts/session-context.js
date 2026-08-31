import { createContext } from 'react';

// The context object lives apart from its provider so the provider file exports
// only components. React Fast Refresh cannot refresh a module that exports both,
// so editing the provider used to force a full reload and drop app state.
export const SessionContext = createContext();
