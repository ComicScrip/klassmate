import { Route, Switch } from 'react-router';
import ActivityPage from '../screens/ActivityPage';
import CreateGroupsPages from '../screens/CreateGroupsPage';
import DojoPage from '../screens/DojoPage';
import LoginPage from '../screens/LoginPage';
import ProfilePage from '../screens/ProfilePage';

export default function Main() {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/createGroups" component={CreateGroupsPages} />
        <Route exact path="/dojo" component={DojoPage} />
        <Route path="/activity" component={ActivityPage} />
      </Switch>
    </main>
  );
}
