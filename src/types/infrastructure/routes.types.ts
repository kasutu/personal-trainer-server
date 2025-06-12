import { Router } from "express";
import { basename, dirname } from "path";

/**
 * Abstract class representing a generic route.
 *
 * This class provides a basic structure for all route classes by initializing an Express router
 * and setting up a base path. The base path is dynamically determined using the caller's directory name.
 *
 * @example
 * // In a route file located in src/routes/v1/my-route.ts
 * export default class MyRoute extends Routes {
 *   constructor() {
 *     super({ path: "/my-path" });
 *     // Additional initialization...
 *   }
 * }
 */
export abstract class Routes {
  /**
   * The Express router for the route.
   */
  public readonly router: Router;

  /**
   * The base path for the route. Determined by the caller's directory and the provided path.
   */
  public readonly path: string;

  /**
   * Returns the directory of the file that called the route constructor.
   *
   * This static helper analyzes the error stack trace to determine the file's directory from
   * which the route was instantiated.
   *
   * @returns {string} The directory path of the caller.
   * @private
   */
  private static getCallerDir(): string {
    const originalFunc = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
      return stack;
    };
    const err = new Error();
    const stack = err.stack as unknown as NodeJS.CallSite[];
    Error.prepareStackTrace = originalFunc;
    // stack[0] is this function,
    // stack[1] is the constructor,
    // stack[2] is the caller of super()
    const callerFile = stack[2]?.getFileName();
    return callerFile ? dirname(callerFile) : "";
  }

  /**
   * Constructs a new Routes instance.
   *
   * @param {Object} options - Options for initializing the route.
   * @param {string} [options.path=""] - The specific route path to append to the base version path.
   * @param {string} [options.version] - The version or module name. Defaults to the caller's directory name.
   *
   * If `version` is equal to "routes", only the custom path is used.
   * Otherwise, the path is prefixed with `/{version}`.
   */
  constructor({
    path = "",
    version = basename(Routes.getCallerDir()),
  }: { version?: string; path?: string } = {}) {
    this.router = Router();
    if (version === "routes") {
      this.path = path;
    } else {
      this.path = `/${version}${path}`;
    }
  }
}
