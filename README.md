# personal-trainer-server

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Creating New Endpoint Flow

1. `services` (interacts with drivers, no try catch)
   1.1. `workflows` (contains complex logic, interact with services)
2. `controllers` (interacts with services/workflows, has try catch, errors are forwarded to express)
3. `routes` (interacts with controllers, manages request, calls the correct controllers)

   ## Remarks

   - Ensure that each route file correctly exports a route class using the `export default` syntax.
   - If the module fails to export a default class (for example, if named exports are used), an error will occur.

   ### Example

   ```javascript
   // Correct export of a route class
   export default class MyRoute extends Routes {
     // Route implementation...
   }
   ```

## Notes on hard deletes

hopefully we dont use this normally will use this when data is not needed for auditing

Next steps:

- require token when calling this funtion
