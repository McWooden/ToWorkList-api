import express from 'express'
import DailyTask from '../database/schema/DailyTaskSchema.js'
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

router.get('/reset', async (req, res) => {
    try {
        await DailyTask.updateMany({}, { $set: { 'list.$[].check': [], currentDate: new Date().toISOString() } })

        res.status(200).json({ message: 'Reset successful' })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' })
    }
})

router.get('/:userId', async (req, res) => {
    try {
        await DailyTask.find({'followers._id': req.params.userId}, (err, result) => {
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
router.put('/follow/:taskId/:userId', async (req, res) => {
    try {
        const daily = await DailyTask.findById(req.params.taskId)
        if (!daily) return res.status(404).json({ error: 'Task not found' })

        const userId = req.params.userId
        let userExists = Boolean(daily.followers.id(userId))

        if (userExists) {
            daily.followers.remove(userId)
        } else {
            daily.followers.push({_id: userId, ...req.body})
        }
        await daily.save()
        userExists = Boolean(daily.followers.id(userId))
        res.json({ isFollow: userExists })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.post('/create', async (req, res) => {
    try {
        const data = new DailyTask({...req.body})
        await data.save()
        res.json({success: true})
    } catch (error) {
        console.log(error)
        res.json({success: true})
    }
})
router.delete('/:dailyTaskId', async (req, res) => {
    try {
        const deletedDailyTask = await DailyTask.findByIdAndDelete(req.params.dailyTaskId)
        if (!deletedDailyTask) {
            return res.status(404).json({ success: false })
        }
        res.json({ success: true })
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
})

export default router