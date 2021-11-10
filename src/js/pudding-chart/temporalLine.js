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
      let $cells = null;
      let $lines = null;
      let $areas = null;
      let $circleEvents = null;
      let $circles = null;
  
      // data
      let data = $chart.datum();
      let dataset = data[0];
      let filter = data[1];
      let country = data[2];
      let variable = data[3];
      let words = dataset.filter(d=>(d.year>filter[0])&&(d.year<filter[1])&&(d.country===country));
      words = words.map(d=> {
        return {
            year: d.year,
            frequency: d[variable],
            word: d.word,
            word_type: d.word_type
        }
      })
      let freqByWord = d3.rollup(
        words,
        g => g.map(({ year, frequency}) => ({date: new Date(year, 0, 1), frequency})),
        d => d.word
      )
      let fullData;
      let minDate;
      let maxDate;
      let wordToScaleAndArea;
      let maxRate;
      let curve;
      let area;
      let line;

      // world events data
      let radius = 6;
      let padding = 1.5;
      let numberOfCategories = 5;
      let categories = ["0", "1", "2", "3", "4"];
      let dateRange = [new Date(2010, 0).getTime(), new Date(2021, 0).getTime()];
      let eventsWorld = [
        {uid: 1, 
         name: "Horrifying gang rape and murder in New Delhi, India", 
         category: 4, 
         date: new Date(2012, 11, 16)},
  {uid: 1, 
         name: "The U.S. military removes a ban against women serving in combat positions", 
         category: 4, 
         date: new Date(2013, 1, 24)},
  {uid: 1, 
         name: "A new Pentagon report found a 50% increase in sexual assault reports in 2013", 
         category: 4, 
         date: new Date(2014, 5, 1)},
        {uid: 1, 
         name: "Caitlyn Jenner comes out in an interview", 
         category: 4, 
         date: new Date(2015, 4, 24)},
  {uid: 1, 
         name: "A survey for the Department of Defense finds that in the past year 52% of active service members who reported sexual assault had experienced retaliation in the form of professional, social, and administrative actions or punishments.", 
         category: 4, 
         date: new Date(2015, 4, 18)},
 {uid: 2, 
         name: "People v. Turner: Brock Turner is arrested for sexually assaulting an unconscious woman", 
         category: 4, 
         date: new Date(2015, 1, 18)},
        {uid: 1, 
         name: "#EndRapeCulture in South Africa", 
         category: 4, 
         date: new Date(2016, 4, 0)},
  {uid: 2, 
         name: "Hillary Clinton becomes the first woman to receive a presidential nomination from a major political party", 
         category: 4, 
         date: new Date(2016, 7, 26)},
        {uid: 3, 
         name: "Trump: “Grab ‘em by the pussy”", 
         category: 4, 
         date: new Date(2016, 10, 8)},
  {uid: 4, 
         name: "People v. Turner: Brock Turner is convicted for three counts of felony sexual assault", 
         category: 4, 
         date: new Date(2016, 3, 30)},
  {uid: 5, 
         name: "People v. Turner: Brock Turner is released after spending 3 months in jail", 
         category: 4, 
         date: new Date(2016, 9, 2)},
        {uid: 1, 
         name: "#MeToo in U.S.A.", 
         category: 4, 
         date: new Date(2017, 10, 15)},
        {uid: 2, 
         name: "Harvey Weinstein Trial", 
         category: 4, 
         date: new Date(2017, 10, 0)},
 {uid: 3, 
         name: "#ChurchToo in U.S.A.", 
         category: 4, 
         date: new Date(2017, 11, 0)},
     {uid: 4, 
         name: "#MeTooSTEM and removal of Francisco J. Ayala from UC Irvine", 
         category: 4, 
         date: new Date(2017, 11, 0)},
        {uid: 5, 
         name: "Release of Wonder Woman", 
         category: 4, 
         date: new Date(2017, 5, 15)},
        {uid: 6, 
         name: "Larry Nassar U.S. Gymnastics doctor sexual assault scandal", 
         category: 4, 
         date: new Date(2017, 12, 0)},
 {uid: 7, 
         name: "Jessie Reyez releases “Gatekeeper”", 
         category: 4, 
         date: new Date(2017, 4, 26)},
  {uid: 8, 
         name: "The 2017 Westminster sexual scandals in the U.K. and resignation of Sir Michael Fallon", 
         category: 4, 
         date: new Date(2017, 11, 0)},
        {uid: 1, 
         name: "Meghan Markle’s wedding to Prince Harry in U.K.", 
         category: 4, 
         date: new Date(2018, 5, 19)},
  {uid: 2, 
         name: "MEE TOO bill in U.S. Congress", 
         category: 4, 
         date: new Date(2018, 1, 18)},
        {uid: 3, 
         name: "Priyanka Chopra marries Nick Jonas in India", 
         category: 4, 
         date: new Date(2018, 12, 1)},
        {uid: 4, 
         name: "People v. Turner: Brock Turner is convicted by jury trial of three counts of felony sexual assault", 
         category: 4, 
         date: new Date(2018, 1, 0)},
  {uid: 5, 
         name: "Google’s Andy Rubin sexual misconduct scandal", 
         category: 4, 
         date: new Date(2018, 10, 25)},
      {uid: 6, 
         name: "Global Women’s March", 
         category: 4, 
         date: new Date(2018, 1, 20)},
      {uid: 7, 
         name: "#MeTooMilitary in U.S.A", 
         category: 4, 
         date: new Date(2018, 1, 0)},
      {uid: 8, 
         name: "#MeToo in India", 
         category: 4, 
         date: new Date(2018, 10, 0)},
      {uid: 9, 
         name: "Mass sexual assaults during the 2018 new year's celebrations in Bangalore", 
         category: 4, 
         date: new Date(2018, 12, 0)},
      {uid: 10, 
         name: "Indian actress Tanushree Dutta accuses Nana Patekar of sexual harassment", 
         category: 4, 
         date: new Date(2018, 9, 27)},
      {uid: 11, 
         name: "Indian minister of state for External Affairs, MJ Akbar is accused of sexual harassment by several female colleagues through the 'Me Too' Movement in India", 
         category: 4, 
         date: new Date(2018, 10, 0)},
      {uid: 12, 
         name: "Indian music director Anu Malik is suspended from the jury panel of Indian Idol 2018, after facing multiple allegations of sexual harassment", 
         category: 4, 
         date: new Date(2018, 10, 21)},
      {uid: 13, 
         name: "Marriage of Prince Harry and Meghan Markle", 
         category: 4, 
         date: new Date(2018, 5, 19)},
        {uid: 1, 
         name: "Greta Thunberg: Climate Action Summit and sail to NYC", 
         category: 4, 
         date: new Date(2019, 8, 28)},
        {uid: 2, 
         name: "Release of “Surviving R. Kelly” documentary", 
         category: 4, 
         date: new Date(2019, 1, 0)},
        {uid: 3, 
         name: "Arrest of R. Kelly for 10 counts of sexual abuse against four women", 
         category: 4, 
         date: new Date(2019, 2, 0)},
        {uid: 1, 
         name: "#SayHerName: Murder of Breonna Taylor", 
         category: 4, 
         date: new Date(2020, 3, 0)},
        {uid: 2, 
         name: "International Women’s Cricket T20", 
         category: 4, 
         date: new Date(2020, 2, 0)},
 {uid: 3, 
         name: "Rape and murder of Vanessa Guillén in U.S. military", 
         category: 4, 
         date: new Date(2020, 4, 22)},
        {uid: 1, 
         name: "16 year old Ma'Khia Bryant is fatally shot by police officer Nicholas Reardon in Columbus, Ohio", 
         category: 4, 
         date: new Date(2021, 4, 20)},
        {uid: 2, 
         name: "Kamala Harris is sworn in as the first woman and first woman of color vice president of the United States", 
         category: 4, 
         date: new Date(2021, 1, 20)},
        {uid: 3, 
         name: "Oprah with Meghan and Harry and “Megxit”", 
         category: 4, 
         date: new Date(2021, 3, 7)},
 {uid: 3, 
         name: "Indian Prime Minister, Narendra Modi, follows trolls on twitter”", 
         category: 4, 
         date: new Date(2017, 8, 8)},
 {uid: 3, 
         name: "Study finds that Indian women politicians face more trolling than US, UK counterparts", 
         category: 4, 
         date: new Date(2021, 0, 24)},
 {uid: 3, 
         name: "40% Indian women fear online trolls as they access Internet: Nielson report", 
         category: 4, 
         date: new Date(2019, 11, 17)},
 {uid: 3, 
         name: "Indian central government passes the Citizenship Amendment Act, by providing a pathway to Indian citizenship for persecuted religious minorities from Afghanistan, Bangladesh and Pakistan who are Hindus, Sikhs, Buddhists, Jains, Parsis or Christians, and arrived in India before the end of December 2014", 
         category: 4, 
         date: new Date(2019, 11, 12)},
 {uid: 3, 
         name: "India saw, for the first time, a sustained countrywide movement led by Women against the CAA-NRC bills", 
         category: 4, 
         date: new Date(2020, 0, 13)},
 {uid: 3, 
         name: "defamation case filed by former Union minister M J Akbar's against journalist Priya Ramani who had accused him of sexual harassment", 
         category: 4, 
         date: new Date(2021, 4, 5)},
 {uid: 3, 
         name: "A majority judgement which declared the prohibition of entry of women aged between 10 and 50 into Sabarimala temple, as unconstitutional and discriminatory", 
         category: 4, 
         date: new Date(2018, 8, 28)},
 {uid: 3, 
         name: "A Supreme Court Bench declared muslim instantaneous divorce, triple Talaq, as unconstitutional", 
         category: 4, 
         date: new Date(2019, 6, 31)},
 {uid: 3, 
         name: "Indian court grants bail to Nupur Talwar, a dentist accused in the twin murder of her daughter and domestic help", 
         category: 4, 
         date: new Date(2019, 6, 31)},
 {uid: 3, 
         name: "Kanimozhi Karunanidhi, Member of Parliament, accused in 2G scam, refused bail", 
         category: 4, 
         date: new Date(2011, 4, 11)},
 {uid: 3, 
         name: "Accused who set fire to the rape survivor from Unnao, Uttar Pradesh, India, out on bail", 
         category: 4, 
         date: new Date(2019, 11, 5)},
 {uid: 3, 
         name: "Multiple women enter inner sanctum of temples across the country, after protest", 
         category: 4, 
         date: new Date(2016, 2, 3)},
 {uid: 3, 
         name: "Section 377: Supreme Court legalizes consensual sexual conduct between adults of the same sex", 
         category: 4, 
         date: new Date(2018, 8, 6)},
 {uid: 3, 
         name: "Women’s Cricket World Cup 2017", 
         category: 4, 
         date: new Date(2017, 5, 23)},
 {uid: 3, 
         name: "The Marikana massacre was the killing of 34 miners by the South African Police Service (SAPS). It took place on 16 August 2012, and was the most lethal use of force by South African security forces against civilians since 1976.", 
         category: 4, 
         date: new Date(2012, 7, 16)},
 {uid: 3, 
         name: "On 11 April 2015, several South Africans attacked foreigners in a xenophobic attack in Durban, South Africa, which extended to some parts of Johannesburg. Several people, both foreign and South African alike, were killed with some of the killings captured on camera.", 
         category: 4, 
         date: new Date(2015, 3, 11)},
 {uid: 3, 
         name: "Brutal gang rape and subsequent death of South African teenager", 
         category: 4, 
         date: new Date(2013, 1, 2)},
 {uid: 3, 
         name: "Monica Lewinsky breaks decade-long media silence", 
         category: 4, 
         date: new Date(2014, 4, 6)}
  
 ]
  
      // dimensions
      let width = 0;
      let height = 0;
      const MARGIN_TOP = 150;
      const MARGIN_BOTTOM = 20;
      const MARGIN_LEFT = 40;
      const MARGIN_RIGHT = 40;
      const stickyAxisHeight = 200;
      const mainColor = "#3569DC";
  
      // scales
      let x = null;
      let y = null;
      let xAxis = null;
      let $stickyAxisGroup = null;
      let $stickyAxis = null;
      let $stickyAxisAnno = null;

      // plot structure
      const cols = 1;
      const rows = 200/cols;
      let grid = d3.cross(d3.range(rows), d3.range(cols), (row, col) => ({ row, col }));
  
      // helper functions
      function combineData() {
        fullData = d3.zip(Array.from(freqByWord), grid).map(
            ([[word, rates], { row, col }]) => ({
                word,
                rates,
                row,
                col,
            })
          )
          console.log(fullData)

          minDate = fullData[0].rates[0].date;
          maxDate = fullData[0].rates[fullData[0].rates.length - 1].date;
      }

      function calcScale() {
        wordToScaleAndArea = Object.fromEntries(
            fullData.map(d => {
            maxRate = d3.max(d.rates, d => d.frequency);
            y = d3.scaleLinear()
                .domain([0, maxRate])
                .range([$row.bandwidth(), 0]).nice();
            
            curve = d3.curveMonotoneX // d3.curveBasis
            area = d3.area()
                .x(d => x(d.date))
                .y1(d => y(d.frequency))
                .y0(d => y(0)).curve(d3.curveMonotoneX);

            
            line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.frequency)).curve(d3.curveMonotoneX);

            
            return [d.word, {y, area, line}];
            })
        )
      }

      function dodge(data, {radius = 1, x = d => d} = {}) {
        const radius2 = radius ** 2;
        const circles = data.map((d, i) => ({x: +x(d, i, data), data: d})).sort((a, b) => a.x - b.x);
		const epsilon = 1e-3;
		let head = null, tail = null;

        function intersects(x, y) {
            let a = head;
            while (a) {
              if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) { return true; }
              a = a.next;
            } return false;
        }

        for (const b of circles) {
			  
            // Remove circles from the queue that can’t intersect the new circle b.
            while (head && head.x < b.x - radius2) head = head.next;
        
            // Choose the minimum non-intersecting tangent.
            if (intersects(b.x, b.y = 0)) {
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
          return circles;
      }

      const Chart = {
        // called once at start
        init() {
          $svg = $chart.append('svg').attr('class', 'pudding-chart');

          // gradient
          let $defs = $svg.append("defs");
          let linearGradient = $defs.append("linearGradient").attr("id", "linear-gradient");

          linearGradient
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
    
          linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", mainColor);

          linearGradient.append("stop")
			.attr("offset", "90%")
			.attr("stop-color", "#FEFAF1");
        
          linearGradient.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#FEFAF1");
  
          // create axis
          $axis = $svg.append('g').attr('class', 'g-axis');

          $row = d3.scaleBand()
                .domain(d3.range(rows))
                .paddingInner(-1);
        
          $col = d3.scaleBand()
                .domain(d3.range(cols))
                .paddingInner(0.2);
            
           x = d3.scaleTime()
                .domain([minDate, maxDate])
                .range([0, $col.bandwidth()])
        
           xaxis = d3.axisBottom(x)
                    .ticks(10)
                    .tickSizeOuter(0)
                    .tickSizeInner(0)
                    .tickPadding(30)
                    .tickFormat((d, i) => i == 0 || i == 3 || i == 6 || i == 9 || i == 11 ? d3.timeFormat('%Y')(new Date(d)):                                
                                       "");
        
            $stickyAxisGroup = d3.select("#stickyXaxis").append("svg")
                .attr("class", "stickyAxis");
            
            $stickyAxis = $stickyAxisGroup.append("g")

            $cirlceEvents = $stickyAxisGroup.append("g")
                .selectAll("circle")
                .data(dodge(eventsWorld.filter(d=>d.date<=maxDate), {radius: radius * 2 + padding, x: d => x(d.date)}));
            
            $circles = $circleEvents
                .join("circle")
                .attr("fill", mainColor)
                .attr("r", radius)
                .attr("opacity", "0.5");

          // data work
          combineData();
          calcScale();
          console.log(wordToScaleAndArea)
  
          // setup viz group
          $vis = $svg.append('g').attr('class', 'g-vis');

          $cells = $vis.append("g")
            .selectAll('g')
            .data(fullData)
            .join('g')
            .attr('class', 'cell')
            .attr('transform', d => `translate(${$col(d.col)}, ${$row(d.row)})`);

        
        //   $area = $cells.append("path")
        //     .attr('d', d => wordToScaleAndArea[d.word].area(d.rates))
        //     .attr('fill', "url(#linear-gradient)")
        //     .attr('opacity', 0.5)
        //     .attr("class", "wordArea")
        //     .attr("id", d => 'area'+ d.word)
        
        //   $lines = $cells.append("path")
        //     .style("stroke", "url(#linear-gradient)")
        //     .attr('stroke-width', 2)
        //     .attr('fill', 'none')
        //     .attr("class", "wordLine")
        //     .attr("id", d => 'line'+ d.word)  
        //     .attr('d', d => wordToScaleAndArea[d.word].line(d.rates)) 
            
            Chart.resize();
            Chart.render();
        },
        // on resize, update new dimensions
        resize() {
          // defaults to grabbing dimensions from container element
          width = $chart.node().offsetWidth - MARGIN_LEFT - MARGIN_RIGHT;
          height = $chart.node().offsetHeight - MARGIN_TOP - MARGIN_BOTTOM;
          $svg
            .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
            .attr('height', height + MARGIN_TOP + MARGIN_BOTTOM);
        
          $row.range([0, height])
          $col.range([0, width])

          $stickyAxisGroup
            .attr('transform', `translate(${MARGIN_LEFT}, 0)`)
            .attr('width', width + MARGIN_LEFT + MARGIN_RIGHT)
            .attr('height', stickyAxisHeight);
        
          $stickyAxis
            .attr('transform', `translate(${$col(0)}, ${MARGIN_TOP})`)
            .call(xaxis)
            // .call(g => g.selectAll(".tick")
            // .call(g => g.select('.domain')
            // .attr('stroke-width', 2)
            // .attr("color", "#282828"));

            $stickyAxisAnno = $stickyAxisGroup.append("g")
                .attr('transform', `translate(${$col(0)}, ${MARGIN_TOP})`)
                .append("text")
                .text("News Events")
                .attr("class", "annotation")
                .attr("font-weight", "400")
                .attr("x", -20)
                .attr("y", -4)
            
            $cirlceEvents.attr('transform', `translate(${$col(0)}, ${MARGIN_TOP})`)

            $circles
                .attr("cx", d => d.x)
                .attr("cy", d =>  d.y)

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
  