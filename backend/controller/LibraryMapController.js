const fs = require("fs");

const LibraryMapRepository = require("../repository/LibraryMapRepository");

exports.getLibraryMaps = (req, res) => {
    LibraryMapRepository.findLibraryMaps().then(libraryMaps => {
        res.json(libraryMaps);
    }).catch(err => {
        res.status(500).json({ error: err.toString() });
    });
}

exports.createLibraryMap = (req, res) => {
    const file = req.file;
    const floor_name = req.body.floorName;
    const name = req.body.name;

    const entry = {
        floor_name,
        name,
    }

    console.log(entry);

    LibraryMapRepository.findOrCreateLibraryMap(entry).spread(function (libraryMap, created) {
        if (file !== undefined) {
            try {
                fs.unlinkSync(libraryMap.image_url);
            } catch (err) {
                console.log(err.toString());
            }
            libraryMap.image_url = file.path.replace(/\\/g, "/");
        }
        libraryMap.save();
        res.json({ success: true });
    }).catch(err => {
        res.status(500).json({ error: err.toString() });
    });
}

exports.updateLibraryMapDetail = (req, res) => {
    const id = req.body.id;
    const floor_name = req.body.floorName;
    const name = req.body.name;

    LibraryMapRepository.updateLibraryMapDetail(id, floor_name, name).then((libraryMap) => {
        res.json({ success: true });
    }).catch(err => {
        res.status(500).json({ error: err.toString() });
    });
}

exports.deleteLibraryMap = async (req, res) => {
    const libraryMapPk = req.body.id;
    const libraryMap = await LibraryMapRepository.findLibraryMapByPk(libraryMapPk);
    try {
        fs.unlinkSync(libraryMap.image_url);
    } catch (err) {
        console.log(err.toString());
    }
    LibraryMapRepository.deleteLibraryMapByPk(libraryMapPk).then(libraryMap => {
        res.json({ success: true });
    }
    ).catch(err => {
        res.status(500).json({ error: err.toString() })
    })
}