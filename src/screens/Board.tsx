import {
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  FormControlLabel,
  Grid,
  Switch,
  Tab,
  Tabs,
  // Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { FEATURE_FLAGS, UNGROUPED } from '../constants';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import shortid from 'shortid';
import { sentence } from 'txtgen';
import { UserAvatar } from '../atoms/UserAvatar';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { ConfirmContext } from '../contexts/ConfirmContext';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { CountdownTimer } from '../elements/CountdownTimer';
import { FeedbackColumn } from '../elements/FeedbackColumn';
import ParticipantsPanel from '../elements/ParticipantsPanel';
import { RetroColumn } from '../elements/RetroColumn';
import RetroPropsPanel from '../elements/RetroPropsPanel';
import SharePanel from '../elements/SharePanel';
import useLoadRetro from '../hooks/useLoadRetro';
import theme from '../theme/theme';
import FeedbackPopup from '../atoms/FeedbackPopup';
import Toolbar from '../elements/Toolbar';
import SubToolbar from '../elements/SubToolbar';
import FirstTimeExperience from '../elements/FirstTimeExperience';
import { styled } from '@mui/material/styles';
interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  color: string;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    scrollButtons="auto"
    allowScrollButtonsMobile
    variant="scrollable"
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(({ color }) => ({
  color: 'red',
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: color,
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: color,
  },
}));

