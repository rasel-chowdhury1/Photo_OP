const catchAsync = require('../../helpers/catchAsync');
const generateNotFoundPage = require('../../helpers/noImageFound');
const generateGalleryHtml = require('../../helpers/photoGallery');
const response = require("../../helpers/response");
const { updateBooking } = require('../Booking/booking.service');
const { addPicUpload, getPicUploadByBooking } = require('./picUpload.service');

const addNewPicUpload = catchAsync(async (req, res) => {
  req.body.data = JSON.parse(req.body.data || '{}');
  req.body.data.snapper = req.body.userId;

  if (req.body.data.pictures.length === 0) {
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'booking', message: req.t('no-image-found') }));
  }
  const result = await addPicUpload(req.body.data);
  if(result){
    await updateBooking(req.body.data.booking, { hasPicUploaded: true });
    return res.status(201).json(response({ status: 'OK', statusCode: '201', type: 'booking', message: req.t('booking-added'), data: result }));
  }
  return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'booking', message: req.t('booking-not-added') }));
});

const getSnappedPicForAppointment = catchAsync(async (req, res) => {
  const bookingId = req.params.id;
  const snappedImages = await getPicUploadByBooking(bookingId);
  if(!bookingId || !snappedImages){
    const generateNotFound = generateNotFoundPage();
    // send a html css designed no image found message
    return res.status(200).send(generateNotFound);
  }

  const imageLinks = [
    'https://via.placeholder.com/200x300',
    'https://via.placeholder.com/300x200',
    'https://via.placeholder.com/250x250',
    'https://via.placeholder.com/400x600',
    'https://via.placeholder.com/600x400',
    'https://via.placeholder.com/350x150',
    'https://via.placeholder.com/450x300',
    'https://via.placeholder.com/300x450',
    'https://via.placeholder.com/150x350',
    'https://via.placeholder.com/500x200',
    'https://via.placeholder.com/200x500',
    'https://via.placeholder.com/350x350',
    'https://via.placeholder.com/200x150',
    'https://via.placeholder.com/150x200',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/400x400',
    'https://via.placeholder.com/600x800',
    'https://via.placeholder.com/800x600',
    'https://via.placeholder.com/700x500',
    'https://via.placeholder.com/500x700'
  ];

  const host = req.query.host || 'web';

  const galleryHtml = generateGalleryHtml(snappedImages.pictures, host);
  return res.status(200).send(galleryHtml);
});

module.exports = { addNewPicUpload, getSnappedPicForAppointment }