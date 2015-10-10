import _ from "lodash";

const syntax = {
  "comment": {
    "block": [
      {
        code: "/*comment*/",
        users: ["JavaScript", "Java"]
      },
      {
        code: "'''comment'''",
        users: ["Python"]
      }
    ],
    "line": [
      {
        code: "//comment",
        users: ["JavaScript", "Java"]
      },
      {
        code: "#comment",
        users: ["Python"]
      }
    ]
  },
  "controlflow": {
    "if": [
      {
        code: "if condition:\n"+
              "  block\n"+
              "elif condition:\n"+
              "  block\n"+
              "else:\n"+
              "  block",
        users: ["Python"]
      },
      {
        code: "if (condition) block else if (condition) block else block",
        users: ["Java", "JavaScript"]
      }
    ]
  },
  "function": {
    "declaration": [
      {
        code: "function identifier(arg1, arg2) { statements }",
        users: ["JavaScript"]
      },
      {
        code: "def identifier(arg1, arg2): statements",
        users: ["Python"]
      }
    ],
    "call": [
      {
        code: "identifier(arg1, arg2)",
        users: ["Python", "Java", "JavaScript"]
      }
    ]
  },
  "variables": {
    "localscope": [
      {
        code: "let identifier = value;\n"+
              "var identifier = value;",
        users: ["JavaScript"]
      },
      {
        code: "identifier = value",
        users: ["Python"]
      },
      {
        code: "type identifier = value;",
        users: ["Java"]
      }
    ]
  },
  "package": {
    "import": {
      "all": [
        {
          code: `import Const from "./const"`,
          users: ["JavaScript"]
        }
      ],
      "partial": [
        {
          code: `import {Foo, Bar} from "./const"`,
          users: ["JavaScript"]
        }
      ]
    }
  }
};

function read(prefix, object) {
  return Object.keys(object).reduce((agg2, k) => {
    if (object instanceof Array) {
      return object.reduce((agg, samples) => {
        samples.users.forEach(u => {
          if (!agg.hasOwnProperty(u)) {
            agg[u] = {};
          }
          agg[u][prefix] = {code: [{code: samples.code}]};
        });
        return agg;
      }, {});
    } else {
      return _.merge(agg2, read(prefix + "." + k, object[k]));
    }
  }, {});
}

export const data = read("", syntax);

export const languages = Object.keys(data);

let duplicateKeywords = languages
  .reduce((kws, language) => {
    Object.keys(data[language]).forEach(s => kws.push(s)); return kws;
  }, []);

export const keywords = _.unique(duplicateKeywords);
