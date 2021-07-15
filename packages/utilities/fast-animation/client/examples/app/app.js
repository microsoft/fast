import React from "react";
import ReactDOM from "react-dom";
import TestPage from "./components/TestPage";
/**
 * App component definition
 * @extends React.Component
 */
class App extends React.Component {
    /**
     * Renders the component
     * @return {function}
     */
    render() {
        return <TestPage />;
    }
}
/**
 * Primary render function for app. Called on store updates
 */
ReactDOM.render(<App />, document.getElementById("root"));
