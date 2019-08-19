import * as winston from 'winston';

export type ClsContextInstance = {
  // tslint:disable
  get(k): any;
  // tslint:disable
  // @ts-ignore
  set(k, v): any;
};

const CONTEXT_KEY_DEFAULT = 'context';

export type ClsFormatterOptions = {
  cls: ClsContextInstance;
  contextKey?: string;
};

export const clsFormatter = winston.format((info, options: ClsFormatterOptions) => {
  // can't do anything if cls is not provided
  if (!options.cls) {
    return info;
  }
  const key = options.contextKey || CONTEXT_KEY_DEFAULT;
  const metadata = options.cls.get(key);

  return {...metadata, ...info};
});
