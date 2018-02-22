#!/bin/bash

echo 20 > /sys/class/gpio/export
echo 21 > /sys/class/gpio/export

echo out > /sys/class/gpio/gpio20/direction
echo out > /sys/class/gpio/gpio21/direction

echo 0 > /sys/class/gpio/gpio20/value
echo 0 > /sys/class/gpio/gpio21/value

rm gpio20
rm gpio21

ln -s /sys/class/gpio/gpio20/value gpio20
ln -s /sys/class/gpio/gpio21/value gpio21

