import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import axios from 'axios';
import fs from 'fs';
import Router from 'koa-router';
import tmp from 'tmp';

// wrap ffmpeg + ffprobe exe
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

interface ConcatenateRequest {
    urls: string[];
}

const _video = new Router({ prefix: '/video' });

_video.post('/concatenate', async (ctx) => {
    const { urls } = ctx.request.body as ConcatenateRequest;

    // create tmp file for each video src
    const files = await Promise.all(
        urls.map(async (u) => {
            // get raw binary data
            const response = await axios.get<Buffer>(u, {
                responseType: 'arraybuffer'
            });

            // write to disk
            const file = tmp.fileSync();
            fs.writeFileSync(file.fd, response.data);

            return file;
        })
    );

    let mergedFile = ffmpeg();

    // concatenate videos in sequential order
    for (const f of files) {
        mergedFile = mergedFile.mergeAdd(f.name);
    }

    // output and cleanup tmp files
    mergedFile
        .mergeToFile('./test.mp4')
        .on('end', () => {
            files.forEach(f => f.removeCallback);
        });

    // TODO: return file output path

    return;
});

export function video(router: Router): Router {
    return router.use(_video.routes());
}
