const router = require('express').Router();

router.get("/logout", function(req, res){   
    req.logOut();
    res.render("logout");
});

module.exports = router;