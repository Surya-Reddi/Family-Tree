// script.js

// Set the dimensions and margins of the diagram
const margin = { top: 20, right: 90, bottom: 30, left: 90 },
      width = 1600 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#tree-container").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate("
      + margin.left + "," + margin.top + ")");

// Create a tooltip div that is hidden by default
const tooltip = d3.select("#tooltip");

// Declare a tree layout and assign the size
const treemap = d3.tree().size([height, width]);

// Load external data
d3.json("data/familyTree.json").then(function(data) {

    // Assigns parent, children, height, depth
    let root = d3.hierarchy(data, function(d) { return d.children; });
  
    // Assigns the x and y position for the nodes
    root = treemap(root);
  
    // Adds the links between the nodes
    const link = svg.selectAll(".link")
        .data( root.links() )
      .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));
  
    // Adds each node as a group
    const node = svg.selectAll(".node")
        .data(root.descendants())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => "translate(" + d.y + "," + d.x + ")")
        .on("mouseover", function(event, d) {
          tooltip.classed("hidden", false)
                 .style("left", (event.pageX + 15) + "px")
                 .style("top", (event.pageY - 28) + "px");
          tooltip.select("#member-name").text(d.data.name);
          tooltip.select("#member-details").text(`Relation: ${d.data.relation || 'N/A'}`);
        })
        .on("mouseout", function() {
          tooltip.classed("hidden", true);
        });


  // Add rectangles for the nodes
  node.append("rect")
      .attr("width", 100)
      .attr("height", 40)
      .attr("x", -50)
      .attr("y", -20)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", d => d.data.relation === "Atthaya" ? "#ADD8E6" : "#FFB6C1");

  // Add labels for the nodes
  node.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .text(d => d.data.name);

}).catch(function(error){
    console.log(error);
});

