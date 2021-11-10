/* global d3 */

/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.puddingStackedBar = function init(options) {
  function createChart(el) {
    // dom elements
    const $chart = d3.select(el);
    let $svg = null;
    let $axis = null;
    let $vis = null;
    let $xAxisGroup = null;
    let $yAxisGroup = null;
    let $xAxis = null;
    let $yAxis = null;
    let $xAxisText = null;
    let $xAxisFlags = null;
    let $rects = null;
    let $rect = null;
    const $container = d3.select('#scrolly-side');
    const $article = $container.select('article');
    const $stepSel = $article.selectAll('.step');

    // data
    let data = $chart.datum();
    let dataLocal = data[0];
    let themes = data[1];
    let themesRank = data[2];
    let themesFreq = data[3];
    let series;
    let flags = [{country:"South Africa", flag:"assets/images/flags/south-africa.svg"}, {country:"USA", flag:"assets/images/flags/united-states.svg"}, 
				{country:"India", flag:"assets/images/flags/india.svg"}, {country:"UK", flag:"assets/images/flags/united-kingdom.svg"}, {country: 'All countries', flag:''}]

    // dimensions
    let width = 0;
    let height = 0;
    const MARGIN_TOP = 50;
    const FLAG_TOP = 80;
    const MARGIN_BOTTOM = 0;
    const MARGIN_LEFT = 0;
    const MARGIN_RIGHT = 0;

    // scales
    let x = null;
    let y = null;

    // helper functions
    function highlightWords(index, direction, task, word) {
      $stepSel.classed('is-active', (d, i) => i === index);
            console.log(task, direction)
            
            d3.selectAll(`.${word}`)
				      .attr("fill", "#E75C33")
            
            d3.selectAll(".stackedBars")
              .selectAll(`rect:not(.${word})`)
              .attr("opacity", "0.5")

            d3.selectAll(".stackedChartyTicks").style("opacity", "0")
    }

    function unHighlightWords() {
      d3.selectAll(".stackedBarAnnotation").remove()
			
      d3.selectAll(".stackedBars")
        .selectAll("rect")
        .attr("opacity", "1")
			
      d3.selectAll(".stackedChartyTicks").style("opacity", "1")
    }

    function prepareWordData(dataLocal, themes) {
      series = d3.stack()
        .keys(dataLocal.columns.slice(2))
      (dataLocal)
        .map(d => (d.forEach(v => v.key = themes.filter(c=>c.word===d.key)[0]!== undefined?
                        {"word": d.key, "theme": themes.filter(c=>c.word===d.key)[0].theme}:
                        {"word": d.key, "theme": "No theme"}), d))
      return series
    }

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
        prepareWordData(dataLocal, themes)
        
        $svg = $chart.append('svg').attr('class', 'stackedChart');

        // create axis
        $axis = $svg.append('g').attr('class', 'g-axis');

        $xAxisGroup = $axis.append('g').attr('class', 'x axis');

        $xAxis = $xAxisGroup.append("g");
        
        $yAxisGroup = $axis.append('g').attr('class', 'y axis')

        // setup viz group
        $vis = $svg.append('g').attr('class', 'g-vis');

        $rects = $vis.append("g")
          .attr("class", "stackedBars")
          .selectAll("g")
          .data(series)
          .join("g")
          .selectAll("rect")
          .data(d => d)
         
        $rect = $rects.join("rect")
          .attr("class", d=>d.key.word)
          .attr("fill", "lightgrey")
          .attr("stroke", "#FEFAF1")
          .attr("stroke-width", "0.2px")
          //.transition().duration("4000")
            //.ease(d3.easeCubic)
            //.delay((d, i) => { return i * 200; })

        Chart.render();
        Chart.resize();
      },
      updateChart(index, direction) {
        console.log(index, direction)

        const sel = $container.select(`[data-index='${index}']`);
				const task = sel.attr('task');
				const hovertype = sel.attr('hovertype');

        if (task==="highlightwords") {
          const word = sel.attr('word');
          if (direction==="down") {
            highlightWords(index, direction, task, word)
          } else {
            console.log(task, direction)
          }  
    
        } else if (task === "drawbars") {
          console.log(task, direction)
        } else if (task === "highlightthemes") {
          console.log(task, direction)
        } else if (task === "tooltip") {
          console.log(task, direction)
        } else if (task === "exploreChart") {
          console.log(task, direction)
        } else if (task === "themeBarsTransition") {
          console.log(task, direction)
        }

        return Chart;
      },
      // on resize, update new dimensions
      resize() {
        console.log("chart")
        // defaults to grabbing dimensions from container element
        width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
        height = ($chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM)*2;
        $svg
          .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
          .attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);
        
        // responsive xAxis 
        $xAxisGroup.attr('transform', `translate(${MARGIN_RIGHT},${FLAG_TOP})`)

        x = d3.scaleBand()
				      .domain(dataLocal.map(d => d.country))
				      .range([0, width + MARGIN_RIGHT])
				      .padding(0.1);
        
        xPad = x.padding();
        
        $xAxis
          .call(d3.axisBottom(x))
          .call(g => g.selectAll(".tick line").remove())
          .call(g => g.selectAll(".tick text").remove())
          .call(g => g.selectAll(".domain").remove())
        
        // $xAxis = $xAxisGroup.append("g")
        //     .call($xAxis)
        
        // xAxis flags
        $xAxis.selectAll(".tick text").remove();
        $xAxis.selectAll(".tick tickFlag").remove();

        $xAxis.selectAll(".tick")
              .append("text")
              .text(d=>d)
              .attr("x", xPad*100)             
              .attr("y", 0)
              .attr("class", "stackedChartTicks")
              .call(wrap, x.bandwidth())
          
        $xAxis.selectAll(".tick")
              .append("svg:image")
              .attr("class", "tickFlag")
              .attr('height', "35px")
              .attr("x", xPad*100)          
              .attr("y", 0)
              .attr("transform", "translate(-17, -50)")
              .attr("xlink:href", d => flags.filter(c=>c.country===d)[0].flag)
        
        // responsive yAxis 
        $yAxisGroup.attr('transform', `translate(${MARGIN_LEFT},0)`)

        y = d3.scaleLinear()
              .domain([series.length, 0])
              .range([height - MARGIN_BOTTOM, MARGIN_TOP]);
        
        $yAxis = g => g
          .call(d3.axisRight(y).tickSizeOuter(0).tickSizeInner(0))
          .call(g => g.selectAll(".tick").remove())
          .call(g => g.selectAll(".domain").remove())
        
        $yAxis = $yAxisGroup.append("g")
          .call($yAxis)
        
        $rect
          .attr("x", (d, i) => x(d.data.country))
          .attr("height", d => d.data[d.key.word]===0 || d.data[d.key.word]===null? 0:height/series.length)
          .attr("width", x.bandwidth())
          .attr("y", d => d.data[d.key.word]!==0 || d.data[d.key.word]!==null? y(d.data[d.key.word]):y(null))
          
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
