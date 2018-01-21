import React, {Component} from 'react';

import * as d3 from 'd3';

import styles from './PlayersGraph.scss';


class PlayersGraph extends Component {

  constructor(props) {
    super(props);
    this.data = [];
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.graph !== nextProps.graph) {// || this.props.selected !== nextProps.selected) {
      this.renderChart(nextProps.graph);
    }
  }

  shouldComponentUpdate(nextProps) {
    return !!nextProps && nextProps.width !== this.props.width;
  }

  componentDidUpdate() {
    this.renderChart(this.props.graph);
  }

  renderChart(graph) {
    let {links, nodes} = graph;

    let simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-50))
      .force("link", d3.forceLink(links).id(function(d) { return d.id; }).distance(500).strength(.3))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("center", d3.forceCenter())
      .on("tick", ticked);

    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    let canvas = this.canvas, context = this.context;
    let width = canvas.width;
    let height = canvas.height;

    let self = this;
    function ticked() {
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);

      context.beginPath();
      links.filter(d => d.source.id !== String(self.props.selected.user_id)).forEach(drawLink);
      context.strokeStyle = "rgba(120, 120, 120, .1)";
      context.lineWidth = .1;
      context.stroke();

      context.save();
      context.beginPath();
      let [mutual, nonmutual] = self.splitLinks(links, String(self.props.selected.user_id));
      mutual.forEach(drawLink);
      context.strokeStyle = "#0154fa";
      context.lineWidth = .5;
      context.stroke();
      context.restore();

      context.save();
      context.beginPath();
      nonmutual.forEach(drawLink);
      context.strokeStyle = "#fa2405";
      context.lineWidth = .7;
      context.stroke();
      context.restore();

      self.data = [];
      context.beginPath();
      nodes.forEach(self.drawNode);
      context.fillStyle = '#040aff';
      context.fill();
      context.strokeStyle = "#fff";
      context.stroke();

      context.restore();
    }



    function drawLink(d) {
      context.moveTo(d.source.x, d.source.y);
      context.lineTo(d.target.x, d.target.y);
    }

    d3.select(canvas)
      .on('click', handleClick)
      .on('mousemove', handleMousemove)
      .call(d3.drag()
        .container(canvas)
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    function handleClick() {
      let [x, y] = d3.mouse(this);
      let target = findClosestTarget([x - width / 2, y - height / 2], self.data);
      if (target) {
        self.props.onClick(target.id);
      } else {
        console.log('Player not found')
      }
    }

    function handleMousemove() {
      let [x, y] = d3.mouse(this);
      let target = findClosestTarget([x - width / 2, y - height / 2], self.data);
      if (target) {
        self.props.onHover(target.id);
      }
    }

    function dragstarted() {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;
    }

    function dragsubject() {
      return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
    }

    function dragged() {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }

    function dragended() {
      if (!d3.event.active) simulation.alphaTarget(0);
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }

    function findClosestTarget(point, data) {
      let node;
      let minDistance = Infinity;
      data.forEach(function(d) {
        let dx = d.x - point[0];
        let dy = d.y - point[1];
        let distance = Math.sqrt((dx * dx) + (dy * dy));
        if (distance < minDistance && distance < d.weight / 5 + .5) {
          minDistance = distance;
          node = d;
        }
      });
      return node;
    }
  }

  drawNode(d) {
    let r = d.weight / 5;
    this.context.moveTo(d.x + r, d.y);
    this.context.arc(d.x, d.y, r, 0, 2 * Math.PI);
    this.data.push({...d})
  }

  /**
   * Returns an array of mutual links and nonmutual links
   * @param links all links
   * @param targetID the target players id
   */
  splitLinks(links, targetID) {
    let asTarget = {};
    let asSource = {};
    links.forEach(d => {
      if (d.source.id === targetID) {
        asSource[d.target.id] = d;
      } else if (d.target.id === targetID) {
        asTarget[d.source.id] = d;
      }
    });
    let mutual = [],
      nonmutual = [];
    Object.keys(asSource).forEach(id => {
      if (id in asTarget) {
        mutual.push(asSource[id]);
      } else {
        nonmutual.push(asSource[id]);
      }
    });
    return [mutual, nonmutual];
  }

  render() {
    return (
      <canvas
        width={this.props.width}
        height={this.props.height}
        ref={canvas => this.canvas = canvas}
      />
    );
  }
}

PlayersGraph.propTypes = {};

export default PlayersGraph;
