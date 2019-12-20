import { Component } from "inferno";

import TextInput from "components/atoms/TextInput";

import "./style.scss";

export default class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = { query: props.query || "" };
  }
  componentWillReceiveProps(props) {
    this.setState({ query: props.query || "" });
  }
  handleChange(evt) {
    this.setState({ query: evt.target.value });
  }
  render() {
    const { label, placeholder, onQuery } = this.props;
    const { query } = this.state;
    return (
      <form
        className="SearchInput"
        onSubmit={$event => {
          $event.preventDefault();
          onQuery(query);
        }}
      >
        <TextInput
          autofocus
          className="SearchInput__input"
          type="search"
          label={label}
          placeholder={placeholder}
          value={this.state.query}
          onChange={this.handleChange.bind(this)}
          onInput={$event => this.setState({ query: $event.target.value })}
        />
        <button className="SearchInput__button" type="submit">
          🔎
        </button>
      </form>
    );
  }
}
