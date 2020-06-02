export type IndexObject = { [key: string]: string };

export const loadEnv = async (): Promise<void> => {
  let fileData: Uint8Array | null = null;
  try {
    fileData = await Deno.readFile("./.env");
  } catch (_error) {
    throw new Error(".env file was not found");
  }

  if (fileData !== null) {
    processFileData(fileData);
  }
};

const processFileData = (fileData: Uint8Array): void => {
  const decoder = new TextDecoder("utf-8");
  const content = decoder.decode(fileData);
  return attachVariablesToEnv(content);
};

const attachVariablesToEnv = (
  content: string,
): void => {
  const parsedContent = parseContent(content);
  for (const [key, val] of Object.entries(parsedContent)) {
    Deno.env.set(key, val);
  }
};

const expandVariables = (parsedContent: IndexObject, value: string): string => {
  const IS_VARIABLE_REGEXP = /(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g;

  return (value.match(IS_VARIABLE_REGEXP) || [])
    .reduce((accumulator: string, currentValue: string): string => {
      const IS_VARIABLE_GROUP_REGEXP = /(.?)\${?([a-zA-Z0-9_]+)?}?/g;

      const [match, delimitator, matchedKey] =
        IS_VARIABLE_GROUP_REGEXP.exec(currentValue) || [];

      let value = parsedContent[matchedKey || ""];
      value = expandVariables(parsedContent, value);
      return accumulator.replace(match.substring(delimitator.length), value);
    }, value);
};

const expandContent = (parsedContent: IndexObject): void => {
  for (let [key, value] of Object.entries(parsedContent)) {
    parsedContent[key] = expandVariables(parsedContent, value);
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
