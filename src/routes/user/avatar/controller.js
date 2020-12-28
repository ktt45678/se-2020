const userService = require('../../../services/user');
const multer = require('../../../middlewares/multer');
const avatarUpload = multer.image.single('image');

exports.view = async (req, res) => {
  const { id } = req.params;
  const search = id ? await userService.findUserById(id) : id;
  if (!search && id) {
    return res.status(404).send({ error: 'User not found' });
  } else if (search) {
    const searchAvatar = userService.findAvatar(search);
    if (!searchAvatar) {
      return res.status(404).send({ error: 'This user does not have an avatar' });
    }
    const avatarUri = userService.getAvatar(searchAvatar);
    return res.status(200).send({ uri: avatarUri });
  }
  const user = req.currentUser;
  const avatar = userService.findAvatar(user);
  if (!avatar) {
    return res.status(404).send({ error: 'Avatar not found' });
  }
  const avatarUri = userService.getAvatar(avatar);
  res.status(200).send({ uri: avatarUri });
};

exports.upload = (req, res) => {
  avatarUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).send({ error: 'No file provided' });
    }
    const user = req.currentUser;
    const avatar = userService.findAvatar(user);
    // Remove previously uploaded avatar if it exists
    if (avatar) {
      user.storage.pull(avatar);
      userService.deleteAvatar(avatar);
    }
    const upload = await userService.uploadAvatar(req.file);
    user.storage.push(upload);
    try {
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
  const avatar = userService.findAvatar(user);
  if (!avatar) {
    return res.status(404).send({ error: 'Avatar not found' });
  }
  user.storage.pull(avatar);
  const deleteResult = await userService.deleteAvatar(avatar);
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