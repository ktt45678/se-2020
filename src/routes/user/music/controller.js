const userService = require('../../../services/user');
const multer = require('../../../middlewares/multer');
const musicUpload = multer.audio.single('audio');

exports.view = async (req, res) => {
  const { id } = req.params;
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
}

exports.upload = (req, res) => {
  musicUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).send({ error: 'No file provided' });
    }
    const user = req.currentUser;
    const music = userService.findMusic(user);
    if (music) {
      user.storages.pull(music);
      await userService.deleteMusic(music);
    }
    try {
      const upload = await userService.uploadMusic(req.file);
      user.storages.push(upload);
      await user.save();
    } catch (e) {
      console.error(e);
      return res.status(500).send({ error: 'Internal server error' });
    }
    res.status(200).send({ message: 'Uploaded successfully' });
  });
}

exports.delete = async (req, res) => {
  const user = req.currentUser;
  const music = userService.findMusic(user);
  if (!music) {
    return res.status(404).send({ error: 'Music not found' });
  }
  user.storages.pull(music);
  const deleteResult = await userService.deleteMusic(music);
  try {
    await user.save();
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: 'Internal server error' });
  }
  if (!deleteResult) {
    return res.status(200).send({ message: 'Tried to delete unavailable blob' });
  }
  res.status(200).send({ message: 'Deleted successfully' });
}