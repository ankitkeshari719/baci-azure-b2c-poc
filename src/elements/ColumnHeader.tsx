import { Grid, TextField, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { ActionType } from '../contexts/GlobalContext';
import { Column } from '../types';

const ColumnHeader = ({column ,columnId,columnName,noHeader,groupFontColour,global,ended,leftHeaderComponent,value,submitColumnName,setColumnName,publishColumn,dispatch}:{
    column : Column ,columnId:string,columnName:string,noHeader:any,groupFontColour:string|undefined,global:any,ended:boolean,leftHeaderComponent:any,value:string,submitColumnName:(columnName:string)=>void,setColumnName:(columnName:string)=>void,publishColumn:(flag:boolean)=>void,dispatch:any
}) => {
    return (
        <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              item
              xs={12}
              md={12}
              lg={12}
            >
              <Grid item lg={8} md={6} xs={6}>
                <Tooltip title={columnName}>
                  <div>
                    {!noHeader && (
                      <Grid
                        
                        style={{
                          userSelect: 'none',
                          display: 'flex',
                          color: groupFontColour + '!important',
                          fontSize: '16px',
                          padding: '10px',
                          alignItems:"center"
                        }}
                      >
                        {global.user.userType == 2 &&
                          (!ended || !global.leaveRetro) ? (
                          <>
                            {' '}
                            {/* {leftHeaderComponent} */}
                            <TextField
                              maxRows={2}
                              sx={{
                                fieldset: { border: 'none' },
                                flex: 10,
                                // padding: '10px',
                                div: { padding: 0, position: 'initial' },
                                textarea: {
                                  // textAlign: 'center',
                                  color: groupFontColour + '!important',
                                  fontSize: '16px',
                                  fontWeight: 600,
                                },

                                position: 'initial',
                                display: 'flex',
                                // alignItems: 'center',
                                // justifyContent: 'left',
                              }}
                              inputProps={{ maxLength: 150 }}
                              multiline
                              fullWidth
                              value={columnName}
                              onKeyDown={e => {
                              
                                if (e.keyCode === 13 && value.length!=0 ) {
                                  submitColumnName(columnName);
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              onChange={e =>
                                setColumnName(e.currentTarget.value)
                              }
                              onBlur={() => submitColumnName(columnName)}
                              onSubmit={() => submitColumnName(columnName)}
                            ></TextField>
                            {/* {rightHeaderComponent} */}
                          </>
                        ) : (
                          <Typography
                            noWrap
                            sx={{
                         
                              width: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'flex',
                              color: groupFontColour + '!important',
                           
                            }}
                          >
                            {columnName}
                          </Typography>
                        )}
                      </Grid>
                    )}
                  </div>
                </Tooltip>
              </Grid>

              <Grid
                container
                justifyContent="flex-end"
                direction="row"
                item
                lg={4}
                md={5}
                xs={5}
              >
                {global.user.userType == 2 && (!ended || !global.leaveRetro) && (
                  <>
                    {column.publish ? (
                      <Typography style={{ color: '#808080' }}>
                        Published
                      </Typography>
                    ) : (
                      <Typography
                        id={'publish' + columnId}
                        onClick={() => {
                          if (!ended) {
                            publishColumn(true);
                          }
                        }}
                        // onTouchStart={() => {
                        //   if (!ended) {
                        //     publishColumn(true);
                        //   }
                        // }}
                        sx={{
                          color: '#159ADD',
                          textDecorationLline: 'underline',
                          cursor: !ended ? 'pointer' : 'auto',
                          display: !ended ? 'flex' : "none"
                        }}
                      >
                        Publish
                      </Typography>
                    )}
                  </>
                )}
             
                {global.expandColumn === -1 ? (
                  <img
                    onClick={() => {
                      dispatch({
                        type: ActionType.EXPAND_COLUMN,
                        payload: { expandColumn: +column.id },
                      });
                    }}
                    src="/svgs/Expand.svg"
                    style={{
                      width: '20px',
                      marginLeft: '15px',
                      cursor: 'pointer',
                    }}
                  />
                ) : (
                  <img
                    onClick={() => {
                      dispatch({
                        type: ActionType.EXPAND_COLUMN,
                        payload: { expandColumn: -1 },
                      });
                    }}
                    src="/svgs/Shrink.svg"
                    style={{
                      width: '20px',
                      marginLeft: '15px',
                      cursor: 'pointer',
                    }}
                  />
                )}
              </Grid>
            </Grid>
    );
};

export default ColumnHeader;