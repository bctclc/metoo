import React, { Component } from 'react'
import {
  Row,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
  Label
} from 'react-bootstrap'
import { displayTimestamp } from '../utils/utils'
import Alert from 'react-s-alert'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import Comments from './Comments'
import EditComment from './EditComment'
import ShareButton from './ShareButton'
import AdminModal from './AdminModal'
import { fetchComments, deletePost } from '../utils/api'

class PostDetail extends Component {
  state = {
    comments: [],
    editComment: false,
    adminKeyDialog: false,
    adminKey: ''
  }

  update = () => {
    fetchComments(this.props.post._id, this.props.admin).then(res =>
      this.setState({ comments: res })
    )
  }

  componentDidMount() {
    this.update()
  }

  render() {
    return (
      <ListGroupItem>
        <div
          className="post-box"
          onClick={() => {
            if (!this.state.editComment) this.props.commentsToggle()
          }}
        >
          {this.props.admin &&
            this.props.post.forTest && (
              <Row>
                <Label>测试贴</Label>
              </Row>
            )}
          {this.props.admin &&
            this.props.post.isDeleted && (
              <Row>
                <Label>已删除</Label>
              </Row>
            )}
          <Row className="post-content">{this.props.post.content}</Row>
          <Row>
            <div className="post-info">
              <span
                className={
                  this.props.post.showComments || this.state.editComment
                    ? ''
                    : 'visible-on-hover'
                }
              >
                <ShareButton
                  url={`${window.location.origin}/treehole/${
                    this.props.post._id
                  }`}
                  content={this.props.post.content}
                />
                {this.props.admin && (
                  <span
                    className="pull-left"
                    style={{ marginLeft: '5px', cursor: 'pointer' }}
                    onClick={() => this.setState({ adminKeyDialog: true })}
                  >
                    <MdDelete size={18} />
                  </span>
                )}
                {this.state.comments &&
                  this.state.comments.length > 0 && (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="expand-comments">
                          {this.props.post.showComments ? '收起' : '展开'}
                        </Tooltip>
                      }
                    >
                      <span
                        style={{
                          cursor: 'pointer',
                          verticalAlign: '-webkit-baseline-middle',
                          paddingRight: '5px'
                        }}
                      >
                        {this.props.post.showComments ? (
                          <FaAngleUp size={20} />
                        ) : (
                          <FaAngleDown size={20} />
                        )}
                      </span>
                    </OverlayTrigger>
                  )}
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={e => {
                    e.stopPropagation()
                    this.setState({ editComment: true })
                  }}
                >
                  添加评论 &nbsp;‧&nbsp;
                </span>
              </span>
              <span
                style={{
                  cursor:
                    (this.props.admin
                      ? this.props.post.commentCountAll
                      : this.props.post.commentCount) > 0
                      ? 'pointer'
                      : 'default'
                }}
              >
                评论 (
                {this.props.admin
                  ? this.props.post.commentCountAll
                  : this.props.post.commentCount}
                )
              </span>{' '}
              &nbsp;‧&nbsp;
              {displayTimestamp(this.props.post.timestamp)}
            </div>
          </Row>
          {this.state.editComment && (
            <EditComment
              postId={this.props.post._id}
              admin={this.props.admin}
              onClose={() => this.setState({ editComment: false })}
              onSubmit={newComment => {
                if (newComment == null) {
                  // error
                  Alert.warning('评论提交失败，请稍候再试')
                } else {
                  // success
                  Alert.success('评论发布成功')
                  this.setState({
                    comments: [newComment, ...this.state.comments],
                    editComment: false
                  })
                  this.props.commentCountInc()
                }
              }}
            />
          )}
          {this.props.post.showComments && (
            <Comments
              postId={this.props.post._id}
              comments={this.state.comments}
              admin={this.props.admin}
              commentCountInc={this.props.commentCountInc}
              onDelete={() => this.update()}
            />
          )}
        </div>
        <AdminModal
          adminKey={this.state.adminKey}
          show={this.state.adminKeyDialog}
          onHide={() => this.setState({ adminKeyDialog: false, adminKey: '' })}
          onChangeKey={e => this.setState({ adminKey: e.target.value })}
          onSubmit={() =>
            deletePost(this.props.post._id, this.state.adminKey).then(res => {
              if (res == null || !res.success) {
                if (res != null && res.error === 'wrong key')
                  Alert.warning('密码输入错误')
                else Alert.warning('删除失败')
              } else {
                Alert.success('删除成功')
                this.setState({ adminKeyDialog: false, adminKey: '' })
                this.props.onDelete()
              }
            })
          }
        />
      </ListGroupItem>
    )
  }
}

export default PostDetail
