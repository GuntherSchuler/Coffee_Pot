#!/bin/bash

echo 1 > /sys/class/gpio/gpio20/value
echo 0 > /sys/class/gpio/gpio21/value
echo 1 > state
