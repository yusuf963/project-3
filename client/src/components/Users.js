import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { isCreator } from '../lib/auth'
import { Link } from 'react-router-dom'

const Users = () => {
  const [users, setUsers] = useState([])
  const [isModal, setIsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})
  const [filterTerm, setFilterTerm] = useState('')

  useEffect(() => {
    if (!filterTerm) {
      axios.get('/api/user')
        .then(axiosResp => {
          setUsers(axiosResp.data)
        })
    }
  }, [])


  async function handleChange(event) {
    event.preventDefault()
    const value = event.target.value
    setFilterTerm(value)
    
  }

  function filterUsers() {
    return users.filter((user) => {
      return user.username.toLowerCase().includes(filterTerm.toLowerCase())
    })
  }

  function showModal(user) {
    setIsModal(true)
    setSelectedUser(user)
  }

  function hideModal() {
    setIsModal(false)
    setSelectedUser({})
  }


  return <div className="section" id="userSectionBackground">
    <p className="title has-text-white has-text-centered is-size-1">
      Park Pong
    </p>
    <div className="container mb-3" >

      <div className="column">
        <input
          type="text"
          placeholder="Search by name..."
          className="input is-info is-rounded is-9"
          onChange={(event) => handleChange(event)}
          value={filterTerm}
        />
      </div>

      <div className="columns">
        <div className={!isModal ? 'column' : 'column is-two-thirds'}>

          <div className="columns is-multiline is-centered">
            {filterUsers().map((user, index) => {
              return <div key={index} className={!isModal ? 'column is-3' : 'column is-4'}>
                <div className="is-hovered transparent"
                  onClick={() => { showModal(user) }}>
                  <div className="level-item has-text-centered">
                    <div className="image usersHeads">
                      <figure className="image is-1by1">
                        <img className="box is-rounded noPadding" id={selectedUser._id === user._id ? "highlighted" : "cardHover"} src={user.image}></img>
                      </figure>
                    </div>
                  </div>
    
                  <div className="content column is-centered">
                    <h3 className="title is-capitalized has-text-centered has-text-white">{user.username}</h3>
                    <h4 className="subtitle has-text-centered has-text-weight-light has-text-white">{user.location}</h4>
                  </div>
                </div>
              </div>
            })}
          </div>
        </div>
        {isModal && <div className="column is-narrow is-one-third">
          <div className="container" id="fixed">
            <button className="delete m-3" onClick={() => hideModal()}></button>
            <div className="column is-full">
              <figure className="image is-1by1">
                <img className="is-rounded" src={selectedUser.image}></img>
              </figure>
              <br></br>
              <h1 className="title">Name: {selectedUser.username}</h1>
              <h3 className="subtitle">Location: {selectedUser.location}</h3>
              <h4 className="subtitle">Bio:</h4>
              <h3 className="mb-3">{selectedUser.bio}</h3>
              <Link to={`/user/${selectedUser._id}`}>
                <button className="button is-hovered is-info">User's Page</button>
              </Link>
              {(selectedUser.comments.length > 0) && <div className="container is-clipped">
                <h4 className="subtitle mt-3">Message board:</h4>
                <div className="column" id="commentsScroll">
                  {selectedUser.comments.map((comment) => {
                    return <article key={comment._id} className="media">
                      <div className="media-content">
                        <div className="content">
                          <p className="subtitle">
                            {comment.user.username}
                          </p>
                          <p>{comment.text}</p>
                        </div>
                      </div>
                    </article>
                  })}
                </div>
              </div>}
            </div>
          </div>
        </div>}

      </div>
    </div>
  </div>
}

export default Users