import _ from "lodash";

export const data = {
  "JavaScript": {
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
    "import.all": {
      code: [
        {
          code: `import Const from "./const"`,
          note: "Imports default export"
        }
      ]
    },
    "import.module": {
      code: [
        {
          code: `import {Foo, Bar} from "./const"`,
          note: "Exports accessible via Const.[export]"
        }
      ]
    }
  },
  "C#": {
    "import.module": {
      code: [
        {
          code: `using Color = System.Drawing.Color;`
        },
      ]
    },
    "import.all": {
      code: [
        {
          code: `using System.Threading;`
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
};

export const languages = Object.keys(data);

let duplicateKeywords = languages
  .reduce((kws, language) => {
    Object.keys(data[language]).forEach(s => kws.push(s)); return kws;
  }, []);

export const keywords = _.unique(duplicateKeywords);
