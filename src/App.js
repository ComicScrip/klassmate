import { ToastProvider } from 'react-toast-notifications';
import Header from './components/Header';
import Main from './components/Main';
import CurrentUserContextProvider from './contexts/currentUser';
import './index.css';

function App() {
  return (
    <ToastProvider
      autoDismiss
      autoDismissTimeout={3000}
      placement="bottom-center"
    >
      <CurrentUserContextProvider>
        <Header />
        <Main />
      </CurrentUserContextProvider>
    </ToastProvider>
  );
}

export default App;
