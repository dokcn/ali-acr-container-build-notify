const server = require('server');
const shell = require('shelljs');
const { get, post } = server.router;

server({
    port: 8000,
    security: {
        csrf: false,
    },
}, [
    get('/test', ctx => "test"),
    post('/receive', ctx => {
        const tag = "latest";
        const repoName = "dokcn-repo/wechat-channels";

        const data = ctx.data;
        console.log(data);

        if (data.push_data.tag === tag && data.repository.repo_full_name === repoName) {
            const commands = [
                'docker pull registry.cn-beijing.aliyuncs.com/dokcn-repo/wechat-channels:latest',
                'docker tag registry.cn-beijing.aliyuncs.com/dokcn-repo/wechat-channels:latest wechat',
                'docker rm -f wechat',
                'docker run --detach --name wechat --hostname ubuntu --restart=unless-stopped -p 9000:9000 wechat',
            ];

            commands.forEach(command => {
                console.log(command);
                shell.exec(command);
                console.log();
            });
        }
        return "done";
    }),
]);

