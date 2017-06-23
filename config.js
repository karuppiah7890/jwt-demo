module.exports = (PORT) => {
  return {
    development: {
      mongoUrl: `${process.env.MONGODB_URI}/testProject`,
      serverUrl: `http://localhost:${PORT}`
    },
    production: {
      mongoUrl : process.env.MONGODB_URI,
      serverUrl : `https://test-project-webcrafters.herokuapp.com`
    }
  }  
}
