import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  keyframes,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import './RetroCard.scss';
import { NestedDropdown } from 'mui-nested-menu';
import { MAX_CARD_TEXT_LENGTH, UNGROUPED } from '../../constants';
import { BoardContext } from '../../contexts/BoardContext';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import { Card as RetroCardType, CardGroup } from '../../types';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForever from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import ThumbUpOffAlt from '@mui/icons-material/ThumbUpOffAlt';
import Color from 'color';
import React, { useEffect } from 'react';
import shortid from 'shortid';
import { ConfirmContext } from '../../contexts/ConfirmContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import theme from '../../theme/theme';
import Avatar from '../Avatar';

const bumpAnimation = keyframes`
    0% {
      opacity: 0;
      transform: scale(100%);
    }
    50% {
        transform: scale(110%);
    }
    100% {
        opacity: 1;
        transform: scale(100%);
    }
`;

export function RetroCard({
  card,
  groups,
  currentGroupId,
  columnId,
  hideButtons,
  moveCard,
  animate,
}: {
  card: RetroCardType;
  currentGroupId: string;
  groups: CardGroup[];
  columnId: string;
  hideButtons: boolean;
  moveCard: (cardId: string, toGroup: string, toIndex: number) => void;
  animate: boolean;
}) {
  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: { columns, ended },
    commitAction,
  } = React.useContext(BoardContext);

  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(card.value);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl1, setAnchorEl1] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const open1 = Boolean(anchorEl1);
  const editFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editing) {
      const end = editFieldRef.current?.value.length || 0;
      editFieldRef.current?.setSelectionRange(end, end);
      editFieldRef.current?.focus();
    }
  }, [editing]);

  const handleClick = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick1 = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleMove = async (groupId?: string) => {
    if (groupId) {
      await moveCard(card.id, groupId, 0);
    } else {
      const id = shortid.generate();
      await createGroup(id);
      await moveCard(card.id, id, 0);
    }
    setAnchorEl(null);
  };

  const cardColour =
    columns.find(column => column.id === columnId)?.cardColour || '#FFFFFF';
  const cardColourHover =
    columns.find(column => column.id === columnId)?.groupColour ||
    '' + Color(cardColour).darken(0.1);

  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const isSmUp = useMediaQuery(theme.breakpoints.only('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.only('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.only('lg'));
  const isLxUp = useMediaQuery(theme.breakpoints.only('xl'));

  const { setConfirmAction } = React.useContext(ConfirmContext);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };
  const createGroup = async (groupId: string) => {
    await saveAndProcessAction(BoardActionType.CREATE_GROUP, {
      groupId,
      columnId,
      order: 0,
    });
  };
  const deleteCard = async (cardId: string) => {
    setConfirmAction({
      action: 'Delete',
      title: 'Delete a card',
      text: 'Are you sure you want to delete a card?',
      onConfirm: () => {
        saveAndProcessAction(BoardActionType.DELETE_CARD, { cardId }).then(
          () => {
            setConfirmAction(undefined);
          }
        );
      },
    });
  };
  const addReactToCard = async (cardId: string) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await saveAndProcessAction(BoardActionType.ADD_REACT_TO_CARD, {
      cardId,
      react: '👍',
    }).then(res => {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: false },
      });
    });
  };
  const removeReactFromCard = async (cardId: string) => {
    await saveAndProcessAction(BoardActionType.REMOVE_REACT_FROM_CARD, {
      cardId,
      react: '👍',
    });
  };
  const submit = async (value: string) => {
    if (card.value !== value) {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      await saveAndProcessAction(BoardActionType.SET_CARD_VALUE, {
        cardId: card.id,
        value,
      }).then(() => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      });
      setEditing(false);
    } else {
      cancelEdit();
    }
  };
  const cancelEdit = (): void => {
    setEditing(false);
    setValue(card.value);
  };

  const cardGroup = groups.find(group =>
    group.cards.find(c => c.id === card.id)
  );

  const ungroupedGroupId = groups.find(group => group.name === UNGROUPED)?.id;

  const cardIsGrouped = cardGroup?.name !== UNGROUPED;

  const userReacted = !!(card.reacts || []).find(r => r.by === global.user.id);

  // ----------------------------------

  const functionToReturnGroupName = (name: string, index: number) => {
    if (name != '' && name != null && name != undefined) {
      return name;
    } else return 'Unnamed group ' + (index + 1);
  };
  const functionToGetArray = () => {
    const items = [];
    if (cardIsGrouped) {
      items.push({
        label: 'out of grouping',
        callback: () => handleMove(ungroupedGroupId),
      });
    }
    items.push({ label: 'to new grouping', callback: () => handleMove() });

    groups
      .filter(group => group.id !== currentGroupId && group.name !== UNGROUPED)
      .forEach((group, i) =>
        items.push({
          label: 'to ' + functionToReturnGroupName(group.name, i),
          callback: () => handleMove(group.id),
        })
      );
    // console.log('items', items);
    return items;
  };

  const menuItemsData: any = {
    label: <img style={{ width: '20px!important' }} src="/svgs/Dots.svg"></img>,
    items: [
      {
        label: '    Delete card    ',
        leftIcon: (
          <DeleteForever
            style={{
              width: '20px',
              paddingLeft: '10px!important',
              paddingRight: '10px!important',
            }}
          />
        ),
        callback: () => deleteCard(card?.id),
      },
      {
        label: '    Move Card    ',
        leftIcon: (
          <MoveDownIcon
            style={{
              width: '20px',
              paddingLeft: '10px!important',
              paddingRight: '10px!important',
            }}
          />
        ),
        rightIcon: <img src="/svgs/RightArrow.svg" />,
        items: functionToGetArray(),
      },
    ],
  };

  //___________________________________

  return (
    <>
      {
        // (
        //   card.createdBy === global.user.id ||
        //   global.user.userType == 2 || column.publish) &&
        <Card
          variant="outlined"
          sx={{
            background: cardColour,
            border: '1px solid ' + Color(cardColour).darken(0.1),
            borderRadius: '8px',
            boxShadow: '-2px 5px 9px -4px rgba(0,0,0,0.74)',
            // opacity: 0.7,
            // minWidth: isXsUp
            //   ? '44vw'
            //   : isSmUp
            //   ? '20vw'
            //   : isMdUp
            //   ? '13vw'
            //   : isLgUp
            //   ? '13.5vw'
            //   : isLxUp
            //   ? '14vw'
            //   : '12vw',
            // maxWidth: isXsUp ? '44vw' : isSmUp ? '20vw' : '12vw',
            width: '100%',
            animation: animate ? `${bumpAnimation} 300ms ease` : 'none',
            '&:hover': {
              background: editing ? 'transparant' : cardColourHover,
            },
          }}
          className="cardStyle"
        >
          {/* Drag handle */}
          {/* <span
          style={{
            position: 'initial',
            padding: 0,
            minWidth: 'calc(100% - 32px)',
            float: 'left',
          }}
          className="handle"
        >
          &nbsp;
        </span> */}

          <CardContent
            sx={{
              paddingBottom: editing ? '0' : 'initial',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Avatar
                onClickAvatar={() => {}}
                avatar={card.avatar}
                css={{ width: '40px', height: '40px', border: 'none' }}
              />

              <Box
                component="span"
                sx={{ width: 'calc(100% - 52px)', marginLeft: '10px' }}
              >
                {editing && !ended ? (
                  <TextField
                    multiline
                    autoFocus
                    fullWidth
                    inputRef={editFieldRef}
                    InputProps={{
                      readOnly: ended || global.leaveRetro,
                    }}
                    value={value}
                    sx={{
                      fieldset: { border: 'none' },
                      padding: 0,
                      textarea: { fontSize: '0.85rem' },
                      div: { padding: 0, position: 'initial' },
                      position: 'initial',
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Escape') {
                        cancelEdit();
                      }
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
                    onChange={e => {
                      const tempValue = value;
                      const removedEnter = tempValue.replace(/[\r\n]/gm, '');
                      // setValue(removedEnter);
                      const removedSpaces = removedEnter.replace(/ /g, '');

                      if (removedSpaces.length === 0) {
                        setValue('');
                      }

                      if (e.target.value !== ' ' && e.target.value != '  \n')
                        setValue(
                          e.currentTarget.value.substring(
                            0,
                            MAX_CARD_TEXT_LENGTH
                          )
                        );
                    }}
                    onSubmit={() => submit(value)}
                  ></TextField>
                ) : (
                  <Typography
                    style={{
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      wordWrap: 'break-word',
                      textAlign: 'left',
                      color: '#343434',
                    }}
                    onClick={e => {
                      // !ended &&
                      //   !editing &&
                      //   card.createdBy === global.user.id &&
                      // setEditing(true);
                      // console.log('e.detail', e.detail);
                      // if (e.detail === 2) {
                      //   setEditing(true);
                      // }
                      // !hideButtons ? e.stopPropagation() : null;
                    }}
                    onTouchStart={e => {
                      // !ended &&
                      //   !editing &&
                      //   card.createdBy === global.user.id &&
                      //   setEditing(true);
                      // !hideButtons ? e.stopPropagation() : null;
                    }}
                    sx={{
                      cursor:
                        card.createdBy === global.user.id &&
                        !ended &&
                        !hideButtons
                          ? 'text'
                          : '',
                    }}
                    className={
                      // card.createdBy === global.user.id &&
                      // !ended &&
                      // !hideButtons
                      //   ? ''
                      //   :
                      ''
                    }
                  >
                    {card.value}
                  </Typography>
                )}
                {!editing && card.editCount > 1 ? (
                  <Typography
                    color="#9DA6AB"
                    style={{ fontSize: '0.85rem', wordWrap: 'break-word' }}
                    className=""
                  >
                    (edited)
                  </Typography>
                ) : null}
                {/* {editing && value && value.length >= MAX_CARD_TEXT_LENGTH - 20 ? (
                <Typography
                  style={{
                    fontSize: '0.75rem',
                    textAlign: 'left',
                    margin: '10px 0',
                  }}
                >
                  Characters remaining: {MAX_CARD_TEXT_LENGTH - value.length}
                </Typography>
              ) : null} */}
                {/* {editing ? (
               
              ) : null} */}
              </Box>
            </Box>
          </CardContent>
          {!editing ? (
            <CardActions
              style={{ justifyContent: 'space-between', padding: 0 }}
            >
              {/* <div style={{ flexGrow: 2 }}>&nbsp;</div> */}
              {!hideButtons ? (
                <Button
                  sx={{ minWidth: '0px', position: 'initial' }}
                  disabled={ended || global.leaveRetro}
                  onClick={e => {
                    // console.log('e', e, ended, userReacted);
                    !ended && userReacted
                      ? removeReactFromCard(card.id)
                      : addReactToCard(card.id);
                    e.stopPropagation();
                  }}
                  // onTouchStart={e => {
                  //   !ended
                  //     ? userReacted
                  //       ? removeReactFromCard(card.id)
                  //       : addReactToCard(card.id)
                  //     : null;
                  //   e.stopPropagation();
                  // }}
                >
                  {userReacted ? (
                    // <img src="/svgs/Star.svg" />
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                        fill="#FBBC05"
                        stroke="#FBBC05"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    // <img src="/svgs/GrayStar.svg" />
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                        fill="#FFFFF"
                        stroke="#FBBC05"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <Typography
                    color="black"
                    style={{
                      fontWeight: 400,
                      fontSize: '14px',
                      color: '#FBBC05',
                      marginLeft: '6px',
                    }}
                  >
                    {card.reacts.length ? card.reacts.length : ''}
                  </Typography>
                </Button>
              ) : (
                <img src="/svgs/GrayStar.svg" />
              )}
              <Box
                component="span"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {card.createdBy === global.user.id &&
                !hideButtons &&
                !ended &&
                !global.leaveRetro ? (
                  <Button
                    sx={{ minWidth: '0px', position: 'initial' }}
                    onClick={e => {
                      setEditing(true);
                      setAnchorEl(null);
                    }}
                    // onTouchStart={e => {
                    //   setEditing(true);
                    //   setAnchorEl(null);
                    // }}
                  >
                    {/* <img id="editLogo" src="/svgs/Edit.svg" /> */}
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        id="editLogo"
                        d="M14.8617 3.48667L16.5492 1.79917C17.2814 1.06694 18.4686 1.06694 19.2008 1.79917C19.9331 2.53141 19.9331 3.71859 19.2008 4.45083L8.58218 15.0695C8.05351 15.5981 7.40144 15.9868 6.68489 16.2002L4 17L4.79978 14.3151C5.01323 13.5986 5.40185 12.9465 5.93052 12.4178L14.8617 3.48667ZM14.8617 3.48667L17.5 6.12499M16 13V17.75C16 18.9926 14.9926 20 13.75 20H3.25C2.00736 20 1 18.9926 1 17.75V7.24999C1 6.00735 2.00736 4.99999 3.25 4.99999H8"
                        stroke="#4E4E4E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* <DeleteForever sx={{ height: '20px', color: '#9EA7AC' }} /> */}
                  </Button>
                ) : null}

                {/* { card.createdBy===global.user.id && !hideButtons && !ended ? ():null} */}
                {!hideButtons &&
                !ended &&
                !global.leaveRetro &&
                (card.createdBy === global.user.id ||
                  global.user.userType == 2) ? (
                  // <Button
                  //   id="basic-button"
                  //   aria-controls={open ? 'basic-menu' : undefined}
                  //   aria-haspopup="true"
                  //   aria-expanded={open ? 'true' : undefined}
                  //   onClick={handleClick}
                  //   color="primary"
                  //   sx={{
                  //     position: 'initial',
                  //     padding: 0,
                  //     minWidth: '32px',
                  //     float: 'right',
                  //   }}
                  // >
                  //   {/* <KeyboardArrowDownIcon /> */}
                  //   <img src="/svgs/Dots.svg" />
                  // </Button>
                  <Box
                    component="span"
                    sx={{
                      marginRight: '-25px',
                      position: 'initial!important',
                      index: '100',
                    }}
                    className="can"
                  >
                    <NestedDropdown
                      menuItemsData={
                        global.user.userType == 2
                          ? menuItemsData
                          : {
                              label: menuItemsData.label,
                              items: [menuItemsData.items[0]],
                            }
                      }
                      MenuProps={{ elevation: 3 }}
                      ButtonProps={{ variant: undefined }}
                      onClick={() => console.log('Clicked')}
                    />
                  </Box>
                ) : null}
              </Box>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                sx={{
                  border: '1px solid #9EA6AC',
                  ul: { color: '#4D555A' },
                  zIndex: 100,
                  position: 'absolute',
                }}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {' '}
                {!editing && card.createdBy === global.user.id ? (
                  <MenuItem
                    onClick={e => {
                      deleteCard(card.id);
                      e.stopPropagation();
                    }}
                    // onTouchStart={e => {
                    //   deleteCard(card.id);
                    //   e.stopPropagation();
                    // }}
                  >
                    <ListItemIcon>
                      <DeleteForever fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete card</ListItemText>
                  </MenuItem>
                ) : null}
                {global.user.userType == 2 && (
                  <MenuItem>
                    <ListItemIcon>
                      <MoveDownIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Move card</ListItemText>
                  </MenuItem>
                )}
                {/* <Button onClick={handleClick1}>
                <ListItemText>Move card</ListItemText>
              </Button> */}
                {/* <Menu
                anchorEl={anchorEl1}
                open={open1}
                onClose={() => setAnchorEl1(null)}
              > */}
                {cardIsGrouped ? (
                  <MenuItem
                    onClick={() => handleMove(ungroupedGroupId)}
                    // onTouchStart={() => handleMove(ungroupedGroupId)}
                  >
                    <ListItemIcon></ListItemIcon>
                    <ListItemText>out of Grouping</ListItemText>
                  </MenuItem>
                ) : null}
                <MenuItem
                  onClick={() => handleMove()}
                  // onTouchStart={() => handleMove()}
                >
                  <ListItemIcon></ListItemIcon>
                  <ListItemText>to New Grouping</ListItemText>
                </MenuItem>
                {groups
                  .filter(
                    group =>
                      group.id !== currentGroupId && group.name !== UNGROUPED
                  )
                  .map((group, i) => (
                    <MenuItem
                      key={group.id}
                      onClick={() => handleMove(group.id)}
                      // onTouchStart={() => handleMove(group.id)}
                    >
                      <ListItemIcon />
                      <ListItemText>
                        to {group.name || 'Unnamed group ' + (i + 1)}
                      </ListItemText>
                    </MenuItem>
                  ))}
              </Menu>
            </CardActions>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                // padding: 0,
                marginTop: '10px',
                paddingLeft: '16px',
                paddingRight: '16px',
              }}
            >
              <Box
                component="span"
                sx={{
                  color: '#CCCCCC',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  paddingLeft: '46px',
                }}
              >
                {MAX_CARD_TEXT_LENGTH - value.length}
              </Box>
              <Box component="span">
                <Button
                  color="error"
                  sx={{
                    minWidth: '0px',
                    padding: 0,
                    position: 'initial',
                    marginRight: '10px',
                  }}
                  onClick={e => {
                    cancelEdit();
                    e.stopPropagation();
                  }}
                  // onTouchStart={e => {
                  //   cancelEdit();
                  //   e.stopPropagation();
                  // }}
                >
                  {/* <CloseIcon sx={{ height: '20px', color: 'black' }} /> */}
                  CLOSE
                </Button>
                <Button
                  sx={{ minWidth: '0px', padding: 0, position: 'initial' }}
                  disabled={
                    !value ||
                    value.length === 0 ||
                    value.replace(/[\r\n]/gm, '').replace(/ /g, '').length === 0
                  }
                  onClick={e => {
                    submit(value);
                    e.stopPropagation();
                  }}
                  // onTouchStart={e => {
                  //   submit(value);
                  //   e.stopPropagation();
                  // }}
                >
                  {/* <CheckIcon sx={{ height: '20px', color: 'black' }} /> */}
                  SAVE
                </Button>
              </Box>
            </Box>
          )}
        </Card>
      }
    </>
  );
}
