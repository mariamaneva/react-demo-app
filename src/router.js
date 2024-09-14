import React from 'react'
import {Route, BrowserRouter, Switch} from 'react-router-dom'

// Components
import Home from './components/home'
import About from './components/about'
import Products from './components/products'
import Contact from './components/contact'
import NotFound from './components/not-found'
import Navigation from './components/navigation'

const Router = () => {
    return (
        <BrowserRouter>
            <div>
                <Navigation />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/products" component={Products} />
                    <Route path="/contact" component={Contact} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default Router