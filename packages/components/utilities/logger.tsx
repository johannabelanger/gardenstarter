export const log = (level: string, ...messages: (string | Object)[]) => {
    console.log(level.toUpperCase, ':', ...messages);
}