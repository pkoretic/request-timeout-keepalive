'use strict'

const keepalive = require('net-keepalive')
const request = require('request')

module.exports = function(request_options, socket_options) {

    if(!socket_options)
        socket_options = {}

    if(socket_options.keepAliveInitialDelay === undefined)
        socket_options.keepAliveInitialDelay = 5000

    if(socket_options.keepAliveInterval === undefined)
        socket_options.keepAliveInterval = 2500

    if(socket_options.keepAliveProbes === undefined)
        socket_options.keepAliveProbes = 2

    if(request_options.timeout === undefined)
        request_options.timeout = 5000

    return new Promise(function(resolve, reject) {
        let req = request(request_options, function(error, response) {
            if (error)
                return reject(error)
            else
                resolve(response)
        })

        req.on('socket', function(socket) {

            function setOptions() {
                if(process.env.NODE_ENV ===  'development')
                    console.info("request-timeout-keepalive: ", socket_options)

                try {
                    socket.setKeepAlive(true, socket_options.keepAliveInitialDelay)
                    keepalive.setKeepAliveInterval(socket, socket_options.keepAliveInterval)
                    keepalive.setKeepAliveProbes(socket, socket_options.keepAliveProbes)
                }
                catch(error) {
                    console.warn("Unable to set keepalive on connection socket:", error.message)
                }
            }

            // if domain is used instead of ip address, file descriptor is not ready because DNS
            // resolve is still in progress so we wait for connect signal which will in turn give
            // valid file descriptor
            if(socket._handle.fd != -1)
                setOptions()
            else
                socket.on('connect', function() { setOptions() })
        })

        req.on('error', function(error) {
            reject(error)
        })
    })
}
