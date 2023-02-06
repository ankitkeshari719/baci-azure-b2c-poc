import * as React from 'react';
import { Box } from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useRetro } from '../../helpers';
import { useAzureAuth } from '../../msal/azureauth';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ActionType } from '../../contexts/GlobalContext';
import { BaciDetailsTab } from './BaciDetailsTab';
import { RetroTemplateTab } from './RetroTemplateTab';
import { PulseCheckTab } from './PulseCheckTab';
import { UserDetailsTab } from './UserDetailsTab';
import { pulseCheckInterface, pulseChecksData, templatesData } from './const';
import { UserTypeArray } from '../../constants';
import { getRetro } from '../../msal/services';
import { StartRetroWithTemplate } from './StartRetroWithTemplate';

type Props = {
  handleStartRetro: () => void;
  isRetroStart: boolean;
};

export function CreateRetroWithTemplatePage({
  handleStartRetro,
  isRetroStart,
}: Props) {
  const { id } = useParams();
  const retro = useRetro();
  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const timeFrameRef = React.useRef<HTMLSelectElement | null>(null);
  const [localRetroName, setLocalRetroName] = React.useState(
    sessionStorage.getItem('retroname') || ''
  );
  const [activePanel, setActivePanel] = React.useState('detailsPanel');
  const [isStartRetro, setIsStartRetro] = React.useState(false);
  {
    /* BACI Details Panel Constant */
  }
  const [retroName, setRetroName] = React.useState('');
  const [retroTimeFrame, setRetroTimeFrame] = React.useState('');
  const [retroNameError, setRetroNameError] = React.useState('');
  const [retroNameWarning, setRetroWarning] = React.useState('');
  const [isTimeFrameSet, setIsTimeFrameSet] = React.useState(id ? true : false);

  {
    /* Template Panel Constant */
  }
  const [templates, setTemplates] = React.useState(templatesData);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  {
    /* Pulse Check Panel Constant */
  }
  const [pulseChecks, setPulseChecks] =
    React.useState<Array<pulseCheckInterface> | null>(pulseChecksData);
  const [selectedPulseCheck, setSelectedPulseCheck] =
    React.useState<pulseCheckInterface | null>(null);

  {
    /* User Details Panel Constant */
  }
  const [userName, setUserName] = React.useState('');
  const [userNameError, setUserNameError] = React.useState('');
  const [userNameWarning, setUserNameWarning] = React.useState('');
  const [selectedAvatar, setAvatar] = React.useState('');
  const [avatarSelectionError, setAvatarSelectionError] = React.useState('');

  React.useEffect(() => {
    dispatch({
      type: ActionType.CLOSE_CURRENT_RETRO,
    });
  }, []);

  React.useEffect(() => {
    const initialPulseCheck = pulseChecksData.filter(e => e.checked == true);
    const initialTemplate: any = templatesData.filter(e => e.checked == true);
    setSelectedTemplate(initialTemplate && initialTemplate[0]);
    setSelectedPulseCheck(initialPulseCheck && initialPulseCheck[0]);
  }, []);

  useAzureAuth();

  // Function to handle Retro Name on change
  function handleRetroNameChange(e: React.SetStateAction<string>) {
    if (e == '') {
      setRetroWarning('');
    } else {
      setRetroNameError('');
    }
    if (e.length >= 60) {
      let count = 80 - e.length;

      if (count === 0) {
        setRetroWarning('No more character remaining');
      } else {
        setRetroWarning('Character remaining -' + `${count}`);
      }
    } else {
      setRetroWarning('');
    }
    setRetroName(e);
  }

  // Function to handle Time Frame on change
  function handleTimeFrame(e: React.SetStateAction<string>) {
    setRetroTimeFrame(e);
    setIsTimeFrameSet(false);
  }

  // Function to template selection
  function handleCheckedTemplate(selectedTemplateData: any) {
    let data: any = templates?.map(template => {
      if (
        selectedTemplateData &&
        template.templateId === selectedTemplateData.templateId
      ) {
        template.checked = true;
      } else {
        template.checked = false;
      }
      return template;
    });
    setTemplates(data);
    setSelectedTemplate(selectedTemplateData);
  }

  function handleSelectClick(selectedTemplateId: string) {
    let data: any = templates?.map(template => {
      if (template.templateId === selectedTemplateId) {
        template.checked = true;
      } else {
        template.checked = false;
      }
      return template;
    });
    setTemplates(data);
  }

  // Function to handle pulse check selection
  function handlePulseCheck(selectedPulseCheck_l: pulseCheckInterface | null) {
    let data: any = pulseChecks?.map(pulseCheck => {
      if (selectedPulseCheck_l && pulseCheck.id === selectedPulseCheck_l.id) {
        pulseCheck.checked = true;
      } else {
        pulseCheck.checked = false;
      }
      return pulseCheck;
    });
    setPulseChecks(data);
    setSelectedPulseCheck(selectedPulseCheck_l);
  }

  // Function to handle User Name on change
  const handleUsername = (e: string) => {
    setUserNameWarning('');
    setUserNameError('');
    if (e.length >= 25) {
      let count = 30 - e.length;
      if (count === 0) {
        setUserNameWarning('No more charachter remaining');
      } else {
        setUserNameWarning('Character remaining - ' + `${count}`);
      }
    }
    setUserName(e);
  };

  // Function to handle Avatar change
  const onClickAvatar = (avatarName: string) => {
    setAvatar(avatarName);
    setAvatarSelectionError('');
  };

  // Function to handle next button on click
  const onClickBack = (previousPanel: string) => {
    setActivePanel(previousPanel);
  };

  // Function to create a New Retro
  const create = async () => {
    sessionStorage.setItem('retroname', retroName);
    setLocalRetroName(retroName);
    const userType: number =
      global?.user?.id == global.currentRetro?.creatorId
        ? UserTypeArray[1].id
        : UserTypeArray[0].id;

    if (
      retroName !== '' &&
      retroTimeFrame !== '' &&
      userName !== '' &&
      selectedAvatar !== '' &&
      selectedPulseCheck != null &&
      selectedTemplate != null
    ) {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      setRetroNameError('');
      setIsTimeFrameSet(false);
      await retro
        .createTemplate(
          { name: retroName },
          retroTimeFrame,
          '',
          userName,
          selectedAvatar,
          userType,
          selectedPulseCheck,
          selectedTemplate
        )
        .then(
          res => {
            dispatch({ type: ActionType.CREATE_RETRO, payload: {} });
            dispatch({
              type: ActionType.SET_PREFERRED_NICKNAME,
              payload: {
                preferredNickname: userName,
                avatar: selectedAvatar,
                userType,
              },
            });
            dispatch({
              type: ActionType.SET_LOADING,
              payload: { loadingFlag: false },
            });
            // Call Join Retro
            // Get Retro
            getRetro(res.id as string)
              .then(retro => {
                if (retro && retro.id) {
                  dispatch({
                    type: ActionType.SET_CURRENT_RETRO,
                    payload: { retro },
                  });
                }
              })
              .catch(e => {
                console.log('error', e);
              });
            setIsStartRetro(true);
            handleStartRetro();
          },
          err => {
            console.log('err', err);
            dispatch({
              type: ActionType.SET_LOADING,
              payload: { loadingFlag: false },
            });
          }
        );
    }
    sessionStorage.setItem('retroname', retroName);
  };

  // Function to handle next button on click
  const onClickNext = (currentPanel: string, nextPanel: string) => {
    if (
      currentPanel === 'detailsPanel' &&
      (retroName === '' || retroTimeFrame === '')
    ) {
      if (retroName === '') {
        setRetroNameError('Please enter retro name.');
      }
      if (retroTimeFrame === '') {
        setIsTimeFrameSet(true);
      }
      return;
    }

    if (
      currentPanel === 'userDetailPanel' &&
      (userName === '' || selectedAvatar === '')
    ) {
      if (selectedAvatar === '') {
        setAvatarSelectionError('Please select avatar');
      }
      if (userName === '') {
        setUserNameError('Please enter your name');
      }
      return;
    }

    setActivePanel(nextPanel);
    if (
      currentPanel === 'userDetailPanel' &&
      retroName != '' &&
      retroTimeFrame != '' &&
      selectedTemplate != null &&
      selectedPulseCheck != null &&
      userName != '' &&
      selectedAvatar != ''
    ) {
      create();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {!isRetroStart ? (
        <Box component="div" whiteSpace="normal" className="createRetroText">
          Create new BACI retro
        </Box>
      ) : (
        <Box component="div" whiteSpace="normal" className="createRetroText">
          First Design Sprint is ready to start
        </Box>
      )}
      <Box sx={{ mt: 4, minWidth: '100%' }}>
        <BaciDetailsTab
          activePanel={activePanel}
          retroName={retroName}
          retroTimeFrame={retroTimeFrame}
          retroNameError={retroNameError}
          retroNameWarning={retroNameWarning}
          timeFrameRef={timeFrameRef}
          isTimeFrameSet={isTimeFrameSet}
          handleRetroNameChange={handleRetroNameChange}
          handleTimeFrame={handleTimeFrame}
          onClickNext={onClickNext}
        />
        <RetroTemplateTab
          activePanel={activePanel}
          onClickNext={onClickNext}
          onClickBack={onClickBack}
          selectedTemplate={selectedTemplate}
          handleCheckedTemplate={handleCheckedTemplate}
          handleSelectClick={handleSelectClick}
          templates={templates}
        />
        <PulseCheckTab
          activePanel={activePanel}
          onClickNext={onClickNext}
          onClickBack={onClickBack}
          selectedPulseCheck={selectedPulseCheck}
          handlePulseCheck={handlePulseCheck}
        />
        <UserDetailsTab
          activePanel={activePanel}
          onClickBack={onClickBack}
          onClickNext={onClickNext}
          handleUsername={handleUsername}
          userName={userName}
          userNameError={userNameError}
          userNameWarning={userNameWarning}
          selectedAvatar={selectedAvatar}
          avatarSelectionError={avatarSelectionError}
          onClickAvatar={onClickAvatar}
        />
      </Box>
      {isStartRetro && (
        <Box
          sx={{
            mt: 2,
            minWidth: '100%',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <StartRetroWithTemplate />
        </Box>
      )}
    </Box>
  );
}
