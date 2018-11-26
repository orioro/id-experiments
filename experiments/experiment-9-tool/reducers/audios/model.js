export const applyAudioDefaults = audio => {
	return {
		loadingStatus: 'not-started',
		playbackStatus: 'stopped',
		duration: 0,
		startedAt: null,
		playbackStartOffset: 0,
		...audio,
	}
}
