import React from "react";
import Bacon from "Bacon";
import * as Directory from "./directory";

// ?a=b,c&d=e -> {a: ["b", "c"], d: ["e"]}
function fromQuery(queryString) {
  return queryString.slice(1).split("&").reduce((acc, kv) => {
    let [k, v] = kv.split("=");
    if (v === undefined) {
      return acc;
    }
    acc[k] = v.split(',').map(decodeURIComponent);
    return acc;
  }, {});
}

function toQuery(state) {
  return "?" + Object.keys(state).map(k => k + "=" + state[k].map(encodeURIComponent).join(",")).join("&");
}

const filterUpdateE = new Bacon.Bus();
const filtersP = filterUpdateE.scan(fromQuery(window.location.search), (state, update) => {
  if (!state.hasOwnProperty(update.type)) {
    state[update.type] = [];
  }
  if (state[update.type].indexOf(update.value) !== -1) {
    state[update.type] = state[update.type].filter(v => v !== update.value);
    if (state[update.type].length === 0) {
      delete state[update.type];
    }
  } else {
    state[update.type].push(update.value);
  }
  return state;
});

filtersP.onValue(state => history.pushState(null, null, toQuery(state)));

function updateFilter(name, item) {
  return (e) => {
    e.preventDefault();
    filterUpdateE.push({type: name, value: item});
  }
}

const Filter = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    selected: React.PropTypes.array.isRequired,
    items: React.PropTypes.array.isRequired
  },
  render() {
    let {items, name, selected} = this.props;
    return (
        <nav>
          <ul>
            <li>{name}</li>
            {items.map((item) => (
              <li className={selected.indexOf(item) !== -1 ? "selected" : ""} key={item}>
                <a href="#" onClick={updateFilter(name, item)}>{item}</a>
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
  propTypes: {
    filters: React.PropTypes.object.isRequired
  },
  render() {
    let {filters} = this.props;
    let selectedKeywords = filters.keywords || []
    let keywords = selectedKeywords.length > 0
      ? Directory.keywords.filter(k => selectedKeywords.indexOf(k) !== -1)
      : Directory.keywords;
    let selectedLanguages = filters.languages || []
    let languages = selectedLanguages.length > 0
      ? Directory.languages.filter(l => selectedLanguages.indexOf(l.name) !== -1)
      : Directory.languages;
    return (
        <div>
          <h1>Code Dictionary</h1>
          <Filter name="keywords" selected={selectedKeywords} items={Directory.keywords}/>
          <Filter name="languages" selected={selectedLanguages} items={Directory.languages.map(l => l.name)}/>
          <Comparison keywords={keywords} languages={languages}/>
        </div>
    );
  }
});

filtersP.onValue((filters) => React.render(<Main filters={filters}/>, document.getElementById("main")));
