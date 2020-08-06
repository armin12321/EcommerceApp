//functions:

const login = (req: any, res: any) => {
    res.send({
        msg: 'Served login page'
    });
}

const register = (req: any, res: any) => {
    res.send({
        msg: 'Served register page'
    });
}

const userController: any = {
    register,
    login        
};

export {userController};