/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
    /**
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * Сохраняет переданный элемент и регистрирует события
     * через registerEvents()
     * */

    lastOptions = null

    constructor(element) {
        if (!element) {
            throw new Error('Уупс!');
        }
        this.element = element
        this.registerEvents()
    }

    /**
     * Вызывает метод render для отрисовки страницы
     * */
    update() {
        this.render()
    }

    /**
     * Отслеживает нажатие на кнопку удаления транзакции
     * и удаления самого счёта. Внутри обработчика пользуйтесь
     * методами TransactionsPage.removeTransaction и
     * TransactionsPage.removeAccount соответственно
     * */
    registerEvents() {
        this.element.querySelector('.remove-account').onclick = (e) => {
            this.removeAccount()
        }
    }

    /**
     * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
     * Если пользователь согласен удалить счёт, вызовите
     * Account.remove, а также TransactionsPage.clear с
     * пустыми данными для того, чтобы очистить страницу.
     * По успешному удалению необходимо вызвать метод App.updateWidgets(),
     * либо обновляйте только виджет со счетами
     * для обновления приложения
     * */
    removeAccount() {
        if (this.lastOptions === null) return
        let result = confirm('Вы действительно хотите удалить счёт?')
        if (!result) return
        Account.remove({id: this.lastOptions.account_id}, (err, response) => {
                if (err === null && response.success) {
                    App.updateWidgets()
                    this.clear()
                }
            }
        )
    }

    /**
     * Удаляет транзакцию (доход или расход). Требует
     * подтверждеия действия (с помощью confirm()).
     * По удалению транзакции вызовите метод App.update(),
     * либо обновляйте текущую страницу (метод update) и виджет со счетами
     * */
    removeTransaction(id) {
        let result = confirm('Вы действительно хотите удалить эту транзакцию?')
        if (!result) return
        Transaction.remove({id: id}, (err, response) => {
                if (err === null && response.success) {
                    this.clear()
                    App.update()
                }
            }
        )
    }

    /**
     * С помощью Account.get() получает название счёта и отображает
     * его через TransactionsPage.renderTitle.
     * Получает список Transaction.list и полученные данные передаёт
     * в TransactionsPage.renderTransactions()
     * */
    render(options) {
        if (!options) return
        this.clear()
        this.lastOptions = options
        Account.get(options.account_id, (err, response) => {
            if (err != null || !response.success) return
            this.renderTitle(response.data.name)
        })

        Transaction.list({account_id: options.account_id}, (err, response) => {
            if (err != null && !response.success) return
            this.renderTransactions(response.data)
        })

    }

    /**
     * Очищает страницу. Вызывает
     * TransactionsPage.renderTransactions() с пустым массивом.
     * Устанавливает заголовок: «Название счёта»
     * */
    clear() {
        let transactions = this.element.querySelectorAll('.transaction')
        for (let i = 0; i < transactions.length; i++) {
            transactions[i].remove()
        }
        this.renderTransactions([])
        this.renderTitle('Название счёта')
        this.lastOptions = null
    }

    /**
     * Устанавливает заголовок в элемент .content-title
     * */
    renderTitle(name) {
        this.element.querySelector('.content-title').innerText = name
    }

    /**
     * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
     * в формат «10 марта 2019 г. в 03:20»
     * */
    formatDate(date) {
        date = new Date(date)
        return date.toLocaleString('default', {dat: 'numeric', month: 'long', year: 'numeric'}) + ' в ' +
            date.toLocaleString('default', {hour: 'numeric', minute: 'numeric'})
    }

    /**
     * Формирует HTML-код транзакции (дохода или расхода).
     * item - объект с информацией о транзакции
     * */
    getTransactionHTML(item) {
        let localDate = this.formatDate(item.created_at)
        return `<div class="transaction transaction_${item.type} row">
            <div class="col-md-7 transaction__details">
              <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
              </div>
              <div class="transaction__info">
                  <h4 class="transaction__title">${item.name}</h4>
                  <div class="transaction__date">${localDate}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="transaction__summ">
                  ${item.sum} <span class="currency">₽</span>
              </div>
            </div>
            <div class="col-md-2 transaction__controls">
                <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                    <i class="fa fa-trash"></i>  
                </button>
            </div>
        </div>`
    }

    /**
     * Отрисовывает список транзакций на странице
     * используя getTransactionHTML
     * */
    renderTransactions(data) {

        data.forEach((element) => {
            this.element.insertAdjacentHTML('beforeEnd', this.getTransactionHTML(element))
            this.element.querySelector(`button[data-id="${element.id}"]`).onclick = (e) => {
                this.removeTransaction(element.id)
            }
        })
    }
}