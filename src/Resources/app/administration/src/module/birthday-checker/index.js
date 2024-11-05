Shopware.Component.register('birthday-test', () => import('../page/birthday-test'));

import deDE from '../../snippet/de-DE.json';
import enGB from '../../snippet/en-GB.json';

Shopware.Module.register('birthday-checker', {
    type: 'plugin',
    name: 'birthdayChecker',
    title: 'birthday.administration.menuItem',
    description: 'birthday.administration.description',
    color: '#ff3d58',
    icon: 'default-shopping-paper-bag-product',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        test: {
            component: 'birthday-test',
            path: 'birthday/test'
        }
    },

    navigation: [{
        label: 'birthday.administration.navItem',
        color: '#ffffff',
        path: 'birthday.checker.test',
        icon: 'default-shopping-paper-bag-product',
        parent: 'sw-customer',
        position: 100
    }]
});
