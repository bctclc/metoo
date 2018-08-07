import React, { Component } from 'react'
import {
  Grid,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'
import { MdHome, MdRefresh, MdAddToPhotos } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { fetchAllPosts } from '../utils/api'
import './Treehole.css'
import Header from './Header'
import PostDetail from './PostDetail'
import EditPost from './EditPost'

class Treehole extends Component {
  state = {
    posts: [],
    editPost: false,
    status: 'loading'
  }

  update = () => {
    this.setState({ status: 'loading' })
    fetchAllPosts().then(res => {
      if (res == null) {
        this.setState({ status: 'error' })
      } else {
        this.setState({ posts: res, status: 'loaded' })
      }
    })
  }

  componentDidMount() {
    this.update()
  }

  render() {
    return (
      <Grid>
        <Header title="树洞" />
        <div id="treehole-buttonbar">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="home">返回首页</Tooltip>}
          >
            <Link to="/">
              <span className="treehole-button">
                <MdHome size={30} />
              </span>
            </Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="home">刷新</Tooltip>}
          >
            <span className="treehole-button" onClick={this.update}>
              <MdRefresh size={30} />
            </span>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="submit">发布新内容</Tooltip>}
          >
            <span
              id="submit-button"
              className="treehole-button"
              onClick={() => this.setState({ editPost: true })}
            >
              <MdAddToPhotos size={30} />
            </span>
          </OverlayTrigger>
        </div>
        {this.state.status === 'loaded' && (
          <ListGroup>
            {this.state.editPost && (
              <ListGroupItem>
                <EditPost
                  onClose={() => this.setState({ editPost: false })}
                  onSubmit={newPost =>
                    this.setState({ posts: [newPost, ...this.state.posts] })
                  }
                />
              </ListGroupItem>
            )}
            {this.state.posts.map(post => (
              <PostDetail key={`post-${post._id}`} post={post} />
            ))}
          </ListGroup>
        )}
        {this.state.status === 'loading' && (
          <div style={{ color: '#bbb' }}>数据读取中……</div>
        )}
        {this.state.status === 'error' && (
          <div style={{ color: '#bbb' }}>数据读取失败，请刷新重试。</div>
        )}
      </Grid>
    )
  }
}

export default Treehole
