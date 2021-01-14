const userService = require('../../../services/user');
const multer = require('../../../middlewares/multer');
const backgroundUpload = multer.background.single('image');

exports.view = async (req, res, next) => {
  const { id } = req.params;
  const { size } = req.query;
  try {
    const search = id ? await userService.findUserById(id) : id;
    if (!search && id) {
      return res.status(404).send({ error: 'User not found' });
    } else if (search) {
      const searchBackground = userService.findBackground(search);
      if (!searchBackground) {
        return res.status(404).send({ error: 'This user does not have a background' });
      }
      const backgroundUri = userService.getBackground(searchBackground, size);
      return res.status(200).send({ uri: backgroundUri });
    }
    const user = req.currentUser;
    const background = userService.findBackground(user);
    if (!background) {
      return res.status(404).send({ error: 'Background not found' });
    }
    const backgroundUri = userService.getBackground(background, size);
    res.status(200).send({ uri: backgroundUri });
  } catch (e) {
    next(e);
  }
}

exports.upload = (req, res, next) => {
  backgroundUpload(req, res, async (err) => {
    if (err) {
      return res.status(422).send({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).send({ error: 'No file provided' });
    }
    const user = req.currentUser;
    const background = userService.findBackground(user);
    try {
      if (background) {
        user.storages.pull(background);
        await userService.deleteBackground(background);
      }
      const upload = await userService.uploadBackground(req.file);
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
  const background = userService.findBackground(user);
  if (!background) {
    return res.status(404).send({ error: 'Background not found' });
  }
  try {
    user.storages.pull(background);
    const deleteResult = await userService.deleteBackground(background);
    await user.save();
    if (!deleteResult) {
      return res.status(200).send({ message: 'Tried to delete unavailable blob' });
    }
    res.status(200).send({ message: 'Deleted successfully' });
  } catch (e) {
    next(e);
  }
}