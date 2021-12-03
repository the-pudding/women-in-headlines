import Autocomplete from 'accessible-autocomplete'
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

d3.selection.prototype.puddingStackedBar = function init(options) {
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
    let $xAxisText = null;
    let $xAxisFlags = null;
    let $rects = null;
    let $rect = null;
    let $rectLabels = null;
    let $rectThemes = null;
    const $container = d3.select('#scrolly-side');
    const $article = $container.select('article');
    const $stepSel = $article.selectAll('.step');
    const $wordSearch = d3.select("#wordSearch");

    // data
    let data = $chart.datum();
    let dataLocal = data[0];
    let themes = data[1];
    let themesRank = data[2];
    let themesFreq = data[3];
    let series;
    let flags = [{country:"South Africa", flag:"assets/images/flags/south-africa.svg"}, {country:"USA", flag:"assets/images/flags/united-states.svg"}, 
				{country:"India", flag:"assets/images/flags/india.svg"}, {country:"UK", flag:"assets/images/flags/united-kingdom.svg"}, {country: 'All countries', flag:''}]
    let stackedData = d3.stack()
      .keys(themesFreq.columns.slice(2))
      .order(d3.stackOrderAscending)
    (themesFreq.filter(d=>d.theme!=="No theme"))
      .map(d => (d.forEach(v => v.key = d.key), d));

    // dimensions
    let width = 0;
    let height = 0;
    const MARGIN_TOP = 50;
    const FLAG_TOP = 80;
    const MARGIN_BOTTOM = 0;
    const MARGIN_LEFT = 0;
    const MARGIN_RIGHT = 0;
    const themePad = 20;
    let xPad = null;

    // scales
    let x = null;
    let y = null;
    let xThemes = null;
    let yThemes = null;

    // helper functions
    function stripSpaces(string) {
      let stripped = string.trim();
      stripped = stripped.replace(/ /g, "");
      stripped = stripped.replace(",", "");
      stripped = stripped.toLowerCase();
      return stripped;
    }

    function searchWords() {
      let onlyWords = dataLocal.columns;

      Autocomplete({
        element: document.querySelector('#wordSearch'),
        id: 'my-autocomplete',
        source: onlyWords,
        displayMenu: 'overlay',
        confirmOnBlur: false,
        onConfirm(word) {

          highlightWords(null, null, null, word)
        },
      });
    }

    function showWord() {
      let wordGroup = d3.select(this);
      let wordText = wordGroup.attr("class");
      wordText = wordText.split("_")[0];

      let wordRects = wordGroup.selectAll("rect")
          .attr("fill", "#282828")
          .attr("opacity", "1");
      
      let lastRect = wordRects._groups[0][4];
      //lastRect = 

      console.log(lastRect)

      $rectLabels = wordGroup.append("text")
        .text(wordText)
        .attr("class", "stackedBarThemeAnnotation")
        .attr("x", 0)
        .attr("y", 0)
    }

    function hideWord() {
      //console.log("hide word")
    }

    function revealChart() {
      let allRects = d3.selectAll(".stackedBars")
        .selectAll(`rect`)
        .transition().duration("1000")
            .ease(d3.easeCubic)
            //.delay((d, i) => { return i * 1; })
            .attr("y", d => d.data[d.key.word]!==0 || d.data[d.key.word]!==null? y(d.data[d.key.word]):y(null))
    }

    function baseRects() {
      let notWordRects = d3.selectAll(".stackedBars")
              .selectAll(`rect`)
              .attr("fill", "#ccc")
              .attr("opacity", "0.5")
    }

    function highlightWords(index, word) {
      $stepSel.classed('is-active', (d, i) => i === index);
            let IDs = word.split(" ")

            if (index === 8 || index === 10) {
              d3.selectAll(`.stackedBars rect`).attr("opacity", "0.5")

              IDs.forEach(ID => {
                let wordRects = d3.selectAll(`.${ID}_class`)
                  .attr("opacity", "1")
              })
            } else {
              baseRects()

              IDs.forEach(ID => {
                let wordRects = d3.selectAll(`.${ID}_class`)
                  .attr("fill", "#282828")
                  .attr("opacity", "1")
              })
            }
    }

    function highlightThemes(index, theme) {
      $stepSel.classed('is-active', (d, i) => i === index);

      let notThemeRects = d3.selectAll(".stackedBars")
          .selectAll(`rect`)
          .attr("fill", "#ccc")
          .attr("opacity", "0.5")

      let violenceRects = d3.selectAll(".stackedBars").selectAll(".crimeandviolence_class")
      let stereotypeRects = d3.selectAll(".stackedBars").selectAll(".femalestereotypes_class")
      let empowermentRects = d3.selectAll(".stackedBars").selectAll(".empowerment_class")
      let peopleRects = d3.selectAll(".stackedBars").selectAll(".peopleandplaces_class")
      let raceRects = d3.selectAll(".stackedBars").selectAll(".raceethnicityandidentity_class")

      if (theme === "crimeandviolence") {
        violenceRects
          .attr("fill", "#E75C33")
          .attr("opacity", "1")
      } 

      if (theme === "femalestereotypes") {
        stereotypeRects
          .attr("fill", "#53B67C")
          .attr("opacity", "1")
      }

      if (theme === "EPR") {
        violenceRects
          .attr("fill", "#E75C33")
          .attr("opacity", "1")
        stereotypeRects
          .attr("fill", "#53B67C")
          .attr("opacity", "1")
        empowermentRects
          .attr("fill", "#F7DC5B")
          .attr("opacity", "1")
        peopleRects
          .attr("fill", "#3569DC")
          .attr("opacity", "1")
        raceRects
          .attr("fill", "#F2C5D3")
          .attr("opacity", "1")
      }
    }

    function renderThemeBars(data, dataFreq, themes, x, y) {
      $rectThemes 
        .transition().duration("500")
        .ease(d3.easeLinear)
        .delay((d, i) => { return i * 10; })
        .attr("x", d=> xThemes(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0].data.theme))
        .attr("y", d => yThemes(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0][1]))
        .attr("height", d => yThemes(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0][0]) - 
                    yThemes(stackedData.filter(c=>c.key === d.key.word)[0].filter(e=>e.data.theme===d.key.theme)[0][1]))
        .attr("width", xThemes.bandwidth()-(themePad/3))
        .attr("transform", `translate(0,${height-MARGIN_TOP})`)
      
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

    const Chart = {
      // called once at start
      init() {
        prepareWordData(dataLocal, themes);
        //searchWords();
        
        $svg = $chart.append('svg').attr('class', 'stackedChart');

        // create axis
        $axis = $svg.append('g').attr('class', 'g-axis');

        $xAxisGroup = $axis.append('g').attr('class', 'x axis');

        $xAxis = $xAxisGroup.append("g");
        
        $yAxisGroup = $axis.append('g').attr('class', 'y axis')

        $xAxisText = $axis.append("text")
          .attr("class", "stackedChartyTicks")
          .attr("transform", "rotate(-90)")
          .text("Frequency of use of headlines ⇢");

        // setup viz group
        $vis = $svg.append('g').attr('class', 'g-vis');

        $rects = $vis.append("g")
          .attr("class", "stackedBars")
          .selectAll("g")
          .data(series)
          .join("g")
          .attr("class", d => `${d.key}_group`)
          //.on("mouseenter", showWord)
					//.on("mouseleave", hideWord)
          .selectAll("rect")
          .data(d => d)
         
        $rect = $rects.join("rect")
          .attr("class", function(d) {
            let themeClass = `${stripSpaces(d.key.theme)}_class`
            let wordClass = `${d.key.word}_class`
            return `${wordClass} ${themeClass}`
          })
          .attr("fill", "#c9c9c9")
          .attr("opacity", "0.5")
          .attr("stroke", "#FEFAF1")
          .attr("stroke-width", "0.2px");
        
        // themes chart
        $visThemes = $svg.append('g').attr('class', 'g-visthemes');
        $axisThemes = $svg.append('g').attr('class', 'g-axisthemes');

        xThemes = d3.scaleBand()
          .domain(["crime and violence","female stereotypes", "empowerment", "people and places", "race, ethnicity and identity"])
          .padding(0.1);
      
        yThemes = d3.scaleLinear()
          .domain([d3.max(stackedData, d => d3.max(d, d => d[1])), 0])

        $xAxisGroupThemes = $axisThemes.append('g').attr('class', 'x axis'); 
        $yAxisGroupThemes = $axisThemes.append('g').attr('class', 'y axis');
        $xAxisThemes = $xAxisGroupThemes.append("g");

        $rectThemes = $vis.selectAll("rect")
          .filter(d=>(d.key.theme!=="No theme")&&(d.data.country==="All countries"))
        
        // $rectLabels = $rects.join("text")
        //   .text(d=>d.key.word)
        //   .attr("id", d =>`${d.key.word}_label`)
        //   .attr("class", d => `stackedBarAnnotation ${d.key.theme}_label`)

        Chart.render();
        Chart.resize();
      },
      updateChart(index, direction) {
        const sel = $container.select(`[data-index='${index}']`);
        const word = sel.attr('word');
        const theme = sel.attr('theme');

        if (index === 0) {
          baseRects()
        }
        if (index === 1) {
          highlightWords(index, word)
        }
        if (index === 2) {
          highlightWords(index, word)
        }
        if (index === 3) {
          highlightWords(index, word)
        }
        if (index === 4) {
          highlightWords(index, word)
        }
        if (index === 5) {
          highlightWords(index, word)
        }
        if (index === 6) {
          highlightWords(index, word)
        }
        if (index === 7) {
          highlightThemes(index, "crimeandviolence")
        }
        if (index === 8) {
          highlightThemes(index, "crimeandviolence")
          highlightWords(index, word)
        }
        if (index === 9) {
          highlightThemes(index, "femalestereotypes")
        }
        if (index === 10) {
          highlightThemes(index, "femalestereotypes")
          highlightWords(index, word)
        }
        if (index === 11) {
          highlightThemes(index, "EPR")
        }
        if (index === 12) {
          renderThemeBars(themesRank, themesFreq, themes, x, y)
        }

        return Chart;
      },
      // on resize, update new dimensions
      resize() {
        // defaults to grabbing dimensions from container element
        width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
        height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;
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
        
        $xAxisText
              .attr("x", -275)
              .attr("y", 10)
        
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
          .attr("y", d => d.data[d.key.word]!==0 || d.data[d.key.word]!==null? y(d.data[d.key.word]):y(null));
        
        // $rectLabels 
        //   .attr("y", d => d.data[d.key.word]!==0 || d.data[d.key.word]!==null? y(d.data[d.key.word]):y(null))
        
        // theme chart
        xThemes.range([MARGIN_LEFT, width + MARGIN_RIGHT])
        yThemes.rangeRound([MARGIN_TOP, height - MARGIN_BOTTOM])

        $xAxisThemes = g => g
          .call(d3.axisBottom(xThemes).tickSizeOuter(0).tickSizeInner(0))
          .call(g => g.selectAll(".domain").remove())
        
        $yAxisThemes = g => g
          .call(d3.axisRight(yThemes).tickSizeOuter(0).tickSizeInner(0))
          .call(g => g.selectAll(".domain").remove())
          
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
