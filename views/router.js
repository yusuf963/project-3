import express from 'express'
import location from '../controllers/locationController.js'
import locationComment from '../controllers/locationCommentControllers.js'
import userComment from '../controllers/userCommentControllers.js'
import eventComment from '../controllers/eventCommentControllers.js'
import events from '../controllers/eventControllers.js'

import singleUserController from '../controllers/singleUserController.js'
import login from '../controllers/login.js'
import register from '../controllers/register.js'
import secureRoute from '../middleware/secureRoute.js'
import userControllers from '../controllers/userControllers.js'
import singleEventControllers from '../controllers/singleEventControllers.js'

const router = express.Router()

router.route('/location')
  .get(location.getAllLocation)
  .post(secureRoute, location.makeLocation)

router.route('/location/:id')
  .get(location.getSingleLocation)
  .put(secureRoute, location.updateLocation)
  .delete(secureRoute, location.deleteLocation)
  .post(secureRoute, locationComment.createLocationComment)

router.route('/location/name/:name')
  .get(location.getLocationByName)

router.route('/events')
  .get(events.getEvents)
  .post(secureRoute, events.postEvent)

router.route('/location/:locationId/comment/:commentId')
  .put(secureRoute, locationComment.updateLocationComment)
  .delete(secureRoute, locationComment.deleteLocationComment)

router.route('/user/:userId/comment/:commentId')
  .put(secureRoute, userComment.updateUserComment)
  .delete(secureRoute, userComment.deleteUserComment)

router.route('/event/:eventId/comment/:commentId')
  .put(secureRoute, eventComment.updateEventComment)
  .delete(secureRoute, eventComment.deleteEventComment)
router.route('/register')
  .post(register.register)

router.route('/login')
  .post(login.login)

router.route('/users')
  .get(userControllers.getUsers)

router.route('/users/search/:name')
  .get(userControllers.searchUsers)

router.route('/events/:id')
  .get(singleEventControllers.getSingleEvent)
  .put(secureRoute, singleEventControllers.updateSingleEvent)
  .delete(secureRoute, singleEventControllers.deleteSingleEvent)
  .post(secureRoute, eventComment.createEventComment)

router.route('/user/:id')
  .get(singleUserController.getSingleUser)
  .put(secureRoute, singleUserController.updateSingleUser)
  .delete(secureRoute, singleUserController.deleteSingleUser)
  .post(secureRoute, userComment.createUserComment)

export default router