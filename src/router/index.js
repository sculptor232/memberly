import React, { useEffect } from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import Admin from "../modes/admin";
import Login from "../modes/login";
import Product from "../modes/product";
import Install from "../modes/install";
import AuthRouter from "../utils/authUtil";
import Error404 from "../pages/errorPage/error404";
import Error500 from "../pages/errorPage/error500";
import i18n from "../i18n";

const Router = () => {
  useEffect(() => {
    if (localStorage.getItem("lng")) {
      i18n.changeLanguage(localStorage.getItem("lng"));
    } else {
      if (navigator.language.indexOf("zh") > -1) {
        i18n.changeLanguage("zh");
        localStorage.setItem("lng", "zh");
      } else {
        i18n.changeLanguage("en");
        localStorage.setItem("lng", "en");
      }
    }
  }, []);
  return (
    <HashRouter>
      <Switch>
        <Route component={Install} exact path="/install" />
        <Route component={Login} exact path="/login" />
        <Route component={Product} path="/product" />
        <Route component={Error404} path="/error/404" />
        <Route component={Error500} path="/error/500" />
        <AuthRouter path="/" component={Admin} />
      </Switch>
    </HashRouter>
  );
};

export default Router;
