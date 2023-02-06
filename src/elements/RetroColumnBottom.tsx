import { Button, Grid, TextField, Typography } from '@mui/material';
import { Box,styled } from '@mui/system';
import EmojiPicker from 'emoji-picker-react';
import React from 'react';
import { MAX_CARD_TEXT_LENGTH, UNGROUPED } from '../constants';
import SendIcon from '@mui/icons-material/Send';
import { Column } from '../types';
const TextFieldNoBorderWrapper = styled('div')({
    '.MuiInputBase-multiline': {
      paddingLeft: '10px',
      paddingRight: '10px',
    },
    alignItems: 'center',
    position: 'initial',
    display: 'flex',
    maxWidth: '135px',
    fieldset: {
      border: 'none',
    },
    input: {
      padding: 0,
    },
  });
const RetroColumnBottom = ({isXsUp,columnId,column,global,ended,value,setValue,setEmojiId,focusTextBox,setMouseOver,submit}:{
    isXsUp:boolean,columnId:string,column:Column,global:any,ended:boolean,value:any,setValue:(value:any)=>void,setEmojiId:(id:string)=>void,
    focusTextBox:()=>void,setMouseOver:(flag:boolean)=>void,submit:(value:any)=>void
}) => {
    const [valueSet, setValueSet] = React.useState(false);

    return (
        <div>
             {!isXsUp && (
            <Grid
              style={{
                // display: 'flex',
                width:
                  document.getElementById(columnId + "0") != null
                    ? document
                      .getElementById(columnId + "0")
                      ?.getBoundingClientRect().width + 'px'
                    : '33px',
                zIndex: 2,
                position: 'absolute',
                bottom: '65px',
                display: columnId == global.emojiId ? 'flex' : 'none',
              }}
            >
              <EmojiPicker
                onEmojiClick={(event, emojiObject) => {
                  console.log(emojiObject, "emoji's selected");
                  setValueSet(true);
                  setValue(value + emojiObject.emoji);
                  setEmojiId('');
                  focusTextBox()

                }}

                pickerStyle={{ width: '100%' }}
              />
            </Grid>
          )}
          {
            !ended && !global.leaveRetro && (
              <Box
                id={columnId + "0"}
                style={{
                  background: 'white',
                  borderRadius: '0px 0px 8px 8px',
                  // margin: '3px',
                  borderTop: '1px solid #F0F0F0',
                  bottom: '0px',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  ...(false
                    ? { position: 'fixed', width: '100vw', height: '8rem' }
                    : {}),
                }}
                onMouseOver={() => {
                  setMouseOver(true);
                }}
                onMouseOut={() => {
                  setMouseOver(true);
                }}
              >
                {!isXsUp && (
                  <img
                    src="/images/Emoji.png"
                    style={{
                      height: '25px',
                      width: '25px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (
                        global.emojiId == '' ||
                        global.emojiId != columnId
                      ) {
                        console.log("columnId", columnId)
                        // setEmojiPicker(columnId);
                        // setShowEmojisOfColumn(columnId);

                        setEmojiId("");
                        setEmojiId(columnId);
                        focusTextBox()
                      } else {
                        // setEmojiPicker('');
                        // setShowEmojisOfColumn('');
                        setEmojiId('');
                        focusTextBox()
                      }
                    }}
                  ></img>
                )}
                {/* <img src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f627.png" /> */}
                <TextFieldNoBorderWrapper
                  sx={{
                    color: '#8E8E8E',
                    flexGrow: 10,
                    maxWidth: 'unset',
                    flexDirection: 'column',
                  }}
                >
                  <TextField
                    id={"textField" + columnId}
                    fullWidth
                    multiline
                    inputProps={{
                      maxLength: MAX_CARD_TEXT_LENGTH,
                      style: {
                        padding: 0,
                      },
                    }}
                    autoFocus={!isXsUp || column.groups.length != 0}
                    sx={{
                      padding: 0,
                      input: { padding: 0 },
                      div: { padding: 0, position: 'initial' },
                      position: 'initial',
                      textarea: {
                        fontStyle: valueSet ? 'normal' : 'italic',
                        color: valueSet ? '#000' : '#8D858A',
                      },
                    }}
                    value={valueSet ? value : 'Add your thoughts...'}
                    onChange={event => {
                      if (event.target.value !== ' ')
                        setValue(event.target.value);
                    }}
                    onFocus={event => {
                      setValueSet(true);
                      if (global.emojiId != '') setEmojiId('');
                    }}
                    onBlur={() => {
                      if (!value) {
                        setValueSet(false);
                      }
                    }}
                    onKeyDown={e => {
                      const tempValue = value;
                      const removedEnter = tempValue.replace(/[\r\n]/gm, '');
                      setValue(removedEnter);
                      const removedSpaces = removedEnter.replace(/ /g, '');
                      if (
                        e.keyCode === 13 &&
                        removedSpaces &&
                        removedSpaces.length !== 0
                      ) {
                        submit(value);
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                  ></TextField>
                  {value && value.length >= MAX_CARD_TEXT_LENGTH - 20 ? (
                    <Typography
                      style={{
                        fontSize: '0.75rem',
                        textAlign: 'right',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Characters remaining:{' '}
                      {MAX_CARD_TEXT_LENGTH - value.length}
                    </Typography>
                  ) : null}
                </TextFieldNoBorderWrapper>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexDirection: 'column',
                  }}
                >
                  <Button
                    style={{ position: 'initial' }}
                    disabled={
                      // !value ||value.replace(/ /g, '').length === 0||
                      value.length === 0 ||
                      !value ||
                      value.replace(/[\r\n]/gm, '').replace(/ /g, '')
                        .length === 0
                    }
                    onClick={() => submit(value)}
                  // onTouchStart={() => submit(value)}
                  >
                    <SendIcon></SendIcon>
                  </Button>
                </div>
              </Box>
            )
            // ) : null
          }
        </div>
    );
};

export default RetroColumnBottom;