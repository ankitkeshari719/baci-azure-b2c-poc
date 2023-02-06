import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      light: '#159ADD',
      main: '#159ADD',
      dark: '#006db3',
    },
    secondary: {
      light: '#fff',
      main: '#fff',
      dark: '#fff',
    },
    info: {
      main: '#9EA6AC',
    },
    divider: '#CDCDD4',
  },
  typography: {
    body1: {
      fontFamily: `'Poppins'`,
    },
    body2: {
      fontFamily: `'Poppins', 'Arial', sans-serif`,
    },
    h1: {
      fontFamily: `'Poppins', 'Arial', sans-serif`,
      fontSize: '36px',
      fontWeight: '500',
      lineHeight: '48px',
      letterSpacing: ' 0.5px',
    },
    h2: {
      fontFamily: `'Poppins', 'Arial', sans-serif`,
      fontSize: '28px',
    },
    h3: {
      fontFamily: `'Poppins', 'Arial', sans-serif`,
      fontSize: '24px',
      lineHeight: '32px',
      letterSpacing: '0.5px'
    },
    h4: {
      fontFamily: `'Poppins', 'Arial', sans-serif`,
      fontSize: '20px',
    },
    h5: {
      fontFamily: `'Poppins'`,
      fontWeight: 600,
      fontSize: '18px',
      letterSpacing: ' 0.5px',
    },
    h6: {
      fontFamily: `'Poppins'`,
      fontWeight: 400,
      fontSize: '16px !important',
      letterSpacing: ' 0.6px',
    },
  },

  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    // MuiUseMediaQuery: {
    //   defaultProps: {
    //     ssrMatchMedia,
    //   },
    // },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#081627',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&& .Mui-selected': {
            // this is to refer to the prop provided by M-UI
            backgroundColor: 'white', // updated backgroundColor
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid',
          '&:before': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
          },
          '&:after': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
          },
          '&:hover:not': {
            borderBottom: 'none',
          },
          '&:focus': {
            backgroundColor: 'white',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(97, 97, 97, 0.92)',
          borderRadius: ['8px', '4px'],
          color: '#fff',
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          padding: '4px 8px',
          fontSize: '14px',
          maxWidth: '300px',
          margin: '2px',
          wordWrap: 'break-word',
          fontWeight: 500,
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        displayEmpty: true,
        variant: 'outlined',
      },
      styleOverrides: {
        select: {
          '&:MuiSelect-select-MuiInputBase-input-MuiInput-input:focus': {
            background: 'white',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          margin: '0 16px',
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up('md')]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    // MuiTooltip: {
    //   styleOverrides: {
    //     tooltip: {
    //       borderRadius: 4,
    //     },
    //   },
    // },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(255,255,255,0.15)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#4fc3f7',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 'auto',
          marginRight: theme.spacing(2),
          '& svg': {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

export default theme;

export const drawerWidth = 256;

export const lightColor = 'rgba(255, 255, 255, 0.7)';
