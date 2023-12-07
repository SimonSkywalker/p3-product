import React from "react";

interface Menu1Props {
  roles: React.JSX.Element[];
}

export default function Menu1(props: Menu1Props) {
  return (
    <div className="roleContainer">
      <h3 className="block text-sm font-semibold text-gray-800">Select roles to get data from</h3>
      <div className="checkboxContainer">
      {props.roles}
      </div>
    </div>
  );
}
