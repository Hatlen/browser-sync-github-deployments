import debug from "debug";
import React, { Component } from "react";
import ReactDOM from "react-dom";

import styles from "./styles.css";

const debugError = debug("error");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deployments: [],
      loading: false,
      active: null
    };
  }
  componentDidMount() {
    fetch("/deployments")
      .then(response => response.json())
      .then(deployments => this.setState({ deployments }))
      .catch(debugError);
  }

  browserSync(url) {
    this.setState({ loading: url });
    fetch("/browser-sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    })
      .then(response => response.json())
      .then(data => this.setState({ active: data.active, loading: false }))
      .catch(debugError);
  }

  render() {
    return (
      <>
        <h1>Your github connected apps:</h1>
        <ul>
          {this.state.deployments.map(({ updatedAt, url }) => {
            const date = new Date(updatedAt);
            const dateTimeString = `${date.toLocaleDateString(
              "sv-SE"
            )} ${date.toLocaleTimeString("sv-SE")}`;

            return (
              <li
                className={[
                  url === this.state.active ? "active" : null,
                  url === this.state.loading ? "loading" : null
                ].join(" ")}
              >
                {url} - {dateTimeString} -
                <button onClick={() => this.browserSync(url)}>
                  Browser sync this app
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("body"));
