
module.exports = [
  {
    method: ['get', 'post'],
    path: '/api/getMessage',
    controller: function (req, res, next) {
      res.json({
        total: 0,
        message: [{
          name: 'Hello chameleon!'
        }]
      });
    }
  }
]
