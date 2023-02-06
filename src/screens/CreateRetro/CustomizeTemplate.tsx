import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { TopBar } from './TopBar';
import Slider from 'react-slick';
import { settings } from './SliderConst';
import * as Icons from 'heroicons-react';

type Props = {
  closeCustomTemplateDialog: () => void;
  selectedTemplate: any;
  handleSelectClick: (selectedTemplateId: string) => void;
};

export function CustomizeTemplate({
  closeCustomTemplateDialog,
  selectedTemplate,
  handleSelectClick,
}: Props) {
  const [tempSelectedTemplate, setTempSelectedTemplate] = React.useState<any>();

  React.useEffect(() => {
    setTempSelectedTemplate(selectedTemplate);
  }, []);

  const handleColumnNameChange = (
    value: React.SetStateAction<string>,
    columnId: string
  ) => {
    let data: any = tempSelectedTemplate.columns?.map((column: any) => {
      if (column.id === columnId) {
        column.name = value;
      }
      return column;
    });
    setTempSelectedTemplate({ ...tempSelectedTemplate, columns: [...data] });
  };

  return (
    <Box className="mainContainer">
      <TopBar />
      <Grid container spacing={0} className="retroContainer">
        {/* About Template */}
        <Grid item xs={12}>
          <Box component="div" whiteSpace="normal" className="createRetroText">
            Customize Template
          </Box>
        </Grid>
        {/* App bar */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <AppBar position="static" className="learnMoreAppBar">
            <Toolbar
              variant="dense"
              sx={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '0px !important',
              }}
            >
              <Icons.ArrowCircleLeftOutline
                size={20}
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'block',
                  right: '0px',
                  color: '#159ADD',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
                onClick={closeCustomTemplateDialog}
              />
              <Typography
                sx={{ ml: 1, flex: 1 }}
                component="div"
                className="selectedTemplate"
              >
                {tempSelectedTemplate && tempSelectedTemplate.templateName}
              </Typography>
              <Button
                autoFocus
                variant="contained"
                className="saveButton"
                onClick={() => handleSelectClick(selectedTemplate.templateId)}
              >
                <Typography className="saveButtonText" component="span">
                  Select
                </Typography>
              </Button>
            </Toolbar>
          </AppBar>
        </Grid>
        {/* Columns */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Box component="div" whiteSpace="normal">
            <Slider {...settings}>
              {tempSelectedTemplate &&
                tempSelectedTemplate.columns.map((column: any) => {
                  return (
                    <Box
                      key={column.id}
                      component="div"
                      whiteSpace="normal"
                      sx={{
                        width: '376px !important',
                        height: '500px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        background: column.cardColor,
                        border: '1px solid ' + column.groupFontColor,
                        borderRadius: '8px',
                      }}
                    >
                      <Box
                        component="div"
                        whiteSpace="normal"
                        sx={{
                          width: '100%',
                          height: '48px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: '9px 9px 0px 0px',
                          background: column.groupColor,
                        }}
                      >
                        <TextField
                          maxRows={2}
                          inputProps={{ maxLength: 150 }}
                          multiline
                          fullWidth
                          value={column.name}
                          sx={{
                            fieldset: { border: 'none' },
                            textarea: {
                              color: column.groupFontColor + '!important',
                              fontSize: '16px',
                              fontWeight: 600,
                              fontFamily: 'Poppins',
                              fontStyle: 'normal',
                              lineHeight: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              letterSpacing: '0.6px',
                            },
                          }}
                          onChange={e =>
                            handleColumnNameChange(
                              e.currentTarget.value,
                              column.id
                            )
                          }
                        />
                      </Box>
                    </Box>
                  );
                })}
            </Slider>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
