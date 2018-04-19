import React, {Component} from 'react';
import { Checkbox, Loader, Input, Form, Button, Grid, Header } from 'semantic-ui-react'

import * as d3 from 'd3';

import PlayersGraph from "../PlayersGraph/PlayersGraph";

import styles from './App.scss';
import InfoBox from "../InfoBox/InfoBox";
import InfoBoxMobile from "../InfoBox/InfoBoxMobile";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: [],
      players: {},
      width: 700,
      height: 1000,
      selectedPlayer: {},
      searchValue: 'Lebron',
      shouldRenderAllLinks: true,
    };
    this.maxWidth = Infinity;
    this.handlePlayerClick = this.handlePlayerClick.bind(this);
    this.handlePlayerHover = this.handlePlayerHover.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchOnChange = this.handleSearchOnChange.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
  }

  componentDidMount() {
    if (window.innerWidth < 550) {
      this.setState({shouldRenderAllLinks: false});
    }
    if (window.innerWidth < 850) {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

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

  handleChecked(e) {
    this.setState(prevState => ({
      shouldRenderAllLinks: !prevState.shouldRenderAllLinks
    }));
  }

  render() {
    const isSmallScreen = window.innerWidth < 850;

    return (
      <div className={styles.container}>
        <Grid centered className={styles.grid}>
          {!isSmallScreen &&
          <Grid.Row>
            <Header className={styles.header} as="h1" textAlign="center">NBA Twitter Network</Header>
          </Grid.Row>
          }
          {isSmallScreen ? (
            <InfoBoxMobile
              searchValue={this.state.searchValue}
              onSearchChange={this.handleSearchOnChange}
              onSearchSubmit={this.handleSearch}
              selectedPlayer={this.state.selectedPlayer}
              shouldRenderAllLinks={this.state.shouldRenderAllLinks}
              onCheck={this.handleChecked}
            />
          ) : (
            <InfoBox
              searchValue={this.state.searchValue}
              onSearchChange={this.handleSearchOnChange}
              onSearchSubmit={this.handleSearch}
              selectedPlayer={this.state.selectedPlayer}
              shouldRenderAllLinks={this.state.shouldRenderAllLinks}
              onCheck={this.handleChecked}
            />
          )}
          <Grid.Row centered={true}>
            <PlayersGraph
              graph={this.state.graph} players={this.state.players}
              width={this.state.width} height={this.state.height}
              onClick={this.handlePlayerClick}
              onHover={this.handlePlayerHover}
              selected={this.state.selectedPlayer}
              shouldRenderAllLinks={this.state.shouldRenderAllLinks}
            />
          </Grid.Row>
        </Grid>
        { this.state.hoveredPlayer && !isSmallScreen && (
          <div className={styles.hoverPopup}>{this.state.hoveredPlayer.name}</div>
        )
        }
      </div>
    );
  }
}

App.propTypes = {};

export default App;
