// IGNORE - was playing around allowing non-equal widths/heights between sources

export function getConcatArgs(paths: string[], output: string) {
    const args = [] as string[];

    paths.forEach(p => {
        args.push(...['-i', p]);
    });

    let filter = paths.reduce((prev, _, idx) => `${prev}[${idx}:v] [${idx}:a] `, `"`);
    filter += `concat=n=${paths.length}:v=1:a=1 [v] [a]"`;

    args.push('-filter_complex');
    args.push(filter);

    args.push('-map');
    args.push(`"[v]"`);

    args.push('-map');
    args.push(`"[a]"`);

    args.push(output);

    return args;
}
