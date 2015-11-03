#!/bin/bash

# Author: Diego Montufar, Clifford Siu, Gustavo Carrion, Andres Chaves, Ilkan Ilhof
# Date: 26/04/2015
# Ver: 0.2
#
# Description: This script will check the processes status on a defined period
#              If it dies, this script will re-start it again.
#              Force this script by running as background task using "&"
#


# Define constant variables
process="python harvester_classifier.py"
noOfProcess=10
interval=900
currentDir=`pwd`

while true;
do

  count=`ps -fu ubuntu | grep "$process" | grep -v 'grep' | wc -l`

  # Check if there are any processes got killed
  if [ $count -lt $noOfProcess ]
  then

    for ((i = 1; i <= $noOfProcess; i++))
    do
      # Confirmed that 1 or more processes had been killed
      # Find it and restart them individually
      if [ `ps aux | grep -w "$process $i" | grep -v 'grep' | wc -l` -lt 1 ]
      then
        eval $process $i &
        dateTime=`date +"%F %T"`
        echo "$dateTime: Restarted process $i" >> $currentDir/restart.log
      fi
    done

  else
    dateTime=`date +"%F %T"`
    echo "$dateTime: All OK!! Do nothing." >> $currentDir/restart.log
  fi

  sleep $interval
done
