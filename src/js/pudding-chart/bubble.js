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

      const logoData = [{site:"nytimes.com", link:"https://www.vectorlogo.zone/logos/nytimes/nytimes-icon.svg"},
					{site:"dailymail.co.uk", link:"https://seeklogo.com/images/D/Daily_Mail-logo-EBD7A83A1F-seeklogo.com.png"},
					{site:"cnn.com", link:"https://www.vectorlogo.zone/logos/cnn/cnn-icon.svg"},//https://www.vectorlogo.zone/logos/cnn/cnn-wordmark.svg
					{site:"bbc.co.uk", link:"https://www.vectorlogo.zone/logos/bbc/bbc-icon.svg"},
					{site:"telegraph.co.uk", link:"https://upload.wikimedia.org/wikipedia/commons/4/48/The_Telegraph_logo.svg"},
					{site:"washingtonpost.com", link:"https://www.vectorlogo.zone/logos/washingtonpost/washingtonpost-icon.svg"},
					{site:"forbes.com", link:"https://www.vectorlogo.zone/logos/forbes/forbes-icon.svg"},
					{site:"abcnews.go.com", link:"https://www.vectorlogo.zone/logos/abcgo/abcgo-icon.svg"},
					{site:"foxnews.com", link:"https://www.vectorlogo.zone/logos/fox/fox-icon.svg"},
					{site:"ksl.com", link:"https://logodix.com/logo/2090138.png"},
					{site:"bloomberg.com", link: "https://www.vectorlogo.zone/logos/bloomberg/bloomberg-icon.svg"},
					{site:"breitbart.com", link:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Breitbart_News.svg/1280px-Breitbart_News.svg.png"},
					{site:"popsugar.com", link:"https://all-4-one.com/wp-content/uploads/2015/07/PopSugar-Logo-logo.png"},
					{site:"nbcnews.com", link:"https://www.vectorlogo.zone/logos/nbc/nbc-icon.svg"},
					{site:"buzzfeed.com", link:"https://www.vectorlogo.zone/logos/buzzfeed/buzzfeed-icon.svg"},
					{site:"cnet.com", link:"https://www.vectorlogo.zone/logos/cnet/cnet-icon.svg"},
					{site:"politico.com", link:"https://www.vectorlogo.zone/logos/politico/politico-icon.svg"},
					{site:"usatoday.com", link:"https://www.vectorlogo.zone/logos/usatoday/usatoday-icon.svg"},
					{site:"nydailynews.com", link:"https://cdn6.myket.ir/icons/large/b0f31373-17ec-46d5-b6ef-66135cc1b242_.png"},
					{site:"businessinsider.com", link:"https://i.insider.com/596e4e7a552be51d008b50fd?width=600&format=jpeg"},
					{site:"aajtak.in", link:"https://static.wikia.nocookie.net/logopedia/images/d/db/Aaj_tak.png"},
					// {site:"ft.com", link:"https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo-v1:brand-ft-logo-square-coloured-dot?source=origami-registry&width=200"},
					{site:"espn.go.com", link:"https://cdn.worldvectorlogo.com/logos/espn.svg"},
					{site:"huffingtonpost.com", link:"https://www.vectorlogo.zone/logos/huffingtonpost/huffingtonpost-icon.svg"}
				]
  
      // dimensions
      let width = 0;
      let height = 0;
      const MARGIN_TOP = 50;
      const MARGIN_BOTTOM = 50;
      const MARGIN_LEFT =50;
      const MARGIN_RIGHT = 50;
  
      // scales
      let xScale = null;
      let yScale = null;
      let extentVisits = d3.extent(filterData, d=>+d.monthly_visits)
      let radius = d3.scaleSqrt()
                    .domain(extentVisits)
      let logoScale = d3.scaleLinear()
                    .domain(extentVisits)
      let simulation = null;

      const legendData = [{level: "", radius: radius(10000000), y: height+75, x: width/2.2, anchor:"end", xtext: width/2.235, ytext: height+53,id: ""}, 
			{level: "", radius: radius(100000000), y: height+75, x: width/2.05,id: ""}, 
			{level: "1B Monthly Viewers", radius: radius(1000000000), y: height+75, x: width/1.85, anchor:"middle", xtext: width/1.85, ytext: height+46,id: ""},
			{level: "?", radius: radius(30000000), y: height*1.08+11, x: width+15, anchor:"middle", xtext: width+15, ytext: height*1.08+16,id: "info"}]
  
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
        let offset = right ? $tooltip.node().offsetWidth + 5 : 0;

        $tooltip
          .classed("is-visible", true)
          .style("top", y + "px")
					.style("left", (x - offset) + "px");

        let dataSubset = data[1];
        let randomHeadline = Math.floor(Math.random() * dataSubset.length);

        $tooltip.html(`<p class="tt-date">${d3.timeFormat("%b %Y")(new Date(dataSubset[randomHeadline].time))} | ${dataSubset[randomHeadline].site}</p>
                      <p class="tt-hed">${dataSubset[randomHeadline].headline_no_site}</p>`);

        let selection = d3.select(this);
        let allCircs = d3.selectAll(".forceCircles");
				let allLogos = d3.selectAll(".forceLogos");

        console.log(selection)

        //allCircs.style("fill", "#FEFAF1")
        selection.style("fill", "#F7DC5B")
			  // allCircs.style("opacity", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"1":
				// 						 selection===""?"1":"0.2")
				//   allLogos.style("opacity", d=>d.country_of_pub.toLowerCase() === selection.toLowerCase()?"1":
				// 						 selection===""?"1":"0.2")
        
      }

      function hideTooltip() {
        $tooltip.classed("is-visible", false);
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
          $svg = $chart.append('svg').attr('class', 'pudding-chart');
  
          // create axis
          $axis = $svg.append('g').attr('class', 'g-axis');
          
          // setup legend group
          $legend = $svg.append('g')
            .attr('class', 'g-legend')
            .attr('transform', `translate(50, 50)`);

          $legendCircle = $legend.append("g")
            .selectAll("circle")
            .data(legendData)
            .join('circle')
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.radius)
            .attr("class","legendBubble")
          
          $legendText = $legend.selectAll("text")
            .data(legendData)
            .join("text")
            .text(d=>d.level)
            .attr("x", d => d.xtext)
            .attr("y", d => d.ytext)
            .attr("class", "themesText")
            .style("text-anchor", d=>d.anchor)
            .attr("id", "info") 
            .call(wrap, 10)

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

          radius.range([3, width/12])
          logoScale.range([18, width/12])

          $svg
            .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
            .attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);
          
          $vis
            .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
            .attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);

          xScale = d3.scaleSymlog()
            .range([MARGIN_LEFT*2+MARGIN_RIGHT, width])
            .domain(variable==="polarity"?[0, d3.max(filterData, d => +d[variable])]:
                            d3.extent(filterData, d => +d[variable]))
          
          //console.log(xScale.range(), xScale.domain())

          simulation = d3.forceSimulation()
            .nodes(filterData)
            .force('charge', d3.forceManyBody().strength(1))
            .force('x', d3.forceX().x(function(d) {
              return xScale(+d[variable]);
            }))
            .force("y", d3.forceY(height / 2))
            .force('collide', d3.forceCollide((d)=>{ 
              return radius(+d.monthly_visits)}))
            .on("tick", function() {
              $circles = $vis.selectAll('circle').data(filterData);
              $logos = $vis.selectAll('image').data(filterData);
        
              $newCircles = $circles.join("circle")
                .attr("class", "forceCircles")
                .style("opacity", "1")
                .attr('r', d=>radius(+d.monthly_visits))
                .on("mouseenter", (event, d) => { showTooltip() })
                .on("mouseleave", (event, d) => { hideTooltip() });

              $circles.merge($newCircles)
                  .attr('cx', function(d) { return d.x; })
                  .attr('cy', function(d) { return d.y; })
              
              $newLogos = $logos.join("svg:image")
									.attr("class", "forceLogo")
									// each logo needs to be centered in the bubble (couldnt find better way of doing this)
									.attr("transform", d=>d.site=="bbc.co.uk" ? "translate(-50,-50)"
														: d.site=="cnn.com" | d.site=="foxnews.com" ? "translate(-30,-30)"
														: d.site=="espn.go.com" ? "translate(-34,-10)"
														: d.site=="nytimes.com" | d.site=="buzzfeed.com" ? "translate(-25,-25)"
														: d.site=="washingtonpost.com" | d.site=="huffingtonpost.com" | d.site== "usatoday.com" ? "translate(-20,-20)"
														: d.site=="dailymail.co.uk" ? "translate(-22,-18)"
														: d.site=="politico.com" | d.site=="ksl.com" | d.site=="abcnews.go.com" | d.site=="nydailynews.com" ? "translate(-12.5,-12.5)"
														: d.site=="telegraph.co.uk" ? "translate(-15,-3)"
														: d.site=="breitbart.com" ? "translate(-14,-10)"
														: d.site=="aajtak.in" ? "translate(-25,-20)"
														: d.site=="businessinsider.com" ? "translate(-14,-13)"
														: "translate(-15,-15)")
									.attr('width', d=>logoScale(+d.monthly_visits))
									.attr("xlink:href", d=>+d.monthly_visits>150000000 ? logoData.filter(x=>x.site==d.site)[0]["link"]:'');
              
              $logos.merge($newLogos)
                  .attr('x', function(d) { return d.x; })
                  .attr('y', function(d) { return d.y; })
            })  

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
  