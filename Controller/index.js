const userSchema = require("../Schema")
const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');
const { upload } = require("../Upload/Upload");
const nodemailer = require("nodemailer")
const fs = require('fs');

// Get all user
exports.getListData = async (req, res) => {
    try {
        const result = await userSchema.find();
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}

// Create user
// exports.createUser = async (req, res) => {
//     try {
//         // Hash Password (bcrypt)
//         const hashedPassword = await bcrypt.hash(req.body.CreateUser.password, 10); // Hash password
//         const user = new userSchema({
//             name: req.body.CreateUser.name,
//             email: req.body.CreateUser.email,
//             password: hashedPassword,
//         })
//         const result = await user.save()
//         res.send(result)
//     } catch (error) {
//         // Check if email or name already exists
//         if (error.code === 11000) {
//             if (error.keyPattern.email === 1) {
//                 res.status(400).json({
//                     "Success": false,
//                     "message": "Email already exists"
//                 })
//                 return;
//             }
//             else if (error.keyPattern.name === 1) {
//                 res.status(400).json({
//                     "Success": false,
//                     "message": "Name already exists"
//                 })
//                 return;
//             }

//         } else {
//             res.status(400).json({
//                 "Success": false,
//                 "message": "Something went wrong"
//             })
//         }
//         res.send(error)
//     }
// }

// Create user & Update User with Flag
exports.createUser = async (req, res) => {
    if (req.body.Flag === "A") {
        try {
            // Hash Password (bcrypt)
            const hashedPassword = await bcrypt.hash(req.body.CreateUser.password, 10); // Hash password
            const user = new userSchema({
                name: req.body.CreateUser.name,
                email: req.body.CreateUser.email,
                password: hashedPassword,
            })
            const result = await user.save()
            res.send(result)
        } catch (error) {
            // Check if email or name already exists
            if (error.code === 11000) {
                if (error.keyPattern.email === 1) {
                    res.status(400).json({
                        "Success": false,
                        "message": "Email already exists"
                    })
                    return;
                }
                else if (error.keyPattern.name === 1) {
                    res.status(400).json({
                        "Success": false,
                        "message": "Name already exists"
                    })
                    return;
                }

            } else {
                res.status(400).json({
                    "Success": false,
                    "message": "Something went wrong"
                })
            }
            res.send(error)
        }
    }
    else {
        console.log("Flag=====>", req.body.Flag)
        try {
            const updateUser = await userSchema.findByIdAndUpdate(req.body.CreateUser._id, req.body.CreateUser, { new: true })
            console.log("Update User=====>", updateUser)
            res.status(200).json({
                "Success": true,
                "CreateUser": updateUser
            })
        } catch (error) {
            res.send(error)
        }
    }
}

// Get user by id
exports.getUserbyid = async (req, res) => {
    try {
        // const getUserById = await userSchema.findById(req.params._id) // (req.query.id) by this u can directly apply id(as u add in key) in parameters as key value pair and URL get it automatically from the parameters
        const getUserById = await userSchema.findById(req.query.id)  // (req.params._id) by this u can apply _id(as u got in res) in directly URL
        res.send(getUserById)
    } catch (error) {
        res.send(error)
    }
}

// Update user by id
exports.updateUser = async (req, res) => {
    try {
        const updateUser = await userSchema.findByIdAndUpdate(req.params._id, req.body, { new: true })
        res.status(200).json({
            "Success": true,
            "userData": updateUser
        })
    } catch (error) {
        res.send(error)
    }
}

// Delete user by id
exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await userSchema.findByIdAndDelete(req.params._id)
        res.status(200).json({
            "Success": true,
            "userData": deleteUser
        })
    } catch (error) {
        res.send(error)
    }
}

// Login user
exports.loginUser = async (req, res) => {
    try {
        const UserData = await userSchema.find();
        const user = UserData.find(data => data.email === req.body.email && data.password === req.body.password);
        const Token = jwt.sign({ user }, SECRET_JWT_CODE, { expiresIn: '1h' })
        if (user) {
            res.status(200).json({
                "Success": true,
                "userData": user,
                "token": Token
            })
        } else {
            res.status(401).json({
                "Success": false,
                "userData": "User not found"
            })
        }
    } catch (error) {
        res.send(error)
    }
}

// upload image
exports.uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({
            message: "Please Select File!"
        })

    }
    // if not image
    if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        res.send({
            "Success": false,
            "message": "Only image files are allowed!"
        })
        return;
    }
    try {
        const newFileUpload = new userSchema({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            profileImage: req.file.filename // Assuming Multer stores the file path in req.file (filename)
        })
        const saveFileUpload = await newFileUpload.save()
        res.status(200).json({
            "Success": true,
            "userData": saveFileUpload
        })
    } catch (error) {
        res.send(error)
    }
}

// Update user by id (form-data) (replace storage image)
exports.updateFormData = async (req, res) => {
    try {
        const user = await userSchema.findById(req.params._id);
        // Delete the old image if it exists
        const oldImgPath = './Upload/image' + user.profileImage;
        fs.unlink(oldImgPath, function (err) {
            if (err && err.code !== 'ENOENT') { // If error is not "File not found"
                console.error('Error deleting old image:', err);
            }
        });
        const updateUser = await userSchema.findByIdAndUpdate(req.params._id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            profileImage: req.file.filename
        }, { new: true })
        res.status(200).json({
            "Success": true,
            "userData": updateUser
        })
       

    } catch (error) {
        res.send(error)
    }
}

// delete form data (with delete image in storage)
exports.deleteFormData = async (req, res) => {
    try {
        const user = await userSchema.findById(req.params._id);
        // Delete the old image if it exists
        const oldImgPath = './Upload/image' + user.profileImage;
        fs.unlink(oldImgPath, function (err) {
            if (err && err.code !== 'ENOENT') { // If error is not "File not found"
                console.error('Error deleting old image:', err);
            }
        });
        const deleteUser = await userSchema.findByIdAndDelete(req.params._id)
        res.status(200).json({
            "Success": true,
            "userData": deleteUser
        })
    } catch (error) {
        res.send(error)
    }
}


exports.emailSend = (req, res) => {
    const { Text, Subject, To } = req.body
    let mailTransporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: 'ankit01.monarch@gmail.com',
                pass: 'shze ehbr srqt mkzw'
            }
        }
    );
    let mailDetails = {
        from: 'ankit01.monarch@gmail.com',
        to: To,
        subject: Subject,
        text: Text,
        attachments: [{
            filename: "image.png",
            path: "./Upload/image/1715152847679Hetik -Birthday (2).png"
        }]
    };
    mailTransporter
        .sendMail(mailDetails,
            function (err, data) {
                if (err) {
                    res.send('Email Send Failed !!');
                    return;
                } else {
                    res.send('Email sent successfully')
                    return;
                }
            });
}


