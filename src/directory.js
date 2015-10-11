import _ from "lodash";

const syntax = {
  "operators": {
    "assignment": [
      {
        code: "=",
        users: ["JavaScript", "Java", "Python"]
      }
    ],
    "equality": [
      {
        code: "==",
        users: ["JavaScript", "Java", "Python"]
      },
      {
        code: "===",
        users: ["JavaScript"]
      }
    ],
    "get": {
      "array": [
        {
          code: "[index]",
          users: ["JavaScript", "Java", "Python"]
        }
      ]
    },
    "stringConcatenation": [
      {
        code: "+",
        users: ["JavaScript", "Java", "Python"]
      }
    ]
  },
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
    ],
    "exceptions": {
      "throw": [
        {
          code: "throw object",
          users: ["Java", "JavaScript"]
        },
        {
          code: "raise object",
          users: ["Python"]
        }
      ],
      "catch": [
        {
          code: "try { } catch(e) { } finally { }",
          users: ["JavaScript"]
        },
        {
          code: "try { } catch(type e1) { }  catch(type2|type3 e2) { } finally { }",
          users: ["Java"]
        },
        {
          code: "try:\n" +
                "  block\n" +
                "except(type e1):\n" +
                "  block\n" +
                "except(type2 e):\n" +
                "  block\n" +
                "else:\n" +
                "  block\n" +
                "finally:\n" +
                "  block",
          users: ["Python"]
        }
      ]
    }
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
    ],
    "lambda": [
      {
        code: "(arg1, arg2) => block",
        users: ["JavaScript"]
      },
      {
        code: "lambda arg1, arg2: block",
        users: ["Python"]
      },
      {
        code: "singleArg => statement",
        users: ["JavaScript"]
      },
      {
        code: "(arg1, arg2) -> block",
        users: ["Java"]
      },
      {
        code: "singleArg -> statement",
        users: ["Java"]
      }
    ]
  },
  "primitives": {
    "atom": [
      {
        code: "Symbol('description');",
        users: ["JavaScript"]
      }
    ],
    "array": [
      {
        code: "[identifier, identifier, ...]",
        users: ["JavaScript", "Python"]
      },
      {
        code: "new type[]{identifier, identifier, ...}",
        users: ["Java"]
      }
    ],
    "hashmap": [
      {
        code: "{key: value, key2: value2}",
        users: ["JavaScript", "Python"]
      },
      {
        code: "new HashMap() {{ put(key1, value1); put(key2, value2); ... }}",
        users: ["Java"]
      }
    ]
  },
  "variables": {
    "readonly": [
      {
        code: "const identifier = value;",
        users: ["JavaScript"]
      },
      {
        code: "final type identifier = value;",
        users: ["Java"]
      }
    ],
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
    ],
    "destructuring": {
      "list": [
        {
          code: "a, b = [1, 2]",
          users: ["Python"]
        },
        {
          code: "var [a, b] = [1, 2]",
          users: ["JavaScript"]
        }
      ],
      "hashmap": [
        {
          code: "var {a, b} = {a: 1, b: 2}",
          users: ["JavaScript"]
        }
      ]
    }
  },
  "package": {
    "import": {
      "all": [
        {
          code: `import Const from "./const"`,
          users: ["JavaScript"]
        },
        {
          code: "from package import *",
          users: ["Python"]
        },
        {
          code: "import package",
          users: ["Python"]
        },
        {
          code: "import path.to.package.*;",
          users: ["Java"]
        }
      ],
      "partial": [
        {
          code: `import {Foo, Bar} from "./const"`,
          users: ["JavaScript"]
        },
        {
          code: "from package import func1, func2",
          users: ["Python"]
        },
        {
          code: "import path.to.package.ClassName;",
          users: ["Java"]
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
