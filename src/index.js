import React from "react";
import Bacon from "Bacon";
import _ from "lodash";
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
    data: React.PropTypes.object.isRequired,
    render: React.PropTypes.func.isRequired
  },
  render() {
    let {xs, ys, data, render} = this.props;
    return (
        <table>
          <thead>
            <tr>
              <th></th>
              {xs.map((value, index) => <th key={index}>{value}</th>)}
            </tr>
          </thead>
          <tbody>
            {ys.map((y) => (
              <tr key={"keyword_" + y}>
                <th>{y}</th>
                {xs.map((x, index) =>{
                    let isDefined = data.hasOwnProperty(x) && data[x].hasOwnProperty(y);
                    return (
                        <td key={index}>
                          {isDefined ? render(data[x][y]) : null}
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

function render(data) {
  return data.code.map((syntax, sindex) => <div key={sindex}><pre>{syntax.code}</pre><p>{syntax.note}</p></div>);
}

const Main = React.createClass({
  propTypes: {
    filters: React.PropTypes.object.isRequired
  },
  render() {
    let {filters} = this.props;
    return (
        <div>
          <h1>Code Dictionary</h1>
          <Filter name="keywords" selected={filters.keywords} items={Directory.keywords}/>
          <Filter name="languages" selected={filters.languages} items={Directory.languages}/>
          <Grid xs={filters.languages} ys={filters.keywords} data={Directory.data} render={render}/>
        </div>
    );
  }
});

function takeValid(input, valid) {
    return (input || []).length > 0
      ? _.intersection(input, valid)
      : valid;
}

filtersP
  .map(filters => {
    return {
      keywords: takeValid(filters.keywords, Directory.keywords),
      languages: takeValid(filters.languages, Directory.languages)
    };
  })
  .onValue((filters) => React.render(<Main filters={filters}/>, document.getElementById("main")));
