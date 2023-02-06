import React, { ComponentProps } from 'react';

import ConfirmDialog from '../atoms/ConfirmDialog';

export interface ConfirmAction {
  onConfirm: () => void;
  title: string;
  text: string;
  action: string;
}

type ContextType = {
  confirmAction?: ConfirmAction;
  setConfirmAction: (confirmAction?: ConfirmAction) => void;
};

const ConfirmContext = React.createContext<ContextType>({
  confirmAction: {} as ConfirmAction,
  setConfirmAction: () => {},
});

function ConfirmProvider(props: ComponentProps<any>) {
  const [confirmAction, setConfirmAction] = React.useState<
    ConfirmAction | undefined
  >(undefined);

  return (
    <ConfirmContext.Provider value={{ confirmAction, setConfirmAction }}>
      <ConfirmDialog
        show={!!confirmAction}
        title={confirmAction?.title || ''}
        text={confirmAction?.text || ''}
        action={confirmAction?.action || ''}
        onCancel={() => setConfirmAction(undefined)}
        onConfirm={() => confirmAction?.onConfirm()}
      />

      {props.children}
    </ConfirmContext.Provider>
  );
}

export { ConfirmProvider, ConfirmContext };
