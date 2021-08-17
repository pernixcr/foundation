"""Test login pages"""
from common import build_driver, login, register_patient, approve_user 


BASE_URL = 'http://127.0.0.1:8000'


def test_admin_login():
    """Test login with an admin user.

    Requirements:
    - Admin user created.
    """
    # Prepare test
    driver = build_driver()

    username = 'admin'
    password = 'abc12345'

    try:
        # Run test
        login(driver, username, password)

        # Check result
        assert driver.current_url == '{}/project/{}/#/'.format(
            BASE_URL, username), 'Login failed: user -> {}'.format(username)

    finally:
        driver.quit()


def test_register_patient():
    """Test register a patient throw the register form
    """
    # Prepare test
    driver = build_driver()

    username = 'temp-patient2@mail.com'
    password = 'abc12345'
    first_name = 'Temporaly'
    last_name = 'patient-1'

    try:
        # Run test
        register_patient(driver, username, password, first_name, last_name)

        # Check result
        assert driver.current_url == '{}/u/home/'.format(
            BASE_URL, username), 'Login failed: user -> {}'.format(username)

        assert str(driver.find_element_by_xpath('/html/body/p').text).startswith(
            'Your account is created but your profile is not verified.')
    finally:
        driver.quit()


def test_approve_pacient():

    # Prepare test
    driver = build_driver()

    username = 'admin'
    password = 'abc12345'
    pacient_username = 'temp-patient2@mail.com'
    role = 'Patient'
    try:
        # Login as admin
        login(driver, username, password)

        # Check result
        assert driver.current_url == '{}/project/{}/#/'.format(
            BASE_URL, username), 'Login failed: user -> {}'.format(username)

        # Approve user
        approve_user(driver, pacient_username, role)

    finally:
        driver.quit()


def test_patient_login():
    """Test login with a patient user.

    Requirements:
    - Patient user created.
    """
    # Prepare test
    driver = build_driver()

    username = 'temp-patient@mail.com'
    password = 'abc12345'
    try:
        # Run test
        login(driver, username, password)

        # Check result
        assert str(driver.current_url).startswith(
            '{}/u/patient/manage/'.format(BASE_URL)), 'Login failed: user -> {}'.format(username)

    finally:
        driver.quit()


def test_incorrent_password_login():
    """Test login with an incorrect password.
    """
    # Prepare test
    driver = build_driver()

    username = 'temp-patient1@mail.com'
    password = 'abc1234511'
    try:
        # Run test
        login(driver, username, password)

        # Check result
        assert driver.current_url == '{}/u/login/'.format(
            BASE_URL), 'Login with incorrent password failed: user -> {}'.format(username)

    finally:
        driver.quit()