import mongoose from "mongoose"

const DailyTask = mongoose.model('dailyTask', {
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

export default DailyTask