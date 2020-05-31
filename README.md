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
  await loadEnviroment();
  console.log(Deno.env.get("TEST")) // => test
```

You can also use variables inside the ```.env``` file

```dotevn
TEST=test
TEST_1=$TEST
```

```typescript
  import { loadEnv } from "https://deno.land/x/deno_dotenv/mod.ts";
  await loadEnviroment();
  console.log(Deno.env.get("TEST_1")) // => test
```
