export default class Utils {
    static parseRequestURL() {
        //location.host
        //location.pathname
        const url = location.hash.slice(1).toLowerCase() || '#'
        const r = url.split('/')
        const request = {
            resource: null,
            id: null,
        }
        request.resource = r[1]
        request.id = r[2]
        return request
    }

    static randomArray(length, min, max) {
        return Array.apply(null, Array(length)).map(function () {
            return min + Math.round(Math.random() * max)
        })
    }

    static shuffle(array) {
        return array
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }

    static formatSeconds(secs) {
        if (!secs) return '00:00'
        const date = new Date(0)
        date.setSeconds(secs)
        return date.toISOString().substr(14, 5)
    }
}
