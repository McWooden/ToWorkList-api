import express from 'express'
const router = express.Router()
import { User } from './schema.js'
import { generate4DigitNumber } from './utils.js'

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
        password: req.body.password,
        tag: randomNumber
    })
    data.save()
    res.send({...data, message: 'Akun berhasil dibuat'})
})
export default router