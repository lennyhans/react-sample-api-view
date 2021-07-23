import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home } from './Home';

export const AppRouter = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/home" component={Home} />
                <Route path="/" component={Home} />
            </Switch>
        </Router>
    );
}