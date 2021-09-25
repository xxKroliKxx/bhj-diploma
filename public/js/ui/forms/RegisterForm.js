/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
    /**
     * Производит регистрацию с помощью User.register
     * После успешной регистрации устанавливает
     * состояние App.setState( 'user-logged' )
     * и закрывает окно, в котором находится форма
     * */
    onSubmit(data) {
        User.register(data,
            (err, response) => {
                if (err != null || !response.success) return

                let form = App.getModal('register')
                form.element.querySelector('form').reset()
                form.close()
                App.setState('user-logged')
            })
    }
}