/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
    /**
     * Устанавливает текущий элемент в свойство element
     * Регистрирует обработчики событий с помощью
     * AccountsWidget.registerEvents()
     * Вызывает AccountsWidget.update() для получения
     * списка счетов и последующего отображения
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * */
    constructor(element) {
        if (!element) {
            throw new Error('Уупс!');
        }
        this.element = element
        this.registerEvents()
        this.update()
    }

    /**
     * При нажатии на .create-account открывает окно
     * #modal-new-account для создания нового счёта
     * При нажатии на один из существующих счетов
     * (которые отображены в боковой колонке),
     * вызывает AccountsWidget.onSelectAccount()
     * */
    registerEvents() {
        this.element.querySelector('.pull-right').onclick = (e) => {
            App.getModal('createAccount').open()
        }
        let elements = this.element.querySelectorAll('.account')
        for (let i = 0; i < elements.length; i++) {
            elements[i].onclick = (e) => {
                this.onSelectAccount(e)
            }
        }
    }

    /**
     * Метод доступен только авторизованным пользователям
     * (User.current()).
     * Если пользователь авторизован, необходимо
     * получить список счетов через Account.list(). При
     * успешном ответе необходимо очистить список ранее
     * отображённых счетов через AccountsWidget.clear().
     * Отображает список полученных счетов с помощью
     * метода renderItem()
     * */
    update() {
        let user = User.current()
        if (!user) return
        Account.list({user_id:user.id}, (err, response) => {
            if (err != null && !response.success) return
            this.clear()
            response.data.forEach((item) => {
                this.renderItem(item)
            })
        })
    }

    /**
     * Очищает список ранее отображённых счетов.
     * Для этого необходимо удалять все элементы .account
     * в боковой колонке
     * */
    clear() {
        let elements = this.element.querySelectorAll('.account')
        for (let i = 0; i < elements.length; i++) {
            elements[i].remove()
        }
    }

    /**
     * Срабатывает в момент выбора счёта
     * Устанавливает текущему выбранному элементу счёта
     * класс .active. Удаляет ранее выбранному элементу
     * счёта класс .active.
     * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
     * */
    onSelectAccount(element) {
        let elements = this.element.querySelectorAll('.account')
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains('active')) elements[i].classList.remove('active')
        }
        let currentElement = element.currentTarget
        currentElement.classList.add('active')
        App.showPage('transactions', {account_id: currentElement.dataset.id});
    }

    /**
     * Возвращает HTML-код счёта для последующего
     * отображения в боковой колонке.
     * item - объект с данными о счёте
     * */
    getAccountHTML(item) {
        return `<li class="account" data-id="${item.id}">
            <a href="#">
                <span>${item.name}</span> /
                <span>${item.sum} ₽</span>
            </a>
        </li>`
    }

    /**
     * Получает массив с информацией о счетах.
     * Отображает полученный с помощью метода
     * AccountsWidget.getAccountHTML HTML-код элемента
     * и добавляет его внутрь элемента виджета
     * */
    renderItem(data) {
        this.element.insertAdjacentHTML('beforeEnd', this.getAccountHTML(data))
        this.element.querySelector(`li[data-id="${data.id}"]`).onclick = (e) => {
            this.onSelectAccount(e)
        }
    }
}
