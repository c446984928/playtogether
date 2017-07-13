'use strict';
/**
* Created by calvin_chen on 2017-4-25 15:32:29.
*/
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

let eventSchema = new Schema({
        eventName: String,

        module: String,

        desc: String,

        channelList: [
            {
                channelName: String,
                targetUser: Array,
                template: String,
                enable: {
                    type: Boolean,
                    default: true
                }
            }
        ]
    },
    {
        timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
    });

eventSchema.index({eventName: 1, module: 1}, {unique: true});

eventSchema.methods.addTargetUser = function(channelName,targetUser) {
    return new Promise((resolve,reject) => {
        for (let channel of this.channelList){
            if (channel.channelName === channelName){
                channel.targetUser.push(targetUser);
                channel.targetUser = _.uniq(channel.targetUser);
                this.markModified('channelList');
                break;
            }
        }
        this.save((err,doc) => {
            if (err){
                reject(err);
            }else {
                resolve(doc);
            }
        });
    });
};

eventSchema.methods.removeTargetUser = function(channelName,targetUser) {
    return new Promise((resolve,reject) => {
        for (let channel of this.channelList){
            if (channel.channelName === channelName){
                _.pull(channel.targetUser,targetUser);
                this.markModified('channelList');
                break;
            }
        }
        this.save((err,doc) => {
            if (err){
                reject(err);
            }else {
                resolve(doc);
            }
        });
    })
};

eventSchema.methods.updateChannel = function(newChannel) {
    let totallyNew = true;
    for (let channel of this.channelList){
        if (channel.channelName === newChannel.channelName){
            _.assign(channel,newChannel);
            this.markModified('channelList');
            totallyNew = false;
            break;
        }
    }
    if (totallyNew){
        this.channelList.push(newChannel);
        this.markModified('channelList');
    }

    return new Promise((resolve,reject) => {
        this.save((err,doc) => {
            if (err){
                reject(err);
            }else {
                resolve(doc);
            }
        });
    });
};

eventSchema.methods.removeChannel = function(channelName) {
    for (let channel of this.channelList){
        if (channel.channelName === channelName){
            _.pull(this.channelList,channel);
            this.markModified('channelList');
            break;
        }
    }
    return new Promise((resolve,reject) => {
        this.save((err,doc) => {
            if (err){
                reject(err);
            }else {
                resolve(doc);
            }
        });
    });
};

module.exports = mongoose.model('Event', eventSchema);