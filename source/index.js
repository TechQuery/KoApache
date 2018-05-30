'use strict';

const fork = require('child_process').fork;


module.exports = function (root = '.',  port = 0,  CORS) {

    const child = fork(
        require.resolve('./core'),
        [root,  '-p',  port,  CORS && '--CORS'],
        {
            execArgv:    [ ],
            silent:      true
        }
    );

    return  new Promise((resolve, reject) => {

        child.on('message',  (event) => {

            switch ( event.type ) {
                case 'ready':    return  resolve( event.data );
                case 'error':    {

                    let error = event.data;

                    reject(Object.assign(
                        new global[ error.name ]( error.message ),  error
                    ));
                }
            }
        });
    });
};
