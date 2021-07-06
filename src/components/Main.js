import { Route, Switch } from 'react-router-dom';
import ActivityPage from '../screens/ActivityPage';
import CreateGroupsPages from '../screens/CreateGroupsPage';
import DojoPage from '../screens/DojoPage';
import EditActivityPage from '../screens/EditActivityPage';
import EditNotePage from '../screens/EditNotePage';
import GetResetPasswordMailPage from '../screens/GetResetPasswordMailPage';
import ListActivitiesPage from '../screens/ListActivitiesPage';
import ListNotesPage from '../screens/ListNotesPage';
import ShowNotePage from '../screens/ShowNotePage';
import LoginPage from '../screens/LoginPage';
import ProfilePage from '../screens/ProfilePage';
import ResetPasswordPage from '../screens/ResetPasswordPage';

export default function Main() {
  return (
    <main className="p-6 m-auto xl:w-7/12 md:w-9/12">
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/createGroups" component={CreateGroupsPages} />
        <Route exact path="/dojo">
          <DojoPage />
        </Route>
        <Route exact path="/notes" component={ListNotesPage} />
        <Route exact path="/notes/edit/:id" component={EditNotePage} />
        <Route exact path="/notes/:id" component={ShowNotePage} />
        <Route exact path="/activities/:id" component={ActivityPage} />
        <Route exact path="/activities" component={ListActivitiesPage} />
        <Route exact path="/activities/edit/:id" component={EditActivityPage} />
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
