import { eventDataNew } from "../utils/eventData";
/* global d3 */

/*
 USAGE (example: line chart)
 1. c+p this template to a new file (line.js)
 2. change puddingChartName to puddingChartLine
 3. in graphic file: import './pudding-chart/line'
 4a. const charts = d3.selectAll('.thing').data(data).puddingChartLine();
 4b. const chart = d3.select('.thing').datum(datum).puddingChartLine();
*/

d3.selection.prototype.puddingTemporalLine = function init(options) {
  function createChart(el) {
    // dom elements
    const $chart = d3.select(el);
    let $svg = null;
    let $axis = null;
    let $vis = null;
    let $row = null;
    let $col = null;
    let $themeGroups = null;
    let $cells = null;
    let $lines = null;
    let $areas = null;
    let $circleEvents = null;
    let $rulerG = null;
    let $tooltip = d3.selectAll(".tooltip");

    // colors
    const mainColor = "#3569DC";
    const fColor = "#648FDC";
    const eColor = "#A35FD0";
    const vColor = "#f76e45";
    const rColor = "#53B67C";

    // data
    let data = $chart.datum();
    let dataset = data[0];
    let filter = data[1];
    let country = data[2];
    let variable = data[3];
    let headlinesTemp = data[4];
    let dataDodge = null;

    var words = dataset.filter((d) => d.country === country);

    const sortBy = [
      "empowerment",
      "crime and violence",
      "female stereotypes",
      "race, ethnicity and identity",
    ];

    const customSort = ({ data, sortBy, sortField }) => {
      const sortByObject = sortBy.reduce((obj, item, index) => {
        return {
          ...obj,
          [item]: index,
        };
      }, {});
      return data.sort(
        (a, b) => sortByObject[a[sortField]] - sortByObject[b[sortField]]
      );
    };

    words = customSort({ data: words, sortBy, sortField: "theme" });

    function peakSort(data) {
      const theme0 = d3
        .rollups(
          data
            .filter((d) => d.theme === sortBy[0])
            .sort((a, b) =>
              d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)
            ),
          (v) => v[0].year,
          (d) => d.word
        )
        .sort((a, b) => d3.ascending(a[1], b[1]))
        .map((d) => d[0]);

      const theme1 = d3
        .rollups(
          data
            .filter((d) => d.theme === sortBy[1])
            .sort((a, b) =>
              d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)
            ),
          (v) => v[0].year,
          (d) => d.word
        )
        .sort((a, b) => d3.ascending(a[1], b[1]))
        .map((d) => d[0]);

      const theme2 = d3
        .rollups(
          data
            .filter((d) => d.theme === sortBy[2])
            .sort((a, b) =>
              d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)
            ),
          (v) => v[0].year,
          (d) => d.word
        )
        .sort((a, b) => d3.ascending(a[1], b[1]))
        .map((d) => d[0]);

      const theme3 = d3
        .rollups(
          data
            .filter((d) => d.theme === sortBy[3])
            .sort((a, b) =>
              d3.ascending(a.freq_prop_headlines, b.freq_prop_headlines)
            ),
          (v) => v[0].year,
          (d) => d.word
        )
        .sort((a, b) => d3.ascending(a[1], b[1]))
        .map((d) => d[0]);

      const sortedWordList = theme0.concat(theme1, theme2, theme3);
      return sortedWordList;
    }

    let peakSortedWordList = peakSort(words);

    let numUniqueWords = d3.map(words, (d) => d.word).filter(onlyUnique).length;

    // plot structure
    const cols = 1;
    const rows = numUniqueWords / cols;
    let grid = d3.cross(d3.range(rows), d3.range(cols), (row, col) => ({
      row,
      col,
    }));

    words = words.map((d) => {
      return {
        year: d.year,
        frequency: d[variable],
        word: d.word,
        word_type: d.word_type,
        theme: d.theme,
      };
    });

    let freqByWord = d3.rollup(
      words,
      (g) =>
        g.map(({ year, frequency }) => ({
          date: new Date(year, 0, 1),
          frequency,
        })),
      (d) => d.word
    );

    let fullData = d3
      .zip(
        customSort({
          data: Array.from(freqByWord),
          sortBy: peakSortedWordList,
          sortField: "0",
        }),
        grid
      )
      .map(([[word, rates], { row, col }]) => ({
        word,
        rates,
        row,
        col,
      }));

    let minDate = fullData[0].rates[0].date;
    let maxDate = fullData[0].rates[fullData[0].rates.length - 1].date;

    let wordToScaleAndArea;
    // let maxRate;
    let curve;
    let area;
    let line;

    // world events data
    let radius = 5;
    let padding = 1.5;
    let numberOfCategories = 5;
    let categories = ["0", "1", "2", "3", "4"];
    let dateRange = [new Date(2010, 0).getTime(), new Date(2021, 0).getTime()];
    let eventsWorld = eventDataNew;

    // dimensions
    let width = 0;
    let height = 0;
    const MARGIN_TOP = 50;
    const MARGIN_BOTTOM = 20;
    const MARGIN_LEFT = 80;
    const MARGIN_RIGHT = 0;
    const stickyAxisHeight = 300;
    const MS_TOP = 50;
    const MS_BOTTOM = 50;
    const MS_LEFT = 80;
    const MS_RIGHT = 0;

    // scales
    let x = null;
    // let y = null;
    let xAxis = null;
    let $stickyAxisGroup = null;
    let $stickyAxis = null;

    // helper functions
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    function showTooltip(event, d) {
      $areas.attr("opacity", 0.125);
      $lines.attr("opacity", 0.25);
      d3.selectAll(".wordText").attr("opacity", 0.125);

      d3.select("#area-" + d.word).attr("opacity", 0.85);
      d3.select("#line-" + d.word).attr("opacity", 1);
      d3.select("#text" + d.word).attr("opacity", 1);

      const hoveredWord = event.target.id.replace("area-", "");
      let wordHeadlines = headlinesTemp.filter((d) => {
        return (
          (country === "all countries" || d.country === country) &&
          d.headline_no_site.toLowerCase().match(hoveredWord)
        );
      });

      let randHeadline = Math.floor(Math.random() * wordHeadlines.length);

      let { clientX: xPos, clientY: yPos } = event;

      let right = xPos > window.innerWidth / 2;
      let offset = right ? $tooltip.node().offsetWidth + -50 : 50;

      $tooltip.classed("is-visible", true);

      if (width >= 600) {
        $tooltip
          .style("top", yPos + 50 + "px")
          .style("left", xPos - offset + "px")
          .style("bottom", "auto");
      } else {
        $tooltip
          .style("bottom", 0 + "px")
          .style("left", 0 + "px")
          .style("top", "auto");
      }

      if (wordHeadlines.length > 0) {
        $tooltip.html(
          `<p class="tt-date">${d3.timeFormat("%m/%Y")(
            new Date(wordHeadlines[randHeadline].time)
          )} | ${wordHeadlines[randHeadline].site}</p><p class="tt-hed">${
            wordHeadlines[randHeadline].headline_no_site
          }</p>`
        );
      }
    }

    function hideTooltip() {
      $areas.attr("opacity", 0.5);
      $lines.attr("opacity", 1);
      d3.selectAll(".wordText").attr("opacity", 1);

      $tooltip.classed("is-visible", false);
    }

    function showTimeRuler(event, d) {
      let selection = d3.select(event.currentTarget);

      d3.selectAll(".event-circle").style("opacity", "0.5");
      selection
        .style("opacity", "1")
        .style("stroke", "#282828")
        .style("stroke-width", 2);

      $rulerG
        .attr("transform", `translate(${$col(0)}, -${MARGIN_TOP / 3})`)
        .attr("x", x(d.date) - 9)
        .attr("y", 0)
        .attr("height", height)
        .attr("width", 20)
        .style("opacity", 1);

      let { clientX: xPos, clientY: yPos } = event;
      let right = xPos > window.innerWidth / 2;
      let offset = right ? $tooltip.node().offsetWidth + -50 : 50;

      $tooltip.classed("is-visible", true);

      if (width >= 600) {
        $tooltip
          .style("top", yPos + 50 + "px")
          .style("left", xPos - offset + "px")
          .style("bottom", "auto");
      } else {
        $tooltip
          .style("bottom", 0 + "px")
          .style("left", 0 + "px")
          .style("top", "auto");
      }

      $tooltip.html(
        `<p class="tt-date">EVENT: ${d3.timeFormat("%m/%Y")(
          d.date
        )}</p><p class="tt-hed-no-italic">${d.name}</p>`
      );
    }

    function hideTimeRuler() {
      $rulerG.style("opacity", 0);

      d3.selectAll(".event-circle")
        .style("opacity", "1")
        .style("stroke", "none");

      $tooltip.classed("is-visible", false);
    }

    function dodge(data, { radius = 1, x = (d) => d } = {}) {
      const radius2 = radius ** 2;
      const circles = data
        .map((d, i) => ({ x: +x(d, i, data), data: d }))
        .sort((a, b) => a.x - b.x);
      const epsilon = 1e-3;
      let head = null,
        tail = null;

      function intersects(x, y) {
        let a = head;
        while (a) {
          if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
            return true;
          }
          a = a.next;
        }
        return false;
      }

      for (const b of circles) {
        // Remove circles from the queue that can’t intersect the new circle b.
        while (head && head.x < b.x - radius2) head = head.next;

        // Choose the minimum non-intersecting tangent.
        if (intersects(b.x, (b.y = 0))) {
          let a = head;
          b.y = Infinity;
          do {
            let y1 = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
            let y2 = a.y - Math.sqrt(radius2 - (a.x - b.x) ** 2);
            if (Math.abs(y1) < Math.abs(b.y) && !intersects(b.x, y1)) b.y = y1;
            if (Math.abs(y2) < Math.abs(b.y) && !intersects(b.x, y2)) b.y = y2;
            a = a.next;
          } while (a);
        }

        // Add b to the queue.
        b.next = null;
        if (head === null) head = tail = b;
        else tail = tail.next = b;
      }

      dataDodge = circles;
    }

    const Chart = {
      // called once at start
      init() {
        $svg = $chart.append("svg").attr("class", "pudding-chart");

        // gradient
        let $defs = $svg.append("defs");
        let linearGradientF = $defs
          .append("linearGradient")
          .attr("id", "linear-gradient-F");
        linearGradientF
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");
        linearGradientF
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", fColor);
        linearGradientF
          .append("stop")
          .attr("offset", "90%")
          .attr("stop-color", "#FEFAF1");
        linearGradientF
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#FEFAF1");

        let linearGradientV = $defs
          .append("linearGradient")
          .attr("id", "linear-gradient-V");
        linearGradientV
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");
        linearGradientV
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", vColor);
        linearGradientV
          .append("stop")
          .attr("offset", "90%")
          .attr("stop-color", "#FEFAF1");
        linearGradientV
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#FEFAF1");

        let linearGradientE = $defs
          .append("linearGradient")
          .attr("id", "linear-gradient-E");
        linearGradientE
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");
        linearGradientE
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", eColor);
        linearGradientE
          .append("stop")
          .attr("offset", "90%")
          .attr("stop-color", "#FEFAF1");
        linearGradientE
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#FEFAF1");

        let linearGradientR = $defs
          .append("linearGradient")
          .attr("id", "linear-gradient-R");
        linearGradientR
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "0%")
          .attr("y2", "100%");
        linearGradientR
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", rColor);
        linearGradientR
          .append("stop")
          .attr("offset", "90%")
          .attr("stop-color", "#FEFAF1");
        linearGradientR
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#FEFAF1");

        // create axis
        $axis = $svg.append("g").attr("class", "g-axis");

        $row = d3.scaleBand().domain(d3.range(rows)).paddingInner(-1);

        $col = d3.scaleBand().domain(d3.range(cols)).paddingInner(0.2);

        $vis = $svg.append("g").attr("class", "g-vis");

        $cells = $vis
          .append("g")
          .selectAll("g")
          .data(fullData)
          .join("g")
          .attr("class", (d) =>
            words.filter((c) => c.word === d.word)[0].theme ===
            "female stereotypes"
              ? "biasCells"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "empowerment"
              ? "empCells"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "crime and violence"
              ? "crimeCells"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "race, ethnicity and identity"
              ? "raceCells"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "important people"
              ? "peopleCells"
              : "ntCells"
          )
          .attr("transform", (d) => `translate(${$col(d.col)}, ${$row(d.row)})`)
          .on("mouseover", (event, d) => showTooltip(event, d))
          .on("mouseleave", (event, d) => hideTooltip(event, d));

        $areas = $cells
          .append("path")
          .attr("fill", (d) =>
            words.filter((c) => c.word === d.word)[0].theme ===
            "female stereotypes"
              ? "url(#linear-gradient-F)"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "empowerment"
              ? "url(#linear-gradient-E)"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "crime and violence"
              ? "url(#linear-gradient-V)"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "race, ethnicity and identity"
              ? "url(#linear-gradient-R)"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "important people"
              ? "url(#linear-gradient-P)"
              : "url(#linear-gradient-NT)"
          )
          .attr("opacity", 0.5)
          .attr("class", "wordArea")
          .attr("id", (d) => `area-${d.word}`)
          .on("mouseover", (event, d) => showTooltip(event, d))
          .on("mouseleave", (event, d) => hideTooltip(event, d));

        $lines = $cells
          .append("path")
          .style("stroke", (d) =>
            words.filter((c) => c.word === d.word)[0].theme ===
            "female stereotypes"
              ? "url(#linear-gradient-F)"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "empowerment"
              ? "url(#linear-gradient-E)"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "crime and violence"
              ? "url(#linear-gradient-V)"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "race, ethnicity and identity"
              ? "url(#linear-gradient-R)"
              : words.filter((c) => c.word === d.word)[0].theme ===
                "important people"
              ? "url(#linear-gradient-P)"
              : "url(#linear-gradient-NT)"
          )
          .attr("stroke-width", 1)
          .attr("fill", "none")
          .attr("class", "wordArea")
          .attr("id", (d) => `line-${d.word}`)
          .on("mouseover", (event, d) => showTooltip(event, d))
          .on("mouseleave", (event, d) => hideTooltip(event, d));

        $rulerG = $vis.append("rect").attr("class", "timeRuler");

        // sticky axis
        $stickyAxis = d3
          .select("div#stickyXaxis")
          .append("svg")
          .attr("class", "stickyAxis");

        $stickyAxisGroup = $stickyAxis.append("g");

        $circleEvents = $stickyAxis.append("g");

        Chart.resize();
        Chart.render();
      },
      // on resize, update new dimensions
      resize() {
        // defaults to grabbing dimensions from container element
        width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
        height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;
        $svg
          .attr("width", width + MARGIN_LEFT + MARGIN_RIGHT)
          .attr("height", height + MARGIN_TOP + MARGIN_BOTTOM);

        $row.range([0, height]);
        $col.range([0, width]);

        x = d3
          .scaleTime()
          .domain([minDate, maxDate])
          .range([0, $col.bandwidth()]);

        xAxis = d3
          .axisBottom(x)
          .ticks(10)
          .tickSizeOuter(0)
          .tickSizeInner(0)
          .tickPadding(30)
          .tickFormat((d, i) =>
            i == 0 || i == 3 || i == 6 || i == 9 || i == 11
              ? d3.timeFormat("%Y")(new Date(d))
              : ""
          );

        let wordToScaleAndArea = Object.fromEntries(
          fullData.map((d) => {
            const maxRate = d3.max(d.rates, (d) => +d.frequency);

            const y = d3
              .scaleLinear()
              .domain([0, maxRate])
              .range([$row.bandwidth(), 0])
              .nice();

            curve = d3.curveMonotoneX; // d3.curveBasis
            area = d3
              .area()
              .x((d) => x(d.date))
              .y1((d) => y(d.frequency))
              .y0((d) => y(0))
              .curve(d3.curveMonotoneX);

            line = d3
              .line()
              .x((d) => x(d.date))
              .y((d) => y(d.frequency))
              .curve(d3.curveMonotoneX);

            return [d.word, { y, area, line }];
          })
        );

        $cells.attr(
          "transform",
          (d) => `translate(${$col(d.col)}, ${$row(d.row)})`
        );

        $areas.attr("d", (d) => wordToScaleAndArea[d.word].area(d.rates));
        $lines.attr("d", (d) => wordToScaleAndArea[d.word].line(d.rates));

        // labels
        $cells.each(function (d) {
          const group = d3
            .select(this)
            .attr("class", "SMCell")
            .attr("id", (d) => "cell" + d.word);

          const yaxis = d3
            .axisLeft(wordToScaleAndArea[d.word].y)
            .ticks(2)
            .tickSizeOuter(0);

          group
            .append("g")
            .attr("class", "catLabel")
            .append("text")
            .attr("x", -10)
            .attr("y", $row.bandwidth())
            .attr("class", "wordText")
            .attr("id", (d) => "text" + d.word)
            .text(d.word)
            .on("mouseover", (event, d) => showTooltip(event, d))
            .on("mouseleave", (event, d) => hideTooltip(event, d));
        });

        // sticky axis
        $stickyAxis
          .attr("transform", `translate(${MS_LEFT / 2}, 0)`)
          .attr("width", width)
          .attr("height", stickyAxisHeight - MS_TOP - MS_BOTTOM);

        $stickyAxisGroup
          .attr("transform", `translate(${$col(0)}, ${MS_TOP + MS_TOP / 2})`)
          .call(xAxis);

        dodge(
          eventsWorld.filter((d) => d.date <= maxDate),
          { radius: radius * 2 + padding, x: (d) => x(d.date) }
        );

        $circleEvents
          .attr("transform", `translate(${$col(0)}, ${MS_TOP + MS_TOP / 2})`)
          .selectAll("circle")
          .data(dataDodge)
          .join("circle")
          .attr("class", "event-circle")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", radius)
          .attr("fill", (d) =>
            d.data.categories === "empowerment"
              ? "#A35FD0"
              : d.data.categories === "crime and violence"
              ? "#f76e45"
              : d.data.categories === "race, ethnicity and identity"
              ? "#53B67C"
              : d.data.categories === "people and places"
              ? "#5787f2"
              : "lightgrey"
          )
          .attr("stroke", (d) =>
            d.data.categories === "empowerment"
              ? "#A35FD0"
              : d.data.categories === "crime and violence"
              ? "#f76e45"
              : d.data.categories === "race, ethnicity and identity"
              ? "#53B67C"
              : d.data.categories === "people and places"
              ? "#5787f2"
              : "lightgrey"
          )
          .on("mouseover", (event, d) => showTimeRuler(event, d.data))
          .on("mouseleave", (event, d) => hideTimeRuler(event, d.data));

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
