import * as d3 from 'd3';
import colors from '../colors';

// https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
export default class PhobiaSection {

    constructor(svg, dataset) {
        this.svg = svg;

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));

        this.center = {
            x: this.svgWidth / 2,
            y: this.svgHeight / 2
        }

        this.phobiaKeys = ['phobia_Flying', 'phobia_storm', 'phobia_darkness', 'phobia_heights',
            'phobia_ageing', 'phobia_public_speaking'];
        this.phobiaKeyToText = {
            'phobia_Flying': 'Flying',
            'phobia_storm': 'Storm',
            'phobia_darkness': 'Darkness',
            'phobia_heights': 'Heights',
            'phobia_ageing': 'Ageing',
            'phobia_public_speaking': 'Public Speaking'
        }

        this.dataset = this.getAggregatedDataset(dataset);

        this.radialScale = d3.scaleLinear()
            .domain([0, 40])
            .range([0, 250]);
        this.ticksValue = [0, 10, 20, 30, 40];

        this.linePath = d3.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });

        this.malePathCordinates = this.phobiaKeys.map((phobia, index) => {
            const angle = (Math.PI / 2) + (2 * Math.PI * index / this.phobiaKeys.length);
            return this.getPointCoordinate(angle, this.dataset[0][phobia]);
        });
        this.malePathCordinates.push(this.getPointCoordinate(Math.PI / 2, this.dataset[0][this.phobiaKeys[0]]));

        this.femalePathCordinates = this.phobiaKeys.map((phobia, index) => {
            const angle = (Math.PI / 2) + (2 * Math.PI * index / this.phobiaKeys.length);
            return this.getPointCoordinate(angle, this.dataset[1][phobia]);
        });
        this.femalePathCordinates.push(this.getPointCoordinate(Math.PI / 2, this.dataset[1][this.phobiaKeys[0]]));
    }

    onInit() {
        this.ticks = this.svg.selectAll('tick')
            .data(this.ticksValue)
            .enter()
            .append('circle')
            .attr('cx', this.center.x)
            .attr('cy', this.center.y)
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('r', (tick) => this.radialScale(tick))
            .attr('opacity', 0);

        this.tickText = this.svg.selectAll('tickText')
            .data(this.ticksValue.slice(1))
            .enter()
            .append('text')
            .attr("x", this.center.x)
            .attr("y", (tick) => this.center.y - this.radialScale(tick))
            .text((tick) => tick.toString())
            .attr('opacity', 0);

        this.axis = this.svg.selectAll('axis')
            .data(this.phobiaKeys)
            .enter()
            .append('line')
            .attr('x1', this.center.x)
            .attr('y1', this.center.y)
            .attr('x2', (_, index) => {
                const angle = (Math.PI / 2) + (2 * Math.PI * index / this.phobiaKeys.length);
                return this.getPointCoordinate(angle, 40).x;
            })
            .attr('y2', (_, index) => {
                const angle = (Math.PI / 2) + (2 * Math.PI * index / this.phobiaKeys.length);
                return this.getPointCoordinate(angle, 40).y;
            })
            .attr('stroke', 'black')
            .attr('opacity', 0);

        this.axisLabel = this.svg.selectAll('axisLabel')
            .data(this.phobiaKeys)
            .enter()
            .append('text')
            .attr('x', (_, index) => {
                const angle = (Math.PI / 2) + (2 * Math.PI * index / this.phobiaKeys.length);
                return this.getPointCoordinate(angle, 45).x;
            })
            .attr('y', (_, index) => {
                const angle = (Math.PI / 2) + (2 * Math.PI * index / this.phobiaKeys.length);
                return this.getPointCoordinate(angle, 45).y;
            })
            .text((key) => this.phobiaKeyToText[key])
            .attr('opacity', 0);

        this.malePath = this.svg.append('path')
            .attr("d", this.linePath(this.malePathCordinates))
            .attr("fill", colors.gender.male)
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr('opacity', 0);

        this.femalePath = this.svg.append('path')
            .attr("d", this.linePath(this.femalePathCordinates))
            .attr("fill", colors.gender.female)
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr('opacity', 0);
    }

    onFocusEntered() {
        this.ticks
            .transition()
            .duration(600)
            .attr('opacity', 1);

        this.tickText
            .transition()
            .duration(600)
            .attr('opacity', 1);

        this.axis
            .transition()
            .duration(600)
            .attr('opacity', 1);

        this.axisLabel
            .transition()
            .duration(600)
            .attr('opacity', 1);

        this.malePath
            .transition()
            .duration(600)
            .attr('opacity', 0.6);

        this.femalePath
            .transition()
            .duration(600)
            .attr('opacity', 0.6);
    }

    onFocusLost() {

        this.ticks
            .transition()
            .duration(600)
            .attr('opacity', 0);

        this.tickText
            .transition()
            .duration(600)
            .attr('opacity', 0);

        this.axis
            .transition()
            .duration(600)
            .attr('opacity', 0);

        this.axisLabel
            .transition()
            .duration(600)
            .attr('opacity', 0);

        this.malePath
            .transition()
            .duration(600)
            .attr('opacity', 0);

        this.femalePath
            .transition()
            .duration(600)
            .attr('opacity', 0);
    }

    getAggregatedDataset(dataset) {
        const maleCounter = {};
        const femaleCounter = {};

        const filterCategories = ['afraid', 'Very afraid', 'Very much afraid'];

        // Get count
        dataset.forEach((row) => {
            const counter = row.gender === 'male' ? maleCounter : femaleCounter;
            this.phobiaKeys.forEach((phobia) => {
                let category = row[phobia];
                if (!filterCategories.includes(category)) return;
                counter[phobia] = counter[phobia] ? counter[phobia] + 1 : 1;
            })
        })

        // Convert to percentage
        Object.keys(maleCounter).forEach((key) => maleCounter[key] = (maleCounter[key] / dataset.length) * 100);
        Object.keys(femaleCounter).forEach((key) => femaleCounter[key] = (femaleCounter[key] / dataset.length) * 100);

        return [maleCounter, femaleCounter];
    }

    getPointCoordinate(angle, value) {
        return {
            x: this.center.x + Math.cos(angle) * this.radialScale(value),
            y: this.center.y + Math.sin(angle) * this.radialScale(value)
        };
    }
}