const router = require("express").Router();
let Concert = require("../models/concert.model");

router.route("/").get((req, res) => {
  Concert.find()
    .then(concerts => res.json(concerts))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const artist = req.body.artist;
  const time = req.body.time;
  const location = req.body.location;
  const date = Date.parse(req.body.date);

  const newConcert = new Concert({
    name,
    artist,
    time,
    location,
    date
  });

  newConcert
    .save()
    .then(() => res.json("Concert added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

//get endpoint returns a concert item given an ID
router.route("/:id").get((req, res) => {
  Concert.findById(req.params.id)
    .then(concert => res.json(concert))
    .catch(err => res.status(400).json("Error: " + err));
});

// DELETE
router.route("/:id").delete((req, res) => {
  Concert.findByIdAndDelete(req.params.id)
    .then(() => res.json("Concert deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

// Update concert route
router.route("/update/:id").post((req, res) => {
  Concert.findById(req.params.id)
    .then(concert => {
      concert.name = req.body.name;
      concert.artist = req.body.artist;
      concert.time = req.body.time;
      concert.date = Date.parse(req.body.date);
      concert.location = req.body.location;

      concert
        .save()
        .then(() => res.json("Concert updated!"))
        .catch(err => res.status(400).json("Error: " + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
