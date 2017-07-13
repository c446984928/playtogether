'use strict';
/**
 * Created by calvin_chen on 2017-4-25 15:46:07.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var triggerSchema = new Schema({
        ip: String,

        userAgent: String,

        eventName: String,

        module: String,

        detail: Schema.Types.Mixed,

        results: Array
    },
    {
        timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
    });

module.exports = mongoose.model('Trigger', triggerSchema);