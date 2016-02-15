## request-timeout-keepalive

drop in promise based replacement for 'request' module that makes it possible to specify underlying socket timeout (TCP_KEEPINTVL  and TCP_KEEPCNT)


```
const request = require('request-timeout-keepalive')
let result =  yield request({
    url  : "http://url",
    qs   : {
        movie_uid: movieUid,
        trailer: true,
        user_uid: userUid,
        user_ip: userIP,
        expires_at: moment(movieData[0].expires).format('X'),
        max_stream_count: 3
    },
    timeout: 1500, // request timeout (in cases where connection is established but invalid)
    json : true
}, {
	keepAliveInitialDelay: 1000, // initial delay (msecs) when to start sending keepalive packets
	keepAliveInterval: 1000, // delay between packates (msecs)
	keepAliveProbes: 1 // how many failed packets are needed before timeout is fired
})

// result.response contains underlying response from 'request' module
// result.body contains underlying body from 'request' module

```
