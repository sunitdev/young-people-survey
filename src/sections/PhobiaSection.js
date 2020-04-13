export default class PhobiaSection {

    constructor(svg, dataset) {
        this.svg = svg;

        this.svgWidth = parseInt(this.svg.attr('width'));
        this.svgHeight = parseInt(this.svg.attr('height'));

        console.log(dataset);
    }

    onInit() {
    }

    onFocusEntered() {
    }

    onFocusLost() {
     }
}