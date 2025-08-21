import React from 'react';

type Props = {
    children: React.ReactNode;
    className?: string;
};

export default function Card({ children, className = "" }: Props) {
    return (
        <div className={`bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${className}`}>
            {children}
        </div>
    );
}