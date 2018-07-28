// import { css } from "emotion";
// import { withProps } from "recompose";

// export const withStyleFn = styles => {
//   return withProps(({ className }) => ({
//     styles: (...params) => mergeClassName(styles, className, params)
//   }));
// };

// export const withStyle = styles => {
//   return withProps(({ className }) => mergeClassName(styles, className));
// };

// function mergeClassName(styles, className, params) {
//   className = className ? " " + className : "";

//   const customStyles = getStyles(styles, params);

//   return {
//     className: customStyles + className
//   };
// }

// function getStyles(styles, params) {
//   const customStyles =
//     typeof styles === "function" ? css(styles(...params)) : css(styles);

//   return customStyles;
// }
