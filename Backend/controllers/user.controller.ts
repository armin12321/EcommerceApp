//functions:

const login = (req: any, res: any) => {
    res.json({
        msg: 'Served login page',
        data: req.body
    });
}

const register = (req: any, res: any) => {
    res.json({
        msg: 'Served register page',
        data: req.body
    });
}

const userController: any = {
    register,
    login        
};

export {userController};