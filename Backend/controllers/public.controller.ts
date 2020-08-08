//functions:

const home = (req: any, res: any) => {
    let test = req.headers['x-access-token'];
    console.log(test); //to see whether i really get a token in every route with interceptor.
    res.json({
        msg: 'Served main page for our website.'
    });    
};

const about = (req: any, res: any) => {
    res.json({
        msg: 'Served about page for our website'
    });   
}

//objects:
const publicController: any = {
    home,
    about
};

export {publicController};