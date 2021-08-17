"""Test for manage patient funcions"""
from common import login, build_driver, manage_patient, add_todo


BASE_URL = 'http://127.0.0.1:8000'


def test_manage_patient():
    # Prepare test
    driver = build_driver()

    username = 'admin'
    password = 'abc12345'

    patient_username = 'temp-patient@mail.com'
    try:
        # Do login as admin.
        login(driver, username, password)
        assert driver.current_url == '{}/project/{}/#/'.format(
            BASE_URL, username), 'Login failed: user -> {}'.format(username)

        # Go to manage patient.
        manage_patient(driver, patient_username)
        assert str(driver.current_url).startswith('{}/u/patient/manage/'.format(
            BASE_URL)), 'Manage patient failed: patient -> {}'.format(patient_username)

    finally:
        driver.quit()


def test_add_todo():
    """Test add a todo to a patient. 
    There is no physician tagged.
    """
    # Prepare test
    driver = build_driver()

    username = 'admin'
    password = 'abc12345'

    patient_username = 'temp-patient@mail.com'

    todo_title = 'temporal-todo'
    try:
        # Do login as admin.
        login(driver, username, password)
        assert driver.current_url == '{}/project/{}/#/'.format(
            BASE_URL, username), 'Login failed: user -> {}'.format(username)

        # Go to manage patient.
        manage_patient(driver, patient_username)
        assert str(driver.current_url).startswith('{}/u/patient/manage/'.format(
            BASE_URL)), 'Manage patient failed: patient -> {}'.format(patient_username)

        # Add todo.
        add_todo(driver, patient_username, todo_title)

        todo_list = driver.find_elements_by_tag_name('li')

        # Check if todo has been created.

        todo_found = False # TODO CHECK VALIDATION.
        
        for todo in todo_list:
            if todo.text == todo_title: 
                todo_found = True
                break
        
        assert todo_found, 'Add todo Failed: patient -> {} \n TODO title -> {}'.format(patient_username, todo_title)


    finally:
        driver.quit()

