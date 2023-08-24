import express from 'express'
import { DailyTask } from '../database/schema.js'
const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        await DailyTask.find({}, (err, result) => {
            if (err) throw new Error(err)
            res.json({all: result})
        })
    } catch (error) {
        
    }
})

router.get('/createOne', async (req, res) => {
    const data = new DailyTask({
        detail: {
            title: 'Tugas harian pertama',
        },
        list: [
            {
                title: 'Tugas pertama',
                subTitle: 'ini adalah tugas pertama',
                check: [],
                order: 1
            },
            {
                title: 'Tugas kedua',
                subTitle: 'ini adalah tugas kedua',
                check: [],
                order: 2
            },
            {
                title: 'Tugas ketiga',
                subTitle: 'ini adalah tugas ketiga',
                check: [],
                order: 3
            },
        ],
        author: {
            nickname: 'Toworklist',
        },
        followers: [{
            name: 'Toworklist',
            avatar: 'noAvatar', 
            bestScore: {
                score: 1
            },
        }],
    })
    await data.save()
    res.json({success: true, data})
})

export default router