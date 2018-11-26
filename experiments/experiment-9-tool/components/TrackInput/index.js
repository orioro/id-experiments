import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import insertCss from 'insert-css'
import styles from './styles.css'

insertCss(styles)

class Track extends React.Component {
	constructor(props) {
		super(props)

		this.trackElRef = React.createRef()
		this.state = {
			trackWidth: 0,
		}

		this.updateTrackWidth = this.updateTrackWidth.bind(this)
	}

	updateTrackWidth() {
		this.setState({
			trackWidth: this.trackElRef.current.offsetWidth
		})
	}

	componentDidMount() {
		this.updateTrackWidth()
		window.addEventListener('resize', this.updateTrackWidth)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateTrackWidth)
	}

	render() {
		const {
			controls,
			onDragStart,
			onDrag,
			onDragStop
		} = this.props

		return <div className='track-input'>
			<div
				ref={this.trackElRef}
				className='track-input__track'>
				{controls.map(control => {
					return <Draggable
						key={control.name}
						axis='x'
						bounds={{
							left: 0,
							right: this.state.trackWidth,
						}}
						position={{
							x: control.value * this.state.trackWidth,
							y: 0,
						}}
						onStart={control.onDragStart}
						onDrag={(e, { x }) => {
							control.onDrag(x / this.state.trackWidth)
						}}
						onStop={control.onDragStop}>
						<div className='track-input__track__control'></div>
					</Draggable>
				})}
			</div>
		</div>
	}
}

Track.propTypes = {
	controls: PropTypes.array.isRequired,
	onDragStart: PropTypes.func.isRequired,
	onDrag: PropTypes.func.isRequired,
	onDragStop: PropTypes.func.isRequired,
}

export default Track
