# air-backend-challenge

> Code challenge sample for Air

* Use npm OR yarn to install dependencies
 ``` bash
npm install
# or
yarn
```

## Run

Execute to start the server:
``` bash
npm start
# or
yarn start
```

The following is an example curl command to concatenate multiple video srcs, in the
order in which they are listed.  The local path of the concatenated file is returned
upon success.

> NOTE: all source files must be of the same dimensions (width + height)

```bash
curl -XPOST -H "Content-type: application/json" -d '{
    "urls": [
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
    ]
}' 'localhost:3000/video/concatenate'
```

## Implementation + Tradeoffs

To start with, an HTTP GET request is made asynchronously for each file requested.  When the
binary data has been retrieved/buffered for each file, it is written to a temporary file
with a randomly generated name, in order to prevent concurrent requests from potentially retrieving
different versions of the same source file (which should be highly unlikely).

An asynchronous ffmpeg command is then issued to merge/stitch the temporary files together in order, and then output
locally to a file with a unique name (to allow for concurrent requests).  An improvement would be to stitch together
any consecutive videos as they come in via multiple calls to ffmpeg, instead of waiting for all of the sources to be retrieved at once.  For an average use case of only needing to stitch together a couple of video sources, the added
code complexity seemed unnecessary for this exercise.