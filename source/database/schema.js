import mongoose from "mongoose"
export const Book = mongoose.model('books', {
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
export const User = mongoose.model('users', {
    name: String,
    nickname: String,
    avatar: String,
    email: String,
    password: String,
    created_at: {type: Date, default: Date.now},
    panggilan: String,
    tempat: String,
    posisi: String,
    kota: String,
    negara: String,
    tag: String,
    bio: String,
    label: [String],
    last_changes: {
        nickname_change_date: {
            type: Date,
            default: null
        },
        password_change_date: {
            type: Date,
            default: null
        },
    },
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