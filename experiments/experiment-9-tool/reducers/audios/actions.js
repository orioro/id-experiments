import Tone from 'tone'
import uuidv4 from 'uuid/v4'
import path from 'path'

import {
	AUDIOS_ADD_AUDIO,
	AUDIOS_REMOVE_AUDIO,
	AUDIOS_LOAD_AUDIO_REQUEST,
	AUDIOS_LOAD_AUDIO_SUCCESS,
	AUDIOS_LOAD_AUDIO_FAILURE,
	AUDIOS_PLAY_AUDIO,
	AUDIOS_PAUSE_AUDIO,
	AUDIOS_STOP_AUDIO,
	AUDIOS_SET_AUDIO_PLAYBACK_START_OFFSET
} from '../../constants'

import {
	tonePlayerFromFile,
	tonePlayerFromUrl
} from '../util'

import {
	applyAudioDefaults
} from './model'

export const setAudioPlaybackStartOffset = (audioId, playbackStartOffset) => {
	return {
		type: AUDIOS_SET_AUDIO_PLAYBACK_START_OFFSET,
		payload: {
			audioId,
			playbackStartOffset
		}
	}
}

export const playAudio = audioId => (dispatch, getState) => {
	const audio = getState().audios.byId[audioId]
	if (!audio) {
		console.warn(`No audio found given for id ${audioId}`)
		return
	}

	const time = Tone.context.now()
	audio.player.start(
		time,
		audio.playbackStartOffset || 0
	)
	dispatch({
		type: AUDIOS_PLAY_AUDIO,
		payload: {
			audioId,
			time
		}
	})
}

export const pauseAudio = audioId => (dispatch, getState) => {
	const audio = getState().audios.byId[audioId]
	if (!audio) {
		console.warn(`No audio found given for id ${audioId}`)
		return
	}

	audio.player.stop()
	dispatch({
		type: AUDIOS_PAUSE_AUDIO,
		payload: {
			audioId,
			time: Tone.context.now()
		}
	})
}

export const stopAudio = audioId => (dispatch, getState) => {
	const audio = getState().audios.byId[audioId]
	if (!audio) {
		console.warn(`No audio found given for id ${audioId}`)
		return
	}

	audio.player.stop()
	dispatch({
		type: AUDIOS_STOP_AUDIO,
		payload: {
			audioId
		}
	})
}

export const loadAudioFromUrl = url => dispatch => {
	const audioId = uuidv4()

	const audio = applyAudioDefaults({
		id: audioId,
		name: path.basename(url),
		sourceType: 'url',
		source: url,
		loadingStatus: 'loading',
	})

	dispatch({
		type: AUDIOS_ADD_AUDIO,
		payload: {
			audioId,
			audio
		}
	})

	return tonePlayerFromUrl(url).then(player => {
		dispatch({
			type: AUDIOS_LOAD_AUDIO_SUCCESS,
			payload: {
				audioId,
				audio: {
					player,
					duration: player.buffer.duration
				}
			}
		})
	})
	.catch(error => {
		dispatch({
			type: AUDIOS_LOAD_AUDIO_FAILURE,
			payload: {
				audioId,
				error
			}
		})
	})
}

export const loadAudioFromFile = file => dispatch => {
	const audioId = uuidv4()

	const audio = applyAudioDefaults({
		id: audioId,
		name: file.name,
		sourceType: 'file',
		source: file,
		loadingStatus: 'loading',
	})

	dispatch({
		type: AUDIOS_ADD_AUDIO,
		payload: {
			audioId,
			audio
		}
	})

	return tonePlayerFromFile(file).then(player => {
		dispatch({
			type: AUDIOS_LOAD_AUDIO_SUCCESS,
			payload: {
				audioId,
				audio: {
					player
				}
			}
		})
	})
	.catch(error => {
		dispatch({
			type: AUDIOS_LOAD_AUDIO_FAILURE,
			payload: {
				audioId,
				error
			}
		})
	})
}
