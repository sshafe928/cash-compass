const notFound = (req, res) => {
    res.status(404).send('You lost: Route does not exist')
}

module.exports = notFound