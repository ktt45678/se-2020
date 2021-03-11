const userService = require('../../../services/user');
const multer = require('../../../middlewares/multer');
const musicUpload = multer.audio.single('audio');
const { validationResult } = require('express-validator');

exports.view = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { id } = req.params;
  try {
    const user = req.currentUser;
    const search = id ? await userService.findUserById(id) : id;
    if ((!search && id) || (!id && !user)) {
      return res.status(404).send({ error: 'User not found' });
    } else if (search) {
      const searchMusic = userService.findMusic(search);
      const musicUri = userService.getMusic(searchMusic);
      return res.status(200).send({ uri: musicUri, mimeType: searchMusic?.mimeType });
    }
    const music = userService.findMusic(user);
    const musicUri = userService.getMusic(music);
    res.status(200).send({ uri: musicUri, mimeType: music?.mimeType });
  } catch (e) {
    next(e);
  }
}

exports.upload = (req, res, next) => {
  musicUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    if (req.params.id) {
      return res.status(400).send({ error: 'Invalid method' });
    }
    if (!req.file) {
      return res.status(400).send({ error: 'No file provided' });
    }
    const mimetypes = ['audio/wave', 'audio/vnd.wave', 'audio/mpeg', 'audio/ogg', 'audio/opus', 'video/mp4', 'video/webm'];
    if (!mimetypes.includes(req.file.detectedMimeType)) {
      return res.status(422).send({ error: 'Unsupported audio format' });
    }
    const user = req.currentUser;
    const music = userService.findMusic(user);
    try {
      if (music) {
        user.storages.pull(music);
        await userService.deleteMusic(music);
      }
      const upload = await userService.uploadMusic(req.file);
      user.storages.push(upload);
      await user.save();
      res.status(200).send({ message: 'Uploaded successfully' });
    } catch (e) {
      next(e);
    }
  });
}

exports.delete = async (req, res, next) => {
  if (req.params.id) {
    return res.status(400).send({ error: 'Invalid method' });
  }
  const user = req.currentUser;
  const music = userService.findMusic(user);
  if (!music) {
    return res.status(404).send({ error: 'Music not found' });
  }
  try {
    user.storages.pull(music);
    const deleteResult = await userService.deleteMusic(music);
    await user.save();
    if (!deleteResult) {
      return res.status(200).send({ message: 'Tried to delete unavailable blob' });
    }
    res.status(200).send({ message: 'Deleted successfully' });
  } catch (e) {
    next(e);
  }
}