import qs from 'query-string';
import { createContext, useCallback, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import createPersistedState from 'use-persisted-state';
import API from '../APIClient';
import history from '../history';

const useLoggedState = createPersistedState('logged');

export const CurrentUserContext = createContext();

export default function CurrentUserContextProvider({ children }) {
  const { addToast } = useToasts();
  const [profile, setProfile] = useState();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useLoggedState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleUnexpectedError = () =>
    addToast('An unexpected error occured', { appearance: 'error' });

  const getProfile = useCallback(async () => {
    setLoadingProfile(true);
    let data = null;
    try {
      data = await API.get('/currentUser').then((res) => res.data);
      setProfile(data);
      setIsLoggedIn(true);
    } catch (err) {
      window.console.error(err);
      setIsLoggedIn(false);
    } finally {
      setLoadingProfile(false);
    }
    return data;
  }, []);

  const login = useCallback(async ({ email, password, stayConnected }) => {
    setIsAuthenticating(true);
    try {
      await API.post('/auth/login', { email, password, stayConnected });
      const { redirectUrl } = qs.parse(window.location.search);
      if (redirectUrl) history.push(redirectUrl);
      addToast('Logged in successfully', { appearance: 'success' });
      await getProfile();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        addToast('Wrong email or password', { appearance: 'error' });
      } else handleUnexpectedError();
    } finally {
      setIsAuthenticating(false);
    }
  });

  const updateProfile = useCallback(
    async (attributes) => {
      setSavingProfile(true);
      const formData = new FormData();
      Object.keys(attributes).forEach((prop) => {
        formData.append(prop, attributes[prop]);
      });
      try {
        const updatedProfile = await API.patch(
          `/users/${profile.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        ).then((res) => res.data);
        setProfile(updatedProfile);
        addToast('Profile successfully updated', {
          appearance: 'success',
        });
      } catch (err) {
        window.console.error(err);
        handleUnexpectedError();
      } finally {
        setSavingProfile(false);
      }
    },
    [profile]
  );

  const logout = useCallback(async () => {
    try {
      setIsLoggedIn(false);
      await API.get('auth/logout');
      addToast('Logged out successfully', { appearance: 'success' });
      setProfile(undefined);
      history.push('/');
    } catch (err) {
      addToast('Could not logout', { appearance: 'error' });
    }
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        profile,
        loadingProfile,
        savingProfile,
        getProfile,
        updateProfile,
        isLoggedIn,
        logout,
        login,
        isAuthenticating,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}
