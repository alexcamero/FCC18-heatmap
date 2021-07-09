const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const H = 500;
const W = 1000;
const Wpad = 80;
const Hpad = 30;
const Tpad = 60;
const Rpad = 20;
const Bpad = 70;
const Lpad = 75;

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const tooltip = d3.select("#tooltip");

fetch(url).then(response => {
  return response.json();
})
.then(data => {
  
  const variance = data.monthlyVariance;
  
  const svg = d3.select("body")
  .append("svg")
  .attr("width", W)
  .attr("height", H);

  
  const xMin = d3.min(variance,(d) => d.year);
  const xMax = d3.max(variance,(d) => d.year);
  
  const xScale = d3.scaleLinear();
  xScale.domain([xMin, xMax]);
  xScale.range([Lpad, W - Rpad]);

  const xAxis = d3.axisBottom(xScale).ticks(16, "d");
  
  svg.append("g")
  .attr("id","x-axis")
  .attr("transform", `translate(0, ${H-Bpad})`)
  .call(xAxis);
  
  const yScale = d3.scaleLinear()
  .domain([0,24])
  .range([Tpad, H - Bpad]);
  
  const yAxis = d3.axisLeft(yScale)
.tickValues([1,3,5,7,9,11,13,15,17,19,21,23])
  .tickFormat((d) => months[(d-1)/2]);
  
  svg.append("g")
  .attr("id","y-axis")
  .attr("transform", `translate(${Lpad},0)`)
  .call(yAxis);
  
  const rW = (W - Lpad - Rpad)/(xMax - xMin + 1);
  const rH = (H - Bpad - Tpad)/12;
  
  svg.selectAll("rect")
  .data(variance)
  .enter()
  .append("rect")
  .attr("class","cell")
  .attr("data-year", (d) => d.year)
  .attr("data-month", (d) => d.month - 1)
  .attr("data-temp", (d) => d.variance)
  .attr("width", rW)
  .attr("height", rH)
  .attr("x", (d,i) => Lpad + (d.year - xMin)*rW)
  .attr("y", (d) => Tpad + (d.month - 1)*rH)
  .attr("fill", (d) => colorMap(d.variance))
  .on("mouseover", popup)
  .on("mouseout", popdown);
  
  
  function colorMap(deg) {
    
    if (deg <= 0) {
      return `#00${Math.ceil(deg*-2).toString(16)}`;
    } else {
      return `#${Math.ceil(deg*2).toString(16)}00`;
    }
  }
  
  svg.append("text")
  .attr("id", "title")
  .text("Monthly Global Land-Surface Temperature")
  .attr("x", Lpad + W/2)
  .attr("y", Tpad/3)
  .style("font-size","24")
  .attr("text-anchor", "middle");
  
  svg.append("text")
  .attr("id", "description")
  .text("1753 - 2015: base temperature 8.66℃")
  .attr("x", Lpad + W/2)
  .attr("y", (2*Tpad)/3)
  .style("font-size","12")
  .attr("text-anchor", "middle");
  
  const legend = svg.append("g")
  .attr("id","legend");
  
  const lScale = d3.scaleLinear()
  .domain([-15,15])
  .range([Lpad,W/3 + Lpad]);
  
  const lAxis = d3.axisBottom(lScale)
  .tickFormat((d) => {
    return (8.66 + d/2).toPrecision(3);
  });
  
  legend.append("g")
  .attr("transform",`translate(0,${H - (Bpad/4)})`)
        .call(lAxis)
  
  
 for (let i=-15; i<15; i++) {
    legend.append("rect")
  .attr("width",(W/3)/30)
  .attr("height", Bpad/10)
  .attr("x", Lpad + (i+15)*(W/3)/30)
  .attr("y", H - (Bpad/4))
  .attr("fill", i < 0 ? `#00${(-1*i).toString(16)}`
       : `#${i.toString(16)}00`)
  }
  
  function popup(event) {
    const year = d3.select(this).attr("data-year");
    
    const month = d3.select(this).attr("data-month");
    
    const temp = d3.select(this).attr("data-temp");
    
    tooltip.attr("data-year", year)
    .style("top", event.pageY)
    .style("left", `${event.pageX + 20}px`)
    .html(`<h2>${months[month]} ${year}</h2><p>${temp}</p>`)
    .style("display", "flex");
  }
  
  function popdown() {
    tooltip.style("display", "none");
  }
  
});