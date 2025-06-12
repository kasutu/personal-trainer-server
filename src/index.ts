import "reflect-metadata";
import { App } from "~/app";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { logger } from "~/utils/logger";

/**
 * Recursively collects all .ts and .js files in the specified directory.
 *
 * @param directory The directory to search.
 * @param fileList An accumulation of file paths.
 * @returns An array of file paths.
 */
function getRouteFiles(directory: string, fileList: string[] = []): string[] {
  const files = readdirSync(directory);
  for (const file of files) {
    const fullPath = join(directory, file);
    const fileStat = statSync(fullPath);
    if (fileStat.isDirectory()) {
      getRouteFiles(fullPath, fileList);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".js")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

/**
 * Loads and initializes all route modules from the routes directory.
 *
 * This function scans the designated routes directory for files ending with ".ts" or ".js".
 * For each file found, it dynamically imports the module and expects a default export—a route class.
 * It then instantiates the class, returning an array of route instances.
 *
 * @remarks
 * Ensure that each route file correctly exports a route class using the `export default` syntax.
 * If the module fails to export a default class (e.g., named exports were used), an error will occur.
 *
 * Example of the correct export in a route file:
 *
 *   // Correct export of a route class
 *   export default class MyRoute {
 *       // Route implementation...
 *   }
 *
 * @returns {Promise<any[]>} A promise that resolves to an array of instantiated route objects.
 *
 * @async
 */

async function loadRoutes() {
  const routesDir = join(__dirname, "routes");
  logger.info(`Loading routes from: ${routesDir}`);

  const routeFiles = getRouteFiles(routesDir);
  logger.info(
    `Found ${routeFiles.length} route file(s): ${routeFiles.join(", ")}`
  );

  const routes = await Promise.all(
    routeFiles.map(async (file) => {
      logger.info(`Loading route from file: ${file}`);
      const module = await import(file);
      if (!module.default) {
        logger.error(
          `The module in file "${file}" does not provide a default export. ` +
            `Please export your route class using the \`export default\` syntax. For example:\n\n` +
            `  // Incorrect export using named export:\n` +
            `  export class MyRoute extends Routes { /*...*/ }\n\n` +
            `  // Correct export using default export:\n` +
            `  export default class MyRoute extends Routes { /*...*/ }`
        );
      }
      logger.info(`Successfully loaded route: ${file}`);
      return new module.default();
    })
  );

  logger.info("All routes loaded successfully");
  return routes;
}

(async () => {
  const routes = await loadRoutes();
  const app = new App(routes);
  app.listen();
})();
