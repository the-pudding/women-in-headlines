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

      chartData  = chartData.filter(d=>(+d.monthly_visits !== 0)&(+d[variable] !== 0)&
                  (d.site !== "msn.com")&(d.site !== "sports.yahoo.com")&
                  (d.site !== "finance.yahoo.com")&(d.site !== "news.google.com")&
                  (d.site !== "news.yahoo.com")&(d.site !== "bbc.com")&
                  (d.site !== "makeuseof.com")&(d.site !== "which.co.uk")&
                  (d.site !== "espncricinfo.com")&(d.site !== "seekingalpha.com")&
                  (d.site !== "prokerala.com"));
        
      filterData = chartData.map((d) => {
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

      const logoData = [{site:"nytimes.com", link:"nytimes.png"},
					{site:"dailymail.co.uk", link:"dailyMail.png"},
					{site:"cnn.com", link:"cnn.png"},
					{site:"bbc.co.uk", link:"bbc.png"},
					{site:"telegraph.co.uk", link:"telegraph.png"},
					{site:"washingtonpost.com", link:"washingtonPost.png"},
					{site:"forbes.com", link:"forbes.png"},
					{site:"abcnews.go.com", link:"abc.png"},
					{site:"foxnews.com", link:"foxNews.png"},
					{site:"ksl.com", link:"ksl.png"},
					{site:"bloomberg.com", link: "bloomberg.png"},
					{site:"breitbart.com", link:"breitbart.png"},
					{site:"popsugar.com", link:"popSugar.png"},
					{site:"nbcnews.com", link:"nbc.png"},
					{site:"buzzfeed.com", link:"buzzfeed.png"},
					{site:"cnet.com", link:"cnet.png"},
					{site:"politico.com", link:"politico.png"},
					{site:"usatoday.com", link:"usaToday.png"},
					{site:"nydailynews.com", link:"nyDailyNews.png"},
					{site:"businessinsider.com", link:"businessInsider.png"},
					{site:"aajtak.in", link:"aajtak.png"},
					{site:"espn.go.com", link:"espn.png"},
					{site:"huffingtonpost.com", link:"huffingtonPost.png"}
				]
  
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
      let logoScale = d3.scaleLinear()
                    .domain(extentVisits)
      let simulation = null;
      let maxR = null;
  
      // helper functions
      function populateDropdown(data, div, attribute) {
        const select = d3.select(div)
	
				const unique_countries = d3.map(data, d=>d[attribute]).filter(onlyUnique);
				attribute==="country_of_pub"?unique_countries.unshift("Country"):unique_countries.unshift("Newsroom")
        
				select.selectAll("option")
				.data(unique_countries)
				.join("option")
					.attr("value", d=>d==="Country"||d==="Newsroom"?"":d)
					.text(d=>d);
      }

      function changeDropdown() {
        const selection = d3.select(this).property("value");
        const dropdownType = d3.select(this).property("id");

        let allCircs = d3.selectAll(".forceCircles");
				let allLogos = d3.selectAll(".forceLogos");

        if (dropdownType === "countrydropdown") {
          $pubDropdown.node().options[0].selected = true;

          allCircs.style("fill", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"#F7DC5B":"#FEFAF1")
				  allCircs.style("opacity", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"1":
										 selection===""?"1":"0.2")
				  allLogos.style("opacity", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"1":
										 selection===""?"1":"0.2")
        }

        if (dropdownType === "pubdropdown") {
          $countryDropdown.node().options[0].selected = true;

          allCircs.style("fill", d=>d.site.toLowerCase() === selection.toLowerCase()?"#F7DC5B":"#FEFAF1")
				  allCircs.style("opacity", d=>d.site.toLowerCase() === selection.toLowerCase()?"1":
											selection===""?"1":"0.2")
				  allLogos.style("opacity", d=>d.site.toLowerCase() === selection.toLowerCase()?"1":
										 selection===""?"1":"0.2")
        }
      }

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      function showTooltip() {
        let [x, y] = d3.pointer(event);
        let right = x > window.innerWidth / 2;
        let offset = right ? $tooltip.node().offsetWidth + -50 : 50;

        let siteMatch = d3.select(this).attr('id'); 
        siteMatch = siteMatch.split("-");
        siteMatch = siteMatch[0];

        let circ = d3.select(this);
        circ.style("stroke-width", 3).style("stroke", "#E75C33")

        let dataSubset = headlines.filter(d => d.site === siteMatch);
        let randomHeadline = Math.floor(Math.random() * dataSubset.length);

        $tooltip.classed("is-visible", true)

          if (width >= 600) {
            $tooltip
              .style("top", y + "px")
              .style("left", (x - offset) + "px")
              .style("bottom", "auto");
          } else {
            $tooltip
              .style("bottom", 0 + "px")
              .style("left", 0 + "px")
              .style("top", "auto");
          }

        $tooltip.html(`<p class="tt-date">${d3.timeFormat("%b %Y")(new Date(dataSubset[randomHeadline].time))} | ${dataSubset[randomHeadline].site}</p>
                      <p class="tt-hed">${dataSubset[randomHeadline].headline_no_site}</p>`);
        
      }

      function hideTooltip() {
        $tooltip.classed("is-visible", false);

        let allCircs = d3.selectAll(".forceCircles");

        allCircs.style("stroke-width", "1")
        allCircs.style("stroke", "#282828")
      }
  
      const Chart = {
        // called once at start
        init() {
          $svg = $chart.append('svg').attr('class', 'pudding-chart');
  
          // create axis
          $axis = $svg.append('g').attr('class', 'g-axis');
          
          // setup legend group
          $legend = $svg.append('g')
            .attr('class', 'g-legend');
          
          $legendCircle = $legend.append("g");

          // setup viz group
          $vis = $svg.append('g').attr('class', 'g-vis');
          
          Chart.resize();
          Chart.render();
        },
        // on resize, update new dimensions
        resize() {

          // defaults to grabbing dimensions from container element
          width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
          height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;

          radius.range([3, width/15])
          logoScale.range([18, width/15])

          maxR = d3.max(filterData, d => +d.monthly_visits)
          maxR = radius(maxR);

          $svg
            .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
            .attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);
          
          $vis
            .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
            .attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);
            
          xScale = d3.scaleSymlog()
            .range([MARGIN_LEFT*2+MARGIN_RIGHT, width - maxR])
            .domain(variable==="polarity"?[0, d3.max(filterData, d => +d[variable])]:
                            d3.extent(filterData, d => +d[variable]))
                            
          legendData = [{level: "", radius: radius(10000000), y: height+75, x: width/2.2, anchor:"end", xtext: width/2.235, ytext: height+53,id: ""}, 
          {level: "", radius: radius(100000000), y: height+75, x: width/2.05,id: ""}, 
          {level: "1B Monthly Viewers", radius: radius(1000000000), y: height+75, x: width/1.85, anchor:"middle", xtext: width/1.85, ytext: height+width/6.5,id: ""}]
          
          $legend.attr('transform', `translate(-${width/2 - MARGIN_LEFT/2 - maxR/2}, -${height})`);

          $legendCircle
            .selectAll("circle")
            .data(legendData)
            .join('circle')
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.radius)
            .attr("class","legendBubble");
          
          $legendText = $legend.selectAll("text")
            .data(legendData)
            .join("text")
            .text(d=>d.level)
            .attr("x", d => d.xtext)
            .attr("y", d => d.ytext)
            .attr("class", "themesText")
            .style("text-anchor", d=>d.anchor)
            .call(wrap, 10);

          simulation = d3.forceSimulation()
            .nodes(filterData)
            .force('charge', d3.forceManyBody().strength(1))
            .force('x', d3.forceX().x(function(d) {
              return xScale(+d[variable]);
            }))
            .force("y", d3.forceY(height / 2))
            .force('collide', d3.forceCollide((d)=>{ 
              return radius(+d.monthly_visits)}))
            .alphaDecay(0.1)
            //.alpha(0.3)
            .on("tick", function() {
              $circles = $vis.selectAll('circle').data(filterData);
              $logos = $vis.selectAll('image').data(filterData);
        
              $newCircles = $circles.join("circle")
                .attr("class", "forceCircles")
                .attr("id", d => `${d.site}-circle`)
                .style("opacity", "1")
                .attr('r', d=>radius(+d.monthly_visits))
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .on("mouseenter", showTooltip)
					      .on("mouseleave", hideTooltip);

              //$circles.merge($newCircles)
                  // .attr('cx', function(d) { return d.x; })
                  // .attr('cy', function(d) { return d.y; })
                  // .on("mouseenter", (event, d) => { showTooltip() })
                  // .on("mouseleave", (event, d) => { hideTooltip() });
              
              $newLogos = $logos.join("svg:image")
									.attr("class", "forceLogo")
                  .attr("transform", function(d) {
                    let logoR = radius(+d.monthly_visits)
                    return `translate(-${logoR/2}, -${logoR/2})`
                  })
									// each logo needs to be centered in the bubble (couldnt find better way of doing this)
                  //.attr("transform", "translate(-50%, -50%)")
									// .attr("transform", d=>d.site=="bbc.co.uk" ? "translate(-50,-50)"
									// 					: d.site=="cnn.com" | d.site=="foxnews.com" ? "translate(-30,-30)"
									// 					: d.site=="espn.go.com" ? "translate(-34,-10)"
									// 					: d.site=="nytimes.com" | d.site=="buzzfeed.com" ? "translate(-25,-25)"
									// 					: d.site=="washingtonpost.com" | d.site=="huffingtonpost.com" | d.site== "usatoday.com" ? "translate(-20,-20)"
									// 					: d.site=="dailymail.co.uk" ? "translate(-22,-18)"
									// 					: d.site=="politico.com" | d.site=="ksl.com" | d.site=="abcnews.go.com" | d.site=="nydailynews.com" ? "translate(-12.5,-12.5)"
									// 					: d.site=="telegraph.co.uk" ? "translate(-15,-3)"
									// 					: d.site=="breitbart.com" ? "translate(-14,-10)"
									// 					: d.site=="aajtak.in" ? "translate(-25,-20)"
									// 					: d.site=="businessinsider.com" ? "translate(-14,-13)"
									// 					: "translate(-15,-15)")
									.attr('width', d=>logoScale(+d.monthly_visits))
                  .attr('height', d=>logoScale(+d.monthly_visits))
                  .attr('xlink:href', function(d) { 
                    if (+d.monthly_visits>150000000) {
                      let logo = logoData.filter(x=>x.site==d.site)[0]["link"]
                      return `assets/images/logos/${logo}`
                    } else {
                      return ""
                    }
                  })
                  .attr('x', function(d) { return d.x; })
                  .attr('y', function(d) { return d.y; })
              
              // $logos.merge($newLogos)
              //     .attr('x', function(d) { return d.x; })
              //     .attr('y', function(d) { return d.y; })
            }); 

          return Chart;
        },
        // update scales and render chart
        render() {
          // offset chart for margins
          $vis.attr('transform', `translate(${MARGIN_LEFT}, ${MARGIN_TOP})`);

          populateDropdown(chartData, "#countrydropdown", "country_of_pub")
          populateDropdown(chartData, "#pubdropdown", "site")

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
  