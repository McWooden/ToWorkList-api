import express from 'express'
const router = express.Router()
import { Mail } from '../database/schema.js'

router.get('/deleteAll', async (req, res) => {
    Mail.deleteMany({}, (err, mail) => {
        res.json({success: true})
    })
})

router.post('/send', async (req, res) => {
    const data = req.body
    try {
        const newMail = new Mail({...data})
        await newMail.save()
    
        res.status(201).json({ message: 'Surat dikirim dengan sukses' })
      } catch (error) {
        console.log(error)
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
        Mail.find({'penerima._id': req.params.userId}, (err, mail) => {
            if(!mail) {
                return res.json({mails: []})
            }
            res.json({mails: mail})
        })
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil surat' })
    }
})
router.put('/:userId', async (req, res) => {
    try {
        const result = await Mail.updateMany(
            { _id: { $in: req.body.arrayOfId } }, 
            { $pull: { 'penerima': {_id: req.params.userId} } }
        )

        const updatedMails = await Mail.find({ 'penerima._id': req.params.userId })

        if (!updatedMails) {
            return res.json({ success: true, mails: [] })
        }

        res.json({ success: true, mails: updatedMails })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Gagal menghapus surat' });
    }
});
export default router