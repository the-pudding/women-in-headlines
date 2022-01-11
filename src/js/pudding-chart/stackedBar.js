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

    // dimensions
    let width = 0;
    let height = 0;
    let MARGIN_TOP = 50;
    const FLAG_TOP = 80;
    let MARGIN_BOTTOM = 80;
    const MARGIN_LEFT = 0;
    const MARGIN_RIGHT = 50;
    const themePad = 20;
    let xPad = null;

    // scales
    let x = null;
    let y = null;
    let xScale = null;
    let yScale = null;
    let xAccessor = null;
    let yAccessor = null;

    // other
    let showThemes = false;
    let themeRects = null;

    // helper functions
    function searchWords() {
      let onlyWords = dataLocal.columns;

      const existing = document.querySelector(
        "#wordSearch .autocomplete__wrapper"
      );
      if (!existing) {
        Autocomplete({
          element: document.querySelector("#wordSearch"),
          id: "my-autocomplete",
          source: onlyWords,
          displayMenu: "overlay",
          placeholder: "Search for a word",
          confirmOnBlur: false,
          onConfirm(word) {
            $rectLabels.remove();
            highlightWords(null, word, "search");
          },
        });
      }
    }

    function stripSpaces(string) {
      let stripped = string.trim();
      stripped = stripped.replace(/ /g, "");
      stripped = stripped.replace(",", "");
      stripped = stripped.toLowerCase();
      return stripped;
    }

    function showWord() {
      let wordGroup = d3.select(this);
      let wordText = wordGroup.attr("id");
      wordText = wordText.split("_")[0];

      $rect.style("opacity", "0.3");

      let wordRects = wordGroup
        .selectAll("rect")
        .classed("hoverRectActive", true);

      const vals = [...wordRects._groups[0]]
        .map((rect) => {
          const datum = d3.select(rect).datum();
          return datum.data[datum.key.word];
        })
        .filter((d) => d);

      const lastVal = vals.pop();

      const top = y(+lastVal);

      $rectLabels = wordGroup
        .append("text")
        .text(wordText)
        .attr("class", "stackedBarThemeHover")
        .attr("x", width - MARGIN_RIGHT)
        .attr("y", top);
    }

    function hideWord() {
      let wordGroup = d3.select(this);

      $rectLabels.remove();

      d3.selectAll(".stackedBars")
        .selectAll(
          ".crimeandviolence_class, .femalestereotypes_class, .empowerment_class, .peopleandplaces_class, .raceethnicityandidentity_class"
        )
        .style("opacity", 1);

      let wordRects = wordGroup
        .selectAll("rect")
        .classed("hoverRectActive", false);
    }

    function revealChart() {
      let allRects = d3
        .selectAll(".stackedBars")
        .selectAll(`rect`)
        .transition()
        .duration("1000")
        .ease(d3.easeCubic)
        //.delay((d, i) => { return i * 1; })
        .attr("y", (d) =>
          d.data[d.key.word] !== 0 || d.data[d.key.word] !== null
            ? y(d.data[d.key.word])
            : y(null)
        );
    }

    function baseRects() {
      let notWordRects = d3
        .selectAll(".stackedBars")
        .selectAll(`rect`)
        .attr("fill", "#ded5bb")
        .attr("opacity", "1");
    }

    function highlightWords(index, word, userAction) {
      $stepSel.classed("is-active", (d, i) => i === index);
      let ID = word;
      let wordRects = null;
      let wordGroup = d3.select(`#${ID}_group`);

      if (index === 7 || index === 9 || userAction === "search") {
        d3.selectAll(`.stackedBars rect`).attr("opacity", "0.3");

        wordRects = d3.selectAll(`.${ID}_class`).attr("opacity", "1");
      } else {
        d3.selectAll(`.stackedBars rect`)
          .attr("fill", "#ded5bb")
          .attr("opacity", "0.3");

        wordRects = d3
          .selectAll(`.${ID}_class`)
          .attr("fill", "#282828")
          .attr("opacity", "1");
      }

      const vals = [...wordRects._groups[0]]
        .map((rect) => {
          const datum = d3.select(rect).datum();
          return datum.data[datum.key.word];
        })
        .filter((d) => d);

      const lastVal = vals.pop();

      const top = y(+lastVal);

      $rectLabels = wordGroup
        .append("text")
        .text(ID)
        .attr("class", "stackedBarThemeHover")
        .attr("x", width - MARGIN_RIGHT)
        .attr("y", top + 5);
    }

    function highlightThemes(index, theme) {
      $stepSel.classed("is-active", (d, i) => i === index);

      let notThemeRects = d3
        .selectAll(".stackedBars")
        .selectAll(`rect`)
        .attr("fill", "#ded5bb")
        .attr("opacity", "0.3");

      let violenceRects = d3
        .selectAll(".stackedBars")
        .selectAll(".crimeandviolence_class");
      let stereotypeRects = d3
        .selectAll(".stackedBars")
        .selectAll(".femalestereotypes_class");
      let empowermentRects = d3
        .selectAll(".stackedBars")
        .selectAll(".empowerment_class");
      let peopleRects = d3
        .selectAll(".stackedBars")
        .selectAll(".peopleandplaces_class");
      let raceRects = d3
        .selectAll(".stackedBars")
        .selectAll(".raceethnicityandidentity_class");

      if (theme === "crimeandviolence") {
        violenceRects.attr("fill", "#E76B2D").attr("opacity", "1");
      }

      if (theme === "femalestereotypes") {
        stereotypeRects.attr("fill", "#648FDC").attr("opacity", "1");
      }

      if (theme === "EPR") {
        violenceRects.attr("fill", "#E76B2D").attr("opacity", "1");
        stereotypeRects.attr("fill", "#648FDC").attr("opacity", "1");
        empowermentRects.attr("fill", "#A35FD0").attr("opacity", "1");
        peopleRects.attr("fill", "#F7DC5B").attr("opacity", "1");
        raceRects.attr("fill", "#53B67C").attr("opacity", "1");
      }
    }

    function renderThemeBars(data, dataFreq, themes, x, y, index) {
      let $INcolumn = d3.selectAll(".india_class, .india_tick");
      let $SAcolumn = d3.selectAll(".southafrica_class, .southafrica_tick");
      let $UKcolumn = d3.selectAll(".uk_class, .uk_tick");
      let $UScolumn = d3.selectAll(".usa_class, .usa_tick");
      let $allColumn = d3.selectAll(".allcountries_class, .allcountries_tick");

      $svg.remove();

      const themeGroups = [
        "crime and violence",
        "female stereotypes",
        "empowerment",
        "people and places",
        "race, ethnicity and identity",
      ];

      let stackedData = d3
        .stack()
        .keys(themesFreq.columns.slice(2))
        .order(d3.stackOrderAscending)(
          themesFreq.filter((d) => d.theme !== "No theme")
        )
        .map((d) => (d.forEach((v) => (v.key = d.key)), d));

      console.log({ stackedData });

      xScale = d3
        .scaleBand()
        .domain(themeGroups)
        .range([0, width])
        .padding([0.2]);
      xAccessor = (d) => d.data.theme;

      const maxY = stackedData.reduce((acc, currentValue) => {
        currentValue.forEach((d) => {
          if (d[0] > acc) acc = d[0];
          if (d[1] > acc) acc = d[1];
        });
        return acc;
      }, 0);
      yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0]);
      yAccessor = (d) => d[1];

      var colorScale = d3
        .scaleOrdinal()
        .domain(themeGroups)
        .range(["#E76B2D", "#648FDC", "#A35FD0", "#F7DC5B", "#53B67C"]);

      $svg = $chart.append("svg").attr("class", "horizontalStackedChart");
      $svg.style("transform", "translate(0px, 10px)");
      $vis = $svg.append("g").attr("class", "g-vis");

      let bars = $vis.append("g").attr("class", "bars");
      let wordGroups = bars
        .selectAll("g")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", (d) => `word ${d.key}`);

      themeRects = wordGroups
        .selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(xAccessor(d)))
        .attr("y", (d) => yScale(yAccessor(d)))
        .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("fill", (d) => colorScale(xAccessor(d)))
        .attr("stroke-width", 0.5)
        .attr("stroke", "#fefaf1");

      // Axes
      $axis = $svg.append("g").attr("class", "g-axis");
      $xAxisGroup = $axis.append("g").attr("class", "x axis");
      $xAxis = $xAxisGroup.append("g");
      $xAxis.call(d3.axisBottom(xScale));

      $xAxis.selectAll(".domain").remove();
      $xAxis.selectAll(".tick line").remove();
      $xAxis.selectAll(".tick .tickFlag").remove();

      $xAxis.attr("transform", `translate(0, ${height - MARGIN_BOTTOM / 2})`);

      $xAxis
        .selectAll(".tick")
        .attr("class", (d) => `${stripSpaces(d)}_tick tick`);

      $xAxis
        .selectAll(".tick text")
        .attr("x", 0)
        .attr("y", -5)
        .attr("class", "stackedChartTicks")
        .call(wrap, xScale.bandwidth());

      $xAxis
        .selectAll(".tick text")
        .attr(
          "transform",
          (d, i) =>
            `translate(${
              xScale.bandwidth() - MARGIN_RIGHT + 12 + i * 10
            }, 0) rotate(23)`
        );

      Chart.resizeCategoryChart();
    }

    function restoreBars() {
      $svg.remove();
      Chart.init();
    }

    function prepareWordData(dataLocal, themes) {
      series = d3
        .stack()
        .keys(dataLocal.columns.slice(2))(dataLocal)
        .map(
          (d) => (
            d.forEach(
              (v) =>
                (v.key =
                  themes.filter((c) => c.word === d.key)[0] !== undefined
                    ? {
                        word: d.key,
                        country: v.data.country,
                        theme: themes.filter((c) => c.word === d.key)[0].theme,
                      }
                    : {
                        word: d.key,
                        country: v.data.country,
                        theme: "No theme",
                      })
            ),
            d
          )
        );
      return series;
    }

    const Chart = {
      // called once at start
      init() {
        prepareWordData(dataLocal, themes);
        searchWords();

        $svg = $chart.append("svg").attr("class", "stackedChart");
        console.log("init - setting to 80");
        MARGIN_BOTTOM = 80;

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

        $rects = $vis
          .append("g")
          .attr("class", "stackedBars")
          .selectAll("g")
          .data(series)
          .join("g")
          .attr("id", (d) => `${d.key}_group`)
          .on("mouseenter", showWord)
          .on("mouseleave", hideWord)
          .selectAll("rect")
          .data((d) => d);

        $rect = $rects
          .join("rect")
          .attr("class", function (d) {
            let themeClass = `${stripSpaces(d.key.theme)}_class`;
            let wordClass = `${d.key.word}_class`;
            let countryClass = `${stripSpaces(d.key.country)}_class`;
            return `${wordClass} ${themeClass} ${countryClass}`;
          })
          .attr("fill", "#e7dfc8")
          .attr("opacity", "1")
          .attr("stroke", "#FEFAF1")
          .attr("stroke-width", "1");

        // themes chart
        $rectThemes = $vis
          .selectAll("rect")
          .filter(
            (d) =>
              d.key.theme !== "No theme" && d.data.country === "All countries"
          );

        $rectDrops = $vis
          .selectAll("rect")
          .filter(
            (d) =>
              d.key.theme === "No theme" && d.data.country === "All countries"
          );

        Chart.render();
        Chart.resize();
      },
      updateChart(index, direction) {
        const sel = $container.select(`[data-index='${index}']`);
        const word = sel.attr("word");
        const theme = sel.attr("theme");

        $rect.style("pointer-events", "none");

        if (index === 0) {
          if ($rectLabels) $rectLabels.remove();
          baseRects();
        }
        if (index === 1) {
          if ($rectLabels) $rectLabels.remove();
          highlightWords(index, word);
        }
        if (index === 2) {
          if ($rectLabels) $rectLabels.remove();
          highlightWords(index, word);
        }
        if (index === 3) {
          if ($rectLabels) $rectLabels.remove();
          highlightWords(index, word);
        }
        if (index === 4) {
          if ($rectLabels) $rectLabels.remove();
          highlightWords(index, word);
        }
        if (index === 5) {
          if ($rectLabels) $rectLabels.remove();
          highlightWords(index, word);
        }
        if (index === 6) {
          if ($rectLabels) $rectLabels.remove();
          highlightThemes(index, "crimeandviolence");
        }
        if (index === 7) {
          if ($rectLabels) $rectLabels.remove();
          highlightThemes(index, "crimeandviolence");
          highlightWords(index, word);
        }
        if (index === 8) {
          if ($rectLabels) $rectLabels.remove();
          highlightThemes(index, "femalestereotypes");
        }
        if (index === 9) {
          if ($rectLabels) $rectLabels.remove();
          highlightThemes(index, "femalestereotypes");
          highlightWords(index, word);
        }
        if (index === 10) {
          if ($rectLabels) $rectLabels.remove();
          highlightThemes(index, "EPR");
          $rect.style("opacity", null);
        }
        if (index === 11 && direction === "down") {
          if ($rectLabels) $rectLabels.remove();
          $rect.style("pointer-events", "auto");
        }
        if (index === 11 && direction === "up") {
          showThemes = false;
          restoreBars();

          if ($rectLabels) $rectLabels.remove();
          highlightThemes(index, "EPR");
          $rect.style("pointer-events", "auto");
        }
        if (index === 12) {
          showThemes = true;
          renderThemeBars(themesRank, themesFreq, themes, x, y, index);
        }

        return Chart;
      },
      // on resize, update new dimensions
      resizeCategoryChart() {
        console.log("resize - setting to 160");
        MARGIN_BOTTOM = 90;

        width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
        height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;

        $svg
          .attr("width", width + MARGIN_LEFT + MARGIN_RIGHT)
          .attr("height", height + MARGIN_TOP + MARGIN_BOTTOM);

        // responsive xAxis
        $xAxisGroup.attr("transform", `translate(0,${FLAG_TOP})`);

        xScale.range([MARGIN_LEFT, width - MARGIN_RIGHT]);
        // xPad = xScale.padding();

        $xAxis.call(d3.axisBottom(xScale));

        $xAxis.selectAll(".domain").remove();
        $xAxis.selectAll(".tick line").remove();
        $xAxis.selectAll(".tick .tickFlag").remove();

        $xAxis
          .selectAll(".tick")
          .attr("class", (d) => `${stripSpaces(d)}_tick tick`);

        $xAxis
          .selectAll(".tick text")
          .attr("x", 0)
          .attr("y", -5)
          .attr("class", "stackedChartTicks")
          .call(wrap, xScale.bandwidth());

        $xAxis
          .selectAll(".tick text")
          .attr(
            "transform",
            (d, i) =>
              `translate(${
                xScale.bandwidth() - MARGIN_RIGHT + 10 + i * 8
              }, 0) rotate(28)`
          );

        $xAxis.attr(
          "transform",
          `translate(0, ${height - MARGIN_BOTTOM * 1.5})`
        );

        yScale.range([height - MARGIN_BOTTOM, MARGIN_TOP]);

        themeRects
          .attr("x", (d) => xScale(xAccessor(d)))
          .attr("y", (d) => yScale(yAccessor(d)))
          .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
          .attr("width", xScale.bandwidth());

        return Chart;
      },
      resize() {
        if (showThemes) return;

        // defaults to grabbing dimensions from container element
        width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
        height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;

        $svg
          .attr("width", width + MARGIN_LEFT + MARGIN_RIGHT)
          .attr("height", height + MARGIN_TOP + MARGIN_BOTTOM);

        // responsive xAxis
        $xAxisGroup.attr("transform", `translate(0,${FLAG_TOP})`);

        x.range([MARGIN_LEFT, width - MARGIN_RIGHT]);
        xPad = x.padding();

        $xAxis.call(d3.axisBottom(x));

        $xAxis.selectAll(".domain").remove();
        $xAxis.selectAll(".tick line").remove();
        $xAxis.selectAll(".tick .tickFlag").remove();

        $xAxis
          .selectAll(".tick")
          .attr("class", (d) => `${stripSpaces(d)}_tick tick`);

        $xAxis
          .selectAll(".tick text")
          .attr("x", 0)
          .attr("y", -5)
          .attr("class", "stackedChartTicks")
          .call(wrap, x.bandwidth());

        $xAxis
          .selectAll(".tick text")
          .attr(
            "transform",
            `translate(${x.bandwidth() - MARGIN_RIGHT + 6}, 0)`
          );

        $xAxis
          .selectAll(".tick")
          .append("svg:image")
          .attr("class", "tickFlag")
          .attr("id", (d) => `${stripSpaces(d)}_flag`)
          .attr("height", "35px")
          .attr("x", x.bandwidth() - MARGIN_RIGHT + 5)
          .attr("y", 0)
          .attr("transform", "translate(-17, -55)")
          .attr("xlink:href", (d) =>
            flags.filter((c) => c.country === d)[0]
              ? flags.filter((c) => c.country === d)[0].flag
              : null
          );

        // responsive yAxis
        $yAxisGroup.attr("transform", `translate(${MARGIN_LEFT},0)`);

        const allYValues = series[0].reduce((acc, currentValue) => {
          const nums = _.values(_.omit(currentValue.data, ["country"]))
            .filter((d) => d !== "")
            .map((d) => parseInt(d));
          return [...acc, ...nums];
        }, []);

        y = d3
          .scaleLinear()
          .domain(d3.extent(allYValues).reverse())
          .range([height - MARGIN_BOTTOM, MARGIN_TOP]);

        $yAxis = (g) =>
          g
            .call(d3.axisRight(y).tickSizeOuter(0).tickSizeInner(0))
            .call((g) => g.selectAll(".tick").remove())
            .call((g) => g.selectAll(".domain").remove());

        $yAxis = $yAxisGroup.append("g").call($yAxis);

        $rect
          .attr("x", (d, i) => x(d.data.country))
          .attr("height", (d) => {
            return d.data[d.key.word] !== 0 &&
              d.data[d.key.word] !== null &&
              d.data[d.key.word] !== ""
              ? height / series.length
              : 0;
          })
          .attr("width", x.bandwidth())
          .attr("y", (d, i) => {
            return y(d.data[d.key.word]);
          })
          .style("display", (d) =>
            d.data[d.key.word] === "" ? "none" : "block"
          );

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
