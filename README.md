# A simple HTTP server implemented in NodeJS without further dependencies

## Usage

- This server returns the content of all files in a directory called public.

- To start the server:

```
node index.js
```

- Access the server on default Port 3000

  - From the Browser
    [http://localhost:3000]

  - From the console

    ```
    curl http://localhost:3000
    ```

    to get the just response header:

    ```
    curl -o - -I http://localhost:3000
    ```
