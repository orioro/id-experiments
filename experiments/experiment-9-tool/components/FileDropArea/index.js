import React from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

const FileDropTargetSpec = {
	canDrop(props) {
		return true
	},
	drop(props, monitor) {
		props.onDropFiles(monitor.getItem().files)
	}
}

const collect = (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop()
	}
}

const FileDropArea = ({ connectDropTarget }) => {
	return connectDropTarget(<div style={{ width: '100vw', height: '50vh', backgroundColor: 'skyblue' }}>
		Drop area
	</div>)
}

FileDropArea.propTypes = {
	onDropFiles: PropTypes.func.isRequired,
}

export default DropTarget([NativeTypes.FILE], FileDropTargetSpec, collect)(FileDropArea)
