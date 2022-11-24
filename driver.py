from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver import Chrome
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
import time

chrome_options = Options()
chrome_options.add_argument("user-data-dir=C:\environments\selenium")
chrome_options.add_experimental_option("excludeSwitches", ['enable-automation'])
driver = webdriver.Chrome(executable_path=r'C:\Users\noahd\Downloads\chromedriver_win32 (1)\chromedriver.exe', chrome_options=chrome_options)
driver.get('https://njaurigue.github.io/FIRMWARE-ALPHA-DELTA/')
driver.fullscreen_window()

proximity = False
while True:
    if proximity:
        driver.find_element(By.CLASS_NAME, 'button').click()
    


time.sleep(200)