import React from 'react'
import { connect } from 'react-redux'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Controls from '../Controls'
import D3Renderer from '../../components/D3Renderer'
import FileDropArea from '../../components/FileDropArea'

import {
	loadAudioFromFile,
	loadAudioFromUrl
} from '../../reducers/audios/actions'

class App extends React.Component {

	componentDidMount() {
		[
			'../resources/blackrole.ogg',
			'../resources/internet.ogg',
			'../resources/water_01.ogg',
		].forEach(this.props.loadAudioFromUrl)
	}

	render() {
		const { loadAudioFromFile } = this.props

		return <DragDropContextProvider backend={HTML5Backend}>
			<Controls />
			<D3Renderer />
			<FileDropArea onDropFiles={files => {
				console.log('droppped', files)
				files.forEach(loadAudioFromFile)
			}} />
		</DragDropContextProvider>
	}
}

const mapStateToProps = state => {
	return {}
}

const mapDispatchToProps = {
	loadAudioFromFile,
	loadAudioFromUrl
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
