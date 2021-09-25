/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {

    static sidebarToggle = document.querySelector('.sidebar-toggle')
    static menuItem = document.querySelectorAll('.menu-item')

    /**
     * Запускает initAuthLinks и initToggleButton
     * */
    static init() {
        //this.initAuthLinks();
        //this.initToggleButton(); - пусть по умолчанию будет скрыта
        this.sidebarToggle.onclick = (e) => {
            this.initToggleButton()
        }
        for (let i = 0; i < this.menuItem.length; i++) {
            this.menuItem[i].onclick = this.initAuthLinks
        }
    }

    /**
     * Отвечает за скрытие/показа боковой колонки:
     * переключает два класса для body: sidebar-open и sidebar-collapse
     * при нажатии на кнопку .sidebar-toggle
     * */
    static initToggleButton() {
        let body = document.querySelector('body')
        body.classList.toggle('sidebar-open')
        body.classList.toggle('sidebar-collapse')
    }

    /**
     * При нажатии на кнопку входа, показывает окно входа
     * (через найденное в App.getModal)
     * При нажатии на кнопку регастрации показывает окно регистрации
     * При нажатии на кнопку выхода вызывает User.logout и по успешному
     * выходу устанавливает App.setState( 'init' )
     * */
    static initAuthLinks() {
        if (this.classList.contains('menu-item_login')) {
            App.getModal('login').open()
        } else if (this.classList.contains('menu-item_register')) {
            App.getModal('register').open()
        } else if (this.classList.contains('menu-item_logout')) {
            User.logout((err, response) => {
                if (err === null && response.success) {
                    App.setState('init')
                }
            })
        }
    }
}