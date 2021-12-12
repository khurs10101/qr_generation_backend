module.exports.checkAndBundleNonEmptyFields = (inputObject) => {

    let nonEmpty = {};

    for (let i in inputObject) {
        if (inputObject[i] !== 'undefined' || inputObject[i].length !== 0) {
            nonEmpty[i] = inputObject[i]
        }
    }

    return nonEmpty;
}