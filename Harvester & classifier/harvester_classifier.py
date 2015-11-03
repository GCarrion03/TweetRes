#########################################################################################################
#
# Authors:          Diego Montufar, Clifford Siu, Gustavo Carrion, Andres Chaves, Ilkan Ilhof
# Date:             Apr/2015
# Name:             harvester_classifier.py
# Description:      Performs Sentiment, geo location and gender analysis for streamed tweets as they come.
#                   Logs will be written in a file for each quadrant defined in the settings i.e. log_harvester_TEST_1.txt
#
# Execution:        python harvester_classifier.py 1
# Output:           log_harvester_TEST_1.txt
#
#########################################################################################################
import json #json docs
import traceback #Exception info
#Twitter Streaming API connection
from tweepy.streaming import StreamListener
from tweepy import Stream, OAuthHandler
import couchdb #couchdb connection
import settings #settings defining quadrants, API keys and tokens
import emailer #emailing services
import time #record date and time
import atexit #catch termination
import random #generate random process ID
import sys #sys
from signal import signal, SIGTERM #detect termination by the system
from sys import exit
import tweet_classifier.classifier as classifier #Sentiment Classifier
from genderizer.genderizer import Genderizer #Gender classifier
import pytz #World timezone
import datetime #Datetime utils
import math #Math functions

proc_id = int(random.random() * 1000) #Assign process id as identification for this program instance
quadrant = str(sys.argv[1]) #get the quadrant argument from command line
settings.defineQuadrant(quadrant) #Assign corresponding quadrant to this process

#Streaming twitter API Listener
class listener(StreamListener):
    sys.stdout.write("listener launched...")
    #Statistics
    tweet_count = 0
    processed_tweets = 0
    ignored_tweets = 0
    
    def on_data(self, data):
	sys.stdout.write("loading data rom one tweet")
	writeLog("loading data rom one tweet")
        #Load Json from Twitter API
        tweet = json.loads(data)
        try:
            tweet["_id"] = str(tweet['id']) #Get the ID
            lang = tweet['lang']
            name = tweet['user']['name']

            #Gender Analysis:
            name_list = name.split()
            name = name_list[0]

            gender = Genderizer.detect(firstName = name)
            tweet['user']['gender'] = gender

            #Sentiment Analysis
            analysed_result = classifier.doSentimentAnalysis(str(tweet['text']))

            if str(lang) == 'en': #only analyse english texts
                if not hasAlreadySentiment(tweet):
                    tweet = updateSentimentDoc(tweet,analysed_result["sentiment"],analysed_result["polarity"],analysed_result["subjectivity"])
                    self.processed_tweets += 1
                else:
                    self.ignored_tweets += 1
            else: #otherwise ignore it!
                self.ignored_tweets += 1

            #Update place coordinates to work with GeoJson
            tweet = updatePlaceDoc(tweet)
            tweet = updateCoordinate(tweet)

            #Update date fields for better reporting
            tweet = updateDateDay(tweet)
            #Update Sentiment
            tweet = updateSentiment(tweet)

            doc = db.save(tweet) #Save tweet into CouchDB
            print("Obtained Tweet ID: " + str(tweet['id']))
            self.tweet_count += 1
            if (self.tweet_count%10000 == 0):
                #Notify when 10000 new tweets have been stored on database
                msg_update = '10K new tweets on database: ' + settings.database
                #emailer.sendEmail(message=str(msg_update))
        except:
            sys.stdout.write("Twitter API error")
            writeLog("Twitter API error")
            pass
        return True
    
    def on_error(self, status):
        sys.stdout.write("Error during streaming "+str(status)+str(self))
        writeLog("Error during streaming "+str(status))
        sys.exit()

#Write info to the log file
def writeLog(msg):
    file_name = "log_harvester_" + settings.location + "_" + settings.region_quadrant + ".dat"
    with open(file_name, "a") as myfile:
        myfile.write(msg + "\n")
    myfile.close()

