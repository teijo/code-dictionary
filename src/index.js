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


const Grid = React.createClass({
  propTypes: {
    xs: React.PropTypes.array.isRequired,
    ys: React.PropTypes.array.isRequired,
    data: React.PropTypes.object.isRequired
  },
  render() {
    let {xs, ys, data} = this.props;
    return (
        <table>
          <thead>
            <tr>
              <th></th>
              {xs.map((value, index) => <th key={index}>{value.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {ys.map((y) => (
              <tr key={"keyword_" + y}>
                <th>{y}</th>
                {xs.map((x, index) =>{
                    let isDefined = data.hasOwnProperty(x) && data[x].hasOwnProperty(y);
                    return (
                        <td className={isDefined ? "" : "not-defined"} key={index}>
                          {isDefined ? data[x][y].code.map((syntax, sindex) => <pre key={sindex}>{syntax.code}</pre>) : "N/A"}
                        </td>
                      );
                    })}
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
    let data = languages.reduce((acc, l) => {
      acc[l.name] = l.syntax;
      return acc;
    }, {});
    return (
        <div>
          <h1>Code Dictionary</h1>
          <Filter name="keywords" selected={selectedKeywords} items={Directory.keywords}/>
          <Filter name="languages" selected={selectedLanguages} items={Directory.languages.map(l => l.name)}/>
          <Grid xs={languages.map(l => l.name)} ys={keywords} data={data}/>
        </div>
    );
  }
});

filtersP.onValue((filters) => React.render(<Main filters={filters}/>, document.getElementById("main")));
