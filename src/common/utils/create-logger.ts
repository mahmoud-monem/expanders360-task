import { LoggerService } from "@nestjs/common";
import safeStringify from "fast-safe-stringify";
import { WinstonModule } from "nest-winston";
import { NestLikeConsoleFormatOptions } from "nest-winston/dist/winston.interfaces";
import { utilities as nestWinstonModuleUtilities } from "nest-winston/dist/winston.utilities";
import { inspect } from "node:util";
import * as winston from "winston";

export interface LoggerOptions extends NestLikeConsoleFormatOptions {
  enableSentry?: boolean;
  useOriginalNestLogFormat?: boolean;
}

/**
 * safely create json log line
 *
 * @param {winston.Logform.TransformableInfo} info - input data for the log line
 * @param {string} appName - passed from the settings
 * @param {LoggerOptions} options - developer options
 * @returns {string} - the log line to print
 */
export const jsonLineFormatTransformer = (
  info: winston.Logform.TransformableInfo,
  appName: string,
  options: LoggerOptions,
): string => {
  // careful, all fields that are not enumerated here will end up in "meta"
  const { message, level, context, timestamp, ms, ...meta } = info;

  // todo: handle level "info" vs. level "log" matching - document via tests

  // better to run it through safeStringify even if we do the prettify step later
  const logLine = `${safeStringify({
    message,
    timestamp,
    level,
    appName,
    context,
    ms,
    meta,
  })}`;

  if (options.prettyPrint) {
    return inspect(JSON.parse(logLine), {
      depth: null,
      colors: options.colors,
    });
  }

  return logLine;
};

/**
 * Return winston.format for the custom json log line
 *
 * @param {string} appName - passed from the settings
 * @param {LoggerOptions} options - developer options
 * @returns {winston.Logform.Format} formatted winston-compatible line
 */
export const jsonLineFormat = (appName: string, options: LoggerOptions): winston.Logform.Format =>
  winston.format.printf(info => jsonLineFormatTransformer(info, appName, options));

/**
 * Format the log to either show the original nestjs log line, or json format.
 * Pretty print and colors options are applied to both.
 *
 * @param {string} appName - passed from the settings
 * @param {LoggerOptions} options - developer options
 * @returns {winston.Logform.Format} formatted winston-compatible line with an option for original nest-like log line
 */
const nestLikeOrJsonLogLine = (appName: string, options: LoggerOptions): winston.Logform.Format => {
  if (options.useOriginalNestLogFormat) {
    return nestWinstonModuleUtilities.format.nestLike(appName, options);
  }
  return jsonLineFormat(appName, options);
};

/**
 * Creates winston logger
 *
 * @param {string} appName - Application name
 * @param {LoggerOptions} options - Console print options
 * @returns {LoggerService} - Created logger
 */
export function createLogger(appName: string, options: LoggerOptions = {}): LoggerService {
  const transports = [new winston.transports.Console()];

  return WinstonModule.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), nestLikeOrJsonLogLine(appName, options)),
    transports,
  });
}
