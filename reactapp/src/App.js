import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';

import wishlist from './reducers/article.reducer';
import ScreenHome from './ScreenHome';
import ScreenArticlesBySource from './ScreenArticlesBySource'
import ScreenMyArticles from './ScreenMyArticles'
import ScreenSource from './ScreenSource'
import selectedLang from './reducers/language.reducer'
import token from './reducers/token.reducer';
const store = createStore(combineReducers({wishlist, token, selectedLang}))

function App() {
  return (
  <Provider store={store}>

    <Router>
      <Switch>
        <Route component={ScreenHome} path="/" exact />
        <Route component={ScreenSource} path="/screensource" exact />
        <Route component={ScreenArticlesBySource} path="/screenarticlesbysource/:id" exact />
        <Route component={ScreenMyArticles} path="/screenmyarticles" exact />
      </Switch>
    </Router>

  </Provider>
  );
}

export default App;
