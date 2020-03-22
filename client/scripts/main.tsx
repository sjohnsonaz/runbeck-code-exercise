import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BodyScroll, DepthStack, Portal } from '@artistry/react';
import 'reflect-metadata';

import Layout from './views/Layout';

window.onload = function () {
    BodyScroll.init();
    DepthStack.init();
    Portal.addElement('layer-fixed', 'layer-fixed');
    Portal.addElement('layer-overlay', 'layer-overlay');
    Portal.addElement('layer-flyout', 'layer-flyout');
    ReactDom.render((
        <Layout />
    ), document.getElementById('layer-root'));
}
