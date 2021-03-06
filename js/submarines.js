var svgWidth = 1500;
var svgHeigth = 800;

// crete svg in this body
var svg = d3.select("body").append("svg").attr('width', svgWidth).attr('height', svgHeigth);

var dataset;

// dataset sourcing
d3.json('/dataset').then(function(data) {
    dataset = data;
    loadDataset();
});

/***
 * Swaps values of two datapoints in the dataset
 * @param firstDatapoint
 * @param secondDatapoint
 */
function swapDatapoints(firstDatapoint, secondDatapoint)
{
    const firstX = dataset[firstDatapoint].x;
    const firstY = dataset[firstDatapoint].y;
    const firstPorthole = dataset[firstDatapoint].porthole;
    const firstWidth = dataset[firstDatapoint].width;
    const firstHeight = dataset[firstDatapoint].height;
    const firstTurret = dataset[firstDatapoint].turret;

    dataset[firstDatapoint].x = dataset[secondDatapoint].x;
    dataset[firstDatapoint].y = dataset[secondDatapoint].y;
    dataset[firstDatapoint].porthole = dataset[secondDatapoint].porthole;
    dataset[firstDatapoint].width = dataset[secondDatapoint].width;
    dataset[firstDatapoint].height = dataset[secondDatapoint].height;
    dataset[firstDatapoint].turret = dataset[secondDatapoint].turret;

    dataset[secondDatapoint].x = firstX;
    dataset[secondDatapoint].y = firstY;
    dataset[secondDatapoint].porthole = firstPorthole;
    dataset[secondDatapoint].width = firstWidth;
    dataset[secondDatapoint].height = firstHeight;
    dataset[secondDatapoint].turret = firstTurret;
}

