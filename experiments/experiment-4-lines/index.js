import * as d3 from 'd3'
const $svg = d3.select('#svg')

const createArray = (length, fn) => {
	return new Array(length).fill(null).map((v, index) => {
		return fn(index)
	})
}

const growingLineData = ({ initial, growthRate, length }) => {
	return createArray(length, (index) => {
		return {
			x: index,
			y: initial * Math.pow(growthRate, index)
		}
	})
}

const drawLine = ({ data, xRange, yRange }) => {
	const scaleX = d3.scaleLinear()
		.domain(d3.extent(data, d => d.x))
		.range(xRange)
	const scaleY = d3.scaleLinear()
		.domain(d3.extent(data, d => d.y))
		.range(yRange)

	return d3.line()
		.x(d => scaleX(d.x))
		.y(d => scaleY(d.y))(data)
}

const $path = $svg.append('path')
  .attr('stroke', 'black')
  .attr('stroke-width', '2')
  .attr('fill', 'none')

$path.attr('d', drawLine({
	data: growingLineData({
		initial: 1,
		growthRate: -1.01,
		length: 200,
	}),
	xRange: [50, window.innerWidth - 50],
	yRange: [50, window.innerHeight - 50]
}))
