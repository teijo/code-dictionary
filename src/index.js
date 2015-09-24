import React from "react";
import * as Directory from "./directory";

const Filter = React.createClass({
  propTypes: {
    items: React.PropTypes.array.isRequired
  },
  render() {
    let {items} = this.props;
    return (
        <nav>
          <ul>
            {items.map((item) => (
              <li key={item}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </nav>
    );
  }
});


const Comparison = React.createClass({
  propTypes: {
    languages: React.PropTypes.array.isRequired,
    keywords: React.PropTypes.array.isRequired
  },
  render() {
    let {languages, keywords} = this.props;
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
          <Filter items={Directory.keywords}/>
          <Filter items={Directory.languages.map(l => l.name)}/>
          <Comparison keywords={Directory.keywords} languages={Directory.languages}/>
        </div>
    );
  }
});

React.render(<Main/>, document.getElementById("main"));
