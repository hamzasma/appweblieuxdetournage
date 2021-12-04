module.exports = ()=> {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
    
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
    
        const results = {}
        if (endIndex < await res.filtersdResults.length) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }
    
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }
        try {
          results.results = await res.filtersdResults.slice(startIndex, endIndex);
          res.nbpage = Math.trunc(res.filtersdResults.length / limit) + 1;
          res.paginatedResults = results;
    
          next()
        } catch (e) {
          res.status(500).json({ message: e })
        }
      }
  }