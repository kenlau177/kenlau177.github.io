$('#myCheckBox1').attr('checked', false);
$('#myCheckBox2').attr('checked', false);

var margin = {top: 20, right: 20, bottom: 30, left: 160},
    width = 400 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

var barAdjustment = 3;

var formatPercent = d3.format(".0%");

var svg1 = d3.select("body .col-sm-5.panel1").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + 70 + "," + margin.top + ")");

//var offSet = Number(d3.select("svg").attr("width")) + margin.left;

makeBarChart = function(file, svg) {
  var x = d3.scale.linear()
            .range([width, 0]);

  var y = d3.scale.ordinal();
   
  var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(formatPercent);

  var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .outerTickSize(0);
  
  d3.tsv(file, function(error, data) {
    x.domain([0, 1]);
    y.rangeRoundBands([0, height*(data.length/14)], .1);

    y.domain(data.map(function(d) { return d.skill; }));

    //console.log(data);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".barNorm")
        .data(data)
        .enter().append("rect")
        .attr("class", "barNorm")
        .attr("y", function(d) {return y(d.skill) + barAdjustment;})
        .attr("width", width)
        .attr("x", 2)
        .attr("height", 13)
        .attr("rx", 4)
        .attr("ry", 4);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", function(d) { return y(d.skill) + barAdjustment; })
        .attr("width", function(d) { return width - x(d.knowledge); })
        .attr("x", 2)
        .attr("height", 13)
        .attr("rx", 3)
        .attr("ry", 3);
          
  });
}

makeBarChart("data.tsv", svg1);

var svg2 = d3.select("body .col-sm-7.panel2").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 100)
            .append("g")
            .attr("transform", "translate(" + 175 + "," + margin.top + ")");

makeBarChart("data-stats.tsv", svg2);

function change1() {
  //var svg = d3.select("panel1").select("svg");
  //console.log(this.checked)
  change("data.tsv", svg1, this.checked);
}

function change2() {
  change("data-stats.tsv", svg2, this.checked);
}

function change(file, svg, checked) {
  var y = d3.scale.ordinal();
  var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .outerTickSize(0);
  
  d3.tsv(file, function(error, data) {
    
    y.rangeRoundBands([0, height*(data.length/14)], .1);
    y.domain(data.map(function(d) { return d.skill; }));

    // Copy-on-write since tweens are evaluated after a delay.
    var y0 = y.domain(data.sort(checked
        ? function(a, b) { return b.knowledge - a.knowledge; }
        : function(a, b) { return d3.ascending(a.skill, b.skill); })
        .map(function(d) { return d.skill; }))
        .copy();
    
    svg.selectAll(".bar").filter(".barNorm")
        .sort(function(a, b) { return y0(a.skill) - y0(b.skill); });

    var transition = svg.transition().duration(450),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("y", function(d) { return y0(d.skill) + barAdjustment; });

    transition.selectAll(".barNorm")
        .delay(delay)
        .attr("y", function(d) { return y0(d.skill) + barAdjustment; });

    transition.select(".y.axis")
        .call(yAxis)
        .selectAll("g")
        .delay(delay);
  });
}

d3.select("#myCheckBox1").on("change", change1);

d3.select("#myCheckBox2").on("change", change2);