#Verify if tweet has already sentiment analysis field
def hasAlreadySentiment(doc):
    try:
        obj = doc["sentiment_analysis"]
    except KeyError:
        return False

    return True

#Update Document with new fields (sentiment results)
def updateSentimentDoc(doc,sentiment,polarity,subjectivity):
    doc["sentiment_analysis"] = json.loads('{"sentiment": "%s","polarity": %.2f,"subjectivity": %.2f}' % (sentiment,polarity,subjectivity))
    return doc

#Update the Palce field of the tweet when it is populated in order to follow GeoJson format for polygons
def updatePlaceDoc(doc):
    if doc["place"] is not None:
        place_coordinates = doc["place"]["bounding_box"]["coordinates"][0]
        tmp_coordinates = []
        if place_coordinates[0] != place_coordinates[1]:
            tmp_coordinates.insert(0,place_coordinates[0])
            tmp_coordinates.insert(1,place_coordinates[1])
            tmp_coordinates.insert(2,place_coordinates[2])
            tmp_coordinates.insert(3,place_coordinates[3])
            tmp_coordinates.insert(4,place_coordinates[0])
            doc["place"]["bounding_box"]["coordinates"][0] = tmp_coordinates
        else:
            doc["place"]["bounding_box"] = None
    return doc

#Update Document with new fields (date information)
def updateDateDay(doc):

  time = retrieveDateTime(doc)
  # remove milliseconds to avoid error
  timestamp = time[0:-3]

  hour_only = int(datetime.datetime.fromtimestamp(int(timestamp),tz=pytz.utc).strftime('%H'))
  day = datetime.datetime.fromtimestamp(int(timestamp),tz=pytz.utc).strftime('%A')

  time_no_second = datetime.datetime.fromtimestamp(int(timestamp),tz=pytz.utc).strftime('%H:%M')
  date_only = datetime.datetime.fromtimestamp(int(timestamp),tz=pytz.utc).strftime('%Y-%m-%d')

  # Define time_type using hour_only
  if hour_only <= 2:
    time_type = "midnight"
  elif hour_only <= 5:
    time_type = "late night"
  elif hour_only <= 10:
    time_type = "morning"
  elif hour_only <= 13:
    time_type = "noon"
  elif hour_only <= 17:
    time_type = "afternoon"
  elif hour_only <= 19:
    time_type = "evening"
  else:
    time_type = "night"

  if day.lower() == "saturday" or day.lower() == "sunday":
    day_type = "weekend"
  else:
    day_type = "weekday"

  doc["date"] = json.loads('{"time_no_second": "%s","time_type": "%s","date_only": "%s", "day_type": "%s"}' % (time_no_second,time_type,date_only,day_type))

  return doc

#Find a midpoint of the bounding box
def updateCoordinate(doc):

  # Check if coordinates is provided. Create one if it doesn't
  if doc["coordinates"] is None:
    place_coordinates = doc["place"]["bounding_box"]["coordinates"][0]

    # Use two points to calcuate the midpoint, assume it is a rectangle or sqare
    lat, lon = getMidPoint(place_coordinates[0][0],place_coordinates[0][1],place_coordinates[2][0],place_coordinates[2][1])

    doc["coordinates"] = json.loads('{"type": "Point","coordinates":[%f,%f]}' % (lat,lon))

  return doc


#Update Document with new fields (sentiment results)
def updateSentiment(doc):

  sentiment = retrieveSentiment(doc)

  # This will be useful to positive/negative sentiment in an area
  if sentiment.lower() == "positive":
    sentiment_num = 1
  elif sentiment.lower() == "negative":
    sentiment_num = -1
  else:
    sentiment_num = 0
    
  doc["sentiment_analysis"]["sentiment_num"] = sentiment_num

  return doc

