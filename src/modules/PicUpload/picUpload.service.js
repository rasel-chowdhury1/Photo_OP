const PicUpload = require('./picUpload.model');

const addPicUpload = async (picUploadBody) => {
  let existingPicUpload = await findPicUpload(picUploadBody);
  if(existingPicUpload) {
    existingPicUpload.pictures = [
      ...existingPicUpload.pictures,
      ...picUploadBody.pictures
    ];
    existingPicUpload.storageSize = (existingPicUpload.storageSize || 0) + (picUploadBody.storageSize || 0);
  }
  else{
    existingPicUpload = new PicUpload(picUploadBody);
  }
  return await existingPicUpload.save()
}

const findPicUpload = async (picUploadBody) => {
  return await PicUpload.findOne({user: picUploadBody.user, snapper: picUploadBody.snapper, booking: picUploadBody.booking})
}

const getPicUploadByBooking = async (bookingId) => {
  return await PicUpload.findOne({ booking: bookingId })
}

module.exports = {
  addPicUpload,
  getPicUploadByBooking
};
