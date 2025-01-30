import jestConfig from "next/jest.js";

const createJestConfig = jestConfig({
  dir: "./",
});

/** @type {import ("jest").Config} */
const config = {
  collectCoverage: false,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // Only needed for what is not covered by tsconfig's `paths` option
    "^@/(.*)$": "<rootDir>/$1",
    "^utils/(.*)$": "<rootDir>/utils/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  preset: "ts-jest",
};

export default createJestConfig(config);
