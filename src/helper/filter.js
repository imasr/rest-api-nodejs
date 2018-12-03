exports.filterUser = (users, req) => {
  return new Promise((Resolve, Reject) => {
    let result = users.filter(item => item._id.toString() != req.user._id.toString())
    if (result) {
      Resolve(result)
    }
  })
}