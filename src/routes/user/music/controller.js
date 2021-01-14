const userService = require('../../../services/user');
const multer = require('../../../middlewares/multer');
const musicUpload = multer.audio.single('audio');

exports.view = async (req, res, next) => {
  const { id } = req.params;
  try {
    const search = id ? await userService.findUserById(id) : id;
    if (!search && id) {
      return res.status(404).send({ error: 'User not found' });
    } else if (search) {
      const searchMusic = userService.findMusic(search);
      if (!searchMusic) {
        return res.status(404).send({ error: 'This user does not want music' });
      }
      const musicUri = userService.getMusic(searchMusic);
      return res.status(200).send({ uri: musicUri });
    }
    const user = req.currentUser;
    const music = userService.findMusic(user);
    if (!music) {
      return res.status(404).send({ error: 'Music not found' });
    }
    const musicUri = userService.getMusic(music);
    res.status(200).send({ uri: musicUri });
  } catch (e) {
    next(e);
  }
}

exports.upload = (req, res, next) => {
  musicUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).send({ error: 'No file provided' });
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