type FlagType = "boolean" | "number" | "string";

const schema: Record<
  string,
  { type: FlagType; default: number | boolean | string }
> = {
  l: {
    type: "boolean",
    default: false,
  },
  p: {
    type: "number",
    default: 3030,
  },
  d: {
    type: "string",
    default: "",
  },
};

export function parse(cmd: string): unknown {
  const result = Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [key, value.default])
  );

  if (!cmd) {
    return result;
  }

  const args = cmd.split(" ");
  while (args.length) {
    const arg = args.shift();
    const flag = parseFlag(arg);
    if (!flag) {
      throw new Error(`Arg ${arg} is not a valid flag.`);
    } else if (flag.type === "boolean") {
      result[flag.key] = true;
    } else if (flag.type === "number") {
      const parsedNumber = parseNumber(args.shift());
      if (parsedNumber === undefined) {
        throw new Error(
          `Arg ${flag.key} require a valid integer value. E.g., -${flag.key} 8000`
        );
      }
      result[flag.key] = parsedNumber;
    } else if (flag.type === "string") {
      const stringArg = args.shift();
      if (isFlagPattern(stringArg) || !stringArg) {
        throw new Error(
          `Arg ${flag.key} require a valid string value. E.g. -${flag.key} abc. However ${stringArg} is not valid.`
        );
      }
      result[flag.key] = stringArg;
    }
  }

  return result;
}

function isFlagPattern(arg: string): boolean {
  return /^-[a-zA-Z]+$/.test(arg);
}

function parseFlag(arg: string): { key: string; type: FlagType } | undefined {
  if (isFlagPattern(arg)) {
    const key = arg.substring(1);
    const matchedSchema = schema[key];
    if (matchedSchema) {
      return { key, type: matchedSchema.type };
    }
  }
}

function parseNumber(arg: string): number | undefined {
  const parsedNumber = Number(arg);
  return Number.isNaN(parsedNumber) ? undefined : parsedNumber;
}
