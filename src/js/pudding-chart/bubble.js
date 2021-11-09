/* global d3 */

/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.puddingBubble = function init(options) {
    function createChart(el) {
      // dom elements
      const $chart = d3.select(el);
      let $svg = null;
      let $axis = null;
      let $vis = null;
      let $circles = null;
      let $logos = null;
      let $newCircles = null;
      let $newLogos = null;

      console.log($chart)
  
      // data
      let data = $chart.datum();
      let chartData = data[0]
      let headlines = data[1]
      let variable = data[2]
      console.log(chartData, headlines, variable);
      chartData  = chartData.filter(d=>(+d.monthly_visits !== 0)&(+d[variable] !== 0)&
                  (d.site !== "msn.com")&(d.site !== "sports.yahoo.com")&
                  (d.site !== "finance.yahoo.com")&(d.site !== "news.google.com")&
                  (d.site !== "news.yahoo.com")&(d.site !== "bbc.com")&
                  (d.site !== "makeuseof.com")&(d.site !== "which.co.uk")&
                  (d.site !== "espncricinfo.com")&(d.site !== "seekingalpha.com")&
                  (d.site !== "prokerala.com"));
      
      const filterData = chartData.map((d) => {
        if (variable === "polarity") {
          return {
            site: d.site,
            polarity: d[variable],
            monthly_visits: d.monthly_visits,
            country_of_pub: d.country_of_pub
          }
        } else {
            return {
              site: d.site,
              bias: d[variable],
              monthly_visits: d.monthly_visits,
              country_of_pub: d.country_of_pub
          }
        }
      })
    
  
      // dimensions
      let width = 0;
      let height = 0;
      const MARGIN_TOP = 110;
      const MARGIN_BOTTOM = 20;
      const MARGIN_LEFT = 50;
      const MARGIN_RIGHT = 30;
  
      // scales
      let xScale = null;
      let yScale = null;
      let extentVisits = d3.extent(filterData, d=>+d.monthly_visits)
      let radius = d3.scaleSqrt()
                    .domain(extentVisits)
                    .range([3, 70])
      let logoScale = d3.scaleLinear()
                    .domain(extentVisits)
                    .range([18, 100])
      let simulation = null;
  
      // helper functions
      function bubbleTick() {
        $newCircles = $circles.join("circle")
          .attr("class", "forceCircles")
          .style("opacity", "1")
          .attr('r', d=>radius(+d.monthly_visits))

        $circles.merge($newCircles)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; })
      }
  
      const Chart = {
        // called once at start
        init() {
          $svg = $chart.append('svg').attr('class', 'pudding-chart');
  
          // create axis
          $axis = $svg.append('g').attr('class', 'g-axis');
  
          // setup viz group
          $vis = $svg.append('g').attr('class', 'g-vis');

          $circles = $vis.selectAll("circle").data(filterData);

          $logos = $vis.selectAll("image").data(filterData);
          
          Chart.resize();
          Chart.render();
        },
        // on resize, update new dimensions
        resize() {
          // defaults to grabbing dimensions from container element
          width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
          height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;

          console.log(width, height)

          $svg
            .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
            .attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);

          xScale = d3.scaleSymlog()
            .range([MARGIN_LEFT*2+MARGIN_RIGHT, width])
            .domain(variable==="polarity"?[0, d3.max(filterData, d => +d[variable])]:
                            d3.extent(filterData, d => +d[variable]))

          simulation = d3.forceSimulation()
            .nodes(filterData)
            .force('charge', d3.forceManyBody().strength(1))
            .force('x', d3.forceX().x(function(d) { return xScale(+d[variable]) }))
            .force("y", d3.forceY(height/1.5).strength(0.05))
            .force('collide', d3.forceCollide((d)=>{ return radius(+d.monthly_visits) }))
            .on("tick", bubbleTick())

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
  