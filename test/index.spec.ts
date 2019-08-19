import { expect } from 'chai';
import { clsFormatter } from '../src';
import { TestTransport } from './TestTransport';
import clsHooked = require('cls-hooked');
import winston = require('winston');

describe('Winston With Context', () => {
  let testTransport: TestTransport;
  let logMessageIterator: IterableIterator<any>;
  let logger: winston.Logger;
  let cls: clsHooked.Namespace;

  beforeEach(() => {
    cls = clsHooked.createNamespace('test_namespace');

    testTransport = new TestTransport();
    logMessageIterator = testTransport.dequeueMessage();

    // @ts-ignore
    logger = winston.createLogger({
      transports: [testTransport],
      format: clsFormatter({ cls })
    })
  });

  it('context is applied to log metadata when defined', async () => {
    return cls.runPromise(async () => {
      // arrange
      const context = {
        a: 1,
        b: [1, 2, 3],
        c: {
          hello: 'there'
        }
      };
      cls.set('context', context);

      // action
      logger.info('hi');

      // assert
      const v = logMessageIterator.next();
      expect(v).not.to.be.undefined;
      expect(v.value).to.deep.eq({ level: 'info', message: 'hi', ...context });
    });
  });

  it('metadata is unchanged when context is not defined', async () => {
    return cls.runPromise(async () => {
      // action
      logger.info('hi');

      // assert
      const v = logMessageIterator.next();
      expect(v).not.to.be.undefined;
      expect(v.value).to.deep.eq({ level: 'info', message: 'hi' });
    });
  });

  it('updated context is reflected in logs', async () => {
    return cls.runPromise(async () => {
      // arrange
      const context = {
        a: 1,
        b: [1, 2, 3],
        c: {
          hello: 'there'
        }
      };
      cls.set('context', context);
      logger.info('hi');
      cls.set('context', { ...context, a: 2 });
      logger.info('there');

      // assert
      let v = logMessageIterator.next();
      expect(v).not.to.be.undefined;
      v = logMessageIterator.next();
      expect(v).not.to.be.undefined;

      expect(v.value).to.deep.eq({ level: 'info', message: 'there', ...context, a: 2 });
    });
  });

  it('custom context keys override the default context key', async () => {
    logger = winston.createLogger({
      transports: [testTransport],
      format: clsFormatter({
        cls,
        contextKey: 'customContextKey'
      })
    });

    return cls.runPromise(async () => {
      // arrange
      const context = {
        a: 1,
        b: [1, 2, 3],
        c: {
          hello: 'there'
        }
      };
      cls.set('customContextKey', context);

      // action
      logger.info('hi');

      // assert
      const v = logMessageIterator.next();
      expect(v).not.to.be.undefined;
      expect(v.value).to.deep.eq({ level: 'info', message: 'hi', ...context });
    });
  });

  it('Explicit metadata overrides the context', async () => {
    return cls.runPromise(async () => {
      // arrange
      const context = {
        a: 1,
        b: [1, 2, 3],
        c: {
          hello: 'there'
        }
      };
      cls.set('context', context);

      // action
      logger.info('hi', { a: 2 });

      // assert
      const v = logMessageIterator.next();
      expect(v).not.to.be.undefined;
      expect(v.value).to.deep.eq({ level: 'info', message: 'hi', ...context, a: 2 });
    });
  });

  it('If cls is not provided, there are no visible side effects', () => {
    logger = winston.createLogger({
      transports: [testTransport],
      format: clsFormatter({}),
    });

    return cls.runPromise(async () => {
      // arrange
      cls.set('context', { a: 1 });
      // action
      logger.info('hi');

      // assert
      const v = logMessageIterator.next();
      expect(v).not.to.be.undefined;
      expect(v.value).to.deep.eq({ level: 'info', message: 'hi' });
    });
  });
});
