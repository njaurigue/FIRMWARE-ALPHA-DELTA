from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver import Chrome
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
import RPi.GPIO as GPIO
import time

#GPIO SETUP
GPIO.setmode(GPIO.BOARD)

PIN_TRIGGER = 7
PIN_ECHO = 11

GPIO.setup(PIN_TRIGGER, GPIO.OUT)
GPIO.setup(PIN_ECHO, GPIO.IN)
GPIO.output(PIN_TRIGGER, GPIO.LOW)

time.sleep(2)

#Selenium Chrome Driver Setup
chrome_options = Options()
chrome_options.add_argument("user-data-dir=C:\environments\selenium")
chrome_options.add_experimental_option("excludeSwitches", ['enable-automation'])
driver = webdriver.Chrome(executable_path=r'C:\Users\noahd\Downloads\chromedriver_win32 (1)\chromedriver.exe', chrome_options=chrome_options)
driver.get('https://njaurigue.github.io/FIRMWARE-ALPHA-DELTA/')
driver.fullscreen_window()

# readSonar()
# Retrieve distance read from Sonar sensor
# return - distance in centimeters
def readSonar():
    try:
        print ("Calculating distance")

        GPIO.output(PIN_TRIGGER, GPIO.HIGH)

        time.sleep(0.00001)

        GPIO.output(PIN_TRIGGER, GPIO.LOW)

        while GPIO.input(PIN_ECHO)==0:
                pulse_start_time = time.time()
        while GPIO.input(PIN_ECHO)==1:
                pulse_end_time = time.time()

        pulse_duration = pulse_end_time - pulse_start_time
        distance = round(pulse_duration * 17150, 2)
        print ("Distance:",distance,"cm")
        return distance
    except:
        print("Sensor Read Failed")

while True:
    q = []
    q.append(readSonar())
    if(len(q) < 5):
        continue

    old = q.pop(0)
    if(old - q[-1] > 3):
        driver.find_element(By.ID, 'checkEnter').click()
    if(old -q[-1] < -3):
        driver.find_element(By.ID, 'checkExit').click()
    if(driver.find_element(By.ID, 'text').text == "ABORTING"):
        break
    time.sleep(1)

GPIO.cleanup()