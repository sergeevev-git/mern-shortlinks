import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { CreatePage } from "./pages/createPage";
import { LinksPage } from "./pages/linksPage";
import { DetailPage } from "./pages/detailPage";
import { AuthPage } from "./pages/authPage";

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/links" exact>
                    <LinksPage />
                </Route>
                <Route path="/create" exact>
                    <CreatePage />
                </Route>
                <Route path="/detail/:id" exact>
                    <DetailPage />
                </Route>
                <Redirect to="/create"></Redirect>
            </Switch>
        );
    }
    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/"></Redirect>
        </Switch>
    );
};
