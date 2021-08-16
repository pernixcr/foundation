"""Test login pages"""
from common import login, build_driver


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


def test_pacient_login():
    """Test login with a pacient user.

    Requirements:
    - Pacient user created.
    """
    # Prepare test
    driver = build_driver()

    username = 'temp-pacient@mail.com'
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

    username = 'temp-pacient1@mail.com'
    password = 'abc1234511'
    try:
        # Run test
        login(driver, username, password)

        # Check result
        assert driver.current_url == '{}/u/login/'.format(
            BASE_URL), 'Login with incorrent password failed: user -> {}'.format(username)

    finally:
        driver.quit()


def test_register_pacient():
    pass