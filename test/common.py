from time import sleep
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def build_driver():
    """Build the driver.

    Returns:
        webdriver
    """
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')

    return webdriver.Chrome(options=options)


def login(driver, username, password):
    """Do a login.

    Args:
        driver: web driver.
        username (str): username of the user.
        password (str): password of the user.
    """

    driver.get('http://127.0.0.1:8000/')
    sleep(1)

    # Go to login page

    login_button = driver.find_element_by_link_text('Login')
    login_button.click()
    sleep(3)

    username_field = driver.find_element_by_name('username')
    password_field = driver.find_element_by_name('password')
    username_field.send_keys(username)
    password_field.send_keys(password)

    # Submit

    submit_button = driver.find_element_by_xpath(
        '//*[@id="dvmain"]/div/div[1]/div/div[2]/form/div[3]/center/button')
    submit_button.click()
    sleep(2)


def manage_pacient(driver, username):
    """Go to manage a pacient.

    Args:
        driver : web driver
        username (str): username of the pacient.
    """
    table = driver.find_element_by_class_name('table')

    pacients = table.find_elements_by_tag_name('tr')
    del pacients[0]  # Remove table headers

    for idx, pacient in enumerate(pacients):
        pacient = pacient.text.split()

        if pacient[2] == username:
            print('{}. {}'.format(idx, pacient[2]))  # username
            driver.find_element_by_xpath(
                '//*[@id="ng-app"]/div[2]/div/div[2]/div[1]/div[2]/table/tbody/tr[{}]/td[7]/a[2]'.format(idx+1)).click()
            break

    sleep(1)


def add_todo(driver, username, title, physician_full_name=None):
    """Add a todo.

    Args:
        username (str): Username of the pacient. 
        title (str): title of the todo.
    """
    # Add title

    todo = driver.find_element_by_id('todoNameInput')
    todo.send_keys(title)
    driver.find_element_by_xpath(
        '//*[@id="tab-content"]/div/div[1]/div[1]/div[2]/div/div[2]/form/div/span/button').click()
    sleep(1)
    driver.find_element_by_xpath(
        '//*[@id="ngdialog1"]/div[2]/div/div[2]/button[2]').click()
    sleep(2)

    # Tag physician
    
    if physician_full_name:

        tag_dialog_div = driver.find_element_by_xpath(
            '//*[@id="ngdialog2"]/div[2]')

        physicians = tag_dialog_div.find_elements_by_tag_name('a')

        for physician in physicians:
            if physician.text == physician_full_name:
                physician.click()
                break

    # Submit 
    sleep(1)

    driver.find_element_by_xpath(
        '//*[@id="ngdialog2"]/div[2]/form/button').click()

    sleep(2)
