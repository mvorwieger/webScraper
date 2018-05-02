class DataFormatter {
    static gatherByTypes(data, typesToSearchFor) {
        return typesToSearchFor.map(type => data.filter(d => d.type === type));
    }

    static flatten(object, separator = '.') {

        const isValidObject = value => {
            if (!value) {
                return false
            }

            const isArray  = Array.isArray(value)
            const isObject = Object.prototype.toString.call(value) === '[object Object]'
            const hasKeys  = !!Object.keys(value).length

            return !isArray && isObject && hasKeys
        }

        const walker = (child, path = []) => {

            return Object.assign({}, ...Object.keys(child).map(key => isValidObject(child[key])
                ? walker(child[key], path.concat([key]))
                : { [path.concat([key]).join(separator)] : child[key] })
            )
        }

        return Object.assign({}, walker(object))
    }

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