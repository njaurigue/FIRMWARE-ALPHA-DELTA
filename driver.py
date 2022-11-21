from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
import time

chrome_options = Options()
chrome_options.add_argument("user-data-dir=C:\environments\selenium")
driver = webdriver.Chrome(executable_path=r'C:\Users\noahd\Downloads\chromedriver_win32 (1)\chromedriver.exe', chrome_options=chrome_options)
driver.maximize_window()
driver.get('https://ucsd.libcal.com/reserve')