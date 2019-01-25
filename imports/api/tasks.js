import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'

export const Tasks = new Mongo.Collection('tasks')

if (Meteor.isServer) {
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { owner: this.userId },
      ],
    })
  })
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String)
    if (! this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      state: 0
    })
  },
  'tasks.remove'(taskId) {
    check(taskId, String)
    Tasks.remove(taskId)
  },
  'tasks.setDoing'(taskId, setDoing) {
    check(taskId, String)
    check(setDoing, Boolean)
    if (setDoing) Tasks.update(taskId, { $set: { state: 1, doing: setDoing } })
    else Tasks.update(taskId, { $set: { state: 0, doing: setDoing } })
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String)
    check(setChecked, Boolean)
    if (setChecked) Tasks.update(taskId, { $set: { state: 2, checked: setChecked } })
    else Tasks.update(taskId, { $set: { state: 0, doing: 0, checked: setChecked } })
  }
})