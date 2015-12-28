'use strict'

const keepalive = require('net-keepalive')
const request = require('request')

module.exports = function(request_options, socket_options) {

    if(!socket_options)
        socket_options = {}

    if(socket_options.keepAliveInitialDelay === undefined)
        socket_options.keepAliveInitialDelay = 1000

    if(socket_options.keepAliveInterval === undefined)
        socket_options.keepAliveInterval = 1000

    if(socket_options.keepAliveProbes === undefined)
        socket_options.keepAliveProbes = 1

    return new Promise(function(resolve, reject) {
        let req = request(request_options, function(error, response, body) {
            if (error) {
                return reject(error)
            }

            resolve({
                response: response,
                body: body
            })
        })

        req.on('socket', function(socket) {
            console.log(socket_options)
            socket.setKeepAlive(true, socket_options.keepAliveInitialDelay)
            keepalive.setKeepAliveInterval(socket, socket_options.keepAliveInterval)
            keepalive.setKeepAliveProbes(socket, socket_options.keepAliveProbes)
        })

        req.on('error', function(error) {
            reject(error)
        })
    })
}
