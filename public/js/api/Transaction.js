/**
 * Класс Transaction наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/transaction'
 * */
class Transaction extends Entity {

    static URL = '/transaction'

    static get(id = '', callback) {
        this.list({id: id}, callback)
    }

}

