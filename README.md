# winston-cls-formatter
[![codecov](https://codecov.io/gh/microsoftly/winston-cls-formatter/branch/master/graph/badge.svg)](https://codecov.io/gh/microsoftly/winston-cls-formatter) [![CircleCI](https://circleci.com/gh/microsoftly/winston-cls-formatter/tree/master.svg?style=svg)](https://circleci.com/gh/microsoftly/winston-cls-formatter/tree/master)

## Install
`npm i winston-cls-formatter`
## Quickstart
```nodejs
const winston = require('winston');
const winstonClsFormatter = require('winston-cls-formatter');

// cls is some Continuation Local Storage management instance that is already bound to a session

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: clsFormatter({ cls })
});

cls.set('context', { a: 1 });

logger.info('hi');
// prints to console: { level: 'info', message: 'hi', a: 1 }
```

Any object with the methods `get(k)` and `set(k, v)` are accepted as a cls arg. This can allow this formatter to work in many more scenarios. 

Better docs to come down the line!

