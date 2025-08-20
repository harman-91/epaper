"use client";

const GloabalLink = ({
  children,
  href,
  rel,
  className,
  title,
  target,
  data,
  eventName,
  onClick,
  ariaLabel,
  ...props
}) => {
  const handleClick = (e) => {
    if (data && eventName) {
      window.dataLayer = window.dataLayer || [];
      const eventData = { event: eventName, ...data };
      dataLayer.push(eventData);
    }

    if (onClick) {
      onClick(e);
    }
  };
  return (
    <a
      className={className}
      title={title}
      href={href}
      rel={rel}
      target={target}
      onClick={handleClick}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </a>
  );
};
export default GloabalLink;
