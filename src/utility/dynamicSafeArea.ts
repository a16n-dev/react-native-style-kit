type SafeAreaUtilities = {
  p_safe: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
  };
  px_safe: {
    paddingLeft: number;
    paddingRight: number;
  };
  py_safe: {
    paddingTop: number;
    paddingBottom: number;
  };
  pt_safe: { paddingTop: number };
  pb_safe: { paddingBottom: number };
  pl_safe: { paddingLeft: number };
  pr_safe: { paddingRight: number };
  m_safe: {
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
  };
  mx_safe: {
    marginLeft: number;
    marginRight: number;
  };
  my_safe: {
    marginTop: number;
    marginBottom: number;
  };
  mt_safe: { marginTop: number };
  mb_safe: { marginBottom: number };
  ml_safe: { marginLeft: number };
  mr_safe: { marginRight: number };
  top_safe: { top: number };
  bottom_safe: { bottom: number };
  left_safe: { left: number };
  right_safe: { right: number };
  inset_safe: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};

export function dynamicSafeArea(insets: {
  top: number;
  bottom: number;
  left: number;
  right: number;
}): SafeAreaUtilities {
  return {
    p_safe: {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    px_safe: {
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    py_safe: {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    pt_safe: { paddingTop: insets.top },
    pb_safe: { paddingBottom: insets.bottom },
    pl_safe: { paddingLeft: insets.left },
    pr_safe: { paddingRight: insets.right },
    m_safe: {
      marginTop: insets.top,
      marginBottom: insets.bottom,
      marginLeft: insets.left,
      marginRight: insets.right,
    },
    mx_safe: {
      marginLeft: insets.left,
      marginRight: insets.right,
    },
    my_safe: {
      marginTop: insets.top,
      marginBottom: insets.bottom,
    },
    mt_safe: { marginTop: insets.top },
    mb_safe: { marginBottom: insets.bottom },
    ml_safe: { marginLeft: insets.left },
    mr_safe: { marginRight: insets.right },
    top_safe: { top: insets.top },
    bottom_safe: { bottom: insets.bottom },
    left_safe: { left: insets.left },
    right_safe: { right: insets.right },
    inset_safe: {
      top: insets.top,
      bottom: insets.bottom,
      left: insets.left,
      right: insets.right,
    },
  };
}
