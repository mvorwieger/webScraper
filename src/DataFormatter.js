/**
 * Used to format our data to csv standards and to the need of a json object because we re retrieving our data as a
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
     * Used to Flatten Object
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
    static formatPropertyNames(specificData) {
        /**
         * Flatten the object
         */
        let modifiedData = DataFormatter.flatten(specificData);

        /**
         * split of the index numbers that were concatinated by the flattening
         */
        for (let key in modifiedData) {
            if (modifiedData.hasOwnProperty(key)) {
                modifiedData[key.split('.')[1].split(' ').join('_')] = modifiedData[key];
                delete modifiedData[key]
            }
        }

        return modifiedData;
    }

    /**
     * Formats the date to a Date that mariaDb can use
     * @param date
     * @return {string}
     */
    static formatDate(date) {
        const monthnames = ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let [day, month, year, hour, ...rest] = date.split(' ');
        const monthNumber = monthnames.indexOf(month);
        const formatedDate = [year, monthNumber, day].join('-');

        return `${formatedDate}${hour ? ' ' + hour : ''}`;
    }

    /**
     * creates {label: value}
     * out of
     * {label:labelName, value: valueNumber}
     * @param arr: Array<{label, value, unit?}>
     * @public
     */
    static createObjectOutOfArr(arr) {
        return arr.map(data => {
            return {[data.label]: data.value}
        })
    }
}

module.exports = DataFormatter;