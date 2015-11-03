#!/bin/bash
# A script which stops the harvesting processing
# Authors: Andres Chaves, Diego Montufar, Ilkan Esiyok, Gustavo Carrion, Clifford Siu
# ID’s: 706801, 661608, 616394,667597, 591158

# Kill the re-start process
ps -fu ubuntu | grep check_process | grep -v "grep" | sed 's/  */ /g' | cut -d' ' -f2 | xargs kill -9

for pid in $(ps -ef | grep "harvester_classifier.py" | grep -v "grep" | awk '{print $2}')
do
  kill -15 $pid
done
