/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {


    static URL = '/user'

    /**
     * Устанавливает текущего пользователя в
     * локальном хранилище.
     * */
    static setCurrent(user) {
        localStorage.setItem('user', JSON.stringify(user))
    }

    /**
     * Удаляет информацию об авторизованном
     * пользователе из локального хранилища.
     * */
    static unsetCurrent() {
        localStorage.removeItem('user')
    }

    /**
     * Возвращает текущего авторизованного пользователя
     * из локального хранилища
     * */
    static current() {
        let userJSON = localStorage.getItem('user')
        return userJSON === undefined ? undefined : JSON.parse(userJSON)
    }

    /**
     * Получает информацию о текущем
     * авторизованном пользователе.
     * */
    static fetch(callback) {
        createRequest({
            data: {},
            method: 'GET',
            url: this.URL + '/current',
            callback: (err, response) => {
                response.success ? this.setCurrent(response.user) : this.unsetCurrent()
                callback(err, response)
            }
        })
    }

    /**
     * Производит попытку авторизации.
     * После успешной авторизации необходимо
     * сохранить пользователя через метод
     * User.setCurrent.
     * */
    static login(data, callback) {
        createRequest({
            url: this.URL + '/login',
            method: 'POST',
            responseType: 'json',
            data,
            callback: (err, response) => {
                if (response && response.user) {
                    this.setCurrent(response.user);
                }
                callback(err, response);
            }
        });
    }

    /**
     * Производит попытку регистрации пользователя.
     * После успешной авторизации необходимо
     * сохранить пользователя через метод
     * User.setCurrent.
     * */
    static register(data, callback) {
        createRequest({
            url: this.URL + '/register',
            method: 'POST',
            callback: (err, response) => {
                if (response && response.success) {
                    this.setCurrent(response.user);
                }
                callback(err, response);
            },
            data
        })
    }

    /**
     * Производит выход из приложения. После успешного
     * выхода необходимо вызвать метод User.unsetCurrent
     * */
    static logout(callback) {
        createRequest({
            url: this.URL + '/logout',
            method: 'POST',
            callback: (err, response) => {
                if (response.success) {
                    this.unsetCurrent()
                }
                callback(err, response)
            },
            data: {id: this.current().id}
        })
    }
}
