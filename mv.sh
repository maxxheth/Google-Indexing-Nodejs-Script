#!/bin/bash

DIRS=$(ls)

for DIR in $DIRS
do
  if [[ $DIR != 'microservice' ]]; then

    mv $DIR microservice

  fi
done