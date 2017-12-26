import Inferno from "inferno";

import SearchInput from "components/molecules/SearchInput";

import "./style.scss";

export default ({ query, label, onQuery }) => (
  <div className="SearchBox">
    <SearchInput type="search" query={query} label={label} onQuery={onQuery} />
  </div>
);
