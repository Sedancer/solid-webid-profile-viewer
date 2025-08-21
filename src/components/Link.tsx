import React from "react";

type Props = {
    children: React.ReactNode;
    href?: string;
};
export default function Link({href = "", children = ""}: Props) {
    return (
        <a
            href={href}
            className="
                relative inline-block text-indigo-600 font-medium
                transition-colors duration-300
                hover:text-indigo-800
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50
              "
        >
            <span className="relative z-10">{children}</span>
        </a>
    );
};
