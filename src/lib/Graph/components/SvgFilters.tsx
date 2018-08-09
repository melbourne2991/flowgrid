import * as React from "react";

export const SvgFilters: React.SFC<{}> = () => {
  return (
    <React.Fragment>
      <filter id="filter-shadow">
        <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>
    </React.Fragment>
  );
};
