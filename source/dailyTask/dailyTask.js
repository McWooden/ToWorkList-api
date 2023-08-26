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

router.put('/reverse/:taskId/:listId', async (req, res) => {
    try {
        const daily = await DailyTask.findById(req.params.taskId)
        if (!daily) return res.status(404).json({ error: 'Task not found' })

        const list = daily.list.id(req.params.listId)
        if (!list) return res.status(404).json({ error: 'List not found' })

        const userId = req.body._id
        const userExists = list.check.includes(userId)

        if (userExists) {
            list.check.remove(userId)
        } else {
            list.check.push(userId)
        }

        await daily.save()
        res.json({ task: daily })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.post('/follow/:dailyTaskId', (req, res) => {
    const newFollowers = req.body
    DailyTask.findById(req.params.dailyTaskId, (err, daily) => {
        if (err) return res.send('Tugas harian tidak ditemukan)')
        const userExists = daily.followers.some(user => user._id === newFollowers._id)
        if (userExists) return res.json({message: 'Anda sudah mengikuti'})
        const update = {
            $addToSet: {
                'followers': {
                    name: newFollowers.nickname,
                    avatar: newFollowers.avatar, 
                    _id: newFollowers._id,
                }
            }
        }
        const options = {new: true}
        DailyTask.findByIdAndUpdate(req.params.dailyTaskId, update, options, (err, updatedDaily) => {
            if (err) res.send('Kesalahan pada update)')
            res.json({message: 'Anda sudah terdaftar, silahkan segarkan tugas sekarang!'})
        })
    })
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