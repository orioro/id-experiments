import React from 'react'
import PropTypes from 'prop-types'
import raf from 'raf'

import PlayArrowIcon from 'mdi-react/PlayArrowIcon'
import PauseIcon from 'mdi-react/PauseIcon'
import StopIcon from 'mdi-react/StopIcon'

import TrackInput from '../TrackInput'

const noop = () => {}

class AudioPlayer extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			playbackStatusBeforePause: null,
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

		const tick = () => {
			this.setState({
				timeElapsedSinceLastPlay: (Date.now() - this._started) / 1000
			})

			if (this.props.playbackStatus === 'playing') {
				this._interval = raf(tick)
			}
		}

		this._interval = raf(tick)
	}

	_stopCountingTimeElapsed() {
		this._started = null

		raf.cancel(this._interval)
		this.setState({
			timeElapsedSinceLastPlay: 0
		})
	}

	play() {
		this.props.onPlay()
		this._startCountingTimeElapsed()
	}

	pause() {
		this.setState({
			playbackStatusBeforePause: this.props.playbackStatus
		})
		this.props.onPause()
		this._stopCountingTimeElapsed()
	}

	stop() {
		this.props.onStop()
		this._stopCountingTimeElapsed()
	}

	computeTimeElapsed() {
		const {
			duration,
			playbackStartOffset,
			playbackStatus
		} = this.props

		return playbackStatus === 'playing' && duration > 0 ?
			(playbackStartOffset + this.state.timeElapsedSinceLastPlay) % duration :
			playbackStartOffset
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
			playbackStartOffset,
			onChangePauseOffset
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
				<div style={{ width: '100px', overflow: 'hidden'}}>{this.computeTimeElapsed()}</div>
			</div>

			<TrackInput
				controls={[
					{
						name: 'timeElapsed',
						value: this.computeTimeElapsed() / duration,
						onDragStart: () => {
							this.pause()
						},
						onDragStop: () => {
							if (this.state.playbackStatusBeforePause === 'playing') {
								this.play()
							}
						},
						onDrag: value => {
							return onChangePauseOffset(value * duration)
						},
					}
				]}
				onDragStart={noop}
				onDrag={noop}
				onDragStop={noop} />
		</div>		
	}
}

AudioPlayer.propTypes = {
	label: PropTypes.string.isRequired,
	playbackStatus: PropTypes.string.isRequired,
	onPlay: PropTypes.func.isRequired,
	onPause: PropTypes.func.isRequired,
	onStop: PropTypes.func.isRequired,
	onChangePauseOffset: PropTypes.func.isRequired,
	duration: PropTypes.number.isRequired,
	playbackStartOffset: PropTypes.number.isRequired,
}

export default AudioPlayer
