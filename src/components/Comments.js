import React, { Component } from 'react'
import { Label } from 'react-bootstrap'
import { displayTimestamp } from '../utils/utils'

class Comments extends Component {
  render() {
    return (
      this.props.comments.length > 0 && (
        <div onClick={e => e.stopPropagation()}>
          {this.props.comments.map(comment => (
            <div className="comment-box" key={`comment-${comment._id}`}>
              <div className="comment-content">{comment.content}</div>
              <div className="post-info">
                {this.props.admin &&
                  comment.forTest && (
                    <Label
                      className="pull-left"
                      style={{ marginLeft: '20px', marginTop: '5px' }}
                    >
                      测试评论
                    </Label>
                  )}
                {displayTimestamp(comment.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )
    )
  }
}

export default Comments
