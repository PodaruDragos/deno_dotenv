export type IndexObject = { [key: string]: string };

export const loadEnv = async (): Promise<void> => {
  try {
    const fileData = await Deno.readFile("./.env");
    const decoder = new TextDecoder("utf-8");
    const content = decoder.decode(fileData);
    return attachVariablesToEnv(content);
  } catch (_error) {
    throw new Error(".env file was not found");
  }
};

const attachVariablesToEnv = (
  content: string,
): void => {
  const parsedContent = parseContent(content);
  for (const [key, val] of Object.entries(parsedContent)) {
    Deno.env.set(key, val);
  }
};

const expandContent = (parsedContent: IndexObject): void => {
  const VARIABLE_REGEXP = /(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g;

  for (let [key, value] of Object.entries(parsedContent)) {
    if (value.match(VARIABLE_REGEXP)) {
      value = value.replace("$", "");

      const matchedKey = Object
        .keys(parsedContent)
        .find((objectKey): boolean => {
          return objectKey === value;
        });

      if (typeof matchedKey !== "undefined") {
        parsedContent[key] = parsedContent[matchedKey];
      }
    }
  }
};

const parseContent = (content: string): IndexObject => {
  const NEW_LINE_REGEXP = /\n|\r|\r\n/;
  const QUOTE_REGEXP = /^['"](.*)['"]$/;

  const lines = content
    .split(NEW_LINE_REGEXP)
    .filter((line: string): boolean => line.trim() !== "");

  const parsedContent: IndexObject = Object
    .fromEntries(
      lines.map((entry: string): [string, string] => {
        let [key, val] = entry.split("=");
        val = !QUOTE_REGEXP.test(val)
          ? val.trim()
          : val.replace(QUOTE_REGEXP, val);
        return [key.trim(), val];
      }),
    );

  expandContent(parsedContent);

  return parsedContent;
};
