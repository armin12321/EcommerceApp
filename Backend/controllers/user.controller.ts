import path from 'path';
import User from '../models/user';

//functions:

const login = (req: any, res: any) => {
    res.json({
        msg: 'Served login page',
        data: req.body
    });
}

const register = (req: any, res: any) => {
    let sampleFile = req.files.file;
    const ext = path.extname(sampleFile.name);
    const avatarName = req.body.username + ext;
    let uploadPath = path.join(__dirname, '..', '/uploads/images/avatars/', avatarName);
    console.log(uploadPath);
    sampleFile.mv(uploadPath, function(err:any){
        if (err){
            return res.json({
                success: false,
                msg: 'Something went wrong while uploading profile image'
            });
        }        
    });
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatarName: avatarName
    });
    user.save();
    return res.json({
        success: true,
        msg: 'User registered successfully'
    });
}

const userController: any = {
    register,
    login        
};

export {userController};