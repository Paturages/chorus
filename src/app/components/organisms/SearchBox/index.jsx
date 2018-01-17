import Inferno from "inferno";

import SearchInput from "components/molecules/SearchInput";

import "./style.scss";

export default ({ query, label, onQuery, onAdvanced }) => (
  <div className="SearchBox">
    <SearchInput type="search" query={query} label={label} onQuery={onQuery} />
    {onAdvanced && (
      <a
        className="SearchBox__advanced-search"
        onClick={onAdvanced}
        href="javascript:void(0)"
      >
        Advanced search
      </a>
    )}
  </div>
);
