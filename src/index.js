import React from "react";
import * as Directory from "./directory";

const Comparison = React.createClass({
  propTypes: {
    languages: React.PropTypes.array.isRequired,
    keywords: React.PropTypes.array.isRequired
  },
  render() {
    let {languages, keywords} = this.props;
    console.log(languages, keywords);
    return (
        <table>
          <thead>
            <tr>
              <th></th>
              {languages.map((language, index) => <th key={index}>{language.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {keywords.map((keyword) => (
              <tr key={"keyword_" + keyword}>
                <th>{keyword}</th>
                {languages.map((language, index) => <td key={index}>{language.syntax[keyword] ? language.syntax[keyword].code.map((syntax, sindex) => <pre key={sindex}>{syntax.code}</pre>) : "N/A"}</td>)}
              </tr>
              ))}
          </tbody>
        </table>
    );
  }
});


const Main = React.createClass({
  render() {
    return (
        <div>
          <h1>Code Dictionary</h1>
          <Comparison keywords={["map", "import"]} languages={[Directory.javascript, Directory.c_sharp]}/>
        </div>
    );
  }
});

React.render(<Main/>, document.getElementById("main"));
