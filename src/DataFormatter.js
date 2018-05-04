/**
 * Used to formmat our data to csv standarts and to the need of a json object because we re retrieving our data as a
 * array of html dogshit
 */
class DataFormatter {
    /**
     * Maps the different types of Actions in arrays
     * @param data
     * @param typesToSearchFor
     */
    static gatherByTypes(data, typesToSearchFor) {
        return typesToSearchFor.map(type => data.filter(d => d.type === type));
    }

    /**
     * Used to Flatten Object / Arrays and potentionally Buffers
     * @param object
     * @param separator
     * @return {{} & any}
     */
    static flatten(object, separator = '.') {

        const isValidObject = value => {
            if (!value) {
                return false
            }

            const isArray = Array.isArray(value)
            const isObject = Object.prototype.toString.call(value) === '[object Object]'
            const hasKeys = !!Object.keys(value).length

            return !isArray && isObject && hasKeys
        };

        const walker = (child, path = []) => {

            return Object.assign({}, ...Object.keys(child).map(key => isValidObject(child[key])
                ? walker(child[key], path.concat([key]))
                : {[path.concat([key]).join(separator)]: child[key]})
            )
        };

        return Object.assign({}, walker(object))
    }

    /**
     * Because the normal flatten leaves indexes of Object Properties infront we need to have another flatten Method that removes the indexes
     * @param specificData
     * @return {{}&any}
     */
    static realFlatten(specificData) {
        /**
         * Flatten the object
         */
        let modifiedData = DataFormatter.flatten(specificData);

        /**
         * split of the index numbers that were concatinated by the flattening
         */
        for (let key in modifiedData) {
            if (modifiedData.hasOwnProperty(key)) {
                modifiedData[key.split('.')[1]] = modifiedData[key];
                delete modifiedData[key]
            }
        }

        return modifiedData;
    }
}

module.exports = DataFormatter;