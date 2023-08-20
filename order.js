import express from 'express'
const router = express.Router()
import mongoose from "mongoose"
import { Book } from './schema.js'

router.put('/pages/:bookId', async (req, res) => {
    const { newOrder } = req.body

    try {
        const bulkUpdateOps = newOrder.map(item => ({
            updateOne: {
                filter: {
                    _id: req.params.bookId,
                },
                update: {
                    $set: { 'pages.$[i].order': item.order }
                },
                arrayFilters: [
                    { 'i._id': mongoose.Types.ObjectId(item._id) },
                ]
            }
        }))
        
        const result = await Book.bulkWrite(bulkUpdateOps)
        console.log(result);
        res.json({ success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'An error occurred while updating page orders.' })
    }
})

router.put('/list/:pageId', async (req, res) => {
    const { newOrder } = req.body

    try {
        const bulkUpdateOps = newOrder.map(item => ({
            updateOne: {
                filter: {
                    'pages': { $elemMatch: { _id: mongoose.Types.ObjectId(req.params.pageId) } }
                },
                update: {
                    $set: { 'pages.$[i].list.$[j].order': item.order }
                },
                arrayFilters: [
                    { 'i._id': mongoose.Types.ObjectId(req.params.pageId) },
                    { 'j._id': mongoose.Types.ObjectId(item._id) }
                ]
            }
        }))
        
        const result = await Book.bulkWrite(bulkUpdateOps)
        res.json({ success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'An error occurred while updating page orders.' })
    }
})

router.put('/notes/:pageId/:todoId', async (req, res) => {
    const { newOrder } = req.body

    try {
        const bulkUpdateOps = newOrder.map(item => ({
            updateOne: {
                filter: {
                    'pages': { $elemMatch: { _id: mongoose.Types.ObjectId(req.params.pageId) } }
                },
                update: {
                    $set: { 'pages.$[i].list.$[j].notes.$[k].order': item.order }
                },
                arrayFilters: [
                    { 'i._id': mongoose.Types.ObjectId(req.params.pageId) },
                    { 'j._id': mongoose.Types.ObjectId(req.params.todoId) },
                    { 'k._id': mongoose.Types.ObjectId(item._id) },
                ]
            }
        }))
        
        const result = await Book.bulkWrite(bulkUpdateOps)
        res.json({ success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'An error occurred while updating page orders.' })
    }
})
router.put('/images/:pageId/:todoId', async (req, res) => {
    const { newOrder } = req.body

    try {
        const bulkUpdateOps = newOrder.map(item => ({
            updateOne: {
                filter: {
                    'pages': { $elemMatch: { _id: mongoose.Types.ObjectId(req.params.pageId) } }
                },
                update: {
                    $set: { 'pages.$[i].list.$[j].images.$[k].order': item.order }
                },
                arrayFilters: [
                    { 'i._id': mongoose.Types.ObjectId(req.params.pageId) },
                    { 'j._id': mongoose.Types.ObjectId(req.params.todoId) },
                    { 'k._id': mongoose.Types.ObjectId(item._id) },
                ]
            }
        }))
        
        const result = await Book.bulkWrite(bulkUpdateOps)
        res.json({ success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'An error occurred while updating page orders.' })
    }
})

export default router