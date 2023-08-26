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

router.get('/reset', async (req, res) => {
    try {
        await DailyTask.updateMany({}, { $set: { 'list.$[].check': [], currentDate: new Date().toISOString() } })

        res.status(200).json({ message: 'Reset successful' })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' })
    }
})

router.post('/create', async (req, res) => {
    try {
        const data = new DailyTask({...req.body})
        await data.save()
        res.json({success: true})
    } catch (error) {
        console.log(error);
        res.json({success: true})
    }
})

router.get('/createOne', async (req, res) => {
    const data = new DailyTask({
        detail: {
            title: 'Sholat Wajib',
        },
        list: [
            {
                title: 'Subuh',
                subTitle: 'Dilakukan sebelum matahari terbit, yaitu dari fajar hingga sebelum terbitnya matahari',
                check: [],
                order: 1
            },
            {
                title: 'Dzuhur',
                subTitle: 'Dilakukan saat matahari sudah condong ke barat setelah melewati tepat di atas kepala, yaitu pada waktu tengah hari',
                check: [],
                order: 2
            },
            {
                title: 'Ashar',
                subTitle: 'Dilakukan pada waktu sore sebelum matahari terbenam sepenuhnya',
                check: [],
                order: 3
            },
            {
                title: 'Maghrib',
                subTitle: 'Dilakukan setelah matahari terbenam sepenuhnya dan waktu senja berakhir',
                check: [],
                order: 4
            },
            {
                title: 'Isya',
                subTitle: 'Dilakukan setelah waktu senja berakhir, biasanya pada malam hari setelah gelap',
                check: [],
                order: 5
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