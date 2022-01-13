import Autocomplete from "accessible-autocomplete";
import { wrap } from "../utils/wrap";
import _ from "lodash";
/* global d3 */

/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.puddingHorizontalStackedBar = function init(options) {
  function createChart(el) {
    // dom elements
    const $chart = d3.select(el);
    let $svg = null;
    let $axis = null;
    let $axisThemes = null;
    let $vis = null;
    let $visThemes = null;
    let $xAxisGroup = null;
    let $yAxisGroup = null;
    let $xAxisGroupThemes = null;
    let $yAxisGroupThemes = null;
    let $xAxis = null;
    let $yAxis = null;
    let $xAxisThemes = null;
    let $yAxisThemes = null;
    let $yAxisText = null;
    let $xAxisFlags = null;
    let $rects = null;
    let $rect = null;
    let $rectLabels = null;
    let $rectThemes = null;
    let $rectDrops = null;
    const $container = d3.select("#scrolly-side");
    const $article = $container.select("article");
    const $stepSel = $article.selectAll(".step");
    const $wordSearch = d3.select("#wordSearch");

    // data
    let data = $chart.datum();
    let dataLocal = data[0];
    let themes = data[1];
    let themesRank = data[2];
    let themesFreq = data[3];

    let series;
    let flags = [
      { country: "South Africa", flag: "assets/images/flags/south-africa.svg" },
      { country: "USA", flag: "assets/images/flags/united-states.svg" },
      { country: "India", flag: "assets/images/flags/india.svg" },
      { country: "UK", flag: "assets/images/flags/united-kingdom.svg" },
      { country: "All countries", flag: "" },
    ];

    let stackedData = d3
      .stack()
      .keys(themesFreq.columns.slice(2))
      .order(d3.stackOrderAscending)(
        themesFreq.filter((d) => d.theme !== "No theme")
      )
      .map((d) => (d.forEach((v) => (v.key = d.key)), d));

    // dimensions
    let width = 0;
    let height = 0;
    const MARGIN_TOP = 50;
    const FLAG_TOP = 80;
    const MARGIN_BOTTOM = 70;
    const MARGIN_LEFT = 0;
    const MARGIN_RIGHT = 50;
    const themePad = 20;
    let xPad = null;

    // scales
    let x = null;
    let y = null;

    const Chart = {
      // called once at start
      init() {
        $svg = $chart.append("svg").attr("class", "stackedChart");

        // create axis
        $axis = $svg.append("g").attr("class", "g-axis");

        $xAxisGroup = $axis.append("g").attr("class", "x axis");

        $xAxis = $xAxisGroup.append("g");

        $yAxisGroup = $axis.append("g").attr("class", "y axis");

        $yAxisText = $yAxisGroup
          .append("text")
          .attr("class", "stackedChartyTicks")
          .attr("transform", "translate(10,275) rotate(-90)")
          .text("Frequency of use of headlines ⇢");

        x = d3
          .scaleBand()
          .domain(dataLocal.map((d) => d.country))
          .padding(0.1);

        // setup viz group
        $vis = $svg.append("g").attr("class", "g-vis");

        Chart.render();
        Chart.resize();
      },
      // on resize, update new dimensions
      resize() {
        // defaults to grabbing dimensions from container element
        width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
        height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;

        $svg
          .attr("width", width + MARGIN_LEFT + MARGIN_RIGHT)
          .attr("height", height + MARGIN_TOP + MARGIN_BOTTOM);

        return Chart;
      },
      // update scales and render chart
      render() {
        // offset chart for margins
        $vis.attr("transform", `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);
        return Chart;
      },
      // get / set data
      data(val) {
        if (!arguments.length) return data;
        data = val;
        $chart.datum(data);
        return Chart;
      },
    };
    Chart.init();

    return Chart;
  }

  // create charts
  const charts = this.nodes().map(createChart);
  return charts.length > 1 ? charts : charts.pop();
};
