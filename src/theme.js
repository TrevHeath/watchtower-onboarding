import { bootstrap } from "@theme-ui/preset-bootstrap";

import nightOwl from "@theme-ui/prism/presets/night-owl.json";

export default {
  ...bootstrap,
  forms: {
    label: {
      fontSize: 1,
      fontWeight: "bold"
    }
  },
  alerts: {
    primary: {
      color: "white",
      bg: "primary"
    },
    error: {
      bg: "danger"
    },
    success: {
      bg: "success"
    }
  },

  styles: {
    ...bootstrap.styles,
    code: {
      ...nightOwl
    }
  }
};
