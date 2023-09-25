import express from 'express'
const router = express.Router()
import User from '../database/schema/UserSchema.js'
import { encrypt, generate4DigitNumber } from '../utils/utils.js'
import jwt_decode from "jwt-decode"

router.post('/', async (req, res) => {
    try {
        const jwt = jwt_decode(req.body.user)
        const emailExists = await User.findOne({ email: jwt.email })

        if (emailExists) {
            return res.status(409).send('Email sudah pernah dipakai')
        }

        const randomNumber = generate4DigitNumber()
        let data = new User({
            name: jwt.name,
            nickname: jwt.given_name,
            avatar: jwt.picture,
            email: jwt.email,
            password: null,
            panggilan: '',
            tempat: '',
            posisi: '',
            kota: '',
            negara: jwt.locale,
            bio: `Hello ${jwt.given_name}`,
            label: ['Pengguna baru'],
            pengikut: [],
            tag: randomNumber,
        })

        const savedUser = await data.save()
        let { password, ...rest } = savedUser._doc
        res.json({ account: encrypt(rest), message: 'Akun berhasil dibuat' })
    } catch (err) {
        console.error(err)
        res.status(500).send('Terjadi masalah saat membuat akun')
    }
})


router.get('/avaible/:checkNickname', async (req, res) => {
    try {
        const user = await User.findOne({ nickname: new RegExp('^' + req.params.checkNickname + '$', 'i')})
        if (user) {
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
            const user = await User.findOne({ email: credential.email})
            if (user) {
                if (user.avatar !== credential.picture) {
                    user.avatar = credential.picture
                    await user.save()
                }
                const data = {...user._doc}
                delete data.password
                res.json({account: encrypt(data)})
            } else {
                res.send(`Akun anda tidak ditemukan`)
            }
        } catch (err) {
            console.log(err)
            res.status(404).send('Akun tidak ditemukan')
        }
    } else {
        res.send('who are you?')
    }
})

router.put('/login/form', async (req, res) => {
    try {
        const {_doc: user} = await User.findOne({ password: req.body.password, nickname: new RegExp(`^${req.body.nickname}$`, 'i') })
        const {__v, password, ...account} = user
        res.json({account: encrypt(account)})
    } catch (err) {
        console.log(err, req.body.password, req.body.nickname)
        res.status(404).send('akun tidak ditemukan')
    }
})

router.put('/pemulihan', (req, res) => {
    const credential = jwt_decode(req.body.credential)
    if (credential.email_verified) {
        User.findOne({ email: credential.email }, (error, user) => {
            if (error) {
                res.status(500).send('Terjadi kesalahan saat mencari akun')
            } else if (!user) {
                res.status(404).send('Akun tidak ditemukan')
            } else {
                const { __v, password, ...account } = user._doc
                res.json({account: encrypt(account)})
            }
        })
    } else {
        res.send('who are you?')
    }
})

router.post('/pemulihan', (req, res) => {
    User.findOneAndUpdate(
        { email: req.body.email },
        { password: req.body.password },
        { new: true },
        (error, user) => {
            if (error) {
                res.status(500).send('Terjadi kesalahan saat mengganti password')
            } else if (!user) {
                res.status(404).send('Akun tidak ditemukan')
            } else {
                delete user.password
                res.json({account: encrypt(user)})
            }
        }
    )
})
router.post('/change_password', async (req, res) => {
    try {
        const { _id, oldPassword, newPassword } = req.body

        const user = await User.findOne({_id})

        if (!user) return res.send('Akun tidak ditemukan')

        const isPasswordMatch = user.password === oldPassword || user.password === null

        if (!isPasswordMatch) return res.send('Password lama tidak cocok')

        // Mengganti password dengan yang baru
        user.password = newPassword
        user.last_changes.password_change_date = new Date().toISOString()
        const updatedUser = await user.save()
        const {password, ...rest} = updatedUser

        // Mengembalikan respons sukses
        res.json({ account: encrypt(rest._doc) })
    } catch (error) {
        console.error(error)
        res.status(500).send('Terjadi kesalahan saat mengganti password')
    }
})

router.delete('/delete_password/:id', async (req, res) => {
    try {
      const { id } = req.params
  
      // Cari pengguna berdasarkan ID
      const user = await User.findByIdAndUpdate(
        id,
        { $set: { password: null, 'last_changes.password_change_date': new Date().toISOString() } }
      )
  
      if (!user) return res.status(404).json({ message: 'Pengguna tidak ditemukan' })
  
      res.json({ message: 'Password berhasil dihapus', user })
    } catch (error) {
      console.error(error)
      res.status(500).send('Terjadi kesalahan saat menghapus password')
    }
}) 

router.put('/', async (req, res) => {
    const { panggilan, tempat, posisi, kota, negara, bio, _id } = req.body
    try {
      const updatedUser = await User.findByIdAndUpdate(_id, { panggilan, tempat, posisi, kota, negara, bio }, { new: true })
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' })
      }
      let {password, ...rest} = updatedUser
      return res.json({account: encrypt(rest._doc)})
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Server error' })
    }
})
router.put('/nickname', async (req, res) => {
    const { nickname, _id } = req.body
    try {
      const updatedUser = await User.findByIdAndUpdate(_id, { nickname, 'last_changes.nickname_change_date': new Date().toISOString() }, { new: true })
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' })
      }
      let {password, ...rest} = updatedUser
      return res.json({account: encrypt(rest._doc)})
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Server error' })
    }
})
router.put('/label', async (req, res) => {
    const { label, _id } = req.body
    try {
      const updatedUser = await User.findByIdAndUpdate(_id, { $set: {'label': label} }, { new: true })
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' })
      }
      let {password, ...rest} = updatedUser
      return res.json({account: encrypt(rest._doc)})
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Server error' })
    }
})
router.put('/bio', async (req, res) => {
    const { bio, _id } = req.body
    try {
      const updatedUser = await User.findByIdAndUpdate(_id, { bio }, { new: true })
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' })
      }
      let {password, ...rest} = updatedUser
      return res.json({account: encrypt(rest._doc)})
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Server error' })
    }
})

router.get('/summary/:userId', (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if(err) {
            return res.status(500).send(err)
        }
        const filteredData = {
            _id: user._id,
            nickname: user.nickname,
            tag: user.tag,
            avatar: user.avatar,
            label: user.label,
            bio: user.bio,
            panggilan: user.panggilan,
            pengikutLength: user.pengikut.length,
        }
        res.json({account: encrypt(filteredData)})
    })
})

// Endpoint untuk memperbarui semua dokumen dengan properti baru
router.get('/updateDocuments', async (req, res) => {
  try {
    // Lakukan pembaruan dokumen sesuai dengan perubahan skema
    await User.updateMany({}, { $set: { last_changes: {
        nickname_change_date: null,
        password_change_date: null,
    }, } })

    res.status(200).json({ message: 'Dokumen berhasil diperbarui' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui dokumen' })
  }
})

export default router
