import React, { Component } from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { Tasks } from '../api/tasks.js'
import Task from './Task.js'
import Accounts from './Accounts.js'

class App extends Component {
  handleSubmit(event) {
    event.preventDefault()
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim()
    if (text !== '') Meteor.call('tasks.insert', text)
    ReactDOM.findDOMNode(this.refs.textInput).value = ''
  }

  renderTasks() {
    return this.props.tasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id
      const showTask = task.owner === currentUserId
      return (
        <Task
          key={task._id}
          task={task}
          showTask={showTask}
        />
      )
    })
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
          <Accounts />
          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
                maxLength="150"
              />
            </form> : ''
          }
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks')
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  }
})(App)