#Get the document's sentiment
def retrieveSentiment(doc):
  sentiment = doc['sentiment_analysis']['sentiment']
  return sentiment

#Get the document's timestamp ms
def retrieveDateTime(doc):
  timestamp = doc['timestamp_ms']
  return timestamp

#Input values as degrees
def getMidPoint(x1, y1, x2, y2):

   lat1, lat2 = math.radians(x1), math.radians(x2)
   lon1, lon2 = math.radians(y1), math.radians(y2)
   dlon = lon2 - lon1
   dx = math.cos(lat2) * math.cos(dlon)
   dy = math.cos(lat2) * math.sin(dlon)
   lat3 = math.atan2(math.sin(lat1) + math.sin(lat2), math.sqrt((math.cos(lat1) + dx) * (math.cos(lat1) + dx) + dy * dy))
   lon3 = lon1 + math.atan2(dy, math.cos(lat1) + dx)
   return(math.degrees(lat3), math.degrees(lon3))

#Instance Listener object
listnerTweet = listener()

#Handler function to perform in case of program interruption
def exit_handler():
    error_msg = 'Server has interrupted harvesting process. \n'
    error_msg = error_msg + 'Process terminated at: ' + time.strftime('%c') + '\n'
    error_msg = error_msg + 'Location: ' + settings.location + ', Quadrant: ' + settings.region_quadrant + '\n'
    error_msg = error_msg + 'VM: ' + settings.vm_ip + '\n'
    error_msg = error_msg + 'Process Id: ' + str(proc_id) + '\n'
    error_msg = error_msg + 'Total tweets received: %d' % listnerTweet.tweet_count 
    writeLog(error_msg)
    #emailer.sendEmail(message=str(error_msg))
    writeLog("--------------------------------------")


#Starting process
writeLog("--------------------------------------")
writeLog("Starting streaming process...")
sys.stdout.write("Starting streaming process...")
atexit.register(exit_handler)
signal(SIGTERM, exit_handler)
#API authentication
sys.stdout.write("1---"+settings.consumer_key+"||"+settings.consumer_secret)
auth = OAuthHandler(settings.consumer_key,settings.consumer_secret)
sys.stdout.write("2---"+settings.access_token+"||"+settings.access_secret)
auth.set_access_token(settings.access_token,settings.access_secret)
sys.stdout.write("3")
twitterStream = Stream(auth, listnerTweet)
#Streams not terminate unless the connection is closed, blocking the thread. 
#Tweepy offers a convenient async parameter on filter so the stream will run on a new thread.
#twitterStream.filter(locations=[145.0544,-39.1549,148.2020,-35.7746])
sys.stdout.write("4")
server = couchdb.Server(settings.server)
sys.stdout.write("5")
server.resource.credentials = (settings.admin_user, settings.admin_pass)


try:
    #Create DB if does not exist
    sys.stdout.write(settings.database)
    db = server.create(settings.database)
    sys.stdout.write("Database: created")
    writeLog("Database: " + settings.database + " doesn't exist. Proceeding with creation...")
except:
    #Just use existing DB
    db = server[settings.database]
    notice_msg = 'Server has initiated harvesting process \n'
    notice_msg = notice_msg + 'Process initiated at: ' + time.strftime('%c') + '\n'
    notice_msg = notice_msg + 'Location: ' + settings.location + ', Quadrant: ' + settings.region_quadrant + '\n'
    notice_msg = notice_msg + 'Process Id: ' + str(proc_id) + '\n'
    notice_msg = notice_msg + 'Server: ' + settings.server + '\n'
    notice_msg = notice_msg + 'Database: ' + settings.database + '\n'
    notice_msg = notice_msg + 'VM: ' + settings.vm_ip + '\n'
    writeLog(notice_msg)
    #emailer.sendEmail(message=str(notice_msg))
try:
    twitterStream.filter(locations=settings.locations)
except Exception, err:
    print(traceback.format_exc())
    raise

