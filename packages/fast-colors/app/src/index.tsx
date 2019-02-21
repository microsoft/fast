import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css"
import PaletteEditor from "./PaletteEditor";

const App: React.FC<{}> = () => {
  return (
    <PaletteEditor />
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
