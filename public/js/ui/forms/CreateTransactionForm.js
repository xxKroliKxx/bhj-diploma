/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
    /**
     * Вызывает родительский конструктор и
     * метод renderAccountsList
     * */
    constructor(element) {
        super(element)
        this.renderAccountsList()
    }

    /**
     * Получает список счетов с помощью Account.list
     * Обновляет в форме всплывающего окна выпадающий список
     * */
    renderAccountsList() {

        let options = this.element.querySelector('.accounts-select').querySelectorAll('option')
        for (let i = 0; i < options.length; i++) {
            options[i].remove()
        }

        Account.list({user_id: User.current().id}, (err, response) => {
            if (err != null && !response.success) return
            let select = this.element.querySelector('.accounts-select')

            response.data.forEach((element) => {
                let option = document.createElement('option');
                option.textContent = element.name;
                option.value = element.id
                select.append(option);
            })
        })
    }

    /**
     * Создаёт новую транзакцию (доход или расход)
     * с помощью Transaction.create. По успешному результату
     * вызывает App.update(), сбрасывает форму и закрывает окно,
     * в котором находится форма
     * */
    onSubmit(data) {
        Transaction.create(data, (err, response) => {
                let form = App.getModal(data.type === 'expense' ? 'newExpense' : 'newIncome')
                form.element.querySelector('form').reset()
                form.close()
                App.update()
            }
        )
    }
}