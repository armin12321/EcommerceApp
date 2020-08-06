//functions

const root = (req: any, res: any) => {
    res.redirect('/public/home');
};

const rootController: any = {
    root
};

export {rootController};