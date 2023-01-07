from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import RPi.GPIO as GPIO
import time

from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys

#GPIO SETUP
GPIO.setmode(GPIO.BOARD)

PIN_TRIGGER = 7
PIN_ECHO = 11

GPIO.setup(PIN_TRIGGER, GPIO.OUT)
GPIO.setup(PIN_ECHO, GPIO.IN)
GPIO.output(PIN_TRIGGER, GPIO.LOW)
button3 = 16
button4 = 37
button1 = 31
button2 = 29
GPIO.setup(button3, GPIO.IN, pull_up_down = GPIO.PUD_UP)
GPIO.setup(button4, GPIO.IN, pull_up_down = GPIO.PUD_UP)
GPIO.setup(button1, GPIO.IN, pull_up_down = GPIO.PUD_UP)
GPIO.setup(button2, GPIO.IN, pull_up_down = GPIO.PUD_UP)

time.sleep(2)

#Selenium Chrome Driver Setup
options = Options()
options.add_experimental_option("excludeSwitches", ['enable-automation'])
driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
driver.implicitly_wait(5)
driver.get('https://njaurigue.github.io/FIRMWARE-ALPHA-DELTA/')
driver.fullscreen_window()

actions = ActionChains(driver)
actions.send_keys(Keys.F11).perform()

# readSonar()
# Retrieve distance read from Sonar sensor
# return - distance in centimeters
def readSonar():
    try:
        print("Calculating distance")

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

loggedIn = False
while not loggedIn:
    time.sleep(1)
    x = 0
    if GPIO.input(button1) == 0:
        x=1
        driver.find_element(By.ID, 'B1').click()
    if GPIO.input(button2) == 0:
        x=2
        driver.find_element(By.ID, 'B2').click()
    if GPIO.input(button3) == 0:
        x=3
        driver.find_element(By.ID, 'B3').click()
    if GPIO.input(button4) == 0:
        x=4
        driver.find_element(By.ID, 'B4').click()
        loggedIn = True
    if x != 0:
        print(x)

q = []
first = False
while True:
    time.sleep(1)
    driver.find_element(By.ID, 'updateDate').click()
    #Check for button input
    x = 0
    if GPIO.input(button1) == 0:
        x=1
        driver.find_element(By.ID, 'B1').click()
    if GPIO.input(button2) == 0:
        x=2
        driver.find_element(By.ID, 'B2').click()
    if GPIO.input(button3) == 0:
        x=3
        driver.find_element(By.ID, 'B3').click()
    if GPIO.input(button4) == 0:
        x=4
        driver.find_element(By.ID, 'B4').click()
    if x != 0:
        print(x)

    #Update Sonar readings
    q.append(readSonar())
    if first == False:
        q.pop(0)
        first = True
        continue
    if(len(q) < 5):
        continue

    old = q.pop(0)
    if(old - q[-1] > 10):
        driver.find_element(By.ID, 'checkEnter').click() #PHONE ENTERS
    if(old - q[-1] < -10):
        driver.find_element(By.ID, 'checkExit').click()  #PHONE EXITS
    if(driver.find_element(By.ID, 'text').get_attribute('innerHTML') == "ABORTING"):
        break

GPIO.cleanup()