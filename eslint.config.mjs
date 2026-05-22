import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "deploy/**", "tmp/**"],
    rules: {
      "react-hooks/incompatible-library": "off"
    }
  }
];

export default eslintConfig;
