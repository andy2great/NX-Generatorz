/* eslint-disable @typescript-eslint/no-empty-function */
import 'jest-preset-angular/setup-jest';

global.console = {
  ...console,
  warn: () => {},
  info: () => {},
};
