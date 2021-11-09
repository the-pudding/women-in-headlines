/* global d3 */

/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.puddingLollipop = function init(options) {
    function createChart(el) {
      // dom elements
      const $chart = d3.select(el);
      let $svg = null;
      let $axis = null;
      let $vis = null;
      let $gridline = null;
      let $difline = null;
      let $circle1 = null;
      let $circle2 = null;
      let $polText = null;
      let $horizLine = null;
      let $legCircle1 = null;
      let $legCircle2 = null;
      let $axisTextLeft = null;
      let $axisTextRight = null;
  
      // data
      let data = $chart.datum();
      data = data.filter(d=>(d.popularity==1)&&(Math.abs(d.difference) > 0.05)
													   &&((d.site_clean !== "dailysun.co.za")
													   &&(d.site_clean !== "msnbc")))
      data = data.sort((a,b)=> d3.descending(+a.polarity_women, +b.polarity_women))
  
      // dimensions
      let width = 0;
      let height = 0;
      const MARGIN_TOP = 130;
      const MARGIN_BOTTOM = 30;
      const MARGIN_LEFT = 160;
      const MARGIN_RIGHT = 50;
  
      // scales
      let x = null;
      let y = null;
  
      // helper functions
      function wrap(text, width) {
        text.each(function () {
          var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                  .append("tspan")
                  .attr("x", x)
                  .attr("y", y)
                  .attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
          }
        });
      }
  
      const Chart = {
        // called once at start
        init() {
          $svg = $chart.append('svg').attr('class', 'pudding-chart');
  
          // create axis
          $axis = $svg.append('g').attr('class', 'g-axis');
  
          // setup viz group
          $vis = $svg.append('g').attr('class', 'g-vis');

          $gridline = $vis.selectAll("gridline")
              .data(data)
              .join("line")
              .attr("class", "grid");
          
          $difline = $vis.selectAll("myline")
              .data(data)
              .join("line")
              .attr("class", "polarityCompBubbleLine")
              .attr("stroke", "black")
              .attr("stroke-width", "2.5px")
          
          $circle1 = $vis.selectAll("mycircle")
              .data(data)
              .join("circle")
              .attr("r", "4")
              .attr("class", "polarityCompBubbleLeft")
          
          $circle2 = $vis.selectAll("mycircle")
              .data(data)
              .join("circle")
              .attr("class", "polarityCompBubbleRight")
              .attr("r", "11")
          
          $polText = $vis.selectAll("mycircle")
            .data(data)
            .join("text")
            .attr("class", "polarityDiffAnnotation")
            .text(d=>((d.polarity_women-d.polarity_base)/d.polarity_base)*100>0?
                  "+"+Math.round(((d.polarity_women-d.polarity_base)/d.polarity_base)*100)+"%":
                  Math.round(((d.polarity_women-d.polarity_base)/d.polarity_base)*100)+"%")
          
          $horizLine = $vis.append("line")
            .attr("stroke", "black")
            .attr("stroke-width", "2.5px")
          
          $legCircle1 = $vis.append("circle")
            .attr("cx", 0)
            .attr("cy", -60)
            .attr("r", "4")
            .attr("class", "polarityCompBubbleLeft")
          
          $legCircle2 = $vis.append("circle")
            .attr("cx", 200)
            .attr("cy", -60)
            .attr("class", "polarityCompBubbleRight")
            .attr("r", "11")
          
          $vis.append("text")
              .attr("class", "xAxisLabel")
              .attr("x", 0)
              .attr("y", -60)
              .text("All headlines")
              .attr("class", "polarityCompAllText")
          
          $vis.append("text")
              .attr("class", "xAxisLabel")
              .attr("x", 200)
              .attr("y", -60)
              .text("Headlines about women")
              .attr("class", "polarityCompFemText")
              .call(wrap, 100)
          
          $axisTextLeft = $vis.append("text")
              .attr("class", "polarityCompxAxisLabel")
              .attr("y", -15)
              .attr("dy", "1em")
              .style("text-anchor", "start")
              .text("← Less polarizing language")
          
          $axisTextRight = $vis.append("text")
              .attr("class", "polarityCompxAxisLabel")
              .attr("y", -15)
              .attr("dy", "1em")
              .style("text-anchor", "end")
              .text("More polarizing language →")

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

          x = d3.scaleLinear()
                .domain(d3.extent(data, d => d.polarity_women))
                .range([ MARGIN_LEFT + MARGIN_RIGHT, width]);

          $axis.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .attr("class", "polarityCompxAxis")
          
          y = d3.scaleBand()
                .range([0, height])
                .domain(data.map(d => d.site_clean))
                .padding(1);

          $axis.append("g")
                .attr("transform", `translate(${MARGIN_LEFT},${MARGIN_TOP})`)
                .call(d3.axisLeft(y)
                .tickSize(0))
                .attr("class", "polarityCompyAxis");
          
          $gridline
              .attr("x1", 10)
              .attr("x2", width)
              .attr("y1", function(d) { return y(d.site_clean); })
              .attr("y2", function(d) { return y(d.site_clean); })
          
          $difline
              .attr("x1", function(d) { return x(d.polarity_base); })
              .attr("x2", function(d) { return x(d.polarity_women); })
              .attr("y1", function(d) { return y(d.site_clean); })
              .attr("y2", function(d) { return y(d.site_clean); })
          
          // circle 1
          $circle1
            .attr("cx", function(d) { return x(d.polarity_base); })
            .attr("cy", function(d) { return y(d.site_clean); })
          
          // circle 2
          $circle2
              .attr("cx", function(d) { return x(d.polarity_women); })
              .attr("cy", function(d) { return y(d.site_clean); })

          $polText
              .attr("x", d=>x(d.polarity_women) - 8)
              .attr("y", d=> y(d.site_clean) + 4)

          $horizLine
              .attr("x1", 0)
              .attr("x2", 200)
              .attr("y1", -60)
              .attr("y2", -60);
          
          $axisTextLeft
              .attr("x", 0)
          
          $axisTextRight
              .attr("x",width)


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
  