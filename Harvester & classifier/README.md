Harvester & Classifier module
===================

- - - - 

This module pulls tweets provided by the Twitter streaming API corresponding to a particular bounding box.
During the process, each tweet will be analysed and then stored on a noSQL database (couchdb).

The process analyses 6 main features:

1. ID
2. Sentiment
3. Gender
4. Geo location
5. Calculate geo point if geo point is not provided by the tweet
6. Store the date in different format

- - - - 

## 1. Tweet Identification (ID):

Each tweet has its own ID. It is meant to be unique, so it is used as a document _id for the couchdb database as well.

## 2. Sentiment Analysis:

Sentiment Analysis is performed by a python open source library called tweet_classifier. It takes a text as parameter and returns a list with the sentiment results which includes a cleaned text, sentiment (positive,negative or neutral), polarity (a number between -1.0 and 1.0) and the subjectivity (0 - 100%). Concepts used by the library [TextBlob](http://textblob.readthedocs.org/en/dev/advanced_usage.html#sentiment-analyzers) are highly applied.

Further information: [tweet_classifier](https://github.com/diogonal/classifier), and [TextBlob](http://textblob.readthedocs.org/en/dev/)

## 3. Gender Analysis:

Althought gender is not provided on streamed tweets, this field can be guessed from information defined in the 'user' field. Generally, users put their real names on the 'user.name' field, so we can perform a quick tokenization on the text and use the genderizer open source library to compute the gender and inlcude it on the tweet before inserting on a database.

Genderizer uses NLTK tools to guess whether a first name is male or female. However, given that we cannot control which information is included in most of the fields defined on a tweet, we end up getting rubbish that cannot be processed accurately by the genderizer. In the case a name cannot be guessed, it will throw a null which will be inlcuded on the tweet as well. Anyhow, previous tests showed that 70% - 75% of the tweets have well defined user names, so results still be a richful source of information that may be used for data analysis later on.

Further information: [genderizer](https://github.com/muatik/genderizer)

## 4. Geo location:

Streamed tweets only correspond to a predefined bounding box. The API will allow us to pull 1% of the tweets falling inside the mentioned bounding box. Most of the time (if tweets have geo location activated) exact geotagged tweets have the 'coordinates' field populated with the exact location. However, sometimes they provide only an approximated location defined on the 'place.bounding_box.coordinates' filed. Such filed will be analysed and formatted as a GeoJson polygon, allowing us to analyse data considering more accurate positioning information.

## 5. Calculate geo point if geo point is not provided by the tweet:

Some tweets provides exact geo point but some are not. If a tweet does not have an exact geo point, this script will use the 4 points of bouding box to calculate the middle point of the bouding box, although this is just an assumption that the person sent the tweet at this point. However, this accuracy would be good enough for our project.
Using this approach, ll tweets would have the exact geo point inside the couchdb. Our team can then use this information to build scenarios and reports.

## 6. Store the date in different format:

By using the timestamp ms from the tweet, the script can generate some interesting data such as Date Type (Weekday and Weekday), Time Type (morning, afternoon, evening etc.). These information would be very useful when analysing the people's behaviour during different time in a day, especailly when we can use this data to combain with sentiment.

- - - - 

Check processes module
===================

While using tweepy to retrieve tweet from the tweeter server, it had beem found that the harvesting process may die randomly. This could be due to max. amount of tweet is reached (from each tweeter account, there is a limit) in a certain period or other unknown limitation.

Since, each harvester node is using 10 harvesting processes to retrieve tweet. Any termination of harvesting would reduce the amount of tweets which the project could receive. To maximise the uptime for these harvesting processes, this script had been created.

This script is responsible to check the harvesting process status regularly. It is using "ps -fu ubuntu" to achieve this purpose.
If it detects 1 or more harvest process is/are dead, it will start them automatically.

This script is running in a infinite loop (in order to check the status regularly) and should never to be terminated itself.

Note: This script will be started automatically when user launchs the start_harvesting.sh script and will be termianted when user launchs the stop_harvesting.sh.

- - - - 
