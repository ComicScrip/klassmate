import Button from '@material-ui/core/Button';
import Avatar from './components/Avatar';
import Header from './components/Header';
import './index.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <p className="text-red-700">Klassmate</p>
        <Button variant="contained" color="secondary">
          Hello World
        </Button>
        <Avatar
          avatarUrl="https://randomuser.me/api/portraits/women/25.jpg"
          alt="user avatar"
        />
        <Avatar
          avatarUrl="https://randomuser.me/api/portraits/women/25.jpg"
          alt="user avatar"
          size={100}
          borderColor="red"
        />
      </main>
    </>
  );
}

export default App;
