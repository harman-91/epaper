"use client";

const GloabalLinkMenu=({children, href, rel,className, title, target, data, eventName, onClick, ariaLabel, ...props})=>{
  const handleClick=(e)=>{
    if(data && eventName){
      window.dataLayer = window.dataLayer || [];      
      const eventData = {'event': eventName, ...data}
      dataLayer.push(eventData);
    }
    window.scroll(0, 0);
    if(onClick){onClick(e)}
  };
  return (<a className={className} title={title} href={href} rel={rel} target={target} onClick={handleClick} aria-label={ariaLabel} {...props}>{children}</a>);
};
export default GloabalLinkMenu;
