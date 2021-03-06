
import React from 'react';
import { App } from './components/app';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';

let csrf = document.body.getAttribute('data-csrf');

if (csrf) {
    paypal.request.addHeaderBuilder(() => ({
        'x-csrf-token': csrf
    }));
}

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="/pattern/:pattern" component={App}/>
  </Router>
), document.getElementById('app'));


let buttonRender = paypal.Button.render;
paypal.Button.render = function(props = {}) {

    if (props.env && props.env !== 'production') {
        return buttonRender.apply(this, arguments);
    }

    if (props.client && props.client.production === '<insert production client id>') {
        props.client.production = 'Aco85QiB9jk8Q3GdsidqKVCXuPAAVbnqm0agscHCL2-K2Lu2L6MxDU2AwTZa-ALMn_N0z-s2MXKJBxqJ';
    }

    let onAuthorize = props.onAuthorize;
    props.onAuthorize = function(data, actions) {

        actions.payment.execute = function() {
            console.warn(`Execute inhibited in production mode; returning payment details without executing`);
            return actions.payment.get();
        };

        return onAuthorize.apply(this, arguments);
    };

    return buttonRender.apply(this, arguments);
};
