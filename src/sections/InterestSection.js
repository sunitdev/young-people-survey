import * as d3 from 'd3';
import colors from '../colors';

export default class InterestSection {

    constructor(svg, dataset) {
        this.svg = svg;

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));

        const padding = 10;

        this.interestKeys = ['interest_history', 'interest_mathematics', 'interest_physics', 'interest_computers',
            'interest_economy', 'interest_medical', 'interest_law', 'interest_geography', 'interest_psychology'];

        this.interestTextMapping = {
            'interest_history': 'History',
            'interest_mathematics': 'Mathematics',
            'interest_physics': 'Physics',
            'interest_computers': 'Computers',
            'interest_economy': 'Economics',
            'interest_medical': 'Medical',
            'interest_law': 'Law',
            'interest_geography': 'Geography',
            'interest_psychology': 'Psychology'
        }

        this.dataset = this.getAggregatedData(dataset);

        this.radiusScale = d3.scaleLinear()
            .domain([0, 400])
            .range([10, 40]);

        this.xScale = d3.scaleLinear()
            .domain([0, 3])
            .range([padding, this.svgWidth - padding]);
        this.yScale = d3.scaleLinear()
            .domain([0, 3])
            .range([padding, this.svgHeight - padding]);
        this.cellWidth = this.xScale(1) - this.xScale(0);
        this.cellHeight = this.yScale(1) - this.yScale(0);

        const cellHalfWidth = (this.xScale(1) - this.xScale(0)) / 2;
        const cellHalfHeight = (this.yScale(1) - this.yScale(0)) / 2;

        this.centers = [
            [
                [this.xScale(0) + cellHalfWidth, this.yScale(0) + cellHalfHeight],
                [this.xScale(1) + cellHalfWidth, this.yScale(0) + cellHalfHeight],
                [this.xScale(2) + cellHalfWidth, this.yScale(0) + cellHalfHeight]
            ],
            [
                [this.xScale(0) + cellHalfWidth, this.yScale(1) + cellHalfHeight],
                [this.xScale(1) + cellHalfWidth, this.yScale(1) + cellHalfHeight],
                [this.xScale(2) + cellHalfWidth, this.yScale(1) + cellHalfHeight]
            ],
            [
                [this.xScale(0) + cellHalfWidth, this.yScale(2) + cellHalfHeight],
                [this.xScale(1) + cellHalfWidth, this.yScale(2) + cellHalfHeight],
                [this.xScale(2) + cellHalfWidth, this.yScale(2) + cellHalfHeight]
            ],
        ];

    }

    onInit() {
        this.groupCharts = this.generateBubbleCharts();
        this.textHolders = this.generateTextHolders();
        this.texts = this.generateTexts()
    }

    onFocusEntered() {
        this.groupCharts.forEach((chart) => {
            chart.transition()
                .duration(600)
                .attr('opacity', 1);
        });
        this.textHolders.forEach((holder, index) => {
            const x = this.xScale(Math.floor(index / 3)) + (this.cellWidth / 2) - 65;

            holder
                .attr('x', this.svgWidth)
                .attr('opacity', 1)
                .transition()
                .duration(600)
                .attr('x', x);
        });
        this.texts.forEach((text, index) => {
            const x = this.xScale(Math.floor(index / 3)) + (this.cellWidth / 2) - 40;
            text
                .attr('x', this.svgWidth)
                .attr('opacity', 1)
                .transition()
                .duration(600)
                .attr('x', x);
        });
    }

    onFocusLost() {
        this.groupCharts.forEach((chart) => {
            chart.transition()
                .duration(600)
                .attr('opacity', 0);
        });
        this.textHolders.forEach((holder) => {
            holder
                .transition()
                .duration(600)
                .attr('opacity', 0);
        });
        this.texts.forEach((text) => {
            text
                .transition()
                .duration(600)
                .attr('opacity', 0);
        });
    }

    getAggregatedData(dataset) {
        const aggregatedData = [];

        const maleInterestCounter = {};
        const femaleInterestCounter = {};

        // Get count
        dataset.forEach((row) => {

            const counter = row.gender === 'male' ? maleInterestCounter : femaleInterestCounter;

            this.interestKeys.forEach((interest) => {
                let interestCounter = counter[interest] ? counter[interest] : {};
                let category = row[interest];
                if (category === "") return;
                interestCounter[category] = interestCounter[category] ? interestCounter[category] + 1 : 1;
                counter[interest] = interestCounter;
            });

        });

        // Combine result
        this.interestKeys.forEach((interest, index) => {

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

    generateBubbleCharts() {

        return this.dataset.map((data, index) => {
            const center = this.centers[Math.floor(index / 3)][index % 3];

            const node = this.svg.append("g")
                .selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("r", (item) => this.radiusScale(item.count))
                .attr("cx", center[0])
                .attr("cy", center[1])
                .style("fill", (item) => {
                    let shades = item.gender === 'male' ? colors.liking.male : colors.liking.female;
                    return shades[item.category];
                })
                .attr('opacity', 0);

            const simulation = d3.forceSimulation()
                .force('charge', d3.forceManyBody().strength(5))
                .force("center", d3.forceCenter().x(center[0]).y(center[1])) // Attraction to the center of the svg area
                .force('collision', d3.forceCollide().radius((data) => this.radiusScale(data.count)));

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

            return node;
        })

    }

    generateTextHolders() {
        return this.interestKeys.map((_, index) => {
            const x = this.xScale(Math.floor(index / 3)) + (this.cellWidth / 2) - 65;
            const y = this.yScale((index % 3)) + this.cellHeight - 20;
            return this.svg.append('rect')
                .attr('x', x)
                .attr('y', y)
                .attr('width', 140)
                .attr('height', 30)
                .attr('fill', colors.textRect)
                .attr('opacity', 0);
        });
    }

    generateTexts() {
        return this.interestKeys.map((interest, index) => {
            const x = this.xScale(Math.floor(index / 3)) + (this.cellWidth / 2) - 40;
            const y = this.yScale((index % 3)) + this.cellHeight;

            return this.svg.append('text')
                .attr('x', x)
                .attr('y', y)
                .text(this.interestTextMapping[interest])
                .attr('opacity', 0);
        });
    }
}