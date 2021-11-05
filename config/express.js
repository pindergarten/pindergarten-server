const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
var cors = require("cors");
module.exports = function() {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */

    require("../src/app/User/userRoute")(app);
    require("../src/app/Community/comRoute")(app);
    require("../src/app/Event/eventRoute")(app);
    // require("../src/app/Pet/petRoute")(app);
    // require("../src/app/Pindergarten/pinderRoute")(app);

    return app;
};