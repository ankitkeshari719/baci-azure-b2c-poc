import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Board from './screens/Board';
import { BoardProvider } from './contexts/BoardContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { ErrorBoundary } from './contexts/ErrorBoundary';
import { ErrorProvider } from './contexts/ErrorContext';
import Feedback from './screens/Feedback';
import { GlobalProvider } from './contexts/GlobalContext';
import { Offboarding } from './screens/Offboarding';
import { LandingPage } from './screens/LandingPage';
import { RetroDetails } from './screens/RetroDetails';
import { ParticipantWaitingPage } from './screens/ParticipantWaitingPage';
import { CreateNewRetro } from './screens/CreateRetroPage';
import { AvatarNamePage } from './screens/AvatarNamePage';
import { CreateRetroMain } from './screens/CreateRetro/CreateRetroMain';
import PulseCheck from './screens/PulseCheck';
import ReportScreen from './screens/ReportScreen';
import { SnackMessage } from './elements/SnackMessage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';

import {
  MsalProvider,
  useMsal,
} from '@azure/msal-react';
import {
  IPublicClientApplication,
} from '@azure/msal-browser';
import { SocketProvider } from './contexts/SocketProvider';
import { StartRetro } from './screens/StartRetro';
import { Grid } from '@mui/material';
import { PageNotFound } from './screens/PageNotFound';

type AppProps = {
  instance: IPublicClientApplication;
};

function MainContent() {
  const { instance } = useMsal();
  return (
    <Grid container spacing={0}>
      <Outlet />
    </Grid>
  );
}

export default function App({ instance }: AppProps) {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <SocketProvider>
          <GlobalProvider>
            <BrowserRouter>
              <BoardProvider>
                <ConfirmProvider>
                  <ThemeProvider theme={theme}>
                    <MsalProvider instance={instance}>
                      <Routes>
                        <Route path="/" element={<LandingPage></LandingPage>} />
                        <Route
                          path="/createretro"
                          element={<CreateNewRetro></CreateNewRetro>}
                        />
                        <Route
                          path="/createretrowithtemplate"
                          element={<CreateRetroMain></CreateRetroMain>}
                        />
                        <Route
                          path="/join/:id"
                          element={<AvatarNamePage></AvatarNamePage>}
                        />
                        <Route
                          path="/retrodetails"
                          element={<RetroDetails></RetroDetails>}
                        />
                        <Route
                          path="/offboarding"
                          element={<Offboarding></Offboarding>}
                        />
                        <Route
                          path="*"
                          element={<PageNotFound></PageNotFound>}
                        />
                        <Route path="/board" element={<MainContent />}>
                          <Route
                            path=":id/waiting"
                            element={
                              <ParticipantWaitingPage></ParticipantWaitingPage>
                            }
                          />
                          <Route
                            path=":id/startRetro"
                            element={<StartRetro></StartRetro>}
                          />

                          <Route
                            path=":id/pulsecheck"
                            element={<PulseCheck />}
                          />
                          <Route path=":id/feedback" element={<Feedback />} />
                          <Route path=":id" element={<Board />} />
                        </Route>
                        <Route path="/report/:id" element={<ReportScreen />} />
                      </Routes>
                    </MsalProvider>
                    <SnackMessage />
                  </ThemeProvider>
                </ConfirmProvider>
              </BoardProvider>
            </BrowserRouter>
          </GlobalProvider>
        </SocketProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
}
