import RNFS from 'react-native-fs';

const DEFAULT_FOLDER = '/remixPlayer';

const getPath = () => {
	const path = RNFS.DocumentDirectoryPath;
	return path;
};

export const getDefaultFolderPath = () => {
	let _path = getPath() + DEFAULT_FOLDER;
	_path += '/audio';
	return _path;
};

export const destinationPath = () => {
	return getDefaultFolderPath() + '/audio.mp3';
};

type DownloadOptions = Omit<RNFS.DownloadFileOptions, 'fromUrl' | 'toFile'>;

const downloadAudio = async (
	url: string,
	options: DownloadOptions = {},
) => {
	await RNFS.mkdir(getDefaultFolderPath(), {
		NSURLIsExcludedFromBackupKey: true,
	});
	const destPath = destinationPath();

	const result = RNFS.downloadFile({
		fromUrl: url,
		toFile: destPath,
		...options,
	});

	// await download of file
	await result.promise;

	return result;
};

export default {downloadAudio, destinationPath};