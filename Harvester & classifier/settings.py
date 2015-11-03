#########################################################################################################
#
# Author: Gustavo Carrion
# Date: Aug-2015
# Name: settings.py
# Description: Configuration file that specifies generic harvest parameters like usernames / e-mails for automated responses
# Execution:   python harvester_classifier.py 1
#
#########################################################################################################



#Local CouchDB 
server = 'http://localhost:5984/'
vm_ip = 'node1:localhost' #just a description to be included on emails
database = '' #create empty
location = '' #create empty
admin_user = 'user' #Futon admin username
admin_pass = 'pass' #Futon admin pass

#create variables for each quadrant
consumer_key = '' #create empty
consumer_secret = '' #create empty
access_token = '' #create empty
access_secret = '' #create empty
region_quadrant = '' #create empty
#Bounding Box:
locations = [] #create empty

#Email default configurations:
smtp_server = 'smtp.gmail.com'
from_address = 'gcmlth2015@gmail.com'
to_address = 'gcarrion03@gmail.com'
from_password = '2015GCMLTH'
def_subject = 'Harvesting process status update'
smtp_port = 587

#Define Quadrant initialization:
# Description: 	Method to be called by the main harvester file this configuration file especifies the cuadrant for melbourne
#
def defineQuadrant(quadrant):

	global consumer_key
	global consumer_secret
	global access_token
	global access_secret
	global locations
	global location
	global database
	global region_quadrant

#harvester configuration
	if quadrant == '1': #single harvester setup
		database = 'test2' #name of the couchdb used to store tweets
		location = 'TEST' #emailing services description
		region_quadrant = '1' #description to be included on emailing services, may be the same as the value of quadrant
		consumer_key = 'EF6WH9n1hv0T8rAW3FqFWeFG6' #Twitter API user info. (example)
		consumer_secret = 'RmIDDsWpvR3QES64Sx6haMnqOG5BpZqOm0HjsqAMkQrlciqrth' #Twitter API user info. (example)
		access_token = '496692665-fsM9vJRP2S2FFDeGFd4ie3QdSZDYEJv5PD1jBadF' #Twitter API user info. (example)
		access_secret = 'qDMBmfraxTcGhY2BavCqt0rg9UMjow7oY8xnffWzBCTTe' #Twitter API user info. (example)
		#geo cuadrant:
		locations = [144.3336,-38.5030,145.8784,-37.1751] #Define a geo area to extract tweets from
