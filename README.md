# Station Clock

Swiss inspired train station clocks.

## URL PARAMS

Example: [https://stationclock.matoseb.com/?seconds=0&real=0&time=1600000000000&background=white&margin=1em&wait=0](https://stationclock.matoseb.com/?seconds=0&real=0&time=1600000000000&background=white&margin=1em&wait=0)

`seconds`: Show seconds. (0-1) Default: 1
`real`: Show real time. (0-1) Default: 1
`time`: Start time. Default: (millis) Date.now()
`background`: Background color. (css) Default: black
`margin`: Margin. Default: (css) 4em
`wait`: Wait delay. Default: (seconds) 1.5

## Iframe

Listen to the `message` event

Example:
```js
window.addEventListener("message", (event) => console.log(event.data));
```