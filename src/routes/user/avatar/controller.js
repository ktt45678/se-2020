const userService = require('../../../services/user');
const multer = require('../../../middlewares/multer');
const avatarUpload = multer.avatar.single('image');
const { validationResult } = require('express-validator');

exports.view = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }
  const { id } = req.params;
  const { size } = req.query;
  try {
    const search = id ? await userService.findUserById(id) : id;
    if (!search && id) {
      return res.status(404).send({ error: 'User not found' });
    } else if (search) {
      const searchAvatar = userService.findAvatar(search);
      const avatarUri = userService.getAvatar(searchAvatar, size);
      return res.status(200).send({ uri: avatarUri });
    }
    const user = req.currentUser;
    const avatar = userService.findAvatar(user);
    const avatarUri = userService.getAvatar(avatar, size);
    res.status(200).send({ uri: avatarUri });
  } catch (e) {
    next(e);
  }
}

exports.upload = (req, res, next) => {
  avatarUpload(req, res, async (err) => {
    if (err) {
      return res.status(422).send({ error: err.message });
    }
    if (req.params.id) {
      return res.status(400).send({ error: 'Invalid method' });
    }
    if (!req.file) {
      return res.status(400).send({ error: 'No file provided' });
    }
    const mimetypes = ['image/png', 'image/gif', 'image/jpeg'];
    if (!mimetypes.includes(req.file.detectedMimeType)) {
      return res.status(422).send({ error: 'Unsupported image format' });
    }
    const user = req.currentUser;
    const avatar = userService.findAvatar(user);
    try {
      // Remove previously uploaded avatar if it exists
      if (avatar) {
        user.storages.pull(avatar);
        await userService.deleteAvatar(avatar);
      }
      const upload = await userService.uploadAvatar(req.file);
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
  const avatar = userService.findAvatar(user);
  if (!avatar) {
    return res.status(404).send({ error: 'Avatar not found' });
  }
  try {
    user.storages.pull(avatar);
    await user.save();
    const deleteResult = await userService.deleteAvatar(avatar);
    if (!deleteResult) {
      return res.status(200).send({ message: 'Tried to delete unavailable blob' });
    }
    res.status(200).send({ message: 'Deleted successfully' });
  } catch (e) {
    next(e);
  }
}