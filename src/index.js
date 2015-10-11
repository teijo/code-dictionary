import React from "react";
import Bacon from "Bacon";
import _ from "lodash";
import * as Directory from "./directory";

const Op = {
  toggle: Symbol("op-toggle"),
  clear: Symbol("op-set")
};

// ?a=b,c&d=e -> {a: ["b", "c"], d: ["e"]}
function fromQuery(queryString) {
  return queryString.slice(1).split("&").reduce((acc, kv) => {
    let [k, v] = kv.split("=");
    if (v === undefined) {
      return acc;
    }
    acc[k] = v.split(",").map(decodeURIComponent);
    return acc;
  }, {});
}

function toQuery(state) {
  return "?" + Object.keys(state).map(k => k + "=" + state[k].map(encodeURIComponent).join(",")).join("&");
}

const hashP = Bacon
    .fromEvent(window, "hashchange")
    .toProperty({newURL: window.location.hash})
    .map(e => e.newURL.split("#")[1]);

const filterUpdateE = new Bacon.Bus();
const filtersP = filterUpdateE.scan(fromQuery(window.location.search), (state, update) => {
  if (update.op === Op.toggle) {
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
  } else if (update.op === Op.clear) {
    delete state[update.type];
  } else {
    throw new Error(`Unsupported OP: ${state.op}`);
  }
  return state;
});

filtersP.skip(1).onValue(state => history.pushState(null, null, toQuery(state)));

function updateFilter(name, item) {
  return (e) => {
    e.preventDefault();
    filterUpdateE.push({op: Op.toggle, type: name, value: item});
  };
}

function clearFilter(name) {
  return (e) => {
    e.preventDefault();
    filterUpdateE.push({op: Op.clear, type: name});
  };
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
            <li>[{(selected.length !== items.length ? <a href="#" onClick={clearFilter(name)}>clear</a> : "clear")}]</li>
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
    render: React.PropTypes.func.isRequired,
    selected: React.PropTypes.string
  },
  render() {
    let {xs, ys, data, render, selected} = this.props;
    let colWidth = (90 / xs.length) + "%";
    return (
        <table className="fit">
          <colgroup>
            <col style={{width: "10%"}}/>
            {xs.map((value, index) => <col key={index} style={{width: colWidth}}/>)}
          </colgroup>
          <thead>
            <tr>
              <th></th>
              {xs.map((value, index) => <th key={index}>{value}</th>)}
            </tr>
          </thead>
          <tbody>
            {ys.map((y) => (
              <tr key={"keyword_" + y} className={y === selected ? "selected" : ""}>
                <th id={y}><a href={"#" + y}>{y}</a></th>
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
  return data.code.map((syntax, sindex) => <div key={sindex}><code>{syntax.code}</code><p>{syntax.note}</p></div>);
}

const Main = React.createClass({
  propTypes: {
    filters: React.PropTypes.object.isRequired,
    selected: React.PropTypes.string
  },
  render() {
    let {filters, selected} = this.props;
    return (
        <div>
          <h1>Code Dictionary</h1>
          <Filter name="keywords" selected={filters.keywords} items={Directory.keywords}/>
          <Filter name="languages" selected={filters.languages} items={Directory.languages}/>
          <Grid xs={filters.languages} ys={filters.keywords} data={Directory.data} selected={selected} render={render}/>
        </div>
    );
  }
});

function takeValid(input, valid) {
  return (input || []).length > 0
      ? _.intersection(input, valid)
      : valid;
}

const activeFiltersP = filtersP
    .map(filters => {
      return {
        keywords: takeValid(filters.keywords, Directory.keywords),
        languages: takeValid(filters.languages, Directory.languages)
      };
    });

Bacon.onValues(activeFiltersP, hashP, (filters, hash) => React.render(<Main filters={filters} selected={hash}/>, document.getElementById("main")));
