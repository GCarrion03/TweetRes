#!/bin/bash
#
# Author: Diego Montufar, Clifford Siu, Gustavo Carrion, Andres Chaves, Ilkan Ilhof
# Date: 12/05/2015
# Ver: 0.1
#
# Description: This is the script to check if the running harvestors.
#              If the harvestor is dead, this node should take over the task and
#              contiune with the harvesting.
#              harvest1<=>harvest3 and harvest2<=>harvest4
#
#              Command Example: bash redundancy_check.sh 1 & 
#              This command will allow this script to check against harvest node 1
#

# constants variables for this project
harvestorDir="/home/ubuntu/EdinburghSentimentAnalysis/harvester"
pem_key="project-key.pem";
startScript="start_harvesting.sh"
stopScript="stop_harvesting.sh"
timeoutSecond=10
interval=120

port=5984

# retrieve the proper ip address for the target node
if [ $# -gt 0 ]
then

  if [ $1 -eq 1 2>/dev/null ]
  then
    ip="144.6.227.59"
  elif [ $1 -eq 2 2>/dev/null ]
  then
    ip="144.6.225.130"
  elif [ $1 -eq 3 2>/dev/null ]
  then
    ip="144.6.227.131"
  elif [ $1 -eq 4 2>/dev/null ]
  then
    ip="144.6.227.126"
  else
    echo "Error: Wrong input. Expecting an argument (1 to 4)!"
    exit
  fi

else
  echo "Error: Wrong input. Expecting an argument (1 to 4)!"
  exit  
fi

# infinite loop to check the status of remote machine
while true;
do
  # Check if the remote's couchdb is responding
  curl --connect-timeout $timeoutSecond http://$ip:$port 2>/tmp/check_remote.log

  # Try to login to remote to stop the harvesting process
  # if the remote's couchdb is not responding
  if grep -q 'timed out' /tmp/check_remote.log
  then
    echo "No response from the Harvestor's couchdb!"
    echo "Trying to login and stop harvesting processes...."

    # Try to ssh and close the harvesting procsses manually
    # If ssh is timed out, that means the remote node is dead, do nothing.
    ssh -i $harvestorDir/$pem_key -o "StrictHostKeyChecking no" -o ConnectTimeout=$timeoutSecond ubuntu@$ip "/bin/bash $harvestorDir/$stopScript"

    echo "Start the local harvesting processes now...."

    # Start the local harvesting processes
    bash $harvestorDir/$startScript

    # Exit the script as we are no longer need to check the remote's status
    exit    
  fi

  # Remote server is responding, wait for the next check
  echo "Remote node is OK, wait for $interval seconds...."
  sleep $interval
  
done 

