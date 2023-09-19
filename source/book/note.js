import express, { query } from 'express'
const router = express.Router()
import mongoose from "mongoose"
import { Book } from '../database/schema.js'

const note = {noteList: [{
    context: String,
    by: {
        nickname: String,
        _id: mongoose.Schema.Types.ObjectId,
    },
    date: {type: Date, default: Date.now},
    color: String,
    order: {type: Number, default: 0}
}]}


router.post('/:pageId', (req, res) => {
    const query = {
        'pages': { $elemMatch: { _id: req.params.pageId } }
    }
    const update = {
        $push: {
            'pages.$[page].noteList': {
                context: req.body.context || req.body.desc,
                by: req.body.by,
                color: req.body.color,
                order: 999,
            }
        }
    }
    const options = { 
        new: true,
        arrayFilters: [{ 'page._id': req.params.pageId }]
    }
    Book.findOneAndUpdate(query, update, options)
    .then(result => {
        console.log('There is');
        if (!result) return res.status(404).json({ success: false, error: 'Page or List not found' })
        res.json(result.pages.id(req.params.pageId))
    }).catch(err => {
        console.log(err);
        res.status(404).json({ success: false, error: err })
    })
})

router.put('/:pageId/:noteId', (req, res) => {
    const query = {
        'pages': {$elemMatch: { _id: req.params.pageId }}
    }
    const update = {
        $set: {
            'pages.$[page].noteList.$[note].context': req.body.context,
            'pages.$[page].noteList.$[note].date': +new Date(),
        }
    }
    const options = { 
        new: true,
        arrayFilters: [{ 'page._id': req.params.pageId }, { 'note._id': req.params.noteId }]
    }
    Book.findOneAndUpdate(query, update, options)
    .then(result => {
        if (!result) res.status(404).json({ success: false, error: 'Page or List not found' })
            res.json(result.pages.id(req.params.pageId))
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
    })
})

router.delete('/:pageId/:noteId', (req, res) => {
    const query = {
        'pages': {$elemMatch: { _id: req.params.pageId }}
    }
    const update = {
        $pull: {
            'pages.$[page].noteList': {_id: req.params.noteId}
        }
    }
    const options = { 
        new: true,
        arrayFilters: [{ 'page._id': req.params.pageId }]
    }
    Book.findOneAndUpdate(query, update, options)
    .then(result => {
        if (!result) res.status(404).json({ success: false, error: 'Page or List not found' })
            console.log(result.pages.id(req.params.pageId).noteList.id(req.params.noteId), req.params.pageId, req.params.noteId);
            res.json(result.pages.id(req.params.pageId))
    }).catch(err => {
        res.status(404).json({ success: false, error: err })
    })
})

export default router