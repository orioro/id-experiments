import React from 'react'

class D3Renderer extends React.Component {
	constructor(props) {
		super(props)

		this.svgRef = React.createRef()
	}
	
	render() {
		return <svg ref={this.svgRef}></svg>
	}
}

export default D3Renderer
