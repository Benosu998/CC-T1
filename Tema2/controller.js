const url = require('url');
var fs = require('fs');
var users = JSON.parse(fs.readFileSync('userData.json', 'utf8'));

// Get Collection
exports.getUsers = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    let response;
    response = [
        {
            "message": "Here are the list of user"
        },
        users
    ];
    res.statusCode = 200;
    res.setHeader('Content-Type', 'Application/json');
    res.end(JSON.stringify(response));
};

// Get Resource
exports.getUserById = function (req, res, id) {
    const reqUrl = url.parse(req.url, true);
    let response;
    if (isNaN(id)) {
        response = [
            {
                "message": "Paramenther provided is not a number"
            }
        ];
        res.statusCode = 400;
    } else {
        userData = 0;
        for (let obj of users) {
            if (obj["id"] === parseInt(id)) {
                userData = obj;
            }
        }
        if (userData === 0) {
            response = [
                {
                    "message": "User not found"
                }
            ];
            res.statusCode = 404;
        } else {
            response = [
                {
                    "message": "The user was found"
                }, userData
            ]
        }
    }

    res.setHeader('Content-Type', 'Application/json');
    res.end(JSON.stringify(response));
};

//Post Collection
exports.postUsers = function (req, res) {
    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        let response;
        postBody = JSON.parse(body);
        if (Array.isArray(postBody)) {
            for (let obj of postBody) {
                let F = doPost(obj);
                response = F[0];
                res.statusCode = F[1];
                if (F[1] === 400 || F[1] === 409) {
                    users = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
                    break;
                }
            }
        } else {
            if (typeof (postBody) === 'object') {
                let F = doPost(postBody);
                response = F[0];
                res.statusCode = F[1];
            } else {
                response = [
                    {
                        "message": "wrong format input data"
                    }
                ];
                res.statusCode = 400;
            }
        }
        var json = JSON.stringify(users);
        fs.writeFileSync('userData.json', json, 'utf8');
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response))
    })

};

// Post Resource
exports.postUserById = function (req, res, id) {
    body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        let response = [
            {
                "message": "Can't use post on resource"
            }
        ];
        res.statusCode = 405;
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response))
    });
};

// Put Collection
exports.put = function (req, res) {
    let response = [
        {
            "message": "Can't use put on collection"
        }
    ];
    res.statusCode = 405;
    res.setHeader('Content-Type', 'Application/json');
    res.end(JSON.stringify(response))
};

//Put Resource
exports.putUserById = function (req, res, id) {
    body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        let response;
        let postBody = JSON.parse(body);
        if (isNaN(id)) {
            response = [
                {
                    "message": "Invalid ID"
                }
            ];
            res.statusCode = 404;
        } else {
            let position = -1;
            for (let obj of users) {
                if (obj["id"] === parseInt(id)) {
                    position = users.indexOf(obj);
                    break
                }
            }
            if (position > -1) {
                users[position] = postBody;
                response = [
                    {
                        "message": " the user with the id requested was updated"
                    }
                ];
                var json = JSON.stringify(users);
                fs.writeFileSync('userData.json', json, 'utf8');
                users = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
                res.statusCode = 200;
            } else {
                response = [
                    {
                        "message": "The Id was not found"
                    }
                ];
                res.statusCode = 404;
            }
        }
        res.setHeader('content-Type', 'Application/json');
        res.end(JSON.stringify(response))
    });
};

// Delete Collection
exports.delete = function (req, res) {
    let response = [
        {
            "message": "Can't use delete on collection"
        }
    ];
    res.statusCode = 405;
    res.setHeader('Content-Type', 'Application/json');
    res.end(JSON.stringify(response))
};


//Delete Resource
exports.deleteUserById = function (req, res, id) {
    let response;

    if (isNaN(id)) {
        response = [
            {
                "message": "id requested not a number"
            }
        ];
        res.statusCode = 404;
    } else {
        let position = -1;
        for (let obj of users) {
            if (obj["id"] === parseInt(id)) {
                position = users.indexOf(obj);
                break
            }
        }
        if (position > -1) {
            users.splice(position, 1);
            response = [
                {
                    "message": " the user with the id requested was removed"
                }
            ];
            var json = JSON.stringify(users);
            fs.writeFileSync('userData.json', json, 'utf8');
            users = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
            res.statusCode = 200;
        } else {
            response = [
                {
                    "message": "The Id was not found"
                }
            ];
            res.statusCode = 404;
        }
    }
    res.setHeader('Content-Type', 'Application/json');
    res.end(JSON.stringify(response))
};

// Wrong Endpoint
exports.errorEndpoint = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    let response;
    response = [
        {
            "message": "Endpoint error"
        }
    ];
    res.statusCode = 400;
    res.setHeader('Content-Type', 'Application/json');
    res.end(JSON.stringify(response))

};


function checkIfId(id) {
    for (let obj of users) {
        if (obj["id"] === id) {
            return false;
        }
    }
    return true;
}

function doPost(obj) {
    let response;
    let statusCode;
    let keys = Object.keys(obj);
    if (keys[0] === 'id' && keys[1] === 'name' && keys[2] === 'password' && keys[3] === 'location' && keys.length === 4) {
        if (checkIfId(obj["id"])) {
            addNewUser(obj);
            response = [
                {
                    "message": "User inserted!"
                }
            ];
            statusCode = 201;
        } else {
            response = [
                {
                    "message": "Conflict, Id already used"
                }
            ];
            statusCode = 409;
        }
    } else {
        response = [
            {
                "message": "Bad format"
            }
        ];
        statusCode = 400;
    }
    return [response, statusCode]
}

function addNewUser(obj) {
    users.push(obj);
    users.sort((a, b) => (a.id < b.id) ? -1 : 1);
}