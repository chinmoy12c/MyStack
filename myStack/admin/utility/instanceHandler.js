const process = require('child_process');
const crypto = require('crypto');

const authUtil = require('./authUtil');
const serverConstants = require('./serverConstants.js');

exports.resolveContainer = (stack) => {
    var containerName;
    switch(stack) {
        case 'TOM':
            containerName = 'tomstack';
            break;
        default:
            containerName = 'NOT_FOUND';
    }

    return containerName;
};

exports.runContainer = (req, res, containerName) => {
    const userData = authUtil.getUserData(req, res);
    var cmd = `${serverConstants.scriptsDir}/getFreePort.py`;
    process.exec(cmd,
    (err, stdout, stderr) => {
        if (err || stderr) {
            res.render('errorPage', {'errorMessage': 'Failed to launch instance! Please try again.'});
            return;
        }
        const port = stdout.trim();
        const containerTag = crypto.randomBytes(16).toString('hex');
        console.log(port);
        cmd = `${serverConstants.scriptsDir}/runContainer.sh -c ${containerName} -v ${userData.volume} -t ${containerTag}`;
        console.log(cmd);
        process.exec(cmd,
        (err, stdout, stderr) => {
            if (err || stderr) {
                res.render('errorPage', {'errorMessage': 'Failed to launch instance! Please try again.'});
                console.log(err ? err : stderr);
                return;
            }
            cmd = `${serverConstants.scriptsDir}/runCaddy.sh -u ${userData.email} -a ${containerTag} -k ${userData.caddyPass} -v ${userData.volume} -p ${port}`;
            console.log(cmd);
            process.exec(cmd,
            (err, stdout, stderr) => {
                if (err || stderr) {
                    res.render('errorPage', {'errorMessage': 'Failed to launch instance! Please try again.'});
                    console.log(err ? err : stderr);
                    return;
                }
                console.log(stdout);
                res.redirect(`http://${req.get('host').split(':')[0]}:${port}`);
            });
        });
    });
};