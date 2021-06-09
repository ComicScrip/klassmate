import { CircularProgress } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { ToastProvider } from 'react-toast-notifications';
import Header from './components/Header';
import Main from './components/Main';
import CurrentUserContextProvider, {
  CurrentUserContext,
} from './contexts/currentUser';
import './index.css';

function App() {
  return (
    <ToastProvider
      autoDismiss
      autoDismissTimeout={3000}
      placement="bottom-center"
    >
      <CurrentUserContextProvider>
        <AppContents />
      </CurrentUserContextProvider>
    </ToastProvider>
  );
}

function AppContents() {
  const { loadingProfile, getProfile } = useContext(CurrentUserContext);
  const [profileLoadedOnce, setProfileLoadedOnce] = useState(false);

  useEffect(() => {
    (async () => {
      if (!profileLoadedOnce) {
        await getProfile();
        setProfileLoadedOnce(true);
      }
    })();
  }, [loadingProfile]);

  return (
    <>
      <Header />
      {profileLoadedOnce ? (
        <Main />
      ) : (
        <div className="mt-40 flex justify-center">
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default App;
