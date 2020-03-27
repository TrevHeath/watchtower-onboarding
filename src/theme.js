import theme from "@theme-ui/preset-bootstrap";

import nightOwl from "@theme-ui/prism/presets/night-owl.json";

export default {
  ...theme,
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
  buttons: {
    primary: {
      color: "white",
      bg: "primary"
    },
    link: {
      bg: "transparent"
    },
    success: {
      bg: "success"
    }
  },

  styles: {
    ...theme.styles,
    padding: "1rem",
    table: {
      width: "100%",
      my: 4,
      // borderColor: colors.gray,
      borderCollapse: "separate",
      borderSpacing: 0
    },

    code: {
      ...nightOwl
    }
  }
};
