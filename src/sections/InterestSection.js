import * as d3 from 'd3';
// https://www.d3-graph-gallery.com/graph/circularpacking_basic.html
export default class InterestSection {

    constructor(svg, dataset) {
        this.svg = svg;

        const svgWidth = parseInt(this.svg.attr('width'));
        const svgHeight = parseInt(this.svg.attr('height'));

        const padding = 10;

        this.intreset_keys = ['interest_history', 'interest_mathematics', 'interest_physics', 'interest_computers',
            'interest_economy', 'interest_medical', 'interest_law', 'interest_geography', 'interest_psychology'];

        this.dataset = this.getAggregatedData(dataset);

        const xScale = d3.scaleLinear()
            .domain([0, 3])
            .range([padding, svgWidth - padding]);
        const yScale = d3.scaleLinear()
            .domain([0, 3])
            .range([padding, svgHeight - padding]);
        const cellHalfWidth = (xScale(1) - xScale(0)) / 2;
        const cellHalfHeight = (yScale(1) - yScale(0)) / 2;

        this.centers = [
            [
                [xScale(0) + cellHalfWidth, yScale(0) + cellHalfHeight],
                [xScale(1) + cellHalfWidth, yScale(0) + cellHalfHeight],
                [xScale(2) + cellHalfWidth, yScale(0) + cellHalfHeight]
            ],
            [
                [xScale(0) + cellHalfWidth, yScale(1) + cellHalfHeight],
                [xScale(1) + cellHalfWidth, yScale(1) + cellHalfHeight],
                [xScale(2) + cellHalfWidth, yScale(1) + cellHalfHeight]
            ],
            [
                [xScale(0) + cellHalfWidth, yScale(2) + cellHalfHeight],
                [xScale(1) + cellHalfWidth, yScale(2) + cellHalfHeight],
                [xScale(2) + cellHalfWidth, yScale(2) + cellHalfHeight]
            ],
        ];

        console.log(this.centers);
    }

    onInit() {

        // set the dimensions and margins of the graph
        var width = 450
        var height = 450


        // create dummy data -> just one element per circle
        var data = [{"name": "A"}, {"name": "B"}, {"name": "C"}, {"name": "D"}, {"name": "E"}, {"name": "F"}, {"name": "G"}, {"name": "H"}]

        // Initialize the circle: all located at the center of the svg area
        var node = this.svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", "#69b3a2")
            .style("fill-opacity", 0.3)
            .attr("stroke", "#69a2b2")
            .style("stroke-width", 4)

        // Features of the forces applied to the nodes:
        var simulation = d3.forceSimulation()
            .force('charge', d3.forceManyBody().strength(5))
            .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
            .force('collision', d3.forceCollide().radius(15))

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
            .on("tick", function (d) {
                node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    })
            });


    }

    onFocusEntered() {
    }

    onFocusLost() {
    }

    getAggregatedData(dataset) {
        const aggregatedData = [];

        const maleInterestCounter = {};
        const femaleInterestCounter = {};

        // Get count
        dataset.forEach((row) => {

            const counter = row.gender === 'male' ? maleInterestCounter : femaleInterestCounter;

            this.intreset_keys.forEach((interest) => {
                let interestCounter = counter[interest] ? counter[interest] : {};
                let category = row[interest];
                if (category === "") return;
                interestCounter[category] = interestCounter[category] ? interestCounter[category] + 1 : 1;
                counter[interest] = interestCounter;
            });

        });

        // Combine result
        this.intreset_keys.forEach((interest, index) => {

            aggregatedData[index] = Object.keys(maleInterestCounter[interest]).map((category) => ({
                category,
                gender: 'male',
                count: maleInterestCounter[interest][category]
            })).concat(
                Object.keys(femaleInterestCounter[interest]).map((category) => ({
                    category,
                    gender: 'female',
                    count: femaleInterestCounter[interest][category]
                }))
            );

        })

        return aggregatedData;
    }
}