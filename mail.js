import express from 'express'
const router = express.Router()
import { Mail } from './schema.js'

router.post('/send', async (req, res) => {
    const data = req.body
    try {
        const newMail = new Mail({...data})
        await newMail.save()
    
        res.status(201).json({ message: 'Surat dikirim dengan sukses' })
      } catch (error) {
        res.status(500).json({ error: 'Surat gagal dikirim' })
    }
})
router.post('/balasan/:mailId', async (req, res) => {
    const balas = req.body

    const query = { '_id': req.params.mailId }
    const update = { $push: { 'balasan': balas } }
    const options = { new: true }
    Mail.findOneAndUpdate(query, update, options)
    .then(result => {
        res.json({mail: result})
    }).catch(err => {
        console.log(err)
        res.status(404).json({ success: false, error: err })
    })
})
router.get('/:userId', (req, res) => {
    try {
        Mail.find({'penerima': req.params.userId}, (err, mail) => {
            if(!mail) {
                return res.json({mails: []})
            }
            res.json({mails: mail})
        })
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil surat' })
    }
})

export default router