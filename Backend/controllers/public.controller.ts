//functions:

const home = (req: any, res: any) => {
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