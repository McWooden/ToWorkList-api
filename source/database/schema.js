import mongoose from "mongoose"
export const Book = mongoose.model('books', {
    profile: {
        book_title: String,
        avatar_url: String,
        create_at: String,
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
                by: String,
                date: String,
                color: String,
                order: {type: Number, default: 0}
            }],
            images: [{
                pic: String,
                desc: String,
                date: String,
                by: String,
                order: {type: Number, default: 0}
            }],
            chat: [{
                nickname: String,
                msg: String,
                time: String,
                date: String
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
        history: [{
            detail: Object,
            parentId: mongoose.Schema.Types.ObjectId,
            box: [{
                date: {type: Date, default: Date.new},
                list: [Object]
            }]
        }],
        order: {type: Number, default: 0},  
    }],
    roles: [{
        name: String,
        color: String,
    }],
    users: [{
        nickname: String,
        tag: String, 
        avatar: String, 
        status: String,
        role: [String],
        joined_at: String,
        _id: mongoose.Schema.Types.ObjectId
    }],
})
export const User = mongoose.model('users', {
    name: String,
    nickname: String,
    avatar: String,
    email: String,
    password: String,
    created_at: String,
    panggilan: String,
    tempat: String,
    posisi: String,
    kota: String,
    negara: String,
    tag: String,
    bio: String,
    label: [String],
    pengikut: [mongoose.Schema.Types.ObjectId]
})
const mailSchema = new mongoose.Schema({
    pengirim: {type: {
        nama: {type: String, default: 'Anonymous'},
        avatar: String,
        _id: mongoose.Schema.Types.ObjectId,
    }, default: {
        nama: 'Anonymous',
        _id: 'anon'
    }},
    penerima: [Object], default: [],
    subjek: {type: String, default: 'Tanpa Subject'},
    body: {type: String, default: 'Kosong'},
    dibaca: {type: [mongoose.Schema.Types.ObjectId], default: []},
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '14d'
    },
    balasan: {
        type: [Object],
        default: []
    }
})
export const Mail = mongoose.model('email', mailSchema)

export const DailyTask = mongoose.model('dailyTask', {
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
    followers: [{
        name: String,
        avatar: String, 
        bestScore: {
            date: {
                type: Date,
                default: Date.now
            },
            score: {
                type: Number,
                default: 0
            }
        },
        _id: mongoose.Schema.Types.ObjectId
    }],
    currentDate: {
        type: Date,
        default: Date.now
    }
})