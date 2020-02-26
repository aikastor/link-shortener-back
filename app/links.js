const express = require('express');
const nanoid = require('nanoid');

const Link = require('../models/Link');

const router = express.Router();

const generateLink = () => (nanoid(11));

router.get('/:shortUrl', async (req,res) => {

  try {
    const link  = await Link.findOne({shortUrl: req.params.shortUrl});
    res.status(301).redirect(link.originalUrl);

  } catch (e) {
    res.status(404).send({message: 'Not found!'});
    console.log(e)
  }
});

router.post('/links', async (req,res) => {
  const linkData = req.body;

  let shortLink  = generateLink();

  let existentLink = await Link.findOne({shortUrl: shortLink });

  while (existentLink) {
    shortLink = generateLink();
    existentLink = await Link.findOne({shortUrl: shortLink });
  }

  linkData.shortUrl = shortLink;
  const link = new Link(linkData);

  try {
    await link.save();
  } catch (e) {
    return res.status(400).send(e);
  }
  res.send({generatedLink: `http://localhost:8000/${link.shortUrl}`});

});

module.exports = router;