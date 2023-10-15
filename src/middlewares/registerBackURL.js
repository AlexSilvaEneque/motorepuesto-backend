const registerBackURL = (req, res, next) => {
    
    if (!req.headers.backurl && req.headers.backurl != '') {
        
        req.backURLFrontend = req.headers.backurl
        console.log(req.backURLFrontend)
        // next()
    }
        
        next()
    
}

export default registerBackURL