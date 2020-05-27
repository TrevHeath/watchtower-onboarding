// @flow

import React from "react";
import { Alert } from "theme-ui";

const Ctx = React.createContext();

// Styled Components
// ==============================

const ToastContainer = (props) => (
  <div
    style={{ position: "fixed", right: 0, top: 0, zIndex: 1000 }}
    {...props}
  />
);
const Toast = ({ children, onDismiss, ...rest }) => (
  <Alert
    style={{
      margin: 10,
      padding: 10,
    }}
    onClick={onDismiss}
    {...rest}
  >
    {children}
  </Alert>
);

// Provider
// ==============================

let toastCount = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const add = ({ content, ...rest }) => {
    const id = toastCount++;
    const toast = { content, id, ...rest };

    setToasts([...toasts, toast]);
  };
  const remove = (id) => {
    const newToasts = toasts.filter((t) => t.id !== id);
    setToasts(newToasts);
  };
  // avoid creating a new fn on every render
  const onDismiss = (id) => () => remove(id);

  return (
    <Ctx.Provider value={{ add, remove }}>
      {children}
      <ToastContainer>
        {toasts.map(({ content, id, ...rest }) => {
          return (
            <Toast key={id} Toast={Toast} onDismiss={onDismiss(id)} {...rest}>
              {content}
            </Toast>
          );
        })}
      </ToastContainer>
    </Ctx.Provider>
  );
}

// Consumer
// ==============================

export const useToasts = () => React.useContext(Ctx);
