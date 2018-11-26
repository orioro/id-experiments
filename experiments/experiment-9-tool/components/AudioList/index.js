import React from 'react'
import PropTypes from 'prop-types'
import insertCss from 'insert-css'
import styles from './styles.css'

insertCss(styles)

import AudioPlayer from '../AudioPlayer'

const AudioList = ({
	audios,
	onPlayAudio,
	onPauseAudio,
	onStopAudio
}) => {
	return <ul className='audio-list'>
		{audios.map(audio => {
			return <li
				key={audio.id}>
				<AudioPlayer
					label={`${audio.name} ${audio.loadingStatus}`}
					playbackStatus={audio.playbackStatus}
					onPlay={onPlayAudio.bind(null, audio.id)}
					onPause={onPauseAudio.bind(null, audio.id)}
					onStop={onStopAudio.bind(null, audio.id)}
					duration={audio.duration}
					pauseOffset={audio.pauseOffset}/>
			</li>
		})}
	</ul>
}

AudioList.propTypes = {
	audios: PropTypes.array.isRequired,
	onPlayAudio: PropTypes.func.isRequired,
	onPauseAudio: PropTypes.func.isRequired,
	onStopAudio: PropTypes.func.isRequired
}

export default AudioList
