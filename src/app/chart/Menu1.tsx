import React from "react";

interface Menu1Props {
  roles: React.JSX.Element[];
}

export default function Menu1(props: Menu1Props) {
  return (
    <>
      <h3>Select roles to get data from</h3>
      <form className="flex flex-col">{props.roles}</form>
    </>
  );
}
