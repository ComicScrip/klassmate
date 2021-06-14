import { Route, Switch } from 'react-router-dom';
import ActivityPage from '../screens/ActivityPage';
import CreateGroupsPages from '../screens/CreateGroupsPage';
import DojoPage from '../screens/DojoPage';
import EditNotePage from '../screens/EditNotePage';
import GetResetPasswordMailPage from '../screens/GetResetPasswordMailPage';
import ListNotesPage from '../screens/ListNotesPage';
import LoginPage from '../screens/LoginPage';
import ProfilePage from '../screens/ProfilePage';
import ResetPasswordPage from '../screens/ResetPasswordPage';
import ShowNotePage from '../screens/ShowNotePage';

export default function Main() {
  return (
    <main className="p-6">
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/createGroups" component={CreateGroupsPages} />
        <Route exact path="/dojo">
          <DojoPage />
        </Route>
        <Route path="/activity" component={ActivityPage} />
        <Route exact path="/notes" component={ListNotesPage} />
        <Route exact path="/notes/edit/:id" component={EditNotePage} />
        <Route exact path="/notes/:id" component={ShowNotePage} />
        <Route
          exact
          path="/password-reset-instructions"
          component={GetResetPasswordMailPage}
        />
        <Route exact path="/reset-password" component={ResetPasswordPage} />
      </Switch>
    </main>
  );
}
