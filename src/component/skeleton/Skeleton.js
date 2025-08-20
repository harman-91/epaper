/* eslint-disable react/no-array-index-key */
import React, { useContext } from "react";
import { SkeletonThemeContext } from "./SkeletonThemeContext.js";
import css from '@/styles/css/skeleton.module.css'
// Default value for animation enablement
const defaultEnableAnimation = true;

// Function to convert style options into CSS properties
function styleOptionsToCssProperties({
  baseColor,
  highlightColor,
  width,
  height,
  borderRadius,
  circle,
  direction,
  duration,
  enableAnimation = defaultEnableAnimation,
}) {
  const style = {};

  if (direction === "rtl") style["--animation-direction"] = "reverse";
  if (typeof duration === "number") style["--animation-duration"] = `${duration}s`;
  if (!enableAnimation) style["--pseudo-element-display"] = "none";

  if (typeof width === "string" || typeof width === "number") style.width = width;
  if (typeof height === "string" || typeof height === "number") style.height = height;

  if (typeof borderRadius === "string" || typeof borderRadius === "number")
    style.borderRadius = borderRadius;

  if (circle) style.borderRadius = "50%";

  if (typeof baseColor !== "undefined") style["--base-color"] = baseColor;
  if (typeof highlightColor !== "undefined") style["--highlight-color"] = highlightColor;

  return style;
}

// Skeleton component
export function Skeleton({
  count = 1,
  wrapper: Wrapper,
  className: customClassName,
  containerClassName,
  containerTestId,
  circle = false,
  style: styleProp,
  ...originalPropsStyleOptions
}) {
  const contextStyleOptions = useContext(SkeletonThemeContext);

  const propsStyleOptions = { ...originalPropsStyleOptions };

  // Remove undefined properties from `propsStyleOptions`
  for (const [key, value] of Object.entries(originalPropsStyleOptions)) {
    if (typeof value === "undefined") {
      delete propsStyleOptions[key];
    }
  }

  // Combine context and prop styles
  const styleOptions = {
    ...contextStyleOptions,
    ...propsStyleOptions,
    circle,
  };

  // Merge final styles, with `styleProp` having the least priority
  const style = {
    ...styleProp,
    ...styleOptionsToCssProperties(styleOptions),
  };

  let className = css["reactloadingskeleton"];
  if (customClassName) className += ` ${customClassName}`;

  const inline = styleOptions.inline ?? false;

  const elements = [];

  const countCeil = Math.ceil(count);

  for (let i = 0; i < countCeil; i++) {
    let thisStyle = style;

    // Handle fractional skeleton for non-integer counts
    if (countCeil > count && i === countCeil - 1) {
      const width = thisStyle.width ?? "100%";
      const fractionalPart = count % 1;
      const fractionalWidth =
        typeof width === "number"
          ? width * fractionalPart
          : `calc(${width} * ${fractionalPart})`;
      thisStyle = { ...thisStyle, width: fractionalWidth };
    }

    const skeletonSpan = (
      <span className={className} style={thisStyle} key={i}>
        &zwnj;
      </span>
    );

    if (inline) {
      elements.push(skeletonSpan);
    } else {
      elements.push(
        <React.Fragment key={i}>
          {skeletonSpan}
          <br />
        </React.Fragment>
      );
    }
  }

  return (
    <span
      className={containerClassName}
      data-testid={containerTestId}
      aria-live="polite"
      aria-busy={styleOptions.enableAnimation ?? defaultEnableAnimation}
    >
      {Wrapper
        ? elements.map((el, i) => <Wrapper key={i}>{el}</Wrapper>)
        : elements}
    </span>
  );
}
