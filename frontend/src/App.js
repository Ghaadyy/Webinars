import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Webinars from "./webinar/pages/Webinars";
import Homepage from "./shared/pages/Homepage";
import WebinarDeatilPage from "./webinar/pages/WebinarDetailPage";
import { AuthContext } from "./shared/context/auth-context";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Auth from "./user/pages/Auth";
import UserWebinars from "./user/pages/UserWebinars";
import AddWebinar from "./webinar/pages/AddWebinar";
import UpdateWebinar from "./webinar/pages/UpdateWebinar";
import { useAuth } from "./shared/hooks/auth-hook";
import UpdateProfile from "./user/pages/UpdateProfile";

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Homepage />
        </Route>
        <Route path="/browse" exact>
          <Webinars />
        </Route>
        <Route path="/profile" excat>
          <UpdateProfile />
        </Route>
        <Route path="/webinars/new">
          <AddWebinar />
        </Route>
        <Route path="/webinars/edit/:wid" excat>
          <UpdateWebinar />
        </Route>
        <Route path="/webinars/user/:userId" excat>
          <UserWebinars />
        </Route>
        <Route path="/webinars/:wid" excat>
          <WebinarDeatilPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Homepage />
        </Route>
        <Route path="/browse" exact>
          <Webinars />
        </Route>
        <Route path="/webinars/:wid" excat>
          <WebinarDeatilPage />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
