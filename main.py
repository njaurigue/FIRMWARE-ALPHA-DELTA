import keyboard #pip install keyboard
import time
from datetime import datetime, timedelta
#import board #pip install board
#import adafruit_hcsr04

#sonar = adafruit_hcsr04.HCSR04(trigger_pin = board.D5, echo_pin = board.D6)
#oldRead = sonar.distance  

#LOCAL TESTING VARIABLE (True if not working w/ pi)
testing = True
phoneIn = False
export = []

# Detection method funcitonal for testing and official use
#
# Parameters:
# phoneIn - whether phone is currently in or out of device
# testing - testing mode
def detect(phoneIn, testing):
    #OFFICIAL SENSOR INPUT (PROXIMITY SENSOR)
    if not testing:
        try:
            newRead = sonar.Distance
            if newRead != oldRead: #if phone detected
                print('DETECTED')
                countdown(10, phoneIn, testing)
                print('TIMER DONE')
        except RuntimeError:
            print('RUNTIME ERROR')
            time.sleep(2)
            
    #TESTING INPUT (SPACEBAR)     
    else:
        if keyboard.is_pressed(' '):
            print('DETECTED')
            if not phoneIn:
                t = countdown(10, testing)
                if t == 0:
                    print('TIMER DONE')
                else:
                    print('SESSION FAILED')
            return True

# Countdown timer, currently prints to terminal
#
# Parameters:
# t - number of seconds
# testing - testing mode
def countdown(t, testing):
    time.sleep(1)
    minutes = int(t/60)
    seconds = t%60
    now = datetime.now()
    later = now + timedelta(minutes = minutes, seconds = seconds)
    dictionary = {
        'start':now,
        'end':later
    }
    while now < later:
        if detect(True, testing):
            print('PHONE REMOVED')
            time.sleep(1)
            export.append(dictionary)
            print(later - datetime.now()) 
            return -1
        now = datetime.now()
        print(now.strftime("%H:%M:%S"))
    return 0

#def interrupt():

while True:
    detect(phoneIn, testing)
