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
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");

    // if (words.includes("empowerment")) {
    //   words = ["ment", "power-", "em-"];
    // }
    // if (words.includes("stereotypes")) {
    //   words = ["types", "stereo-", "female"];
    // }
    if (words.includes("places")) {
      words = ["places", "people and"];
    }
    if (words.includes("ethnicity")) {
      words = ["and identity", "race, ethnicity"];
    }
    if (words.includes("violence")) {
      words = ["and violence", "crime"];
    }

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

export { wrap };
