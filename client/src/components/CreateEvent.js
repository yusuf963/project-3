import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Select from 'react-select'
import moment from 'moment'

export default function CreateEvent({ history }) {
  const currentTime = moment().format('YYYY-MM-DDTHH:mm')
  const token = localStorage.getItem('token')

  const [eventData, updateEventData] = useState({
    name: '',
    time: `${currentTime}`,
    details: '',
    location: '',
    image: 'https://data.nssmag.com/images/galleries/12244/26032017-IMG-5266AnyOkolie.jpg',
    attendees: [],
    results: [{}],
    comments: []
  })

  const [errors, updateErrors] = useState({
    name: '',
    time: '',
    details: '',
    location: [],
    image: '',
    attendees: [],
    results: [{}],
    comments: []
  })

  const [locationOptions, updateLocationsOptions] = useState([])
  const [locations, getLocations] = useState([])
  const [creationSuccess, updateCreationSuccess] = useState(false)
  const [uploadSuccess, updateUploadSuccess] = useState(false)

  useEffect(() => {
    axios.get('/api/location')
      .then(({ data }) => {
        getLocations(data)
        const locationArr = data.map(location => {
          return { value: location._id, label: location.name }
        })
        updateLocationsOptions(locationArr)
      })
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    updateEventData({ ...eventData, [name]: value })
    // ! Whenever I make a change, I should remove any error for this particular field!
    updateErrors({ ...errors, [name]: '' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const selectedLocation = locations.find(location => location._id === eventData.location.value)
    const timeStr = moment(eventData.time).format('dddd, MMMM Do YYYY, h:mm a')
    const dataToSubmit = { ...eventData, time: timeStr, location: selectedLocation }
    try {
      const { data } = await axios.post('/api/event', dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      })
      updateCreationSuccess(true)
      setTimeout(() => {
        history.push(`/event/${data._id}`)
      }, 2000)
    } catch (err) {
      updateErrors(err.response.data.errors)
    }
  }

  function handleUpload(event) {
    event.preventDefault()
    window.cloudinary.createUploadWidget(
      {
        cloudName: `${process.env.cloudName}`,
        uploadPreset: `${process.env.uploadPreset}`,
        cropping: true
      },
      (err, result) => {
        if (result.event !== 'success') {
          return
        }
        updateEventData({
          ...eventData,
          image: `${result.info.secure_url}`
        })
        updateUploadSuccess(true)
      }
    ).open()
  }

  return <main className='section'>
    <div className='columns is-centered'>
      <div className='column is-two-thirds'>
        <div className='box'>
          <h2 className='title'>Create Event</h2>
          <form className='columns' onSubmit={handleSubmit}>
            <div className='column'>
              <div className='field'>
                <label className='label'>Event Name</label>
                <div className='control'>
                  <input
                    className='input'
                    placeholder='Pong in the park?'
                    type='text'
                    value={eventData.name}
                    onChange={handleChange}
                    name={'name'}
                  />
                  {errors.name && <small className='has-text-danger'>{errors.name.message}</small>}
                </div>
              </div>
              <div className='field'>
                <label className='label'>Location</label>
                <div className='control'>
                  <Select
                    name='location'
                    closeMenuOnSelect={true}
                    defaultValue={[]}
                    onChange={(location) => updateEventData({ ...eventData, location })}
                    options={locationOptions}
                    value={eventData.location}
                  />
                </div>
              </div>
              <label className='label'>Time</label>
              <div className='field'>
                <div className='control'>
                  <input
                    className='input'
                    type='datetime-local'
                    min={currentTime}
                    value={eventData.time}
                    onChange={handleChange}
                    name={'time'}
                  />
                  {errors.time && <small className='has-text-danger'>{errors.time.message}</small>}
                </div>
              </div>
              <div className='field'>
                <div className='control'>
                  <button className="button is-info is-hovered" onClick={handleUpload}>(Optional) Upload Event Image</button>
                  {uploadSuccess && <div><small className="has-text-primary">Upload Complete</small></div>}
                </div>
              </div>
              <div className='field'>
                <div className='control'>
                  <button className="button is-primary is-hovered">Submit</button>
                  {creationSuccess && <div><small className="has-text-primary">Event Created! Redirecting...</small></div>}
                </div>
              </div>
            </div>
            <div className='column'>
              <div className='field'>
                <label className='label'>Details</label>
                <div className='control'>
                  <textarea
                    rows='12'
                    className='textarea'
                    placeholder='Casual or tournament? Other info?'
                    type='text'
                    value={eventData.details}
                    onChange={handleChange}
                    name={'details'}
                  />
                  {errors.name && <small className='has-text-danger'>{errors.details.message}</small>}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>

}