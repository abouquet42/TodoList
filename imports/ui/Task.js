import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import classnames from 'classnames'

export default class Task extends Component {
  toggleChecked() {
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked)
  }

  toggleDoing() {
    Meteor.call('tasks.setDoing', this.props.task._id, !this.props.task.doing)
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id)
  }

  render() {
    const taskClassName = classnames({
      checked: this.props.task.checked,
      doing: this.props.task.doing,
    })
    return (
      <div>
        {this.props.showTask ? (
          <li className={taskClassName}>
            <div>
              <button className="delete" onClick={this.deleteThisTask.bind(this)}>
                &times;
            </button>
              {this.props.task.checked ?
                <div className="divTask">
                  <img src="https://img.icons8.com/windows/24/000000/in-progress.png" style={{opacity: '0.5'}}></img>
                </div>
                :
                <div className="divTask">
                  {this.props.task.state === 1 ?
                    <img src="https://img.icons8.com/color/24/000000/in-progress.png" onClick={this.toggleDoing.bind(this)} className="img"></img> :
                    <img src="https://img.icons8.com/windows/24/000000/in-progress.png" onClick={this.toggleDoing.bind(this)} className="img"></img>}
                </div>
              }
              <input
                type="checkbox"
                readOnly
                checked={!!this.props.task.checked}
                onClick={this.toggleChecked.bind(this)}
                className="checkbox"
              />
              <span className="text" style={{width: '490px'}}>{this.props.task.text}</span>
            </div>
          </li>
        ) : ''}
      </div>
    )
  }
}