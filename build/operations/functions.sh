#!/bin/bash

function debug_print() {

    [[ $debug == true ]] && echo "${bold}${green}$1"${reset}${unbold}
    [[ $debug == true ]] && echo $2

}
