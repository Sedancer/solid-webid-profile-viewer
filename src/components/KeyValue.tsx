import React from "react";

type Props = {
    value: React.ReactNode | string;
    label: string;
};

const KeyValue = ({label = "", value = "Value missing"}: Props) => {
    return (
        <div className="relative border border-slate-800 rounded-md p-3 inline-flex items-center gap-2 min-w-[330px] mb-4">
            <span className="text-gray-400 dark:bg-slate-900 font-medium uppercase text-sm font-semibold absolute top-[-8px] px-[5px]">{label}:</span>
            <span className="font-medium">{value}</span>
        </div>
    );
};

export default KeyValue;
