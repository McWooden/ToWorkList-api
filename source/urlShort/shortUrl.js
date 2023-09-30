import express from 'express'
import mongoose from "mongoose"
import ShortUrl from '../database/schema/ShortUrlSchema.js'
import Book from '../database/schema/BookSchema.js'
import { nanoid } from 'nanoid'
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { bookId, pageId, todoId } = req.body

        const origin = {
            bookId: bookId,
            pageId: pageId,
            todoId: todoId,
        }

        let findOption
        
        if (todoId) {
            findOption = {'origin.todoId': todoId}
        } else {
            findOption = {'origin.pageId': pageId}
        }

        let existShort = await ShortUrl.findOne(findOption).exec()

        if (existShort) return res.json({short: existShort})
        
        // if (existShort) {
        //     const book = await Book.findById(existShort).exec()
        //     const page = book.pages.id(existShort.origin.pageId)
        //     if (existShort.origin.todoId) {
        //         return res.json(page.list.id(existShort.origin.todoId))
        //     } else {
        //         return res.json(page.list.id(existShort.origin.todoId))
        //     }
        // }

        let shortUrl = nanoid()

        const newShortUrl = new ShortUrl({
            origin,
            short: shortUrl,
        })

        await newShortUrl.save()

        res.json({ short: newShortUrl })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})



router.get('/:short', async (req, res) => {
    try {
        const short = await ShortUrl.findOne({ short: req.params.short }).exec()
        
        if (!short) {
            return res.json({ msg: 'Not found', short: null })
        }

        const book = await Book.findById(short.origin.bookId).exec()
        
        if (!book) {
            return res.json({ msg: 'Book not found', short: null })
        }

        const page = book.pages.id(short.origin.pageId)

        if (short.origin.todoId) {
            res.json({data: page.list.id(short.origin.listId), type: 'TODO'})
        } else {
            res.json({data: page, type: page.details.icon})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

router.get('/deleteAll', async (req, res) => {
    try {
        // Use Mongoose to remove all documents in the ShortUrl collection
        await ShortUrl.deleteMany({});
    
        res.status(204).send(); // Send a No Content response
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    
  });
  


export default router