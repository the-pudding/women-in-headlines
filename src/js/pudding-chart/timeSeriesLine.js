import { wrap } from '../utils/wrap';
/* global d3 */

/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.puddingTimeSeriesLine = function init(options) {
    function createChart(el) {
      // dom elements
      const $chart = d3.select(el);
      let $svg = null;
      let $axis = null;
      let $vis = null;
      let $lineW = null;
      let $lineA = null;
      let $womenLine = null;
      let $allLine = null;
      let $womenCircle = null;
      let $allCircle = null;
      let $womenAnno = null;
      let $allAnno = null;
      let $axisText = null;
  
      // data
      let data = $chart.datum();
  
      // dimensions
      let width = 0;
      let height = 0;
      const MARGIN_TOP = 30;
      const MARGIN_BOTTOM = 10;
      const MARGIN_LEFT = 50;
      const MARGIN_RIGHT = 20;
  
      // scales
      let x = null;
      let y = null;
      let $xAxis = null;
      let $yAxis = null;
  
      // helper functions
      function mapToArray(map) {
        var res = [];
        map.forEach(function(val, key) {
            res.push({year: key, womenPolarityMed: val[0], allPolarityMed: val[1]});
      });
        return res
      }
  
      const Chart = {
        // called once at start
        init() {
            data = mapToArray(d3.rollup(data, v => [d3.median(v, d=>d.women_polarity_median), d3.median(v, d=>d.all_polarity_median)], d => d.year)).filter(d=>(d.year!==2021)&&(d.year!==2016))

            $svg = $chart.append('svg').attr('class', 'pudding-chart');
    
            // create axis
            $axis = $svg.append('g').attr('class', 'g-axis');

            x = d3.scaleTime()
				.domain(d3.extent(data, d => d.year))
            
            y = d3.scaleLinear()
                .domain([0, d3.max(data, d=> d.womenPolarityMed)]).nice();
            
            $xAxis = $axis.append("g")
                .attr("class", "stackedChartyTicks")
            
            $yAxis = $axis.append("g")
                .attr("class", "lineChartyAxis")
            
            $axisText = $axis.append("text")
                .attr("class", "stackedChartyTicks")
                .attr("transform", "rotate(-90)")
                .text("Average polarity of news headlines ⇢");
    
            // setup viz group
            $vis = $svg.append('g').attr('class', 'g-vis');

            $lineW = d3.line()
                .defined(d => !isNaN(d.womenPolarityMed))
                .curve(d3.curveBasis);
            
            $lineA = d3.line()
                .defined(d => !isNaN(d.allPolarityMed))
                .curve(d3.curveBasis);
            
            $womenLine = $vis.append("path")
                .datum(data)
                .attr("class", "women-comp-line");
            
            $allLine = $vis.append("path")
                .datum(data)
                .attr("class", "all-comp-line");
            
            $womenCircle = $vis.append("circle")
                .attr("r", "11")
                .attr("class", "polarityCompBubbleRight");
            
            $allCircle = $vis.append("circle")
                .attr("r", "4")
                .attr("class", "polarityCompBubbleLeft");
            
            $womenAnno = $vis.append("text")
                .attr("class", "polarityCompFemText");
            
            $allAnno = $vis.append("text")
                .attr("class", "polarityCompAllText");
        },
        // on resize, update new dimensions
        resize() {
            // defaults to grabbing dimensions from container element
            width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
            height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;
            $svg
                .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
                .attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);
    
            x.range([MARGIN_LEFT, width - MARGIN_RIGHT]);
            y.range([height - MARGIN_BOTTOM, MARGIN_TOP]);

            $xAxis
                .attr("transform", `translate(0,${height - MARGIN_BOTTOM})`)
                .call(d3.axisBottom(x).ticks(6).tickSizeOuter(0).tickSizeInner(0).tickFormat(d3.format("d")))
            
            $yAxis
                .attr("transform", `translate(${MARGIN_LEFT},0)`)
                .call(d3.axisLeft(y).tickSize(0).tickValues([0.1, 0.2, 0.3, 0.4, 0.45]))
                .call(g => g.select(".domain").remove());
            
            $axisText
                .attr("x", -height/1.1)
                .attr("y", 10)
    
            $lineW
                .x(d => x(d.year))
                .y(d => y(d.womenPolarityMed));
            
            $lineA
                .x(d => x(d.year))
                .y(d => y(d.allPolarityMed));
            
            $womenLine.attr("d", $lineW);

            $allLine.attr("d", $lineA);

            $womenCircle
                .attr("cx", x(d3.max(data, d=>d.year)))
                .attr("cy", function(d) {
                    let dataLength = data.length - 1;
                    let point = data[dataLength].womenPolarityMed;
                    return y(point)
                })
                .attr("r", d => width >= 600 ? 11 : 8)
            
            $allCircle
                .attr("cx", x(d3.max(data, d=>d.year)))
                .attr("cy", function(d) {
                    let dataLength = data.length - 1;
                    let point = data[dataLength].allPolarityMed;
                    return y(point)
                })
                .attr("r", d => width >= 600 ? 4 : 3)
            
            $womenAnno
                .text("Headlines about women")
                .attr("x", x(d3.max(data, d=>d.year)))
				.attr("y", function(d) {
                    let dataLength = data.length - 1;
                    let point = data[dataLength].womenPolarityMed;
                    return y(point) + 8
                })
                .call(wrap, 100)
            
            $allAnno
                .text("All headlines")
                .attr("x", x(d3.max(data, d=>d.year)))
				.attr("y", function(d) {
                    let dataLength = data.length - 1;
                    let point = data[dataLength].allPolarityMed;
                    return y(point) + 40
                })
                .call(wrap, 100)

            return Chart;
        },
        // update scales and render chart
        render() {
          // offset chart for margins
          $vis.attr('transform', `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);
  
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
  