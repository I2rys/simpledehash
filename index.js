(async()=>{
    "use strict"

    // Dependencies
    const { ArgumentParser } = require("argparse")
    const request = require("request-async")
    const { JSDOM } = require("jsdom")
    const fs = require("fs")
    
    // Variables
    const parser = new ArgumentParser()
    var args;
    
    // Functions
    async function dehash(hash){
        const response = await request.post("https://dehash.me/", {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                cookie: ".AspNetCore.Antiforgery.VyLW6ORzMgk=CfDJ8M5fxFjab2BFuDCTl4EAhnYfnhF089VRhOsYENwxrUmmYb4ii2b79yy4GXLobcZ0CWLHzhUNNEeQNcxNJ_SCB1LNmJbMMbLzCkdyQphvsNa-wjJquW9YCkFnQAfRxIu_g9RnqKyiC_m-D3Ds0m_o0KY; .AspNetCore.Session=CfDJ8M5fxFjab2BFuDCTl4EAhnaz%2BOWdLfbBtS2zvHZ9YMS7p2uHpXfGlO0XbRjivjAzGc5l40oe6bvAa8UKAXe3Ct1A7So645UM8A2XQbsHtuFWWx6UIXPWj3VhD76gQmaFuctClG006bI30hF7CHtUYJqy780%2BjwP3EJrMBQnP0WsS",
                referer: "https://dehash.me/"
            },
            body: `searchText=${hash}&dehash=Dehash+me+%21&__RequestVerificationToken=CfDJ8M5fxFjab2BFuDCTl4EAhnbZJ_EYXtRAYHxWAEb6p0cY8G-GUm2U7ULpHhHhwFJwIlW29AjKKrLAkvJEYPFpIQgPi9xCv98dUS3HyWj6IKga1XRfyOZdGw4nssRMLDl3qIMUEdxm4bSkGBXoPQ8btGw`
        })
    
        const dom = new JSDOM(response.body)
        
        try{
            const result = dom.window.document.querySelector("tr:nth-of-type(2) > td:nth-of-type(1)").textContent
            return result
        }catch{
            return false
        }
    }
    
    // Main
    parser.add_argument("-sh", "--singleHash", { help: "Any channel ID on the target server."})
    parser.add_argument("-mh", "--multiHash", { help: "The amount of junk log to send in the server's audit log." })
    
    args = parser.parse_args()
    
    if(args.singleHash){
        const result = await dehash(args.singleHash)
        result ? console.log(`Hash successfully dehashed. ${result}`) : console.log("Unable to dehash hash.")
    }else if(args.multiHash){
        const hashes = fs.readFileSync(args.multiHash, "utf8").replace(/\r/g, "").split("\n")
        if(!hashes.length) return console.log("No hash found in the file.")

        for( const hash of hashes ){
            const result = await dehash(hash)
            result ? console.log(`Hash ${hash} successfully dehashed. ${result}`) : console.log(`Unable to dehash ${hash}`)
        }
    }else{
        console.log("Please use at least 1 argument.")
    }
})()