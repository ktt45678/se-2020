const userService = require('../../../services/user');
const multer = require('../../../middlewares/multer');
const backgroundUpload = multer.image.single('image');

exports.view = async (req, res) => {
  const { id } = req.params;
  const search = id ? await userService.findUserById(id) : id;
  if (!search && id) {
    return res.status(404).send({ error: 'User not found' });
  } else if (search) {
    const searchBackground = userService.findBackground(search);
    if (!searchBackground) {
      return res.status(404).send({ error: 'This user does not have a background' });
    }
    const backgroundUri = userService.getBackground(searchBackground);
    return res.status(200).send({ uri: backgroundUri });
  }
  const user = req.currentUser;
  const background = userService.findBackground(user);
  if (!background) {
    return res.status(404).send({ error: 'Background not found' });
  }
  const backgroundUri = userService.getBackground(background);
  res.status(200).send({ uri: backgroundUri });
};

exports.upload = (req, res) => {
  backgroundUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).send({ error: 'No file provided' });
    }
    const user = req.currentUser;
    const background = userService.findBackground(user);
    if (background) {
      user.storage.pull(background);
      userService.deleteBackground(background);
    }
    const upload = await userService.uploadBackground(req.file);
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
  const background = userService.findBackground(user);
  if (!background) {
    return res.status(404).send({ error: 'Background not found' });
  }
  user.storage.pull(background);
  const deleteResult = await userService.deleteBackground(background);
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