import { parse } from "./index";

describe("#parse", () => {
  test("should parse bool parameter", () => {
    expect(parse("-l")).toMatchObject({
      l: true,
    });

    expect(() => parse("-ll")).toThrow();
  });

  test("should parse integer parameter", () => {
    expect(parse("-p 8000")).toMatchObject({
      p: 8000,
    });

    expect(parse("-p -8000")).toMatchObject({
      p: -8000,
    });

    expect(() => parse("-p")).toThrow();
    expect(() => parse("-p abcd")).toThrow();
  });

  test("should parse string parameter", () => {
    expect(parse("-d /usr/logs")).toMatchObject({
      d: "/usr/logs",
    });

    expect(() => parse("-d")).toThrow();
    expect(() => parse("-d -i")).toThrow();
  });

  test("should handle schema default", () => {
    expect(parse("-l")).toEqual({
      l: true,
      p: 3030,
      d: "",
    });

    expect(parse("")).toEqual({
      l: false,
      p: 3030,
      d: "",
    });
  });

  test("should order not a problem combination of different parameters", () => {
    expect(parse("-l -p 8000 -d usr/local")).toEqual({
      l: true,
      p: 8000,
      d: "usr/local",
    });

    expect(parse("-p 8000 -l -d usr/local")).toEqual({
      l: true,
      p: 8000,
      d: "usr/local",
    });
  });

  test("should schema checking still find error for combination of different parameters", () => {
    expect(() => parse("-l abcd -p 8000 -d usr/local")).toThrow();
    expect(() => parse("-p abcd -l -d usr/local")).toThrow();
  });
});
