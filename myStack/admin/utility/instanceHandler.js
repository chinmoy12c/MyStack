const process = require('child_process');
const crypto = require('crypto');

const authUtil = require('./authUtil.js');
const serverConstants = require('./serverConstants.js');
const dbHandler = require('./dbHandler.js');

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

exports.resolveStackIcon = (stack) => {
    var stackIcon;
    switch(stack) {
        case 'tomstack':
            stackIcon = 'https://www.itzgeek.com/wp-content/uploads/2014/03/Tomcat-Logo.jpg';
            break;
    }

    return stackIcon;
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
            const caddyName = crypto.randomBytes(16).toString('hex');
            cmd = `${serverConstants.scriptsDir}/runCaddy.sh -u ${userData.email} -n ${caddyName} -a ${containerTag} -k ${userData.caddyPass} -v ${userData.volume} -p ${port}`;
            console.log(cmd);
            process.exec(cmd,
            (err, stdout, stderr) => {
                if (err || stderr) {
                    res.render('errorPage', {'errorMessage': 'Failed to launch instance! Please try again.'});
                    console.log(err ? err : stderr);
                    return;
                }
                dbHandler.recordInstance(req, res, userData, caddyName, containerTag, containerName);
                console.log(caddyName);
                res.redirect(`http://${req.get('host').split(':')[0]}:${port}`);
            });
        });
    });
};