import React, { ComponentProps } from 'react';

import ErrorDialog from '../atoms/ErrorDialog';

export interface ErrorContextType {
  error: string | undefined;
  setError: (error: string) => void;
}

const ErrorContext = React.createContext<ErrorContextType>({
  error: undefined,
  setError: error => {},
});

function ErrorProvider(props: ComponentProps<any>) {
  const [error, setError] = React.useState<string | undefined>(undefined);
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {error ? <ErrorDialog /> : null}
      {props.children}
    </ErrorContext.Provider>
  );
}

export { ErrorProvider, ErrorContext };
