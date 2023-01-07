import express from 'express'
const router = express.Router()
import { User } from './schema.js'
import { generate4DigitNumber } from './utils.js'
import jwt_decode from "jwt-decode";

router.get('/avaible/:checkNickname', async (req, res) => {
    try {
        const user = await User.findOne({ nickname: new RegExp('^' + req.params.checkNickname + '$', 'i')})
        if (user) {
            console.log(user)
            res.status(404).send(`${req.params.checkNickname} sudah dipakai`)
        } else {
            res.send(`${req.params.checkNickname} tersedia`)
        }
    } catch (err) {
        res.status(404).send('Terjadi masalah saat mencari nickname')
    }
})

router.get('/emailExist/:checkEmail', async (req, res) => {
    try {
        const email = await User.findOne({ email: req.params.checkEmail})
        if (email) {
            console.log(email)
            res.status(404).send(`Email sudah pernah dipakai`)
        } else {
            res.send(`Email tersedia`)
        }
    } catch (err) {
        res.status(404).send('Terjadi masalah saat mencari email')
    }
})

router.put('/login/google', async (req, res) => {
    const credential = jwt_decode(req.body.credential)
    if (credential.email_verified) {
        try {
            const {_doc: user} = await User.findOne({ email: credential.email})
            if (user) {
                const {__v, password, ...account} = user
                console.log(account)
                res.send(account)
            } else {
                res.send(`Akun anda tidak ditemukan`)
            }
        } catch (err) {
            res.status(404).send('Akun tidak ditemukan')
        }
    } else {
        res.send('who are you?')
    }
})
router.put('/login/form', async (req, res) => {
    try {
        const {_doc: user} = await User.findOne({ password: req.body.password, nickname: new RegExp(`^${req.body.nickname}$`, 'i') })
        console.log(req.body)
        if (user) {
            const {__v, password, ...account} = user
            console.log(account)
            res.send(account)
        } else {
            res.send(`akun anda tidak ditemukan`)
        }
    } catch (err) {
        res.status(404).send('Terjadi masalah saat mencari akun')
    }
})

router.post('/', async (req, res) => {
    const old = await User.findOneAndUpdate({email: req.body.email}, {
        $set: {
            nickname : req.body.nickname,
            picture : req.body.picture,
            password : req.body.password
        }
    })
    console.log(old)
    if (old) return res.send({...old, message: 'Akun berhasil diperbarui'})
    const randomNumber = generate4DigitNumber()
    let data = new User({
        name: req.body.name,
        nickname: req.body.nickname,
        avatar: req.body.avatar,
        email: req.body.email,
        created_at: new Date().toLocaleDateString(),
        password: req.body.password,
        tag: randomNumber
    })
    data.save()
    res.send({...data, message: 'Akun berhasil dibuat'})
})
export default router