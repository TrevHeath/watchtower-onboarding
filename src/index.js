import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "theme-ui";

import "./styles.css";

import Onboarding from "./routes/Onboarding";
import Admin from "./routes/admin";
import { ApolloProvider } from "@apollo/react-hooks";

import { Router } from "@reach/router";
import theme from "./theme";
import client from "./services/Apollo";
import { PublicRoute, ProtectedRoute } from "./components/routes";
import Login from "./routes/admin/Login";
import UserManagement from "./routes/admin/UserManagement";
import AgencyActivity from "./routes/admin/Activity";
import { ToastProvider } from "./components/Toasts";
import Prism from "@theme-ui/prism";

const components = {
  pre: ({ children }) => <>{children}</>,
  code: Prism
};

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme} components={components}>
        <ToastProvider>
          <Router>
            <PublicRoute component={Onboarding} path="/" />
            <ProtectedRoute path="admin" component={Admin} />
            <ProtectedRoute path="admin/users" component={UserManagement} />
            <ProtectedRoute path="admin/activity" component={AgencyActivity} />
            <PublicRoute component={Login} path="/admin/login" />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
