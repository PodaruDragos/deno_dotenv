# deno_dotenv

You need to create a `.env` file in the root of your project. 


### Simple Example

Content of the .env file
```dotevn
TEST=test
```

And then you use it like

```typescript
import { loadEnv } from "https://deno.land/x/deno_dotenv/mod.ts";

const main = async (): Promise<void> => {
  try {
  await loadEnviroment();
  console.log(Deno.env.get("TEST")) // => test
  } catch (error) {
    throw new Error(error);
  }
}

main();

```

You can also use variables inside the ```.env``` file

```dotevn
NAME=John
SURNAME=DOE
FULL_NAME=name: ${NAME}, surname: $DOE
```

```typescript
console.log(Deno.env.get("FULL_NAME")) // => name: John, surname: Doe
```


**To use this package in your code you need to run deno with 2 args**: 
*--allow-read to give access to reading local files*
*--allow-end to give access to the enviroment variables*

```typescript
deno run --allow-read --allow-env ./mod.ts
```