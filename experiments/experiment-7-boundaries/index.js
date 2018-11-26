import * as d3 from 'd3'
const $svg = d3.select('#svg')

const PATH_COUNT = 30
const POINT_COUNT = 100

const createArray = (length, fn) => {
	return new Array(length).fill(null).map((v, index) => {
		return fn(index)
	})
}

const cut = (min, max, cutCount) => {
	const distance = max - min
	const step = distance / cutCount

	return createArray(cutCount + 1, index => index * step)
}

const createPath = ({ stroke = 'black', strokeWidth = 2 } = {}) => {
	return $svg.append('path')
	  .attr('stroke', stroke)
	  .attr('stroke-width', strokeWidth)
	  .attr('fill', 'none')
	  .attr('transform', `translate(0, ${window.innerHeight / 2})`)
}

const $paths = createArray(PATH_COUNT, createPath)

const yScale = d3.scaleLinear()
	.domain([-1, 1])
	.range([-1 / 2 * window.innerHeight, 1 / 2 * window.innerHeight])

const xScale = d3.scaleLinear()
	.domain([0, POINT_COUNT])
	.range([window.innerWidth / 2, window.innerWidth])

const generateLine = d3.line()
	.x(d => xScale(d.x))
	.y(d => yScale(d.y))

const isBetween = (min, max, num) => {
	return num >= min && num <= max
}

const boundaries = createArray(POINT_COUNT + 1, index => {
	return {
		x: index,
		min: isBetween(30, 50, index) ?
			index * -1 / (POINT_COUNT - 20) :
			index * -1 / POINT_COUNT,
		max: isBetween(20, 35, index) ?
			Math.pow(1.05, index) * 1 / (80 - index) :
			Math.pow(1.05, index) * 1 / 100,
	}
})

const lines = createArray(PATH_COUNT, index => {
	return boundaries.map(({ x, min, max }) => {
		return {
			x,
			y: min + (((max - min) / PATH_COUNT) * index)
		}
	})
})

lines.forEach((line, index) => {
	$paths[index].attr(
		'd',
		generateLine(line)
	)
})