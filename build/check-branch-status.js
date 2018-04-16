let request = require("request");
let https = require("https");

const errHandler = function(err) {
    console.log(err);
}

function getBranch(url, auth) {
    // Setting URL and headers for request
    let options = {
        url: url,
        headers: {
            "User-Agent": "request",
            "Authentication": auth
        }
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
        // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

const getBranchStatus = async (branch, auth) => {
    const url = `https://api.github.com/repos/Microsoft/fast-dna/compare/master...${branch}`;

    try {
        // this parse may fail
        let data = JSON.parse(await getBranch(url, auth))

        if (data.status !== "ahead") {
            let errString = data.status === undefined ? 
                "Something went wrong - try restarting the build" : `Branch is currently ${data.status} - please rebase locally`

            console.log(errString);
            
            return process.exit(1);
        } else {
            console.log(`Branch is currently ${data.status}`);
        }
    } catch (err) {
        console.log(err)
    }
}


getBranchStatus(process.argv[2], process.argv[3]);