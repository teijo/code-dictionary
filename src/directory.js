import _ from "lodash";

export const languages = [
  {
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
  }, {
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
      },
      lambda: {
        code: [
          {
            code: `(a, b) => { a + b }`,
          },
          {
            code: `call(a => a + 1)`,
          }
        ]
      }
    }
  }
];

let duplicateKeywords = languages.reduce((kws, language) => { Object.keys(language.syntax).forEach(s => kws.push(s)); return kws; }, []);

export const keywords = _.unique(duplicateKeywords);
