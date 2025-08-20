"use client";

import Link from "next/link";

const GlobalLink = ({ children, href, data, eventName, onClick, ...props }) => {
    const handleClick = (e) => {
        if (data && eventName) {
            const eventData = { 'event': eventName, ...data }

            dataLayer.push(eventData);
        }
        window.scroll(0, 0);

        if (onClick) {
            onClick(e);
        }
    };

    return (
        <Link href={href} onClick={handleClick} {...props}>
            {children}
        </Link>
    );
};
export default GlobalLink;
