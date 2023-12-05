import React from "react";

interface Menu2Props {
    questions: React.JSX.Element[];
  }

export default function Menu2(props: Menu2Props){
    return(
        <div className="roleContainer">
            <h3 className="block text-sm font-semibold text-gray-800">Select questions</h3>
            <div className="roleResults">
                {props.questions}
            </div>
        </div>
    )
}