interface StyledTabProps {
  label: string;
  color: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme, color }) => ({
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: '400',
  marginRight: theme.spacing(1),
  color: color,

  '&.Mui-selected': {
    color: color,
    fontWeight: '600',

    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
    // display: 'inline-block',
    width: '99%',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

const ColumnContainer = ({
  children,
  totalPanels,
}: {
  children: React.ReactNode;
  totalPanels: number;
}) => {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  return (
    <Grid
      item
      xs={isXsUp ? 12 : 6}
      md={12 / totalPanels}
      sx={{
        background: '#ffffff',
        margin: isXsUp ? 0 : '10px',
        '&:not(:last-child)': {
          marginRight: 0,
        },
      }}
    >
      {children}
    </Grid>
  );
};

export default function RetroBoard() {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const isSmUp = useMediaQuery(theme.breakpoints.only('sm'));

  const navigate = useNavigate();

  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: {
      lastStateUpdate,
      columns,
      retroName,
      users,
      creatorId,
      ended,
      needsToShow,
      retroStatus,
    },
    commitAction,
  } = React.useContext(BoardContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);

  const [currentColumn, setCurrentColumn] = React.useState(0);
  const [showEditBox, setShowEditBox] = React.useState(false);
  const [justMyCards, setJustMyCards] = React.useState(false);
  const [showFeedback, setshowFeedback] = React.useState(false);
  const [islanded, setIsLanded] = React.useState(true);

  const [showRetroPanel, setShowRetroPanel] = React.useState(false);
  const [showParticipantsPanel, setShowParticipantsPanel] =
    React.useState(false);
  const [showSharePanel, setShowSharePanel] = React.useState(false);

  useLoadRetro();

  const isMatch = (element: any, index: number, array: any): boolean => {
    // console.log(element, index, array);
    return true;
  };

  const getProcessedColumns = () =>
    columns
      ? columns.map(
          column => {
            const groups = [...column.groups].sort(
              (a, b) =>
                (!b.reactions ? 0 : b.reactions.length) -
                (!a.reactions ? 0 : a.reactions.length)
            );

            return {
              ...column,
              groups: groups
                .map(group => {
                  const cards = group.cards.filter(card =>
                    global.user?.id !== global.currentRetro?.creatorId
                      ? card
                      : global.usersSelected?.some((user, index) => {
                          return user?.userId === card?.createdBy;
                        })
                  );
                  return {
                    ...group,
                    cards,
                  };
                })
                .filter(
                  group =>
                    !justMyCards ||
                    group.name === UNGROUPED ||
                    group.cards.length !== 0
                ),
            };
          }
          // }
        )
      : [];

  const closeAllPanels = () => {
    setShowRetroPanel(false);
    setShowParticipantsPanel(false);
    setShowSharePanel(false);
  };

  const totalPanels = columns
    ? global.expandColumn != -1
      ? 1
      : columns.length
    : 0;
  // columns ? columns.length + (isXsUp ? 1 : 0) : 0;

  const LeftContainer = ({ index }: { index: number }) =>
    isSmUp && currentColumn === index ? (
      <Button
        disabled={currentColumn === 0}
        style={{ float: 'left', position: 'initial' }}
        onClick={() => {
          setCurrentColumn(currentColumn - 1);
        }}
      >
        <ArrowBackIosIcon />
      </Button>
    ) : (
      <></>
    );

  const RightContainer = ({ index }: { index: number }) =>
    isSmUp && currentColumn + 1 === index ? (
      <Button
        disabled={currentColumn + 1 >= totalPanels - 1}
        style={{ float: 'right', position: 'initial' }}
        onClick={() => {
          setCurrentColumn(currentColumn + 1);
        }}
      >
        <ArrowForwardIosIcon />
      </Button>
    ) : (
      <></>
    );

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const finishRetro = () => {
    if (global.user.userType == 2) {
      sessionStorage.removeItem('retoname');

      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });

      sessionStorage.removeItem('pulseCheckState');

      saveAndProcessAction(BoardActionType.UPDATE_RETRO_DETAILS, {
        creatorId: global.currentRetro?.creatorId,
        userId: global.user.id,
        retroStatus: 'ended',
      }).then(
        () => {
          saveAndProcessAction(BoardActionType.END_RETRO, {}).then(
            () => {
              dispatch({
                type: ActionType.SET_LOADING,
                payload: { loadingFlag: false },
              });
              navigate('/report/' + global.currentRetro?.id);
            },
            () => {
              dispatch({
                type: ActionType.SET_LOADING,
                payload: { loadingFlag: false },
              });
            }
          );
        },
        () => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        }
      );
    } else {
      dispatch({
        type: ActionType.SET_LEAVE_RETRO,
        payload: { leaveRetro: true },
      });
      setshowFeedback(true);
    }
  };
  const create10Cards = async () => {
    setIsLanded(false);
    for (let i = 0; i < 10; i++) {
      const column = Math.floor(Math.random() * columns.length);
      const group = Math.floor(Math.random() * columns[column].groups.length);
      await saveAndProcessAction(BoardActionType.ADD_NEW_CARD, {
        groupId: columns[column].groups[group].id,
        id: shortid.generate(),
        value: sentence(),
      });
    }
  };

  React.useEffect(() => {
    if (ended || global.leaveRetro) {
      if (global.user.userType !== 2) {
        const currentUser = users?.filter(
          card => card.userId === global?.user.id
        );
        if (currentUser?.length == 1 && currentUser[0].feedback.length == 0) {
          setshowFeedback(true);
        }
      } else {
        setshowFeedback(false);
      }
    }
  }, [ended]);

  const getColumns = () => {
    return columns;
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue, 'value');
    setValue(newValue);
  };

  return (
    <Box
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        height: 'calc(var(--app-height))',
      }}
    >
      {global?.user.userType == 2 && !ended && (
        <FirstTimeExperience facilitator={true} />
      )}
      {global?.user.userType != 2 &&
        !ended &&
        (isXsUp ? (
          <FirstTimeExperience facilitator={false} isXsUp={true} />
        ) : (
          <FirstTimeExperience facilitator={false} isXsUp={false} />
        ))}
      <Grid xs={12} item>
        <Toolbar onFinishRetro={finishRetro}></Toolbar>
        {!isXsUp && <SubToolbar></SubToolbar>}
      </Grid>
      <Grid
        container
        spacing={0}
        style={{
          flexWrap: 'nowrap',
          flexGrow: 1,
          background: 'white',
          paddingLeft: isXsUp ? 0 : '42px',
          paddingRight: isXsUp ? 0 : '42px',
        }}
      >
        {showFeedback ? (
          <FeedbackPopup show={true} showThankYou={ended}></FeedbackPopup>
        ) : null}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {isXsUp && getColumns().length !== 0 ? (
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <StyledTabs
                color={getColumns()[value].groupFontColour}
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                sx={{ color: 'green!important' }}
              >
                <StyledTab
                  color={getColumns()[0].groupFontColour}
                  label={getColumns()[0].name}
                  {...a11yProps(0)}
                  sx={{ fontSize: '16px' }}
                />
                <StyledTab
                  color={getColumns()[1].groupFontColour}
                  label={getColumns()[1].name}
                  {...a11yProps(1)}
                  sx={{ fontSize: '16px' }}
                />
                <StyledTab
                  color={getColumns()[2].groupFontColour}
                  label={getColumns()[2].name}
                  {...a11yProps(2)}
                  sx={{ fontSize: '16px' }}
                />
                ;
              </StyledTabs>
            </Box>
          ) : (
            <></>
          )}
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            {useMemo(
              () =>
                (false
                  ? [...getProcessedColumns(), undefined]
                  : getProcessedColumns()
                ).map((column, index) => (
                  <React.Fragment key={index}>
                    {((isXsUp && index == value) ||
                      (!isXsUp &&
                        (global.expandColumn == -1 ||
                          index == global.expandColumn))) && (
                      <ColumnContainer
                        totalPanels={totalPanels}
                        key={index + '1'}
                      >
                        {!!column ? (
                          <>
                            <RetroColumn
                              leftHeaderComponent={
                                <LeftContainer index={index} />
                              }
                              rightHeaderComponent={
                                <RightContainer index={index} />
                              }
                              column={column}
                              columnId={column.id}
                              noHeader={false}
                              showEditBox={showEditBox}
                              setShowEditBox={setShowEditBox}
                              setIslanded={setIsLanded}
                              cardGroups={column.groups}
                            />
                          </>
                        ) : (
                          <FeedbackColumn
                            noHeader={isXsUp}
                            leftHeaderComponent={
                              <LeftContainer index={index} />
                            }
                            rightHeaderComponent={
                              <RightContainer index={index} />
                            }
                          />
                        )}
                      </ColumnContainer>
                    )}
                  </React.Fragment>
                )),
              [
                lastStateUpdate,
                isXsUp,
                value,
                // isSmUp,
                justMyCards,
                currentColumn,
                showEditBox,
                global.expandColumn,
                global.usersSelected,
                // emojiPickerid,
              ]
            )}
          </div>
        </Box>
      </Grid>
    </Box>
  );
}
