drag = simulation => {
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

function chart(data) {
    height = 800;
    width = 800;

    const groups = data.nodes.map(d => d.group);
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));
  
    const svg = d3.select("#svg")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    for (let i = 0; i < nodes.length; i++) {
        nodes[i]["color"] = colorScale(groups[nodes[i].index])
    }

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .on("click", function(d){
            showInfo(data, d.index);
        })
        .attr("r", 5)
        .attr("fill", d => d.color)
        .call(drag(simulation));
  
    node.append("title")
        .text(d => d.id);
  
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x / 3 + width / 3)
            .attr("y1", d => d.source.y / 3 + height / 3)
            .attr("x2", d => d.target.x / 3 + width / 3)
            .attr("y2", d => d.target.y / 3 + height / 3);
  
        node
            .attr("cx", d => d.x / 3 + width / 3)
            .attr("cy", d => d.y / 3 + height / 3);
    });
}

function showInfo(data, index) {
    const employee_id = data.nodes[index].id;
    const face_el = document.getElementById("face-img");
    face_el.style.backgroundImage = `url("file:////Users/hassaku/Documents/hobby/exawizards-event/data/${employee_id}/${employee_id}_HV.jpg")`;
    const id_el = document.getElementById("employee-id");
    id_el.innerHTML = employee_id;
}

chart(data);
