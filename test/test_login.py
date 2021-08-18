"""Test login pages"""
from common import build_driver, login, register_patient, approve_user
import pytest

BASE_URL = 'http://127.0.0.1:8000'


@pytest.fixture
def receiving_admin_user():
    """Data of the temporal admin user used during tests"""
    return {
        'username': 'admin',
        'password': 'abc12345'
    }


@pytest.fixture
def receiving_patient_user():
    """Data of the temporal patient user used during tests"""
    return {
        'username': 'temp-patient@mail.com',
        'password': 'abc12345',
        'first_name': 'Temporaly',
        'last_name': 'patient-1'
    }


@pytest.fixture
def setup():
    """Common setup for run login tests"""
    driver = build_driver()
    
    try:
        yield driver

    finally:
        driver.quit()

def test_admin_login(setup, receiving_admin_user):
    """Test login with an admin user.

    Requirements:
    - Admin user created.
    """
    # Prepare test
    driver = setup
    admin_user = receiving_admin_user
    
    # Login as admin
    login(driver, admin_user['username'], admin_user['password'])

    # Check results
    assert driver.current_url == '{}/project/{}/#/'.format(
        BASE_URL, admin_user['username']), 'Login failed: user -> {}'.format(admin_user['username'])

    
def test_register_patient(setup, receiving_patient_user):
    """Test register a patient throw the register form
    """
    # Prepare test
    driver = setup
    patient_user = receiving_patient_user
 
    # Register patient
    register_patient(driver, patient_user['username'], patient_user['password'],
                        patient_user['first_name'], patient_user['last_name'])

    # Check results
    assert driver.current_url == '{}/u/home/'.format(
        BASE_URL, patient_user['username']), 'Login failed: user -> {}'.format(patient_user['username'])

    assert str(driver.find_element_by_xpath('/html/body/p').text).startswith(
        'Your account is created but your profile is not verified.')


def test_approve_pacient(setup):
    """Test the patient approval funtionality"""
    # Prepare test
    driver = setup

    username = 'admin'
    password = 'abc12345'
    pacient_username = 'temp-patient2@mail.com'
    role = 'Patient'

    # Login as admin
    login(driver, username, password)

    # Check result
    assert driver.current_url == '{}/project/{}/#/'.format(
        BASE_URL, username), 'Login failed: user -> {}'.format(username)

    # Approve user
    approve_user(driver, pacient_username, role)



def test_patient_login(setup):
    """Test login with a patient user.

    Requirements:
    - Patient user created.
    """
    # Prepare test
    driver = setup

    username = 'temp-patient@mail.com'
    password = 'abc12345'

    # Run test
    login(driver, username, password)

    # Check result
    assert str(driver.current_url).startswith(
        '{}/u/patient/manage/'.format(BASE_URL)), 'Login failed: user -> {}'.format(username)


def test_incorrent_password_login(setup):
    """Test login with an incorrect password.
    """
    # Prepare test
    driver = setup

    username = 'temp-patient1@mail.com'
    password = 'abc1234511'

    # Run test
    login(driver, username, password)

    # Check result
    assert driver.current_url == '{}/u/login/'.format(
        BASE_URL), 'Login with incorrent password failed: user -> {}'.format(username)