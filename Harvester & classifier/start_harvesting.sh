#!/bin/bash
# A script which starts the harvesting processing
# Authors: Andres Chaves, Diego Montufar, Ilkan Esiyok, Gustavo Carrion, Clifford Siu
# ID’s: 706801, 661608, 616394,667597, 591158

initial_cuadrant="$1"
final_cuadrant="$2"

if [ $# -lt 2 ]
  then
    for((i=1;i<=10;i++)); do nohup python harvester_classifier.py ${i} 2>1 & done
  else if [ $# -eq 2 ]
  then
    for((i=$initial_cuadrant;i<=$final_cuadrant;i++)); do nohup python harvester_classifier.py ${i} 2>1 & done
  fi
fi

eval "./check_process.sh &"
