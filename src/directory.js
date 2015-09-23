export const keys = [
  "map",
  "list",
  "tuple",
  "import",
  "constant",
  "public",
  "uinteger",
  "integer",
  "static",
  "enum",
]

export const javascript = {
  name: "JavaScript",
  syntax: {
    map: {
      code: [
        {
          code: "{key: value}",
        },
        {
          code: "object[key] = value;"
        }
      ]
    },
    import: {
      code: [
        {
          code: `import * as Const from "./const"`,
          note: "Exports accessible via Const.[export]"
        },
        {
          code: `import Const from "./const"`,
          note: "Imports default export"
        }
      ]
    }
  }
}

export const c_sharp = {
  name: "C#",
  syntax: {
    import: {
      code: [
        {
          code: `using Color = System.Drawing.Color;`,
        },
        {
          code: `using System.Threading;`,
        }
      ]
    }
  }
}
