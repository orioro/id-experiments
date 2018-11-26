import { combineReducers } from 'redux'

import {
	objDeleteKey,
	objUpdateKey,
	arrUpdateItem,
	arrRemoveItem
} from '../util'

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

const audio = (state, action) => {
	switch (action.type) {
		case AUDIOS_LOAD_AUDIO_REQUEST:
			return {
				...state,
				loadingStatus: 'loading',
			}
		case AUDIOS_LOAD_AUDIO_SUCCESS:
			return {
				...state,
				...action.payload.audio,
				loadingStatus: 'loaded'
			}
		case AUDIOS_LOAD_AUDIO_FAILURE:
			return {
				...state,
				loadingStatus: 'error',
				error: action.payload.error
			}
		case AUDIOS_PLAY_AUDIO:
			return state.playbackStatus !== 'playing' ? {
				...state,
				playbackStatus: 'playing',
				startedAt: action.payload.time,
			} : state
		case AUDIOS_PAUSE_AUDIO:
			return state.playbackStatus === 'playing' ? {
				...state,
				playbackStatus: 'paused',
				startedAt: null,
				playbackStartOffset: ((state.playbackStartOffset || 0) + action.payload.time - state.startedAt) % state.duration
			} : state
		case AUDIOS_STOP_AUDIO:
			return {
				...state,
				playbackStatus: 'stopped',
				startedAt: null,
				playbackStartOffset: 0,
			}
		case AUDIOS_SET_AUDIO_PLAYBACK_START_OFFSET:
			return {
				...state,
				playbackStartOffset: action.payload.playbackStartOffset
			}
		default:
			return state
	}
}

const byId = (state = {}, action) => {
	switch (action.type) {
		case AUDIOS_ADD_AUDIO:
			return {
				...state,
				[action.payload.audioId]: action.payload.audio
			}
		case AUDIOS_REMOVE_AUDIO:
			return objDeleteKey(state, action.payload.audioId)
		case AUDIOS_LOAD_AUDIO_REQUEST:
		case AUDIOS_LOAD_AUDIO_SUCCESS:
		case AUDIOS_LOAD_AUDIO_FAILURE:
		case AUDIOS_PLAY_AUDIO:
		case AUDIOS_PAUSE_AUDIO:
		case AUDIOS_STOP_AUDIO:
		case AUDIOS_SET_AUDIO_PLAYBACK_START_OFFSET:
			return objUpdateKey(state, action.payload.audioId, aud => {
				return audio(aud, action)
			})
		default:
			return state
	}
}

const idList = (state = [], action) => {
	switch (action.type) {
		case AUDIOS_ADD_AUDIO:
			return [...state, action.payload.audioId]
		case AUDIOS_REMOVE_AUDIO:
			return arrRemoveItem(state, action.payload.audioId)
		default:
			return state
	}
}

export default combineReducers({
	byId,
	idList
})
