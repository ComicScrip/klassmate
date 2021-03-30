import Avatar from './components/Avatar';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header />
      <main>
        Klassmate
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
