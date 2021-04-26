import { Route, Switch } from 'react-router';
import ActivityPage from '../screens/ActivityPage';
import CreateGroupsPages from '../screens/CreateGroupsPage';
import CreateNotePage from '../screens/CreateNotePage';
import DojoPage from '../screens/DojoPage';
import LoginPage from '../screens/LoginPage';
import NotesPage from '../screens/NotesPage';
import ProfilePage from '../screens/ProfilePage';

export default function Main() {
  return (
    <main className="p-6">
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/createGroups" component={CreateGroupsPages} />
        <Route exact path="/dojo" component={DojoPage} />
        <Route path="/activity" component={ActivityPage} />
        <Route exact path="/notes" component={NotesPage} />
        <Route exact path="/notes/new" component={CreateNotePage} />
      </Switch>
    </main>
  );
}
