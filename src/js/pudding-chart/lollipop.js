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
      let $sortLollipopDiff = d3.select("#sortLollipopDiff");
      let $sortLollipopPol = d3.select("#sortLollipopPol");
  
      // data
      let data = $chart.datum();
      data = data.filter(d=>(d.popularity==1)&&(Math.abs(d.difference) > 0.05)
													   &&((d.site_clean !== "dailysun.co.za")
													   &&(d.site_clean !== "msnbc")))
      data = data.sort((a,b)=> d3.descending(+a.polarity_women, +b.polarity_women))
      
      let $xMin = d3.max(data, d => d.polarity_women);
      let $xMax = d3.min(data, d => d.polarity_women);

      // dimensions
      let width = 0;
      let height = 0;
      const MARGIN_TOP = 0;
      const MARGIN_BOTTOM = 0;
      let MARGIN_LEFT = null;
      const MARGIN_RIGHT = 50;
  
      // scales
      let x = null;
      let y = null;
      let $xAxis = null;
      let $yAxis = null;
  
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

      // click functions
      function sortChart() {
        const buttonID = this.id;
        const sortType = (buttonID === "sortLollipopDiff") ? "difference" : "polarity_women";
        const dataSort = data.sort((a,b)=> d3.descending(+a[sortType], +b[sortType]));
        console.log(dataSort);

        d3.selectAll(".lollipopTextbutton").attr("class", "lollipopTextbutton-active")
        d3.selectAll(".lollipopTextbutton-active").attr("class", "lollipopTextbutton")

        y.domain(dataSort.map(d=>d.site_clean))

        $axis.select(".polarityCompyAxis")
          .transition()
          .duration("1000")
          .call(d3.axisLeft(y).tickSize(0))

        $vis.selectAll(".polarityCompBubble")
          .sort((a, b) => a !== undefined? d3.ascending(+a[sortType], +b[sortType]):"")
          .transition().duration("1000")
          .attr("cy", (d, i)=>
            d !== undefined?
            y(d.site_clean):"-60"//xScale is defined earlier
          )

        $vis.selectAll(".polarityDiffAnnotation")
          .sort((a, b) => d3.ascending(+a[sortType], +b[sortType]))
          .transition().duration("1000")
          .attr("y", (d, i)=> y(d.site_clean))

        $vis.selectAll(".polarityCompBubbleLine")
          .sort((a, b) => d3.ascending(+a[sortType], +b[sortType]))
          .transition().duration("1000")
          .attr("x1", (d, i)=>x(d.polarity_base))
          .attr("x2", (d, i)=>x(d.polarity_women))
          .attr("y1", (d, i)=>y(d.site_clean))
          .attr("y2", (d, i)=>y(d.site_clean))
        }
  
      const Chart = {
        // called once at start
        init() {
          $svg = $chart.append('svg').attr('class', 'pudding-chart');
  
          // create axis
          $axis = $svg.append('g').attr('class', 'g-axis');

          $xAxis = $axis.append("g").attr("class", "polarityCompxAxis")
          $yAxis = $axis.append("g").attr("class", "polarityCompyAxis")

          x = d3.scaleLinear()
                .domain([$xMax, $xMin])
  
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
              .attr("class", "polarityCompBubble polarityCompBubbleLeft")
          
          $circle2 = $vis.selectAll("mycircle")
              .data(data)
              .join("circle")
              .attr("class", "polarityCompBubble polarityCompBubbleRight")
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
            .attr("stroke-width", "2.5px");
          
          $sortLollipopPol.attr("class", "lollipopTextbutton-active"); 

          Chart.resize();
          Chart.render();
        },
        // on resize, update new dimensions
        resize() {
          // defaults to grabbing dimensions from container element
          width = $chart.node().offsetWidth;
          if (width >= 600) {
            MARGIN_LEFT = 160;

            $vis.attr('transform', `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);

            d3.selectAll('.polarityCompyAxis .tick text')
              .attr("transform", "translate(0,0)")
              .style("text-anchor", "end");
            
            //x.range([MARGIN_LEFT + MARGIN_RIGHT, width]);
            $gridline.attr("x1", 10);

          } else {
            MARGIN_LEFT = 40;

            $vis.attr('transform', `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);

            d3.selectAll('.polarityCompyAxis .tick text')
              .attr("transform", "translate(3,-25)")
              .style("text-anchor", "start");
            
            //x.range([MARGIN_LEFT + MARGIN_RIGHT, width]);
            $gridline.attr("x1", 0);
          }

          width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
          height = 1700 - MARGIN_TOP - MARGIN_BOTTOM;

          $svg
            .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
            .attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);

          $xAxis
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
          
          y = d3.scaleBand()
                .range([0, height])
                .domain(data.map(d => d.site_clean))
                .padding(1);

          $yAxis
                .attr("transform", `translate(${MARGIN_LEFT},${MARGIN_TOP})`)
                .call(d3.axisLeft(y)
                .tickSize(0));
          
          x.range([MARGIN_LEFT + MARGIN_RIGHT, width]);

          $gridline
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
              .attr("y", d=> y(d.site_clean) + 6)

          return Chart;
        },
        // update scales and render chart
        render() {
          // offset chart for margins
          
          $sortLollipopDiff.on("click", sortChart)
          $sortLollipopPol.on("click", sortChart)

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
  