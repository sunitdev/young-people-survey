import * as d3 from 'd3';

import colors from '../colors';

export default class InterestSection {

    constructor(svg, tooltip, dataset) {
        this.svg = svg;
        this.tooltip = tooltip;
        this.lengendSvg = d3.select('#sectionInterestLegend');
        this.scaleSvg = d3.select('#sectionInterestScale');

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));

        this.lengendSvgWidth = parseInt(this.lengendSvg.attr('width'));
        this.lengendSvgHeight = parseInt(this.lengendSvg.attr('height'));

        this.scaleSvgWidth = parseInt(this.scaleSvg.attr('width'));
        this.scaleSvgHeight = parseInt(this.scaleSvg.attr('height'));

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

        this.valueToTextMapping = {
            'Strongly agree': 'Very Interested',
            'Agree': 'Interested',
            'Neutral': 'Neutral',
            'Disagree': 'Not Interested',
            'Strongly disagree': 'Least Interested'
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

        this.legendXScale = d3.scaleLinear()
            .domain([0, 3])
            .range([0, this.lengendSvgWidth]);
        this.legendYScale = d3.scaleLinear()
            .domain([0, 6])
            .range([0, this.lengendSvgHeight])
        this.legendCellWidth = this.legendXScale(1) - this.legendXScale(0);
        this.legendCellHeight = this.legendYScale(1) - this.legendYScale(0);

        const scaleLegendPadding = 15;
        this.scaleXScale = d3.scaleLinear()
            .domain([0, 400])
            .range([5, this.scaleSvgWidth - scaleLegendPadding]);
        this.xScaleAxis = d3.axisBottom(this.scaleXScale);

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
        this.texts = this.generateTexts();

        this.generateLegend();

        this.initEventHandler();
    }

    onFocusEntered() {
        let handleOnMouseHover = this.handleOnMouseHover.bind(this);
        let handleOnMouseOut = this.handleOnMouseOut.bind(this);
        let valueToTextMapping = this.valueToTextMapping;
        this.groupCharts.forEach((chart) => {
            chart
                .on('mouseover', function (item){
                    d3.select(this)
                        .attr('stroke', 'black')
                        .attr('stroke-width', '2px');
                    const gender = item.gender === 'male'? 'Male' : 'Female';
                    handleOnMouseHover(`${gender}, ${valueToTextMapping[item.category]}: ${item.count}`);
                })
                .on('mouseout', function () {
                    d3.select(this)
                        .attr('stroke', null)
                        .attr('stroke-width', null);
                    handleOnMouseOut();
                })
                .transition()
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
            chart
                .on('mouseover', null)
                .on('mouseout', null)
                .transition()
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
                .classed('interest-bubble', true)
                .classed('gender-male', (item) => item.gender === 'male')
                .classed('gender-female', (item) => item.gender !== 'male')
                .classed('very-interested', (item) => item.category === 'Strongly agree')
                .classed('interested', (item) => item.category === 'Agree')
                .classed('neutral', (item) => item.category === 'Neutral')
                .classed('not-interested', (item) => item.category === 'Disagree')
                .classed('least-interested', (item) => item.category === 'Strongly disagree')
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

    generateLegend() {
        this.generateLegendHeaderText();
        this.generateLegendColumnText();
        this.generateMaleLegend();
        this.generateFemaleLegend();

        this.generateScaleLegendXscale();
        this.generateScaleCricles();
    }

    generateLegendHeaderText() {
        this.lengendSvg.selectAll('legendHeaderText')
            .data(d3.range(2))
            .enter()
            .append('text')
            .attr('x', (_, index) => this.legendXScale(index + 1) + (this.legendCellWidth / 2) - 30)
            .attr('y', this.legendCellHeight / 2)
            .text((_, index) => index === 0 ? 'Male' : 'Female');
    }

    generateLegendColumnText() {
        const columnText = ["Very Interested", "Interested", "Neutral", "Not Interested", "Least Interested"];
        this.lengendSvg.selectAll('legendColumnText')
            .data(d3.range(5))
            .enter()
            .append('text')
            .attr('x', 2)
            .attr('y', (_, index) => this.legendYScale(index + 1) + 30)
            .text((_, index) => columnText[index]);
    }

    generateMaleLegend() {
        const fillColor = [colors.liking.male['Strongly agree'], colors.liking.male['Agree'], colors.liking.male['Neutral'],
            colors.liking.male['Disagree'], colors.liking.male['Strongly disagree']];
        this.lengendSvg.selectAll('maleLegendCircle')
            .data(d3.range(5))
            .enter()
            .append('circle')
            .attr('cx', this.legendXScale(1) + (this.legendCellWidth / 2))
            .attr('cy', (_, index) => this.legendYScale(index + 1) + (this.legendCellHeight / 2))
            .attr('r', 10)
            .attr('fill', (_, index) => fillColor[index]);
    }

    generateFemaleLegend() {
        const fillColor = [colors.liking.female['Strongly agree'], colors.liking.female['Agree'], colors.liking.female['Neutral'],
            colors.liking.female['Disagree'], colors.liking.female['Strongly disagree']];
        this.lengendSvg.selectAll('femaleLegendCircle')
            .data(d3.range(5))
            .enter()
            .append('circle')
            .attr('cx', this.legendXScale(2) + (this.legendCellWidth / 2))
            .attr('cy', (_, index) => this.legendYScale(index + 1) + (this.legendCellHeight / 2))
            .attr('r', 10)
            .attr('fill', (_, index) => fillColor[index]);
    }

    initEventHandler() {
        // Gender Event handler
        d3.select('#selectGender')
            .on('change', this.handelOnSelectChangeEvent);

        d3.select('#selectLiking')
            .on('change', this.handelOnSelectChangeEvent);
    }

    handelOnSelectChangeEvent() {
        const allBubbles = d3.selectAll('.interest-bubble');

        let genderSelectValue = d3.select('#selectGender').property('value');
        let likingSelectValue = d3.select('#selectLiking').property('value');

        if (genderSelectValue === 'all') {
            genderSelectValue = ''
        } else {
            genderSelectValue = '.' + genderSelectValue;
        }

        if (likingSelectValue === 'all') {
            likingSelectValue = ''
        } else {
            likingSelectValue = '.' + likingSelectValue;
        }

        let selector = genderSelectValue + likingSelectValue;
        if(selector){
            allBubbles.transition()
                .duration(600)
                .attr('opacity', 0);
            d3.selectAll(selector)
                .transition()
                .duration(600)
                .attr('opacity', 1);
        } else {
            allBubbles.transition()
                .duration(600)
                .attr('opacity', 1);
        }

    }

    generateScaleLegendXscale() {
        this.scaleSvg.append('g')
            .attr('transform', `translate(0, ${this.scaleSvgHeight - 20})`)
            .call(this.xScaleAxis);
    }

    generateScaleCricles() {
        const ticks = [50, 150, 250, 350];
        this.scaleSvg.selectAll('tick')
            .data(ticks)
            .enter()
            .append('circle')
            .attr('cx', (tick) => this.scaleXScale(tick))
            .attr('cy', (this.scaleSvgHeight / 2) - 10)
            .attr('r', (tick) => this.radiusScale(tick))
            .attr('fill', 'black');
    }

    handleOnMouseHover(message){
        this.tooltip
            .style('visibility', 'visible')
            .style('top', (d3.event.pageY-10)+'px')
            .style('left',(d3.event.pageX+10)+'px')
            .text(message);
    }

    handleOnMouseOut(){
        this.tooltip
            .style('visibility', 'hidden');
    }
}