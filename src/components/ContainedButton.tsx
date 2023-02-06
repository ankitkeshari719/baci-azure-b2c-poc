import * as React from 'react';
import { Button, Typography } from '@mui/material';
import './styles.scss';

type Props = {
  name: string;
  onClick: (...param: any) => void;
  style?: any;
  disabled?: boolean;
};

export function ContainedButton({ name, onClick, style, disabled }: Props) {
  return (
    <Button
      variant="contained"
      className="containedButton"
      onClick={onClick}
      sx={{ ...style }}
      disabled={disabled}
    >
      <Typography className="saveButtonText" component="span">
        {name}
      </Typography>
    </Button>
  );
}
