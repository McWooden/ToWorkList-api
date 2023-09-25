import mongoose from "mongoose"
const BookSchema = new mongoose.Schema({
    profile: {
        book_title: String,
        avatar_url: String,
        created_at: {type: Date, default: Date.now},
        desc: String,
        author: {
            nickname: String,
            tag: String,
            _id: mongoose.Schema.Types.ObjectId
        },
    },
    pages: [{
        details: {
            page_title: String,
            icon: String,
            jadwal_url: String,
        },
        access: {type: [String], default: []},
        list: [{
            details: {
                item_title: String,
                desc: String,
                color: String,
                deadline: Number
            },
            dones: [String],
            notes: [{
                context: String,
                by: {
                    nickname: String,
                    _id: mongoose.Schema.Types.ObjectId,
                },
                date: {type: Date,default: Date.now},
                color: String,
                order: {type: Number, default: 0}
            }],
            images: [{
                pic: String,
                desc: String,
                date: {type: Date,default: Date.now},
                by: {
                    nickname: String,
                    _id: mongoose.Schema.Types.ObjectId,
                },
                order: {type: Number, default: 0}
            }],
            chat: [{
                nickname: String,
                by: mongoose.Schema.Types.ObjectId,
                msg: String,
                time: String,
                date: {type: Date,default: Date.now},
            }],
            order: {type: Number, default: 0},
            default: []
        }],
        dailyList: [{
            detail: {
                title: String,
                desc: {type: String, default: ''},
                createdAt: {
                    type: Date,
                    default: Date.now,
                }
            },
            list: [{
                title: {type: String, default: 'empty'},
                check: [mongoose.Schema.Types.ObjectId],
                order: {type: Number, default: 1},
            }],
            author: {
                name: String,
                _id: mongoose.Schema.Types.ObjectId,
            },
            currentDate: {
                type: Date,
                default: Date.now
            },
            default: []
        }],
        noteList: [{
            context: String,
            by: {
                nickname: String,
                _id: mongoose.Schema.Types.ObjectId,
            },
            date: {type: Date, default: Date.now},
            color: String,
            order: {type: Number, default: 0}
        }],
        history: [{
            detail: Object,
            box: [{
                date: {type: Date, default: Date.new},
                list: [Object]
            }],
            _id: mongoose.Schema.Types.ObjectId,
        }],
        order: {type: Number, default: 0},  
    }],
    roles: [{
        name: String,
        color: String,
    }],
    users: [{
        nickname: String,
        isAdmin: {type: Boolean, default: false},
        tag: String, 
        avatar: String, 
        status: String,
        role: [String],
        joined_at: {type: Date, default: Date.now},
        _id: mongoose.Schema.Types.ObjectId
    }],
})
const Book = mongoose.model('books', BookSchema)
export default Book