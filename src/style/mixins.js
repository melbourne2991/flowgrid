export function flexContainer() {
  return {
    width: "100%",
    height: "100%",
    display: "flex"
  };
}

export function boxSpacing(theme) {
  return {
    ...theme.mixins.gutters(),
    paddingTop: `${theme.spacing.unit * 2}px`,
    paddingBottom: `${theme.spacing.unit * 2}px`
  };
}
