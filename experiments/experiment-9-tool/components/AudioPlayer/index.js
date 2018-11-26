import React from 'react'
import PropTypes from 'prop-types'

import PlayArrowIcon from 'mdi-react/PlayArrowIcon'
import PauseIcon from 'mdi-react/PauseIcon'
import StopIcon from 'mdi-react/StopIcon'

class AudioPlayer extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			timeElapsedSinceLastPlay: 0,
		}

		this._started = null
		this._interval = null

		this.play = this.play.bind(this)
		this.pause = this.pause.bind(this)
		this.stop = this.stop.bind(this)
	}

	_startCountingTimeElapsed() {
		this._started = Date.now()

		this._interval = setInterval(() => {
			this.setState({
				timeElapsedSinceLastPlay: (Date.now() - this._started) / 1000
			})
		}, 60)
	}

	_stopCountingTimeElapsed() {
		this._started = null

		clearInterval(this._interval)
		this._interval = null
		this.setState({
			timeElapsedSinceLastPlay: 0
		})
	}

	play() {
		this.props.onPlay()
		this._startCountingTimeElapsed()
	}

	pause() {
		this.props.onPause()
		this._stopCountingTimeElapsed()
	}

	stop() {
		this.props.onStop()
		this._stopCountingTimeElapsed()
	}

	computeTimeElapsed() {
		const {
			pauseOffset,
			playbackStatus
		} = this.props

		return playbackStatus === 'playing' ?
			pauseOffset + this.state.timeElapsedSinceLastPlay :
			pauseOffset
	}

	componentWillUnmount() {
		if (this._interval) {
			clearInterval(this._interval)
		}
	}

	render() {
		const {
			label,
			playbackStatus,
			duration,
			pauseOffset
		} = this.props

		return <div>
			<button
				onClick={() => {
					if (playbackStatus === 'playing') {
						this.pause()
					} else {
						this.play()
					}
				}}>
				{ playbackStatus === 'playing' ? <PauseIcon /> : <PlayArrowIcon /> }
			</button>
			<button
				onClick={this.stop}
				disabled={playbackStatus === 'stopped'}>
				<StopIcon />
			</button>

			<div
				style={{
					backgroundImage: 'linear-gradient(transparent 10%, #00ffff 10%, #00ffff 90%, transparent 90%)',
					backgroundRepeat: 'no-repeat',
					backgroundSize: `${((this.computeTimeElapsed() / duration) * 100).toFixed(2)}% 100%`
				}}>
				{label}
			</div>
		</div>		
	}
}

AudioPlayer.propTypes = {
	label: PropTypes.string.isRequired,
	playbackStatus: PropTypes.string.isRequired,
	onPlay: PropTypes.func.isRequired,
	onPause: PropTypes.func.isRequired,
	onStop: PropTypes.func.isRequired,
	duration: PropTypes.number.isRequired,
	pauseOffset: PropTypes.number.isRequired
}

export default AudioPlayer
