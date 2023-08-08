import express from 'express'
const router = express.Router()
import { Mail } from './schema.js'

router.post('/send', async (req, res) => {
    const data = req.body
    try {
        const newMail = new Mail({...data})
        await newMail.save()
    
        res.status(201).json({ message: 'Email sent successfully.' })
      } catch (error) {
        res.status(500).json({ error: 'Failed to send email.' })
    }
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
        res.status(500).json({ error: 'Failed to get email.' })
    }
})

export default router