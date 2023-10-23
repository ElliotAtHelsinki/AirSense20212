function isEmpty(variable) {
	if (typeof variable === 'string') variable.trim();
	if ([null, undefined, {}, [], ''].includes(variable)) return true;
	if (variable?.length === 0) return true;
	if (typeof variable === 'object' && Object.keys(variable)?.length === 0) {
		return true;
	}
	return false;
}
function isUpdateHasNoEffect(result) {
	return result[0] === 0;
}
function blobToFile(theBlob, fileName) {
	//A Blob() is almost a File() - it's just missing the two properties below which we will add
	theBlob.lastModifiedDate = new Date();
	theBlob.name = fileName;
	return theBlob;
}
module.exports = {
	blobToFile,
	isEmpty,
	isUpdateHasNoEffect,
};
