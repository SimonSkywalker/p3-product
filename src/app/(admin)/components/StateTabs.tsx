import React from 'react';

interface TabsProps {
    activeTab: number;
    setActiveTab: (tabIndex: number) => void;
    tabLabels: string[];
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, tabLabels }) => {
    return (
        <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row max-w-screen-2xl mx-auto" role="tablist">
            {tabLabels.map((label, index) => (
                <li key={label + index} className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                    <a
                        className={
                            "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                            (activeTab === index + 1
                                ? "text-white bg-palette-500"
                                : "text-palette-500 bg-white-300")
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(index + 1);
                        }}
                        data-toggle="tab"
                        href={`#link${index + 1}`}
                        role="tablist"
                    >
                        {label}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default Tabs;