import {
  Box,
  Grid,
  Button,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  Link,
  Tooltip,
} from '@mui/material';
import React, { ReactElement, useEffect, useMemo } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { MAX_CARD_TEXT_LENGTH, UNGROUPED } from '../constants';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { Card, Card as RetroCardType, CardGroup, Column } from '../types';
import Avatar from '../elements/Avatar';
import SendIcon from '@mui/icons-material/Send';
import Color from 'color';
import shortid from 'shortid';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { RetroCard } from './retroCard/RetroCard';
import theme from '../theme/theme';
import { RetroCardGroup } from './RetroCardGroup';
import EmojiPicker from 'emoji-picker-react';
import { DragDropContext, Draggable as Drag, Droppable, DropResult } from "react-beautiful-dnd"
import ColumnHeader from './ColumnHeader';
import RetroColumnBottom from './RetroColumnBottom';

const ColumnComponent = styled('div')({
  height: 'calc(var(--app-height) - 160px)',
  display: 'flex',
  flexGrow: 1,
  padding: 0,
});



export function RetroColumn({
  column,
  columnId,
  cardGroups,
  noHeightLimit,
  expandAllGroups,
  noHeader,
  showEditBox,
  setShowEditBox,
  setIslanded,
  leftHeaderComponent,
  rightHeaderComponent,
}: {
  column: Column;
  columnId: string;
  noHeader: boolean;
  expandAllGroups?: boolean;
  cardGroups: CardGroup[];
  noHeightLimit?: boolean;
  showEditBox: boolean;
  leftHeaderComponent: any;
  rightHeaderComponent: any;
  setIslanded: (islanded: boolean) => void;
  setShowEditBox: (showEditBox: boolean) => void;
}): ReactElement {
  const selectedCard = React.useRef<number[] | null>(null);
  const selectedCardCopy = React.useRef<number[] | null>(null);
  const dragStartTime = React.useRef<number | null>(null);
  const dragTargetTime = React.useRef<number | null>(null);
  const targetLanding = React.useRef<number[] | null>(null);
  const targetGroup = React.useRef<number | null>(null);
  const targetMergeCard = React.useRef<number[] | null>(null);
  const targetForReorderToLastCard = React.useRef<number[] | null>(null);
  const targetMergeCardCopy = React.useRef<number[] | null>(null);
  const targetSelectedMergeCard = React.useRef<string | null>(null);
  const actionRef = React.useRef<string>("");
  const surroundDiv = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const nodeRef = React.useRef(null);
  const [groupCollapsed, setGroupCollapsed] = React.useState<boolean[]>(
    cardGroups.map(() => false)
  );
  const [showEmojisOfColumn, setShowEmojisOfColumn] =
    React.useState<string>('');
  const {
    state: { columns, ended },
    commitAction,
  } = React.useContext(BoardContext);
  const groupColour = columns.find(
    column => column.id === columnId
  )?.groupColour;
  const groupFontColour = columns.find(
    column => column.id === columnId
  )?.groupFontColour;
  const [value, setValue] = React.useState('');
  const [valueSet, setValueSet] = React.useState(false);
  const [mouseOver, setMouseOver] = React.useState(true);
  const autoFocusCardId = React.useRef<string | undefined>(undefined);

  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));

  const groupRefs = cardGroups.map(
    cardGroup => null
  ) as (HTMLDivElement | null)[];

  const cardRefs = cardGroups.map(cardGroup =>
    cardGroup.cards.map(() => null)
  ) as (HTMLDivElement | null)[][];
  const draggableRefs = cardGroups.map(cardGroup =>
    cardGroup.cards.map(() => null)
  ) as (Draggable | null)[][];
  const placeholderRefs = cardGroups.map(cardGroup =>
    cardGroup.cards.map(() => null)
  ) as (HTMLDivElement | null)[][];
  const landingZones = cardGroups.map(cardGroup =>
    Array(cardGroup.cards.length + 1)
      .fill(0)
      .map(() => null)
  ) as (HTMLDivElement | null)[][];
  const [global, dispatch] = React.useContext(GlobalContext);

  const [columnName, setColumnName] = React.useState(column.name);

  // React.useEffect(() => {
  //   setColumnName(column.name);
  // }, [column.name]);
  // React.useEffect(() => {
  //   console.log(groupCollapsed);
  // }, [groupCollapsed]);

  const findCardInGroup = (group: CardGroup, id: string) =>
    group.cards.find(card => card.id === id);

  const findCard = (id: string): Card | undefined => {
    for (const group of column.groups) {
      const card = findCardInGroup(group, id);
      if (card) {
        return card;
      }
    }
    return undefined;
  };

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const addNewCard = async (cardGroupId: string, value: string) => {
    const id = shortid.generate();
    // console.log(id, 'id');
    await saveAndProcessAction(BoardActionType.ADD_NEW_CARD, {
      groupId: cardGroupId,
      id,
      value,
      avatar: global.user.avatar,
    });
    autoFocusCardId.current = id;
  };

  const moveCard = async (cardId: string, toGroup: string, toIndex: number) => {
    dispatchLoadingFlag(true)
    await saveAndProcessAction(BoardActionType.MOVE_CARD, {
      cardId,
      groupId: toGroup,
      index: toIndex,
    }).then(res => {

      dispatchLoadingFlag(false)
    }, err => {

      dispatchLoadingFlag(false)
    })
    autoFocusCardId.current = cardId;
  };
  const dispatchLoadingFlag = (flag: boolean) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: flag },
    });
  }
  const createGroup = async (groupId: string) => {

    dispatchLoadingFlag(true)
    await saveAndProcessAction(BoardActionType.CREATE_GROUP, {
      groupId,
      columnId,
      order: 0,
    }).then(res => {

      dispatchLoadingFlag(false)
    }, err => {
      dispatchLoadingFlag(false)
    })
  };
  const reorderCards = async (cardId: string, targetCard: string, index: number, moveToLast: boolean) => {
    dispatchLoadingFlag(true)
    await saveAndProcessAction(BoardActionType.REORDER_CARD, {
      cardId, targetCard, index, moveToLast
    }).then(() => {
      dispatchLoadingFlag(false)
    }, error => {
      dispatchLoadingFlag(false)
    })

  }
  const mergeCards = async (cardId1: string, cardId2: string) => {
    const groupId = shortid.generate();

    await createGroup(groupId);
    await moveCard(cardId1, groupId, 0);
    await moveCard(cardId2, groupId, 1)
    autoFocusCardId.current = cardId1;
  };

  const submitColumnName = async (value: string) => {
    await saveAndProcessAction(BoardActionType.SET_COLUMN_NAME, {
      columnId: column.id,
      value,
    });
  };

  const publishColumn = async (value: boolean) => {
    // console.log('publish');
    if (true) {
      dispatchLoadingFlag(true)
      await saveAndProcessAction(BoardActionType.PUBLISH_COLUMN, {
        columnId: column.id,
        value,
      }).then(res => {
        dispatchLoadingFlag(false)
      });
    } else {
    }
  };

  const submit = async (text: string) => {
    setIslanded(false);
    dispatchLoadingFlag(true)
    await addNewCard(
      (cardGroups.find(cardGroup => cardGroup.name === UNGROUPED) as CardGroup)
        .id,
      text
    ).then((res: any) => {
      dispatchLoadingFlag(false)
    });
    setValue('');
    setValueSet(false);
    setShowEditBox(false);
  };

  const handleStart = (
    i: number,
    j: number,
    event: DraggableEvent,
    data: DraggableData
  ): void => {
    // (cardRefs[i][j].current as HTMLDivElement).style.maxHeight = '0';
    // (landingZones[i][j].current as HTMLDivElement).style.display = 'none';
    if (cardRefs && landingZones) {
      const { top, left, width, height } = (
        (cardRefs[i][j] as HTMLDivElement).firstChild as any
      ).getBoundingClientRect();
      const cardElement = cardRefs[i][j] as HTMLDivElement;
      const draggable = draggableRefs[i][j];
      if (draggable) {
        draggable.setState({ x: 0, y: 0 });
      }
      cardElement.style.padding = '0';
      const placeholder = placeholderRefs[i][j];
      const cardElementChild = cardElement.firstChild as HTMLDivElement;
      if (placeholder) {
        placeholder.style.position = cardElementChild.style.position;
        placeholder.style.display = cardElementChild.style.display;
        placeholder.style.width = `${width}px`;
        placeholder.style.height = `${height}px`;
        placeholder.style.margin = '10px 10px';
        placeholder.style.background = 'none';
      }
      cardElementChild.style.position = 'absolute';
      cardElementChild.style.top = `${top + window.pageYOffset}px`;
      cardElementChild.style.left = `${left + window.pageXOffset}px`;
      cardElementChild.style.width = `${width}px`;
      cardElementChild.style.height = `${height}px`;
      if (j !== 0) {
        (landingZones[i][j] as HTMLDivElement).style.display = 'none';
      }
      // handleDrag(i, j, data);
      dragStartTime.current = new Date().getTime();
    }
  };


  var timeoutForBorder: any;
  const handleDrag = (
    i: number,
    j: number,
    event: DraggableEvent,
    data: DraggableData
  ): void | false => {


    if (cardRefs) {
      const { top, left, height, width } = (
        (cardRefs[i][j] as HTMLDivElement).firstChild as any
      ).getBoundingClientRect();
      const x = left + window.pageXOffset;
      const y = top + window.pageYOffset;
      targetLanding.current = null;
      targetMergeCard.current = null;
      targetForReorderToLastCard.current = null;

      targetGroup.current = null;

      // Scrolling while driving
      let {
        top: t,
        bottom: b,
        height: h,
      } = (containerRef.current as HTMLDivElement).getBoundingClientRect();

      t += +window.pageYOffset;
      if (y < t) {
        containerRef.current?.scrollBy(0, -(t - y));
      } else if (t + h < y + height) {
        containerRef.current?.scrollBy(0, y + height - (t + h));
      }

      let ii = 0;
      for (const groupRef of groupRefs) {

        if (groupRef !== null && ii !== i) {
          // console.log(ii,"ii")
          let {
            top: t,
            left: l,
            bottom: b,
            right: r,
            width: w,
            height: h,
          } = (groupRef as HTMLDivElement).getBoundingClientRect();
          l += +window.pageXOffset;
          t += +window.pageYOffset;
          // if moving card from ungroup to grouped cards. or viceversa
          if (t < y && y < t + h && l < x && x < l + w) {
            (groupRef as HTMLDivElement).style.border = '3px dotted gray';
            (groupRef as HTMLDivElement).style.borderRadius = '8px';
            (groupRef as HTMLDivElement).style.padding = '0px';
            targetGroup.current = ii;
          }
          else {
            (groupRef as HTMLDivElement).style.border = 'none';
            (groupRef as HTMLDivElement).style.padding = '0px';

          }
        }
        ii++;
      }


      ii = 0;
      for (const group of cardRefs) {


        let jj = 0;
        // Only group within same group
        // if (ii === i && cardGroups[ii].name === UNGROUPED) 

        if (ii === i) {
          const isUngroup: boolean = cardGroups[ii].name === UNGROUPED;
          clearInterval(timeoutForBorder)
          let v: number = 0;
          for (const cardRef of group) {
            v++
            if (cardRef === null) continue;
            let {
              top: t,
              left: l,
              bottom: b,
              right: r,
              width: w,
              height: h,
            } = (cardRef as HTMLDivElement).getBoundingClientRect();
            // l += +window.pageXOffset;
            // t += +window.pageYOffset;

            var length: number = group.length == 0 ? 0 : group.length - 1;

            let {
              top: T,
              left: L,
              bottom: B,
              right: R,
              width: W,
              height: H,
            } = ((group[length]) as HTMLDivElement).getBoundingClientRect();

            if (
              (j !== jj || i !== ii) && v == length + 1 && (l + (w / 1.8) < x && x < (l + (w + (w / 5))) && T <= (y + height / 6) && y < (T + height)
                ||
                T + height <= (y) && y < (T + height + (height / 2))
              )) {

              (group[length] as HTMLDivElement).style.borderRight =
                '3px dotted gray';
              (group[length] as HTMLDivElement).style.borderRadius =
                '0px';

              actionRef.current = "moveToLast"
              // targetMergeCard.current = [ii, jj];
              //  if(l)
              targetForReorderToLastCard.current = [ii, jj];
            }
            else {
              (group[length] as HTMLDivElement).style.borderRight =
                'none';
              actionRef.current = "";
              // targetMergeCard.current=[0,0]
              targetForReorderToLastCard.current = null;

            }


            if (
              !targetGroup.current &&
              (j !== jj || i !== ii) &&
              t - height / 2 < y &&
              y < t + height / 2 &&
              l - width / 2 < x &&
              x < l + width / 2 &&
              !cardGroups[ii].cards[jj].locked
            ) {
              selectedCardCopy.current = [i, j];
              targetMergeCardCopy.current = [ii, jj];
              if (
                selectedCardCopy.current !== null &&
                targetMergeCardCopy.current !== null
              ) {
                const showReorder = jj - j != 1;
                if (targetSelectedMergeCard.current == null || targetSelectedMergeCard.current != cardGroups[targetMergeCardCopy.current[0]].cards[
                  targetMergeCardCopy.current[1]
                ].id) {
                  targetSelectedMergeCard.current = cardGroups[targetMergeCardCopy.current[0]].cards[
                    targetMergeCardCopy.current[1]].id;

                  // setChangeCardTime(new Date().getTime());

                  dragTargetTime.current = new Date().getTime()

                  cardLineChangeFunction(i, j, ii, jj, t, y, l, x, h, w, isUngroup, showReorder)
                  clearInterval(timeoutForBorder)
                  timeoutForBorder = setInterval(() => cardLineChangeFunction(i, j, ii, jj, t, y, l, x, h, w, isUngroup, showReorder)
                    , 100)
                }
                else if (targetSelectedMergeCard.current === cardGroups[targetMergeCardCopy.current[0]].cards[
                  targetMergeCardCopy.current[1]
                ].id) {
                  clearInterval(timeoutForBorder)

                  timeoutForBorder = setInterval(() => cardLineChangeFunction(i, j, ii, jj, t, y, l, x, h, w, isUngroup, showReorder)
                    , 100)


                }

              }
              targetMergeCard.current = [ii, jj];
            } else {
              // (surroundDiv.current as HTMLDivElement).style.display="none";
              // ((cardRef as HTMLDivElement).firstChild as any).style.background = 'none';
            }

            jj++;
          }
        }
        ii++;
      }

      if (!targetMergeCard.current) {
        (surroundDiv.current as HTMLDivElement).style.display = 'none';
      }
      selectedCard.current = [i, j];
    }
  };

  const cardLineChangeFunction = (i: number, j: number, ii: any, jj: any, t: number, y: number, l: number, x: number, h: number, w: number, flag: boolean, showReorder: boolean) => {
    (surroundDiv.current as HTMLDivElement).style.border = 'none';
    (surroundDiv.current as HTMLDivElement).style.display = 'inline';
    (surroundDiv.current as HTMLDivElement).style.position = 'absolute';
    if (((dragTargetTime.current && new Date().getTime() - dragTargetTime.current < 1500) || !flag) && showReorder) {

      (surroundDiv.current as HTMLDivElement).style.borderLeft =
        '3px dotted gray';
      (surroundDiv.current as HTMLDivElement).style.borderRadius =
        '0px';
      actionRef.current = "reorder";
      if (!flag) {
        clearInterval(timeoutForBorder);
      }
      (surroundDiv.current as HTMLDivElement).style.top = t + "px";
      // `${Math.min(
      //   t,
      //   y
      // )}px`;
      (surroundDiv.current as HTMLDivElement).style.left = l + "px";

      // `${Math.min(
      //   l,
      //   x
      // )}px`;

    } else {
      if (flag) {
        (surroundDiv.current as HTMLDivElement).style.border =
          '3px dotted gray';
        (surroundDiv.current as HTMLDivElement).style.borderRadius =
          '8px';
        actionRef.current = "merge"
        clearInterval(timeoutForBorder);
      }
      (surroundDiv.current as HTMLDivElement).style.top = `${Math.min(t, y)}px`;
      (surroundDiv.current as HTMLDivElement).style.left = `${Math.min(l, x)}px`;
    }

    (surroundDiv.current as HTMLDivElement).style.height = `${Math.abs(t - y) + h
      }px`;
    (surroundDiv.current as HTMLDivElement).style.width = `${Math.abs(l - x) + w
      }px`;
    (surroundDiv.current as HTMLDivElement).style.zIndex = `1000`;
  }





  const handleStop = (
    i: number,
    j: number,
    event: DraggableEvent,
    data: DraggableData
  ): void | false => {
    selectedCard.current = [i, j];
    if (cardRefs !== undefined) {
      clearInterval(timeoutForBorder)
      if (selectedCard.current !== null) {
        // for (const group of cardRefs) {
        //     for (const cardRef of group) {
        //         if (cardRef === null) continue;
        //         ((cardRef as HTMLDivElement).firstChild as any).style.background = 'white';
        //     }
        // }

        const selectedCardElement = cardRefs[selectedCard.current[0]][
          selectedCard.current[1]
        ] as HTMLDivElement;
        selectedCardElement.style.padding = '10px';
        if (selectedCardElement.firstChild) {
          (selectedCardElement.firstChild as any).style.position = 'inherit';
          (selectedCardElement.firstChild as any).style.top = `inherit`;
          (selectedCardElement.firstChild as any).style.left = `inherit`;
          (selectedCardElement.firstChild as any).style.width = `inherit`;
          (selectedCardElement.firstChild as any).style.height = `inherit`;
          (selectedCardElement.firstChild as any).style.transform = ``;
        }
        const placeholder = placeholderRefs[selectedCard.current[0]][
          selectedCard.current[1]
        ] as HTMLDivElement;
        if (placeholder) {
          placeholder.style.width = '0';
          placeholder.style.height = '0';
        }

        if (selectedCard.current[1] !== 0) {
          (
            landingZones[selectedCard.current[0]][
            selectedCard.current[1]
            ] as HTMLDivElement
          ).style.display = 'inline';
        }
        if (targetLanding.current !== null) {
          (
            landingZones[targetLanding.current[0]][
            targetLanding.current[1]
            ] as HTMLDivElement
          ).style.background = 'none';
          (
            landingZones[targetLanding.current[0]][
            targetLanding.current[1]
            ] as HTMLDivElement
          ).style.backgroundColor = 'transparent';
          (
            landingZones[targetLanding.current[0]][
            targetLanding.current[1]
            ] as HTMLDivElement
          ).style.padding = '0';
          (
            landingZones[targetLanding.current[0]][
            targetLanding.current[1]
            ] as HTMLDivElement
          ).style.border = 'none';
        }
        if (targetMergeCard.current) {
          (surroundDiv.current as HTMLDivElement).style.display = 'none';
        }
        for (const groupRef of groupRefs) {
          (groupRef as HTMLDivElement).style.border = 'none';
          (groupRef as HTMLDivElement).style.padding = '3px';
          (groupRef as HTMLDivElement).style.borderRadius = '0';
        }

        try {
          if (
            dragStartTime.current &&
            new Date().getTime() - dragStartTime.current > 500
          ) {
            dragStartTime.current = null;

            //Not in use
            if (
              selectedCard.current !== null &&
              targetLanding.current !== null
            ) {
              console.log("move 2");
              moveCard(
                cardGroups[selectedCard.current[0]].cards[
                  selectedCard.current[1]
                ].id,
                cardGroups[targetLanding.current[0]].id,
                targetLanding.current[1]
              );
            }

            //moving of card from one group to another group
            if (targetGroup.current !== null) {
              moveCard(
                cardGroups[selectedCard.current[0]].cards[
                  selectedCard.current[1]
                ].id,
                cardGroups[targetGroup.current].id,
                cardGroups[targetGroup.current].cards.length
              );
            }

            // Reorder the card to last location
            else if (actionRef.current == "moveToLast" && targetForReorderToLastCard.current != null) {
              reorderCards(cardGroups[selectedCard.current[0]].cards[
                selectedCard.current[1]
              ].id,
                cardGroups[targetForReorderToLastCard.current[0]].cards[
                  targetForReorderToLastCard.current[1]
                ].id, targetForReorderToLastCard.current[1], true);
              actionRef.current = "";
              (cardRefs[targetForReorderToLastCard.current[0]][targetForReorderToLastCard.current[1]] as HTMLDivElement).style.border = "none";

            }
            //Merge the cards
            else if (actionRef.current === "merge" && selectedCard.current !== null &&
              targetMergeCard.current !== null) {
              mergeCards(cardGroups[selectedCard.current[0]].cards[selectedCard.current[1]].id,
                cardGroups[targetMergeCard.current[0]].cards[targetMergeCard.current[1]].id);
            }
            //Reorder the cards except to last location
            else {
              if (targetMergeCard.current != null && (targetMergeCard.current[1] - 1) != selectedCard.current[1]) {
                reorderCards(cardGroups[selectedCard.current[0]].cards[
                  selectedCard.current[1]
                ].id,
                  cardGroups[targetMergeCard.current[0]].cards[
                    targetMergeCard.current[1]
                  ].id, targetMergeCard.current[1], false)
              }

            }
          }
        } finally {
          (surroundDiv.current as HTMLDivElement).style.display = 'none';
          selectedCard.current = null;
          targetLanding.current = null;
          targetMergeCard.current = null;
        }
      }
    }
    dragStartTime.current = null;

    targetSelectedMergeCard.current = null;
    dragTargetTime.current = null;
  };

  const cardRefCollector = (
    e: HTMLDivElement,
    i: number,
    j: number,
    card: Card
  ) => {
    cardRefs[i][j] = e as HTMLDivElement;
    if (card.id === autoFocusCardId.current && e !== null) {
      e?.focus();
      e?.scrollIntoView(false);
      autoFocusCardId.current = undefined;
    }
  };

  const setEmojiId = (columnId: string) => {
    dispatch({
      type: ActionType.SET_EMOJI_ID,
      payload: { emojiId: columnId },
    });
  };
  const focusTextBox = () => {
    const inputText = document.getElementById("textField" + columnId);
    if (inputText != null) {
      inputText.focus();
    }
  }

  const reorderNumbers = (result: any) => {
    console.log(result, "destination   ", result.destination.index, "source   ", result.source.index);

  }

  // if (!location.pathname.includes('report')) {
  return (
    <ColumnComponent
      sx={{
        height: noHeightLimit
          ? 'auto'
          : isXsUp
            ? 'calc(var(--app-height) - 115px)'
            : 'calc(var(--app-height) - 160px)',
        borderRadius: '8px',
        border: isXsUp || location.pathname.includes('report') ? 'none' : '1px solid #0B6623',
        borderColor: groupFontColour,
        padding: isXsUp ? '10px' : '0px',
        paddingBottom: 0,
      }}
      onMouseOver={() => {
        setMouseOver(true);
      }}
      onMouseOut={() => {
        setMouseOver(true);
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: '100px',
        }}
      >
        {!isXsUp && !location.pathname.includes('report') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: '15px',
              marginBottom: '25px',
              background: groupColour,
              borderRadius: '8px',
            }}
          >
            <ColumnHeader

              column={column}
              columnId={columnId}
              columnName={columnName}
              noHeader={noHeader}
              groupFontColour={groupFontColour}
              global={global}
              ended={ended}
              leftHeaderComponent={leftHeaderComponent}
              value={value}
              submitColumnName={submitColumnName}
              setColumnName={setColumnName}
              publishColumn={publishColumn}
              dispatch={dispatch}
            />
          </div>
        )}
        {/* </Box> */}
        {useMemo(
          () => (


            <>
              {!column.publish && global.user.userType !== 2 ? (
                <Box
                  sx={{
                    display: 'flex',
                    width: 'calc(100%-20px)',
                    paddingLeft: '10px',
                    paddingRight: '10px',

                    flexDirection: 'column',
                  }}
                  ref={containerRef}
                  style={{
                    // overflowY: noHeightLimit ? 'auto' : 'auto',
                    overflowY: 'auto',
                    userSelect: 'none',
                    flexGrow: 2,
                  }}
                >
                  <Grid
                    container
                    // rowSpacing={1}
                    columnSpacing={'20px'}
                    direction="row"
                    justifyContent={
                      global?.expandColumn === -1
                        ? 'space-between'
                        : 'flex-start'
                    }
                  >
                    {cardGroups.map((group, i) => (
                      <React.Fragment key={i}>
                        {group.cards.map((card: RetroCardType, j: number) => (
                          <React.Fragment key={j}>
                            {card.createdBy === global.user.id && (
                              <Grid
                                item
                                lg={global?.expandColumn !== -1 ? 2 : 6}
                                md={global?.expandColumn !== -1 ? 2 : 4}
                                xs={12}
                                sx={{ marginBottom: '20px' }}
                                key={j + '0'}
                              >
                                {/* <Box sx={{width:"100%"}}> */}
                                <RetroCard
                                  moveCard={moveCard}
                                  card={card}
                                  groups={cardGroups}
                                  currentGroupId={group.id}
                                  columnId={column.id}
                                  hideButtons={false}
                                  animate={true}
                                />
                                {/* </Box> */}
                              </Grid>
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </Grid>
                  <span
                    ref={surroundDiv}
                    style={{
                      display: 'none',
                    }}
                  ></span>
                </Box>
              ) : (
                <div
                  ref={containerRef}
                  style={{
                    overflowY: 'auto',
                    userSelect: 'none',
                    flexGrow: 2,
                  }}
                >
                  <DragDropContext onDragEnd={reorderNumbers}>
                    <Droppable droppableId="droppable">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {cardGroups.map((group, i) => (
                            <Drag key={i} draggableId={group.id.toString()} index={i}>
                              {/* <React.Fragment key={i}> */}
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <span {...provided.dragHandleProps}></span>
                                  <Grid
                                    container
                                    lg={12}
                                    item
                                    key={group.id}
                                    ref={e => (groupRefs[i] = e)}
                                    style={{
                                      marginBottom: '10px',
                                      padding: '3px',
                                      borderRadius: 0,
                                      background:
                                        group.name !== UNGROUPED ? groupColour : 'none',
                                    }}
                                  >
                                    <RetroCardGroup
                                      admin={global.user.userType == 2}
                                      group={group}
                                      column={column}
                                      columnId={column.id}
                                      provided={provided}
                                      showCollapse={
                                        group.name !== UNGROUPED &&
                                        // group.cards.length > 1 &&
                                        !groupCollapsed[i]
                                      }
                                      onCollapse={value => {
                                        groupCollapsed[i] = !groupCollapsed[i];
                                        setGroupCollapsed([...groupCollapsed]);
                                      }}
                                    >
                                      {group.name === UNGROUPED ||
                                        !groupCollapsed[i] ||
                                        // group.cards.length < 1 ||
                                        expandAllGroups ? (
                                        <div
                                          style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            justifyContent: 'flex-start',
                                            minHeight: '100px',
                                          }}
                                        >
                                          <span
                                            ref={e => {
                                              landingZones[i][0] = e as HTMLDivElement;
                                            }}
                                            style={{
                                              maxHeight: '0',
                                              margin: '0',
                                              padding: '0',
                                            }}
                                          ></span>
                                          {group.cards.map(
                                            (card: RetroCardType, j: number) =>
                                              (card.createdBy === global.user.id ||
                                                global.user.userType == 2 ||
                                                column.publish) && (
                                                <React.Fragment key={card.id}>
                                                  {group.name === UNGROUPED ||
                                                    j <
                                                    (groupCollapsed[i]
                                                      ? 2
                                                      : group.cards.length) ? (
                                                    <>
                                                      <Grid
                                                        item
                                                        lg={
                                                          global?.expandColumn !== -1
                                                            ? 2
                                                            : !location.pathname.includes('report') ? 6 : 4
                                                        }
                                                        md={
                                                          global?.expandColumn !== -1
                                                            ? 2
                                                            : !location.pathname.includes('report') ? 6 : 4
                                                        }
                                                        xs={12}
                                                        ref={e =>
                                                          cardRefCollector(
                                                            e as HTMLDivElement,
                                                            i,
                                                            j,
                                                            card
                                                          )
                                                        }
                                                        style={{
                                                          padding: '10px',
                                                        }}
                                                      >
                                                        <Draggable
                                                          nodeRef={nodeRef}
                                                          ref={ref => {
                                                            draggableRefs[i][j] = ref;
                                                          }}
                                                          disabled={
                                                            ended ||
                                                            global.leaveRetro ||
                                                            (card.locked &&
                                                              card.lockedBy !==
                                                              global.user.id)
                                                          }
                                                          onStart={(event, data) =>
                                                            handleStart(i, j, event, data)
                                                          }
                                                          onStop={(event, data) => {
                                                            handleStop(i, j, event, data);
                                                          }}
                                                          onDrag={(event, data) =>
                                                            handleDrag(i, j, event, data)
                                                          }
                                                          enableUserSelectHack={true}
                                                          cancel={'.can'}
                                                          handle=".handle"
                                                        >
                                                          <span
                                                            className={
                                                              global.user.userType == 2
                                                                ? 'handle'
                                                                : ''
                                                            }
                                                            id={i + ""}
                                                            ref={nodeRef}
                                                          >
                                                            <RetroCard
                                                              moveCard={moveCard}
                                                              card={card}
                                                              groups={cardGroups}
                                                              currentGroupId={group.id}
                                                              columnId={column.id}
                                                              hideButtons={false}
                                                              animate={true}
                                                            />
                                                          </span>

                                                        </Draggable>
                                                        {/* <div
                                                ref={ref =>
                                                  (placeholderRefs[i][j] = ref)
                                                }
                                              ></div> */}
                                                      </Grid>
                                                      <span
                                                        ref={e => {
                                                          landingZones[i][j + 1] =
                                                            e as HTMLDivElement;
                                                        }}
                                                        style={{
                                                          maxHeight: '0',
                                                          margin: '0',
                                                          padding: '0',
                                                        }}
                                                      ></span>
                                                    </>
                                                  ) : null}
                                                </React.Fragment>
                                              )
                                          )}
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                    </RetroCardGroup>
                                  </Grid></div>
                              )}

                              {/* </React.Fragment> */}
                            </Drag>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}

                    </Droppable>

                  </DragDropContext>
                  <span
                    ref={surroundDiv}
                    style={{ display: 'none' }}
                  ></span>
                </div>)}
            </>


          ),
          [column.groups, groupCollapsed]
        )}
        <>
          <RetroColumnBottom

            isXsUp={isXsUp}
            columnId={columnId} column={column} global={global}
            ended={ended}
            value={value}
            setValue={setValue}
            setEmojiId={setEmojiId}
            focusTextBox={focusTextBox}
            setMouseOver={setMouseOver} submit={submit}

          />
        </>
      </div>
    </ColumnComponent>
  );
  // }
}

