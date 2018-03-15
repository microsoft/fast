import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { set, get, cloneDeep } from 'lodash';
import TestPage from './components/TestPage';

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
        return (
            <TestPage />
        );
    }
}

/**
 * Primary render function for app. Called on store updates
 */
ReactDOM.render(
    <App />,
    document.getElementById('root')
);