import React, {Component} from 'react';

import * as d3 from 'd3';

import styles from './PlayersGraph.scss';


class PlayersGraph extends Component {

  constructor(props) {
    super(props);
    this.data = [];
    this.drawLink = this.drawLink.bind(this);
    this.drawNode = this.drawNode.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.selected = nextProps.selected;
      this.shouldRenderAllLinks = !!nextProps.shouldRenderAllLinks;
    }
    if (nextProps.graph && this.props.graph !== nextProps.graph) {// || this.props.selected !== nextProps.selected) {
      this.setupChart(nextProps.graph);
    } else if (nextProps.selected !== this.props.selected) {
      this.ticked();
    }
  }

  shouldComponentUpdate(nextProps) {
    return !!nextProps && nextProps.width !== this.props.width;
  }

  setupChart(graph) {
    let {links, nodes} = graph;
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.simulation = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-50))
      .force("link", d3.forceLink(links).id(function(d) { return d.id; }).distance(500).strength(.3))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
      .force("center", d3.forceCenter())
      .on("tick", this.ticked.bind(this));

    d3.select(this.canvas)
      .on('click', handleClick)
      .on('mousemove', handleMousemove)
      .call(d3.drag()
        .container(this.canvas)
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    let self = this,
      simulation = this.simulation;

    function handleClick() {
      let {width, height} = self.canvas;
      let [x, y] = d3.mouse(this);
      let target = self.findClosestTarget([x - width / 2, y - height / 2], self.data);
      if (target) {
        self.props.onClick(target.id);
      } else {
        console.log('Player not found')
      }
    }

    function handleMousemove() {
      let {width, height} = self.canvas;
      let [x, y] = d3.mouse(this);
      let target = self.findClosestTarget([x - width / 2, y - height / 2], self.data);
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
      let {width, height} = self.canvas;
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
  }

  ticked() {
    let {links, nodes} = this.props.graph;
    let context = this.ctx;
    let {width, height} = this.canvas;
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    if (this.shouldRenderAllLinks) {
      context.beginPath();
      // links.filter(d => d.source.id !== String(this.selected.user_id)).forEach(this.drawLink);
      links.forEach(this.drawLink);
      // context.strokeStyle = "rgba(120, 120, 120, .1)";
      context.strokeStyle = "rgb(220, 220, 220)";
      context.lineWidth = .1;
      context.stroke();
    }

    context.save();
    context.beginPath();
    let [mutual, nonmutual] = this.splitLinks(links, String(this.selected.user_id));
    mutual.forEach(this.drawLink);
    context.strokeStyle = "#0154fa";
    context.lineWidth = .5;
    context.stroke();
    context.restore();

    context.save();
    context.beginPath();
    nonmutual.forEach(this.drawLink);
    context.strokeStyle = "#fa2405";
    context.lineWidth = .7;
    context.stroke();
    context.restore();

    this.data = [];
    context.beginPath();
    nodes.forEach(this.drawNode);
    context.fillStyle = '#040aff';
    context.fill();
    context.strokeStyle = "#fff";
    context.stroke();

    context.restore();
  }

  findClosestTarget(point, data) {
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

  drawLink(d) {
    this.ctx.moveTo(d.source.x, d.source.y);
    this.ctx.lineTo(d.target.x, d.target.y);
  }

  drawNode(d) {
    let r = d.weight / 5;
    this.ctx.moveTo(d.x + r, d.y);
    this.ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
    this.data.push({...d})
  }

  /**
   * Returns an array of mutual links and nonmutual links
   * @param links - all links
   * @param targetID - the target players id
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
      />
    );
  }
}

PlayersGraph.propTypes = {};

export default PlayersGraph;