// dataset loader in D3.js
function loadDataset()
{
    svg.selectAll("g").data(dataset).join(

        /***
         * ENTER
         */
        function (enter) {
            g = enter.append("g"); // create a <g> element

            // helix
            g.append("polyline")
                .attr("points", function(datapoint) {
                    var angleMeasure = 1/8;

                    var x = datapoint.x;
                    var y = datapoint.y;

                    var startX = x + datapoint.width * Math.cos(Math.PI * (angleMeasure));
                    var startY = y + datapoint.height * Math.sin(Math.PI * angleMeasure);
                    var endX = x + datapoint.width * Math.cos(Math.PI * -angleMeasure);
                    var endY = y + datapoint.height * Math.sin(Math.PI * -angleMeasure);

                    return [
                        startX, startY,
                        startX + datapoint.width/4, startY + datapoint.height/2,
                        startX + datapoint.width/2, startY + datapoint.height/2,
                        startX + datapoint.width/2, endY - datapoint.height/2,
                        startX + datapoint.width/4, endY - datapoint.height/2,
                        endX, endY
                    ]
                })
                .attr("class", "helix")
                .attr("fill", function(datapoint) { return datapoint.color; })
                .attr("stroke-width", 2)
                .attr("stroke", "black");

            // body
            g.append("ellipse")
                .attr('cx', function(datapoint) { return datapoint.x})
                .attr('cy', function(datapoint) { return datapoint.y })
                .attr('rx', function(datapoint) { return datapoint.width})
                .attr('ry', function(datapoint) { return datapoint.height})
                .attr("stroke-width", 2)
                .attr("stroke", "black")
                .attr("class", "body")
                .attr('fill', function(datapoint) { return datapoint.color });

            // left porthole
            g.append("circle")
                .attr('cx', function(datapoint) { return datapoint.x - datapoint.width/2})
                .attr("cy", function(datapoint) { return datapoint.y})
                .attr("r", function(datapoint) { return datapoint.porthole})
                .attr("class", "left-porthole")
                .attr("fill", "black");

            // central porthole
            g.append("circle")
                .attr('cx', function(datapoint) { return datapoint.x})
                .attr("cy", function(datapoint) { return datapoint.y})
                .attr("r", function(datapoint) { return datapoint.porthole})
                .attr("class", "central-porthole")
                .attr("fill", "black");

            // right porthole
            g.append("circle")
                .attr('cx', function(datapoint) { return datapoint.x  + datapoint.width/2 })
                .attr("cy", function(datapoint) { return datapoint.y })
                .attr("r", function(datapoint) { return datapoint.porthole })
                .attr("class", "right-porthole")
                .attr("fill", "black");

            // turret
            g.append("polyline")
                .attr("points", function(datapoint) {
                    var x = datapoint.x;
                    var y = datapoint.y - datapoint.height;

                    return [
                        x, y,
                        x, y - datapoint.turret,
                        x - datapoint.turret / 3, y - datapoint.turret
                    ];

                })
                .attr("class", "turret")
                .attr("fill", "None")
                .attr("stroke-width", 3)
                .attr("stroke", "black");
        },
        /***
         * UPDATE
         */
        function (update) {
            tx = d3.transition().duration(2000);

            // helix
            update.select(".helix")
                .transition(tx)
                .attr("points", function(datapoint) {
                    var angleMeasure = 1/8;

                    var x = datapoint.x;
                    var y = datapoint.y;

                    var startX = x + datapoint.width * Math.cos(Math.PI * (angleMeasure));
                    var startY = y + datapoint.height * Math.sin(Math.PI * angleMeasure);
                    var endX = x + datapoint.width * Math.cos(Math.PI * -angleMeasure);
                    var endY = y + datapoint.height * Math.sin(Math.PI * -angleMeasure);

                    return [
                        startX, startY,
                        startX + datapoint.width/4, startY + datapoint.height/2,
                        startX + datapoint.width/2, startY + datapoint.height/2,
                        startX + datapoint.width/2, endY - datapoint.height/2,
                        startX + datapoint.width/4, endY - datapoint.height/2,
                        endX, endY
                    ]
                })
                .attr("class", "helix")
                .attr("fill", function(datapoint) { return datapoint.color; })
                .attr("stroke-width", 2)
                .attr("stroke", "black");

            // body
            update.select(".body")
                .transition(tx)
                .attr('cx', function(datapoint) { return datapoint.x})
                .attr('cy', function(datapoint) { return datapoint.y })
                .attr('rx', function(datapoint) { return datapoint.width})
                .attr('ry', function(datapoint) { return datapoint.height})
                .attr("stroke-width", 2)
                .attr("stroke", "black")
                .attr("class", "body")
                .attr('fill', function(datapoint) { return datapoint.color });

            // left porthole
            update.select(".left-porthole")
                .transition(tx)
                .attr('cx', function(datapoint) { return datapoint.x - datapoint.width/2})
                .attr("cy", function(datapoint) { return datapoint.y})
                .attr("r", function(datapoint) { return datapoint.porthole})
                .attr("class", "left-porthole")
                .attr("fill", "black");

            // central porthole
            update.select(".central-porthole")
                .transition(tx)
                .attr('cx', function(datapoint) { return datapoint.x })
                .attr("cy", function(datapoint) { return datapoint.y})
                .attr("r", function(datapoint) { return datapoint.porthole})
                .attr("class", "central-porthole")
                .attr("fill", "black");

            // right porthole
            update.select(".right-porthole")
                .transition(tx)
                .attr('cx', function(datapoint) { return datapoint.x + datapoint.width/2})
                .attr("cy", function(datapoint) { return datapoint.y})
                .attr("r", function(datapoint) { return datapoint.porthole})
                .attr("class", "right-porthole")
                .attr("fill", "black");

            // turret
            update.select(".turret")
                .transition(tx)
                .attr("points", function(datapoint) {
                    var x = datapoint.x;
                    var y = datapoint.y - datapoint.height;

                    return [
                        x, y,
                        x, y - datapoint.turret,
                        x - datapoint.turret / 3, y - datapoint.turret
                    ];

                })
                .attr("class", "turret")
                .attr("fill", "None")
                .attr("stroke-width", 3)
                .attr("stroke", "black");
        }
    );


    svg.selectAll("g").on('mousedown', function(datapoint) {
        thisDatapointIndex = dataset.indexOf(datapoint);
        otherDatapointIndex = Math.floor(Math.random() * dataset.length);

        while (thisDatapointIndex === otherDatapointIndex)
        {
            otherDatapointIndex = Math.floor(Math.random() * dataset.length);
        }

        swapDatapoints(thisDatapointIndex, otherDatapointIndex);
        loadDataset(dataset);
    });
}