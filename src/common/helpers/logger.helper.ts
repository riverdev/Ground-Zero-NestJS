import { LogLevel } from '@nestjs/common/services/logger.service';

/**
 * This function receives a boolean, if true then sets the log levels
 * to fit a production log levels.
 * Otherwise it uses all log levels.
 *
 * The levels and environments by best practice is:
 *
 * Development:   [ debug , verbose , log , warn, error ]
 * Staging:       [ log , warn, error ]
 * Production:    [ warn, error ]
 *
 * @param isProduction
 * @returns string[]
 */

function getLogLevels(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    console.log('Yes true');
    return ['warn', 'error'];
  }

  //todo @2022-08-16-2312: Update this func to support 3 or more variations
  //todo  this means that the input will probably a string.

  return ['error', 'warn', 'log', 'verbose', 'debug'];
}
export default getLogLevels;
