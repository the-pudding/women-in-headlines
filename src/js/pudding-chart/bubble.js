import { wrap } from "../utils/wrap";
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
    let $legend = null;
    let $legendCircle = null;
    let $legendText = null;
    let $countryDropdown = d3.select("#countrydropdown");
    let $pubDropdown = d3.select("#pubdropdown");
    let $tooltip = d3.selectAll(".tooltip");

    // data
    let data = $chart.datum();
    let chartData = data[0];
    let headlines = data[1];
    let variable = data[2];
    let filterData = null;
    let legendData = null;

    chartData = chartData.filter(
      (d) =>
        (+d.monthly_visits !== 0) &
        (+d[variable] !== 0) &
        (d.site !== "msn.com") &
        (d.site !== "sports.yahoo.com") &
        (d.site !== "finance.yahoo.com") &
        (d.site !== "news.google.com") &
        (d.site !== "news.yahoo.com") &
        (d.site !== "bbc.com") &
        (d.site !== "makeuseof.com") &
        (d.site !== "which.co.uk") &
        (d.site !== "espncricinfo.com") &
        (d.site !== "seekingalpha.com") &
        (d.site !== "prokerala.com")
    );

    filterData = chartData.map((d) => {
      if (variable === "polarity") {
        return {
          site: d.site,
          polarity: d[variable],
          monthly_visits: d.monthly_visits,
          country_of_pub: d.country_of_pub,
        };
      } else {
        return {
          site: d.site,
          bias: d[variable],
          monthly_visits: d.monthly_visits,
          country_of_pub: d.country_of_pub,
        };
      }
    });

    const logoData = [
      { site: "nytimes.com", link: "nytimes.png" },
      { site: "dailymail.co.uk", link: "dailyMail.png" },
      { site: "cnn.com", link: "cnn.png" },
      { site: "bbc.co.uk", link: "bbc.png" },
      { site: "telegraph.co.uk", link: "telegraph.png" },
      { site: "washingtonpost.com", link: "washingtonPost.png" },
      { site: "forbes.com", link: "forbes.png" },
      { site: "abcnews.go.com", link: "abc.png" },
      { site: "foxnews.com", link: "foxNews.png" },
      { site: "ksl.com", link: "ksl.png" },
      { site: "bloomberg.com", link: "bloomberg.png" },
      { site: "breitbart.com", link: "breitbart.png" },
      { site: "popsugar.com", link: "popSugar.png" },
      { site: "nbcnews.com", link: "nbc.png" },
      { site: "buzzfeed.com", link: "buzzfeed.png" },
      { site: "cnet.com", link: "cnet.png" },
      { site: "politico.com", link: "politico.png" },
      { site: "usatoday.com", link: "usaToday.png" },
      { site: "nydailynews.com", link: "nyDailyNews.png" },
      { site: "businessinsider.com", link: "businessInsider.png" },
      { site: "aajtak.in", link: "aajtak.png" },
      { site: "espn.go.com", link: "espn.png" },
      { site: "huffingtonpost.com", link: "huffPost.png" },
    ];

    // dimensions
    let width = 0;
    let height = 0;
    let MARGIN_TOP = 80;
    let MARGIN_BOTTOM = 120;
    let MARGIN_LEFT = 55;
    let MARGIN_RIGHT = 50;

    // scales
    let xScale = null;
    let yScale = null;
    let extentVisits = d3.extent(filterData, (d) => +d.monthly_visits);
    let radius = d3.scaleSqrt().domain(extentVisits);
    let logoScale = d3.scaleLinear().domain(extentVisits);
    let simulation = null;
    let maxR = null;

    // helper functions
    function populateDropdown(data, div, attribute) {
      const select = d3.select(div);

      const unique_countries = d3
        .map(data, (d) => d[attribute])
        .filter(onlyUnique);
      attribute === "country_of_pub"
        ? unique_countries.unshift("Country")
        : unique_countries.unshift("Newsroom");

      select
        .selectAll("option")
        .data(unique_countries)
        .join("option")
        .attr("value", (d) => (d === "Country" || d === "Newsroom" ? "" : d))
        .text((d) => d);
    }

    function changeDropdown() {
      const selection = d3.select(this).property("value");
      const dropdownType = d3.select(this).property("id");

      let allCircs = d3.selectAll(".forceCircles");
      let allLogos = d3.selectAll(".forceLogo");

      if (dropdownType === "countrydropdown") {
        $pubDropdown.node().options[0].selected = true;

        allCircs.style("fill", (d) =>
          d.country_of_pub.toLowerCase() === selection.toLowerCase()
            ? "#F7DC5B"
            : "#FEFAF1"
        );
        allCircs.style("stroke", (d) =>
          d.site.toLowerCase() === selection.toLowerCase()
            ? "#E76B2D"
            : "#282828"
        );
        allCircs.style("stroke-width", (d) =>
          d.site.toLowerCase() === selection.toLowerCase() ? "3" : "1"
        );
        allCircs.style("opacity", (d) =>
          d.country_of_pub.toLowerCase() === selection.toLowerCase()
            ? "1"
            : selection === ""
            ? "1"
            : "0.2"
        );
        allLogos.style("opacity", (d) =>
          d.country_of_pub.toLowerCase() === selection.toLowerCase()
            ? "1"
            : selection === ""
            ? "1"
            : "0.2"
        );
      }

      if (dropdownType === "pubdropdown") {
        $countryDropdown.node().options[0].selected = true;

        allCircs.style("fill", (d) =>
          d.site.toLowerCase() === selection.toLowerCase()
            ? "#F7DC5B"
            : "#FEFAF1"
        );
        allCircs.style("stroke", (d) =>
          d.site.toLowerCase() === selection.toLowerCase()
            ? "#E76B2D"
            : "#282828"
        );
        allCircs.style("stroke-width", (d) =>
          d.site.toLowerCase() === selection.toLowerCase() ? "3" : "1"
        );
        allCircs.style("opacity", (d) =>
          d.site.toLowerCase() === selection.toLowerCase()
            ? "1"
            : selection === ""
            ? "1"
            : "0.2"
        );
        allLogos.style("opacity", (d) =>
          d.site.toLowerCase() === selection.toLowerCase()
            ? "1"
            : selection === ""
            ? "1"
            : "0.2"
        );
      }
    }

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    function showTooltip(e) {
      let { clientX: x, clientY: y } = e;
      let right = x > window.innerWidth / 2;
      let offset = right ? $tooltip.node().offsetWidth + -50 : 50;

      let siteMatch = e.target.id;
      siteMatch = siteMatch.split("-");
      siteMatch = siteMatch[0];
      let siteMatchNoPunc = siteMatch.replace(/\./g, "");

      let allCircs = d3.selectAll(".forceCircles").style("opacity", 0.2);
      let allLogos = d3.selectAll(".forceLogo").style("opacity", 0.2);

      allCircs
        .style("fill", (d) => {
          if (e.target.id.startsWith(d.site)) return "#F7DC5B";
          return null;
        })
        .style("stroke-width", (d) => {
          if (e.target.id.startsWith(d.site)) return 3;
          return null;
        })
        .style("stroke", (d) => {
          if (e.target.id.startsWith(d.site)) return "#E76B2D";
          return null;
        })
        .style("opacity", (d) => {
          if (e.target.id.startsWith(d.site)) return 1;
          return null;
        });

      allLogos.style("opacity", (d) => {
        if (e.target.id.startsWith(d.site)) return 1;
        return null;
      });

      //let circ = d3.select(`#${e.target.id}`);
      //let logo = d3.selectAll(`.forceLogo-${siteMatchNoPunc}`);

      // circ
      //   .style("stroke-width", 3)
      //   .style("stroke", "#E76B2D")
      //   .style("opacity", 1)
      //   .style("fill", "#F7DC5B");
      // logo.style("opacity", 1);

      let dataSubset = headlines.filter((d) => d.site === siteMatch);
      let randomHeadline = Math.floor(Math.random() * dataSubset.length);

      $tooltip.classed("is-visible", true);

      if (width >= 500) {
        $tooltip
          .style("top", `${y + 50}px`)
          .style("left", `${x - offset}px`)
          .style("bottom", "auto");
      } else {
        $tooltip
          .style("bottom", 0 + "px")
          .style("left", 0 + "px")
          .style("top", "auto");
      }

      $tooltip.html(`<p class="tt-date">${d3.timeFormat("%b %Y")(
        new Date(dataSubset[randomHeadline].time.replace(/-/g, "/"))
      )} | ${dataSubset[randomHeadline].site}</p>
                      <p class="tt-hed">${
                        dataSubset[randomHeadline].headline_no_site
                      }</p>`);
    }

    function hideTooltip() {
      $tooltip.classed("is-visible", false);

      let allCircs = d3.selectAll(".forceCircles");

      allCircs
        .style("stroke-width", "1")
        .style("stroke", "#282828")
        .style("opacity", 1)
        .style("fill", "#fefaf1");
      let allLogos = d3.selectAll(".forceLogo").style("opacity", 1);
    }

    const Chart = {
      // called once at start
      init() {
        $svg = $chart.append("svg").attr("class", "pudding-chart");

        // create axis
        $axis = $svg.append("g").attr("class", "g-axis");

        // setup legend group
        $legend = $svg.append("g").attr("class", "g-legend");

        $legendCircle = $legend.append("g");

        // setup viz group
        $vis = $svg.append("g").attr("class", "g-vis");

        // zoom
        // const onZoom = (e) => {
        //   d3.select($vis.node()).attr("transform", e.transform);
        // };
        // const zoomer = d3.zoom().scaleExtent([-5, 5]).on("zoom", onZoom);
        // d3.select($svg.node()).call(zoomer);
        // d3.select($svg.node()).style("cursor", "grab");

        Chart.resize();
        Chart.render();
      },
      // on resize, update new dimensions
      resize() {
        $vis.selectAll("circle").remove();
        $vis.selectAll("image").remove();

        if (window.innerWidth <= 600) {
          MARGIN_LEFT = 20;
        } else {
          MARGIN_LEFT = 55;
        }

        // defaults to grabbing dimensions from container element
        width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
        height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;

        let rSize = width >= 500 ? 18 : 12;

        radius.range([3, width / rSize]);
        logoScale.range([12, width / rSize]);

        maxR = d3.max(filterData, (d) => +d.monthly_visits);
        maxR = radius(maxR);

        $svg
          .attr("width", width + MARGIN_LEFT + MARGIN_RIGHT)
          .attr("height", height + MARGIN_TOP + MARGIN_BOTTOM);

        $vis
          .attr("width", width + MARGIN_LEFT + MARGIN_RIGHT)
          .attr("height", height + MARGIN_TOP + MARGIN_BOTTOM)
          .attr("transform", `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);

        xScale = d3
          .scaleLinear()
          .range([MARGIN_LEFT, width + MARGIN_LEFT - maxR * 2])
          .domain(d3.extent(filterData, (d) => +d[variable]));

        yScale = d3
          .scaleLinear()
          .range([MARGIN_TOP + MARGIN_BOTTOM, height - maxR * 2])
          .domain(d3.extent(filterData, (d) => +d[variable]));

        legendData = [
          {
            level: "",
            radius: radius(10000000),
            y: height + 75,
            x: width / 2 + maxR,
            anchor: "end",
            xtext: width / 2.235,
            ytext: height + 53,
            id: "",
          },
          {
            level: "",
            radius: radius(100000000),
            y: height + 75,
            x: width / 2 + maxR * 1.5,
            id: "",
          },
          {
            level: "1B Monthly Viewers",
            radius: radius(1000000000),
            y: height + 75,
            x: width / 2 + maxR * 2.75,
            anchor: "middle",
            xtext: width / 2 + maxR * 2.75,
            ytext: height + MARGIN_BOTTOM / 2 - 10,
            id: "",
          },
        ];

        //$legend.attr('transform', `translate(-${width / 2 - MARGIN_LEFT / 2 - maxR / 2}, -${height})`);
        let legendPos = width >= 500 ? -maxR : -width / 2 - maxR / 1.5;
        $legend.attr("transform", `translate(${legendPos},50)`);

        if (width >= 500) {
          simulation = d3
            .forceSimulation()
            .nodes(filterData)
            .force(
              "x",
              d3
                .forceX()
                .x(function (d) {
                  return xScale(+d[variable]);
                })
                .strength(1)
            )
            .force("y", d3.forceY(height / 2).strength(0.8))
            .force(
              "collide",
              d3.forceCollide((d) => {
                return radius(+d.monthly_visits);
              })
            )
            .stop();
        } else {
          simulation = d3
            .forceSimulation()
            .nodes(filterData)
            .force(
              "y",
              d3
                .forceY()
                .y((d) => xScale(+d[variable]))
                .strength(0.3)
            )
            .force(
              "x",
              d3
                .forceX()
                .x((d) => $chart.node().offsetWidth * 0.45)
                .strength(0.5)
            )
            .force(
              "collide",
              d3.forceCollide((d) => {
                return radius(+d.monthly_visits);
              })
            )
            .stop();
        }

        for (var i = 0; i < 1000; i++) {
          simulation.tick();
        }

        $circles = $vis.selectAll("circle").data(filterData);
        $logos = $vis.selectAll("image").data(filterData);

        $newCircles = $circles
          .join("circle")
          .attr("class", "forceCircles")
          .attr("id", (d) => `${d.site}-circle`)
          .style("opacity", "1")
          .attr("r", (d) => radius(+d.monthly_visits))
          .on("mouseenter", (e) => showTooltip(e))
          .on("mouseleave", hideTooltip);

        $circles
          .merge($newCircles)
          .attr("cx", function (d) {
            //let posX = width >= 500 ? d.x : d.y;
            let posX = d.x;
            return posX;
          })
          .attr("cy", function (d) {
            //let posY = width >= 500 ? d.y : d.x;
            let posY = d.y;
            return posY;
          });

        $newLogos = $logos
          .join("svg:image")
          .attr("class", function (d) {
            let siteNoPunc = d.site.replace(/\./g, "");
            return `forceLogo-${siteNoPunc} forceLogo`;
          })
          .attr("transform", function (d) {
            let logoR = radius(+d.monthly_visits);
            return `translate(-${logoR / 2}, -${logoR / 2})`;
          })
          .attr("width", (d) => logoScale(+d.monthly_visits))
          .attr("height", (d) => logoScale(+d.monthly_visits))
          .attr("xlink:href", function (d) {
            if (+d.monthly_visits > 150000000) {
              let logo = logoData.filter((x) => x.site == d.site)[0]["link"];
              return `assets/images/logos/${logo}`;
            } else {
              return "";
            }
          })
          .attr("x", function (d) {
            //let posX = width >= 500 ? d.x : d.y;
            let posX = d.x;
            return posX;
          })
          .attr("y", function (d) {
            //let posY = width >= 500 ? d.y : d.x;
            let posY = d.y;
            return posY;
          });

        $legendCircle
          .selectAll("circle")
          .data(legendData)
          .join("circle")
          .attr("fill", "orange")
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y)
          .attr("r", (d) => d.radius)
          .attr("class", "legendBubble");

        $legendText = $legend
          .selectAll("text")
          .data(legendData)
          .join("text")
          .text((d) => d.level)
          .attr("x", (d) => d.xtext)
          .attr("y", (d) => d.ytext)
          .attr("class", "themesText")
          .style("text-anchor", (d) => d.anchor)
          .call(wrap, 10);

        return Chart;
      },
      // update scales and render chart
      render() {
        // offset chart for margins
        if (width >= 500) {
          $vis.attr("transform", `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);
        }

        populateDropdown(chartData, "#countrydropdown", "country_of_pub");
        populateDropdown(chartData, "#pubdropdown", "site");

        $countryDropdown.on("change", changeDropdown);
        $pubDropdown.on("change", changeDropdown);

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
