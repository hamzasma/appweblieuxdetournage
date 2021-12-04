module.exports = (model)=> {
    return async (req, res, next) => {
      let filteredUsers = [];
      let filters = Object.create(req.query);
      filters = { ...req.query }
      delete filters.page;
      delete filters.limit;
      try {
  
        filteredUsers = await model.filter(tournage => {
          let isValid = true;
          for (key in filters) {
            if(tournage.properties[key] === undefined ){
              isValid=false;
          }else{
            isValid = isValid && tournage.properties[key].toUpperCase() == filters[key];
          }
          }
          return isValid;
        });
        res.filtersdResults = filteredUsers;
        next()
      } catch (e) {
        
        res.status(500).json(e.message)
      }
    }
  }