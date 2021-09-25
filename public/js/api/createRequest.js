/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options) => {

    let url = options.url
    if (options.method === 'GET') {
        if (options.data.hasOwnProperty('id')) {
            url += '/' + options.data.id
        }
        let params = []
        for (let key in options.data) {
            params.push(`${key}=${options.data[key]}`)
        }
        if (params.length != 0) url += '?' + params.join('&')
    }
    let formData = new FormData
    for (let key in options.data) formData.append(key, options.data[key])

    let xhr = new XMLHttpRequest;
    xhr.open(options.method, url)
    xhr.onreadystatechange = function () {
        if (this.readyState != this.DONE) return
        if (this.status === 200) {
            options.callback(null, JSON.parse(this.responseText))
        } else {
            options.callback(new Error(`status ${this.status}`), null)
        }

    }
    xhr.onerror = function () {
        options.callback(new Error('ошибка'), null)
    };

    //xhr.setRequestHeader('Content-Type', 'multipart/form-data')
    //xhr.responseType = 'json'
    xhr.send(formData)

};
