export const arrRemoveItem = (arr, item) => {
	const index = arr.indexOf(item)

	return index === -1 ?
		arr : [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)]
}

export const arrUpdateItem = (arr, item, updateFn) => {
	const index = arr.indexOf(item)

	return index === -1 ?
		arr : [...arr.slice(0, index), updateFn(item), ...arr.slice(index + 1, arr.length)]
}

export const objDeleteKey = (obj, key) => {
	const obj2 = {
		...obj
	}

	delete obj2[key]

	return obj2
}

export const objUpdateKey = (obj, key, updateFn) => {
	const value = obj[key]

	return value ? {
		...obj,
		[key]: updateFn(value) 
	} : obj
}

export * from './audio-players'
