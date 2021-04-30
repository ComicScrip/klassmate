import { ToastProvider } from 'react-toast-notifications';
import Header from './components/Header';
import Main from './components/Main';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <Header />
      <Main />
    </ToastProvider>
  );
}

export default App;
