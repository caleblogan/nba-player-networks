import React, {Component} from 'react';
import { Loader, Input, Form, Button, Grid, Header } from 'semantic-ui-react'

import * as d3 from 'd3';

import PlayersGraph from "../PlayersGraph/PlayersGraph";

import styles from './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: [],
      players: {},
      width: 700,
      height: 1000,
      selectedPlayer: '',
      searchValue: 'Lebron',
    };
    this.maxWidth = Infinity;
    this.handlePlayerClick = this.handlePlayerClick.bind(this);
    this.handlePlayerHover = this.handlePlayerHover.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchOnChange = this.handleSearchOnChange.bind(this);
  }

  componentDidMount() {
    d3.json("graph.json", (err, graph) => {
      if (err) throw err;
      d3.json("players.json", (error, data) => {
        if (error) throw error;
        let players = {};
        data.forEach(player => {
          players[String(player.user_id)] = player;
        });
        let selectedPlayer = data[Math.floor(Math.random() * data.length)];
        this.setState({
          players,
          graph,
          width: window.innerWidth > this.maxWidth ? this.maxWidth : window.innerWidth,
          selectedPlayer,
          searchValue: selectedPlayer.name,
        });
      });
    });
  }

  handlePlayerClick(id) {
    this.setState({
      selectedPlayer: this.state.players[id]
    });
  }

  handlePlayerHover(id) {
    this.setState({
      hoveredPlayer: this.state.players[id]
    });
  }

  handleSearch(e) {
    let matches = Object.keys(this.state.players).filter(key => {
      let player = this.state.players[key];
      return player.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
    });
    if (matches.length > 0) {
      this.setState({
        selectedPlayer: this.state.players[matches[0]]
      })
    }
  }

  handleSearchOnChange(e) {
    this.setState({
      searchValue: e.target.value
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <Grid centered className={styles.grid}>
          <Grid.Row>
            <Header className={styles.header} as="h1" textAlign="center">NBA Twitter Network</Header>
          </Grid.Row>
          <div className={styles.infoBox}>
            <Form onSubmit={this.handleSearch}>
              <Input
                value={this.state.searchValue}
                className={styles.search}
                placeholder="search player..."
                onChange={this.handleSearchOnChange}
              />
              <Button>Search</Button>
            </Form>
            <Header as="h4" className={styles.selectedPlayer}>Selected Player: {this.state.selectedPlayer.name}</Header>
            <div className={styles.legend}>
              <ul>
                <li><div className={styles.box} style={{background: "#0154FA"}}/>line: mutual follow</li>
                <li><div className={styles.box} style={{background: "#fa2405"}}/>line: outgoing follow</li>
                <li><div className={[styles.circle, styles.box].join(' ')} style={{background: "#040aff"}}/>size: n incoming player follows</li>
              </ul>
            </div>
          </div>
          <Grid.Row centered={true}>
            <PlayersGraph
              graph={this.state.graph} players={this.state.players}
              width={this.state.width} height={this.state.height}
              onClick={this.handlePlayerClick}
              onHover={this.handlePlayerHover}
              selected={this.state.selectedPlayer}
            />
          </Grid.Row>
        </Grid>
        { this.state.hoveredPlayer && (
          <div className={styles.hoverPopup}>{this.state.hoveredPlayer.name}</div>
        )
        }
      </div>
    );
  }
}

App.propTypes = {};

export default App;
